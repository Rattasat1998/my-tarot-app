import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

// Use service_role key to bypass RLS
const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

// Manually verify Stripe webhook signature using Web Crypto API
async function verifyStripeSignature(
    payload: string,
    sigHeader: string,
    secret: string
): Promise<boolean> {
    const parts = sigHeader.split(',')
    let timestamp = ''
    const signatures: string[] = []

    for (const part of parts) {
        const [key, value] = part.split('=')
        if (key === 't') timestamp = value
        if (key === 'v1') signatures.push(value)
    }

    if (!timestamp || signatures.length === 0) return false

    // Check timestamp tolerance (5 minutes)
    const now = Math.floor(Date.now() / 1000)
    if (Math.abs(now - parseInt(timestamp)) > 300) return false

    const signedPayload = `${timestamp}.${payload}`
    const encoder = new TextEncoder()

    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    )

    const signatureBuffer = await crypto.subtle.sign(
        'HMAC',
        key,
        encoder.encode(signedPayload)
    )

    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')

    return signatures.some((sig) => sig === expectedSignature)
}

Deno.serve(async (req: Request) => {
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
        return new Response('Missing stripe-signature header', { status: 400 })
    }

    try {
        const body = await req.text()

        // Verify webhook signature
        const isValid = await verifyStripeSignature(body, signature, STRIPE_WEBHOOK_SECRET)
        if (!isValid) {
            console.error('Invalid webhook signature')
            return new Response('Invalid signature', { status: 400 })
        }

        const event = JSON.parse(body)

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object

            // Only process if payment is paid
            if (session.payment_status !== 'paid') {
                console.log('Payment not yet paid, skipping...')
                return new Response(JSON.stringify({ received: true }), { status: 200 })
            }

            const userId = session.metadata?.userId
            const packageId = session.metadata?.packageId
            const type = session.metadata?.type || 'one_time'

            if (!userId) {
                console.error('Missing userId in metadata')
                return new Response('Missing userId', { status: 400 })
            }

            // Check if already processed (idempotency)
            const { data: existing } = await supabaseAdmin
                .from('transactions')
                .select('id')
                .eq('stripe_session_id', session.id)
                .single()

            if (existing) {
                console.log('Transaction already processed:', session.id)
                return new Response(JSON.stringify({ received: true }), { status: 200 })
            }

            if (type === 'subscription') {
                // 1. Update user profile to premium
                const { error: profileError } = await supabaseAdmin
                    .from('profiles')
                    .update({ 
                        is_premium: true,
                        subscription_status: 'active',
                        subscription_id: session.subscription,
                        premium_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
                    })
                    .eq('id', userId)

                if (profileError) {
                    console.error('Error updating profile to premium:', profileError)
                    return new Response('Error updating profile', { status: 500 })
                }

                // 2. Record transaction
                const { error: txError } = await supabaseAdmin
                    .from('transactions')
                    .insert({
                        user_id: userId,
                        amount: (session.amount_total || 0) / 100, // Convert satang to baht
                        credits_added: 0,
                        status: 'approved',
                        payment_method: 'stripe_card',
                        stripe_session_id: session.id,
                        type: 'subscription'
                    })

                if (txError) {
                    console.error('Error recording transaction:', txError)
                }

                console.log(`✅ Activated premium subscription for user ${userId}`)
            } else {
                const credits = parseInt(session.metadata?.credits || '0', 10)
                
                if (credits <= 0) {
                    console.error('Missing credits in metadata:', { credits })
                    return new Response('Missing credits', { status: 400 })
                }

                // 1. Add credits to user profile
                const { error: creditError } = await supabaseAdmin.rpc('add_stripe_credits', {
                    target_user_id: userId,
                    credit_amount: credits,
                })

                if (creditError) {
                    console.error('Error adding credits:', creditError)
                    return new Response('Error adding credits', { status: 500 })
                }

                // 2. Record transaction
                const { error: txError } = await supabaseAdmin
                    .from('transactions')
                    .insert({
                        user_id: userId,
                        amount: (session.amount_total || 0) / 100, // Convert satang to baht
                        credits_added: credits,
                        status: 'approved',
                        payment_method: 'stripe_promptpay',
                        stripe_session_id: session.id,
                        type: 'one_time'
                    })

                if (txError) {
                    console.error('Error recording transaction:', txError)
                }

                console.log(`✅ Added ${credits} credits to user ${userId}`)
            }
        } else if (event.type === 'invoice.paid') {
            // Handle recurring subscription payment (month 2, 3, etc.)
            const invoice = event.data.object
            const subscriptionId = invoice.subscription
            
            if (subscriptionId && invoice.billing_reason === 'subscription_cycle') {
                const { data: profile } = await supabaseAdmin
                    .from('profiles')
                    .select('id')
                    .eq('subscription_id', subscriptionId)
                    .single()
                    
                if (profile) {
                    // Extend premium_until by 30 days from now
                    await supabaseAdmin
                        .from('profiles')
                        .update({ 
                            is_premium: true,
                            subscription_status: 'active',
                            premium_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
                        })
                        .eq('id', profile.id)

                    // Record renewal transaction
                    await supabaseAdmin
                        .from('transactions')
                        .insert({
                            user_id: profile.id,
                            amount: (invoice.amount_paid || 0) / 100,
                            credits_added: 0,
                            status: 'approved',
                            payment_method: 'stripe_card',
                            stripe_session_id: invoice.id,
                            type: 'subscription_renewal'
                        })
                        
                    console.log(`✅ Renewed premium for user ${profile.id}`)
                }
            }
        } else if (event.type === 'customer.subscription.deleted' || event.type === 'customer.subscription.updated') {
            const subscription = event.data.object
            
            // Find user by subscription_id
            const { data: profile } = await supabaseAdmin
                .from('profiles')
                .select('id')
                .eq('subscription_id', subscription.id)
                .single()
                
            if (profile) {
                const status = subscription.status
                const isPremium = status === 'active' || status === 'trialing'
                
                await supabaseAdmin
                    .from('profiles')
                    .update({ 
                        is_premium: isPremium,
                        subscription_status: status,
                        premium_until: new Date(subscription.current_period_end * 1000).toISOString()
                    })
                    .eq('id', profile.id)
                    
                console.log(`✅ Updated subscription status for user ${profile.id} to ${status}`)
            }
        }

        return new Response(JSON.stringify({ received: true }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        })
    } catch (err) {
        console.error('Webhook error:', (err as Error).message)
        return new Response(`Webhook Error: ${(err as Error).message}`, { status: 400 })
    }
})

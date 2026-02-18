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
            const credits = parseInt(session.metadata?.credits || '0', 10)
            const packageId = session.metadata?.packageId

            if (!userId || credits <= 0) {
                console.error('Missing metadata:', { userId, credits })
                return new Response('Missing metadata', { status: 400 })
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
                })

            if (txError) {
                console.error('Error recording transaction:', txError)
                // Credits already added, log but don't fail
            }

            console.log(`✅ Added ${credits} credits to user ${userId}`)
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

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')!

const PACKAGES: Record<string, { label: string; price: number; credits?: number; type: 'one_time' | 'subscription' }> = {
    starter: { label: 'Starter - 5 เครดิต', price: 2900, credits: 5, type: 'one_time' },
    popular: { label: 'Standard - 15 เครดิต', price: 7900, credits: 15, type: 'one_time' },
    pro: { label: 'Pro - 30 เครดิต', price: 14900, credits: 30, type: 'one_time' },
    premium_monthly: { label: 'Premium Membership (Monthly)', price: 29900, type: 'subscription' }
}

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: Request) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    // Check authentication
    const authHeader = req.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response(
            JSON.stringify({ error: 'Missing or invalid authorization header' }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

    const token = authHeader.replace('Bearer ', '')
    
    // Verify JWT token with Supabase
    const jwtResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/auth/v1/user`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'apikey': Deno.env.get('SUPABASE_ANON_KEY')!
        }
    })

    if (!jwtResponse.ok) {
        return new Response(
            JSON.stringify({ error: 'Invalid authentication token' }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

    const user = await jwtResponse.json()

    try {
        const { packageId, userId, userEmail } = await req.json()

        if (!packageId || !userId) {
            return new Response(
                JSON.stringify({ error: 'Missing packageId or userId' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Verify that the authenticated user matches the userId from request
        if (user.id !== userId) {
            return new Response(
                JSON.stringify({ error: 'User ID mismatch' }),
                { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const pkg = PACKAGES[packageId]
        if (!pkg) {
            return new Response(
                JSON.stringify({ error: 'Invalid package' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Determine origin for redirect URLs
        const origin = req.headers.get('origin') || 'https://yourdomain.com'

        // Create Stripe Checkout Session using REST API
        const params = new URLSearchParams()
        
        if (pkg.type === 'subscription') {
            params.append('payment_method_types[]', 'card')
            params.append('mode', 'subscription')
            params.append('line_items[0][price_data][currency]', 'thb')
            params.append('line_items[0][price_data][product_data][name]', pkg.label)
            params.append('line_items[0][price_data][unit_amount]', pkg.price.toString())
            params.append('line_items[0][price_data][recurring][interval]', 'month')
            params.append('line_items[0][quantity]', '1')
            params.append('success_url', `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}&type=subscription`)
        } else {
            params.append('payment_method_types[]', 'promptpay')
            params.append('mode', 'payment')
            params.append('line_items[0][price_data][currency]', 'thb')
            params.append('line_items[0][price_data][product_data][name]', pkg.label)
            params.append('line_items[0][price_data][unit_amount]', pkg.price.toString())
            params.append('line_items[0][quantity]', '1')
            params.append('success_url', `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`)
        }

        params.append('cancel_url', `${origin}/payment/cancel`)
        params.append('metadata[userId]', userId)
        if (pkg.credits) {
            params.append('metadata[credits]', pkg.credits.toString())
        }
        params.append('metadata[packageId]', packageId)
        params.append('metadata[type]', pkg.type)
        if (userEmail) {
            params.append('customer_email', userEmail)
        }

        const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
        })

        const session = await stripeRes.json()

        if (session.error) {
            console.error('Stripe error:', session.error)
            return new Response(
                JSON.stringify({ error: session.error.message }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        return new Response(
            JSON.stringify({ url: session.url }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )
    } catch (error) {
        console.error('Error:', error)
        return new Response(
            JSON.stringify({ error: (error as Error).message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})

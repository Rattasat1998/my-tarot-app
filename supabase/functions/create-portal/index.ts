const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')!

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: Request) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { userEmail } = await req.json()

        if (!userEmail) {
            return new Response(
                JSON.stringify({ error: 'Missing userEmail' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const origin = req.headers.get('origin') || 'https://yourdomain.com'

        // 1. Find Stripe customer by email
        const customerSearchRes = await fetch(
            `https://api.stripe.com/v1/customers/search?query=email:'${encodeURIComponent(userEmail)}'`,
            {
                headers: {
                    'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
                },
            }
        )

        const customerSearch = await customerSearchRes.json()

        if (!customerSearch.data || customerSearch.data.length === 0) {
            return new Response(
                JSON.stringify({ error: 'ไม่พบข้อมูลลูกค้าใน Stripe กรุณาติดต่อเจ้าหน้าที่' }),
                { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const customerId = customerSearch.data[0].id

        // 2. Create Billing Portal Session
        const params = new URLSearchParams()
        params.append('customer', customerId)
        params.append('return_url', `${origin}/profile`)

        const portalRes = await fetch('https://api.stripe.com/v1/billing_portal/sessions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
        })

        const portalSession = await portalRes.json()

        if (portalSession.error) {
            console.error('Stripe portal error:', portalSession.error)
            return new Response(
                JSON.stringify({ error: portalSession.error.message }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        return new Response(
            JSON.stringify({ url: portalSession.url }),
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

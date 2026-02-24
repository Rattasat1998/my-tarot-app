import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

type PackageType = 'one_time' | 'subscription'
type PackageConfig = {
    label: string
    price: number
    credits?: number
    type: PackageType
}

const BASE_PACKAGES: Record<string, PackageConfig> = {
    starter: { label: 'Starter - 5 เครดิต', price: 2900, credits: 5, type: 'one_time' },
    popular: { label: 'Standard - 15 เครดิต', price: 7900, credits: 15, type: 'one_time' },
    pro: { label: 'Pro - 30 เครดิต', price: 14900, credits: 30, type: 'one_time' },
    premium_monthly: { label: 'Premium Membership (Monthly)', price: 29900, type: 'subscription' },
}

const supabaseAdmin = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    : null

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const getPremiumPricing = async () => {
    const fallback = {
        basePriceSatang: BASE_PACKAGES.premium_monthly.price,
        discountAmountSatang: 0,
        promoApplied: false,
    }

    if (!supabaseAdmin) {
        console.warn('Missing Supabase env for dynamic membership pricing. Using fallback.')
        return fallback
    }

    const { data, error } = await supabaseAdmin
        .from('membership_discount_settings')
        .select('discount_amount_baht, is_discount_active, discount_ends_at')
        .eq('id', 1)
        .maybeSingle()

    if (error || !data) {
        if (error) {
            console.error('Failed to load membership discount settings:', error)
        }
        return fallback
    }

    const discountAmountBaht = Number(data.discount_amount_baht ?? 0)
    const isWithinEndTime = data.discount_ends_at
        ? new Date(data.discount_ends_at).getTime() > Date.now()
        : false

    const discountAmountSatang = Math.round(discountAmountBaht * 100)
    const promoApplied = Boolean(data.is_discount_active)
        && isWithinEndTime
        && discountAmountSatang > 0
        && discountAmountSatang < BASE_PACKAGES.premium_monthly.price

    return {
        basePriceSatang: BASE_PACKAGES.premium_monthly.price,
        discountAmountSatang: promoApplied ? discountAmountSatang : 0,
        promoApplied,
    }
}

const createOneTimeCoupon = async (discountAmountSatang: number) => {
    const params = new URLSearchParams()
    params.append('duration', 'once')
    params.append('amount_off', discountAmountSatang.toString())
    params.append('currency', 'thb')
    params.append('name', `Premium first month discount (${discountAmountSatang / 100} THB)`)
    params.append('metadata[source]', 'membership_discount_settings')

    const stripeRes = await fetch('https://api.stripe.com/v1/coupons', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
    })

    const coupon = await stripeRes.json()
    if (coupon.error) {
        throw new Error(coupon.error.message || 'Failed to create promo coupon')
    }

    return coupon.id as string
}

Deno.serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { packageId, userId, userEmail } = await req.json()

        if (!packageId || !userId) {
            return new Response(
                JSON.stringify({ error: 'Missing packageId or userId' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const basePackage = BASE_PACKAGES[packageId]
        if (!basePackage) {
            return new Response(
                JSON.stringify({ error: 'Invalid package' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const pkg: PackageConfig = { ...basePackage }
        let promoApplied = false
        let promoDiscountSatang = 0

        if (packageId === 'premium_monthly') {
            const premiumPricing = await getPremiumPricing()
            // Keep monthly subscription price at base amount. Promo is applied once via coupon.
            pkg.price = premiumPricing.basePriceSatang
            promoApplied = premiumPricing.promoApplied
            promoDiscountSatang = premiumPricing.discountAmountSatang
        }

        const origin = req.headers.get('origin') || 'https://yourdomain.com'
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

            if (promoApplied && promoDiscountSatang > 0) {
                const couponId = await createOneTimeCoupon(promoDiscountSatang)
                params.append('discounts[0][coupon]', couponId)
            }
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
        params.append('metadata[promoApplied]', promoApplied ? 'true' : 'false')
        params.append('metadata[promoDiscountSatang]', promoDiscountSatang.toString())

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

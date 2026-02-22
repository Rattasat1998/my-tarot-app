import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const LINE_CHANNEL_ID = Deno.env.get('LINE_CHANNEL_ID')!
const LINE_CHANNEL_SECRET = Deno.env.get('LINE_CHANNEL_SECRET')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const SITE_URL = Deno.env.get('SITE_URL') || 'https://satduangdao.com'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    const url = new URL(req.url)
    const action = url.searchParams.get('action')

    // ─── Step 1: Redirect to LINE Login ───
    if (action === 'login') {
        const callbackUrl = `${SUPABASE_URL}/functions/v1/line-auth?action=callback`
        const state = crypto.randomUUID()

        const lineAuthUrl = 'https://access.line.me/oauth2/v2.1/authorize?' +
            new URLSearchParams({
                response_type: 'code',
                client_id: LINE_CHANNEL_ID,
                redirect_uri: callbackUrl,
                state,
                scope: 'profile openid email',
            }).toString()

        return Response.redirect(lineAuthUrl, 302)
    }

    // ─── Step 2: Handle LINE Callback ───
    if (action === 'callback') {
        const code = url.searchParams.get('code')
        const error = url.searchParams.get('error')

        if (error || !code) {
            const msg = url.searchParams.get('error_description') || 'LINE login cancelled'
            return Response.redirect(`${SITE_URL}?login_error=${encodeURIComponent(msg)}`, 302)
        }

        try {
            // Exchange code for access token
            const callbackUrl = `${SUPABASE_URL}/functions/v1/line-auth?action=callback`
            const tokenRes = await fetch('https://api.line.me/oauth2/v2.1/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    grant_type: 'authorization_code',
                    code,
                    redirect_uri: callbackUrl,
                    client_id: LINE_CHANNEL_ID,
                    client_secret: LINE_CHANNEL_SECRET,
                }),
            })

            const tokenData = await tokenRes.json()
            if (!tokenData.access_token) {
                console.error('LINE token error:', tokenData)
                return Response.redirect(`${SITE_URL}?login_error=token_exchange_failed`, 302)
            }

            // Get LINE user profile
            const profileRes = await fetch('https://api.line.me/v2/profile', {
                headers: { Authorization: `Bearer ${tokenData.access_token}` },
            })
            const profile = await profileRes.json()

            if (!profile.userId) {
                console.error('LINE profile error:', profile)
                return Response.redirect(`${SITE_URL}?login_error=profile_fetch_failed`, 302)
            }

            // Create Supabase admin client
            const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
                auth: { autoRefreshToken: false, persistSession: false }
            })

            // Construct a unique email for this LINE user
            const email = `line_${profile.userId}@satduangdao.com`

            const userMetadata = {
                name: profile.displayName,
                full_name: profile.displayName,
                avatar_url: profile.pictureUrl,
                line_user_id: profile.userId,
                provider: 'line',
            }

            // Try to create user first
            const { data: createData, error: createError } = await supabase.auth.admin.createUser({
                email,
                email_confirm: true,
                user_metadata: userMetadata,
            })

            if (createError) {
                // User already exists — update metadata instead
                const { data: { users } } = await supabase.auth.admin.listUsers({
                    page: 1,
                    perPage: 1,
                    filter: email,
                })
                const existingUser = users?.[0]

                if (existingUser) {
                    await supabase.auth.admin.updateUserById(existingUser.id, {
                        user_metadata: userMetadata,
                    })
                }
            }

            // Generate magic link to sign the user in
            const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
                type: 'magiclink',
                email,
            })

            if (linkError || !linkData) {
                console.error('Generate link error:', linkError)
                return Response.redirect(`${SITE_URL}?login_error=session_failed`, 302)
            }

            // Extract hashed_token from the generated link
            const hashedToken = linkData.properties?.hashed_token
            if (!hashedToken) {
                console.error('No hashed_token in link data')
                return Response.redirect(`${SITE_URL}?login_error=session_failed`, 302)
            }

            // Redirect to frontend callback page with the token
            return Response.redirect(
                `${SITE_URL}/auth/line-callback?token_hash=${hashedToken}&type=magiclink`,
                302
            )

        } catch (err) {
            console.error('LINE auth error:', err)
            return Response.redirect(`${SITE_URL}?login_error=unexpected_error`, 302)
        }
    }

    return new Response(
        JSON.stringify({ error: 'Invalid action. Use ?action=login or ?action=callback' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
})

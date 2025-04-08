require('dotenv').config()

async function userData(req) {
    if (req.body.credential) {
        if (!req.cookies.g_csrf_token) {
            throw new Error('No CSRF token in Cookie')
        }
        if (!req.body.g_csrf_token) {
            throw new Error('No CSRF token in Post body')
        }
        if (req.cookies.g_csrf_token != req.body.g_csrf_token) {
            throw new Error('Failed to verify double submit cookie')
        }

        const { OAuth2Client } = require('google-auth-library');
        const client = new OAuth2Client();

        const ticket = await client.verifyIdToken({
            idToken: req.body.credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        return { 'email': payload.email, 'password': payload.sub }
    }

    if (req.session.auth) {
        req.body.email = req.session.auth
    }

    return req.body
}

export default userData
// Netlify Function: sendSignup
// For production: set SIGNUP_WEBHOOK to a secure webhook (email service, Zapier, Pipedream)
// This function receives a signup payload and forwards it to the webhook if present.

const fetch = require('node-fetch');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body || '{}');

    // Optional forwarding
    const webhook = process.env.SIGNUP_WEBHOOK;
    if (webhook) {
      // forward a compact payload
      await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'corner-website', payload: data }),
      });
    }

    console.log('Signup received:', data);
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: String(err) }) };
  }
};

# CORNER — Coming Soon (static site)

This is a small, animated coming-soon landing page for CORNER — a creative hub targeted primarily at Gen Z. The design uses a dark aesthetic with a neon accent color (#b9ff6b). It's built as a simple static site ready to deploy on Netlify.

What's included
- `index.html` — main landing page (hero, about, who it's for, problems, features, roadmap, founder + notify forms)
- `styles.css` — styles, responsive layout, neon-themed animations and mobile tuning
- `main.js` — interactive features: particles, floating banner, scroll reveal, animated progress bars, form UX
- `ASSET/` — the three image files you provided (logos and banner)

How to run locally
1. In the project folder, run a simple static server. Example using Python 3:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

Deploy on Netlify (free)
1. Push this folder to GitHub (or any Git provider Netlify supports).
2. Create a new site on Netlify and point it to the repository.
3. Netlify will detect the site as static and deploy the site automatically.

Forms / "Notify When Live"
The notify forms in `index.html` use Netlify's static form handling (the `data-netlify` attribute). When deployed to Netlify, submissions will appear in Netlify’s forms dashboard for the site and can be forwarded to an integration/service.

Serverless forwarder (optional)
You can optionally forward signups to a webhook (eg. Zapier, Pipedream, an email/CRM) using the included Netlify Function `functions/sendSignup.js`.
1. In Netlify dashboard for your site, set an environment variable `SIGNUP_WEBHOOK` to point to your webhook URL.
2. The site already calls the function on submit — the function will forward the payload to the webhook if the environment variable is present.

This keeps your webhook secret out of the client while giving you full control over where signups are routed.

Next suggestions (optional)
- Add an email list integration or webhook for long-term capture
- Add a tiny CMS or collection to manage content and announcements
- Add more playful micro-interactions and a mobile-first tuning pass

If you'd like I can:
- polish copy and micro-copy for the site
- add an animation-first hero / Lottie file
- wire Netlify form handling to a serverless function (send to email/CRM) and add simple validation UX
- add analytics (Plausible / Umami / Google Analytics) and track form signups

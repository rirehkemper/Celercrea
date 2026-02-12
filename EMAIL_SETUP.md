# Email Setup Instructions

## Current Configuration

The contact form on the website is configured to send emails to: **rirehkemper@gmail.com**

## How It Works

### Static Site (Current Implementation)
The form currently uses a `mailto:` link that opens the user's email client with a pre-filled draft email to `rirehkemper@gmail.com`. The user still needs to click "Send" in their email client.

### Advanced Setup (Optional - Cloudflare Pages Function)

For a more professional automated email experience, you can use the included Cloudflare Pages Function (`contact.js`) with Resend API:

1. **Sign up for Resend** at https://resend.com
2. **Set up environment variables** in your Cloudflare Pages project:
   - `TO_EMAIL`: `rirehkemper@gmail.com` (where you want to receive inquiries)
   - `FROM_EMAIL`: A verified sender email in Resend (e.g., `noreply@yourdomain.com`)
   - `RESEND_API_KEY`: Your Resend API key

3. **Update the form submission handler** in `index.html` to POST to `/functions/api/contact` instead of using mailto

This will enable automatic email delivery without requiring the visitor to use their email client.

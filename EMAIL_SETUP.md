# Email Setup Instructions for Resend + Cloudflare Pages

## Overview

Your contact form is now configured to use Resend API through Cloudflare Pages Functions for automated email delivery. When customers submit the form, emails will be sent directly to **rirehkemper@gmail.com** without requiring them to use their email client.

## ✅ What You Need

1. **Resend Account** - Sign up at https://resend.com (free tier includes 100 emails/day)
2. **Resend API Key** - You mentioned you already have this! ✓
3. **Verified Sender Domain** in Resend (or use their test domain)

## 🔧 Cloudflare Pages Setup

### Step 1: Access Your Cloudflare Pages Project

1. Go to your Cloudflare dashboard: https://dash.cloudflare.com
2. Navigate to **Pages** in the left sidebar
3. Select your **Celercrea** project

### Step 2: Configure Environment Variables

You need to set up **three environment variables**. Here's how:

1. In your Cloudflare Pages project, go to **Settings** → **Environment variables**
2. Add the following variables (use "Production" environment):

#### Variable 1: `RESEND_API_KEY`
- **Name:** `RESEND_API_KEY`
- **Value:** Your Resend API key (starts with `re_...`)
- **Environment:** Production (and Preview if you want to test)

#### Variable 2: `TO_EMAIL`
- **Name:** `TO_EMAIL`
- **Value:** `rirehkemper@gmail.com`
- **Environment:** Production (and Preview)

#### Variable 3: `FROM_EMAIL`
- **Name:** `FROM_EMAIL`
- **Value:** One of these options:
  - If you have a verified domain in Resend: `noreply@yourdomain.com`
  - For testing with Resend's demo domain: `onboarding@resend.dev`
  - **Important:** This email must be verified in your Resend account

### Step 3: Verify Your Sender Email in Resend

1. Go to your Resend dashboard: https://resend.com/domains
2. Choose one option:
   
   **Option A - Use Resend's Test Domain (Quick Start)**
   - Use `onboarding@resend.dev` as your `FROM_EMAIL`
   - This works immediately, no setup needed
   - Good for testing and low-volume use
   
   **Option B - Use Your Own Domain (Recommended for Production)**
   - Add your domain (e.g., `celercrea.com`) in Resend
   - Add the DNS records Resend provides to your domain
   - Wait for verification (usually a few minutes)
   - Use `noreply@celercrea.com` (or any address) as your `FROM_EMAIL`

### Step 4: Save and Redeploy

1. After adding all three environment variables, click **Save**
2. Go to **Deployments** tab
3. Click **Retry deployment** on your latest deployment, OR
4. Push a small change to trigger a new deployment

The environment variables will be available to your Cloudflare Pages Function after the deployment completes.

## 📁 File Structure

Your repository is now set up with:
```
/functions/api/contact.js    ← Cloudflare Pages Function (handles form submissions)
/index.html                  ← Contact form (POSTs to /functions/api/contact)
```

## 🧪 Testing Your Setup

After deploying with environment variables:

1. Visit your live site at `https://celercrea.com`
2. Fill out the contact form
3. Click "Send inquiry →"
4. You should see: **"✓ Message sent! I'll get back to you within 24 hours."**
5. Check your email at **rirehkemper@gmail.com** for the inquiry

### Troubleshooting

If you see an error message:

**"Missing RESEND_API_KEY"** or similar
- Environment variables aren't set correctly
- Make sure to redeploy after adding variables

**"Email send failed"**
- Check that `FROM_EMAIL` is verified in Resend
- Verify your API key is correct
- Check Resend dashboard for error logs

**"Network error"**
- Check browser console for details
- Verify the Cloudflare Pages Function deployed correctly

## 🛡️ Security Features

✅ **Honeypot field** - Invisible `company` field catches spam bots  
✅ **CORS protection** - Only your domain can submit  
✅ **Input validation** - Email format and required fields checked  
✅ **Rate limiting** - Cloudflare provides DDoS protection  

## 📧 Email Format

Customers will receive a professional email with:
- **To:** rirehkemper@gmail.com
- **From:** Your verified sender (e.g., noreply@celercrea.com)
- **Reply-To:** Customer's email (so you can reply directly)
- **Subject:** "CelerCrea Inquiry — [Type] — [Name]"
- **Body:** All form details (name, email, project type, message)

## 🎯 Quick Setup Checklist

- [ ] Sign up for Resend account
- [ ] Get API key from Resend
- [ ] Add `RESEND_API_KEY` to Cloudflare Pages environment variables
- [ ] Add `TO_EMAIL=rirehkemper@gmail.com` to environment variables
- [ ] Choose and verify your `FROM_EMAIL` in Resend
- [ ] Add `FROM_EMAIL` to Cloudflare Pages environment variables
- [ ] Redeploy your Cloudflare Pages site
- [ ] Test the contact form on your live site
- [ ] Verify you receive the test email

## 💡 Tips

- **Check Resend Dashboard** - View sent emails and delivery status at https://resend.com/emails
- **Monitor Usage** - Free tier includes 100 emails/day, 3,000/month
- **Preview Environment** - Add the same variables to "Preview" environment to test before production
- **Logs** - Check Cloudflare Pages **Functions** logs for debugging

---

**Need help?** Check the Resend documentation at https://resend.com/docs or Cloudflare Pages docs at https://developers.cloudflare.com/pages/


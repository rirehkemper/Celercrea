# Cloudflare Pages Environment Variables Setup Guide

## Quick Answer: YES, put your Resend API key in Cloudflare! ✅

You asked: **"I got the API key. I put that in my cloudflare, correct?"**

**Answer: Yes, exactly!** You need to add your Resend API key (and two other variables) to your Cloudflare Pages project settings.

## Step-by-Step Instructions

### 1. Log into Cloudflare Dashboard

Go to: https://dash.cloudflare.com

### 2. Navigate to Your Pages Project

1. Click **"Pages"** in the left sidebar
2. Click on your **"Celercrea"** project (or whatever you named it)

### 3. Go to Settings → Environment Variables

1. Click the **"Settings"** tab at the top
2. Scroll down to **"Environment variables"** section
3. Click **"Add variable"** (or "Edit variables")

### 4. Add These Three Variables

For **Production** environment, add:

#### Variable #1
```
Variable name:  RESEND_API_KEY
Value:          re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                ↑ (your actual Resend API key)
```

#### Variable #2
```
Variable name:  TO_EMAIL
Value:          rirehkemper@gmail.com
```

#### Variable #3
```
Variable name:  FROM_EMAIL
Value:          onboarding@resend.dev
                ↑ (or your verified domain email)
```

### 5. Save and Redeploy

1. Click **"Save"** at the bottom
2. Go to the **"Deployments"** tab
3. Click **"Retry deployment"** on your latest deployment
4. Wait for deployment to finish (usually 1-2 minutes)

## ✅ That's It!

Once the deployment completes, your contact form will automatically send emails via Resend when customers fill it out.

## 🧪 How to Test

1. Visit your live website: `https://celercrea.com` (or your Pages URL)
2. Scroll to the contact form
3. Fill out the form with test data
4. Click "Send inquiry →"
5. You should see: **"✓ Message sent! I'll get back to you within 24 hours."**
6. Check your email at **rirehkemper@gmail.com**

## 📋 About the Variables

- **RESEND_API_KEY** - Your secret key from Resend (starts with `re_`)
- **TO_EMAIL** - Where you want to receive customer inquiries (your Gmail)
- **FROM_EMAIL** - The "sender" email address (must be verified in Resend)
  - Use `onboarding@resend.dev` for quick testing
  - Or add your own domain in Resend for production use

## ❓ Where to Get Your API Key

If you don't have it yet:

1. Go to https://resend.com/api-keys
2. Log in to your Resend account
3. Click "Create API Key"
4. Give it a name (e.g., "Celercrea Contact Form")
5. Copy the key (starts with `re_`)
6. Paste it into Cloudflare as shown above

## 🔒 Security Note

Environment variables in Cloudflare are **encrypted and secure**. They are:
- ✅ Not visible in your code
- ✅ Not accessible to website visitors
- ✅ Only available to your Cloudflare Pages Functions
- ✅ Protected by Cloudflare's security

This is the **correct and secure** way to store API keys!

## 🆘 Troubleshooting

**If the form shows "Missing RESEND_API_KEY":**
- You forgot to redeploy after adding variables
- Go to Deployments → Retry deployment

**If the form shows "Email send failed":**
- Check that FROM_EMAIL is verified in Resend
- Verify your API key is correct (starts with `re_`)

**If you see "Network error":**
- Check browser console (F12) for details
- Make sure the deployment completed successfully

## 📚 More Help

- Full setup guide: [EMAIL_SETUP.md](EMAIL_SETUP.md)
- Cloudflare Pages docs: https://developers.cloudflare.com/pages/
- Resend docs: https://resend.com/docs

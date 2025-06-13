# PriceTracker - Email Setup Guide

## 🚨 Current Issue: Email Not Working

The current implementation is **simulating** email sending with console logs only. To receive actual emails, you need to set up a real email service.

## 📧 Email Service Options

### Option 1: Resend (Recommended - Easy Setup)

1. **Sign up for Resend**: Go to [resend.com](https://resend.com) and create a free account
2. **Get API Key**: 
   - Go to your Resend dashboard
   - Navigate to "API Keys"
   - Create a new API key
3. **Add Domain** (Optional but recommended):
   - Add your domain in Resend dashboard
   - Verify domain ownership
   - Use `noreply@yourdomain.com` as sender
4. **Set Environment Variable**:
   - In your Supabase project dashboard
   - Go to Settings → Environment Variables
   - Add: `RESEND_API_KEY` = `your_resend_api_key_here`

### Option 2: SendGrid

1. **Sign up for SendGrid**: Go to [sendgrid.com](https://sendgrid.com)
2. **Get API Key**: Create an API key in your SendGrid dashboard
3. **Set Environment Variable**: `SENDGRID_API_KEY`
4. **Update the email function** to use SendGrid API

### Option 3: Gmail SMTP (For Testing)

1. **Enable 2FA** on your Gmail account
2. **Generate App Password**: 
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. **Set Environment Variables**:
   - `GMAIL_USER` = `your_email@gmail.com`
   - `GMAIL_PASS` = `your_app_password`

## 🔧 Quick Fix - Enable Resend

The code is already updated to use Resend. Just add your API key:

1. Go to [resend.com](https://resend.com) and sign up
2. Get your API key from the dashboard
3. In Supabase dashboard → Settings → Environment Variables
4. Add: `RESEND_API_KEY` = `re_your_api_key_here`
5. Test by adding a new product to track

## 📝 Current Email Features

✅ **Tracking Confirmation Email** - Sent when product tracking starts
✅ **Price Alert Email** - Sent when target price is reached  
✅ **Stock Alert Email** - Sent when out-of-stock products become available
✅ **Beautiful HTML Templates** - Professional email design
✅ **Detailed Product Information** - Complete product details in emails

## 🐛 Debugging

Check the Supabase Edge Function logs:
1. Go to Supabase Dashboard
2. Edge Functions → scrape-product
3. Check the logs for email sending status

## 💡 Alternative: Webhook Integration

If you prefer not to set up email service, you can:
1. Set up a webhook endpoint
2. Send notifications to Discord/Slack
3. Use browser notifications
4. SMS notifications via Twilio

Let me know which email service you'd like to use and I'll help you set it up!
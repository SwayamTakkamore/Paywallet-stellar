# 🔑 API Keys & External Services Setup Guide

Complete guide for setting up all external service API keys for PayWallet.

## 💳 Payment Gateways

### Stripe (Global payments)
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to Developers > API keys
3. Get your keys from API section:
   ```bash
   # Backend (.env)
   STRIPE_SECRET_KEY=sk_test_51Hxxxxxxxxxxxxxxx
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxx
   
   # Frontend (.env.local)
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51Hxxxxxxxxxxxxxxx
   ```

### PayPal (Alternative payment)
1. Go to [PayPal Developer](https://developer.paypal.com/)
2. Create a new app in "My Apps & Credentials"
3. Get Client ID and Secret:
   ```bash
   # Backend (.env)
   PAYPAL_CLIENT_ID=AYxxxxxxxxxxxxxxxxxxxxxxx
   PAYPAL_CLIENT_SECRET=ELxxxxxxxxxxxxxxxxxxxxxxx
   
   # Frontend (.env.local)
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=AYxxxxxxxxxxxxxxxxxxxxxxx
   ```

### Razorpay (Indian market)
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Navigate to Settings > API Keys
3. Generate Test/Live keys:
   ```bash
   # Backend (.env)
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
   RAZORPAY_SECRET_KEY=xxxxxxxxxxxxxxxxxxxxxxxx
   
   # Frontend (.env.local)
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
   ```

### Square (Alternative processor)
1. Go to [Square Developer Dashboard](https://developer.squareup.com/)
2. Create new application
3. Get Application ID and Access Token:
   ```bash
   # Backend (.env)
   SQUARE_ACCESS_TOKEN=EAAAxxxxxxxxxxxxxxxxxxxxxxx
   SQUARE_APPLICATION_ID=sq0idp-xxxxxxxxxxxxxxxx
   
   # Frontend (.env.local)
   NEXT_PUBLIC_SQUARE_APPLICATION_ID=sq0idp-xxxxxxxxxxxxxxxx
   ```

## 📱 Communication Services

### Twilio (SMS/Phone)
1. Go to [Twilio Console](https://console.twilio.com/)
2. Get Account SID, Auth Token, and Phone Number:
   ```bash
   # Backend (.env)
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_PHONE_NUMBER=+1234567890
   ```

### SendGrid (Email)
1. Go to [SendGrid Dashboard](https://app.sendgrid.com/)
2. Navigate to Settings > API Keys
3. Create new API key:
   ```bash
   # Backend (.env)
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxx
   ```

### Resend (Modern email service)
1. Go to [Resend Dashboard](https://resend.com/dashboard)
2. Generate API key:
   ```bash
   # Backend (.env)
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxx
   ```

### Mailgun (Email alternative)
1. Go to [Mailgun Dashboard](https://app.mailgun.com/)
2. Get API key and domain:
   ```bash
   # Backend (.env)
   MAILGUN_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxx-xxxxxxxx
   MAILGUN_DOMAIN=sandboxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.mailgun.org
   ```

## 📊 Analytics & Monitoring

### Mixpanel (Product Analytics)
1. Go to [Mixpanel](https://mixpanel.com/project)
2. Get Project Token and API Secret:
   ```bash
   # Frontend (.env.local)
   NEXT_PUBLIC_MIXPANEL_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   
   # Backend (.env)
   MIXPANEL_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

### Sentry (Error Tracking)
1. Go to [Sentry Dashboard](https://sentry.io/)
2. Create project and get DSN:
   ```bash
   # Both Frontend (.env.local) and Backend (.env)
   NEXT_PUBLIC_SENTRY_DSN=https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx@xxxxxxxx.ingest.sentry.io/xxxxxxxx
   SENTRY_DSN=https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx@xxxxxxxx.ingest.sentry.io/xxxxxxxx
   ```

### Google Analytics
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create property and get Measurement ID:
   ```bash
   # Frontend (.env.local)
   NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
   ```

### Hotjar (User Experience)
1. Go to [Hotjar Dashboard](https://insights.hotjar.com/)
2. Get Site ID:
   ```bash
   # Frontend (.env.local)
   NEXT_PUBLIC_HOTJAR_ID=xxxxxxx
   ```

### Datadog (Infrastructure Monitoring)
1. Go to [Datadog](https://app.datadoghq.com/)
2. Get API key:
   ```bash
   # Backend (.env)
   DATADOG_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

## 🔐 Social Authentication

### Google OAuth
1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create OAuth 2.0 credentials:
   ```bash
   # Frontend (.env.local)
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
   
   # Backend (.env)
   GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxx
   ```

### GitHub OAuth
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create new OAuth application:
   ```bash
   # Frontend (.env.local)
   NEXT_PUBLIC_GITHUB_CLIENT_ID=Iv1.xxxxxxxxxxxxxxxx
   
   # Backend (.env)
   GITHUB_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

### LinkedIn OAuth
1. Go to [LinkedIn Developer Portal](https://developer.linkedin.com/)
2. Create new app and get credentials:
   ```bash
   # Frontend (.env.local)
   NEXT_PUBLIC_LINKEDIN_CLIENT_ID=xxxxxxxxxxxxxxxx
   
   # Backend (.env)
   LINKEDIN_CLIENT_SECRET=xxxxxxxxxxxxxxxx
   ```

### Microsoft OAuth
1. Go to [Azure Portal](https://portal.azure.com/)
2. Register new application:
   ```bash
   # Frontend (.env.local)
   NEXT_PUBLIC_MICROSOFT_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   
   # Backend (.env)
   MICROSOFT_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

## 🔍 KYC/Identity Verification

### Jumio (ID Verification)
1. Go to [Jumio Portal](https://portal.jumio.com/)
2. Get API token and secret:
   ```bash
   # Backend (.env)
   JUMIO_API_TOKEN=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   JUMIO_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   
   # Frontend (.env.local)
   JUMIO_API_TOKEN=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   ```

### Onfido (Background Checks)
1. Go to [Onfido Dashboard](https://onfido.com/)
2. Get API token:
   ```bash
   # Backend (.env)
   ONFIDO_API_TOKEN=api_test.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   
   # Frontend (.env.local)
   ONFIDO_API_TOKEN=api_test.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

### Persona (Identity Platform)
1. Go to [Persona Dashboard](https://app.withpersona.com/)
2. Get API key:
   ```bash
   # Backend (.env)
   PERSONA_API_KEY=persona_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   
   # Frontend (.env.local)
   PERSONA_API_KEY=persona_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

### SumSub (KYC/AML)
1. Go to [SumSub Dashboard](https://cockpit.sumsub.com/)
2. Get App Token and Secret Key:
   ```bash
   # Backend (.env)
   SUMSUB_APP_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   SUMSUB_SECRET_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

## 📁 File Storage

### AWS S3
1. Go to [AWS Console](https://aws.amazon.com/console/)
2. Create IAM user with S3 permissions:
   ```bash
   # Backend (.env)
   AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
   AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   AWS_BUCKET_NAME=paywallet-storage-dev
   AWS_REGION=us-east-1
   ```

### Cloudinary (Image/Video Processing)
1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Get cloud name and API credentials:
   ```bash
   # Backend (.env)
   CLOUDINARY_CLOUD_NAME=xxxxxxxxxxxxxxxx
   CLOUDINARY_API_KEY=xxxxxxxxxxxxxxx
   CLOUDINARY_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   
   # Frontend (.env.local)
   CLOUDINARY_CLOUD_NAME=xxxxxxxxxxxxxxxx
   ```

## 🗺️ Map Services

### Mapbox
1. Go to [Mapbox Dashboard](https://account.mapbox.com/)
2. Get access token:
   ```bash
   # Frontend (.env.local)
   NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6ImNsxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

### Google Maps
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Maps JavaScript API and get key:
   ```bash
   # Frontend (.env.local)
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

## 🔔 Push Notifications

### Firebase
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create project and get config:
   ```bash
   # Frontend (.env.local)
   NEXT_PUBLIC_FIREBASE_CONFIG={"apiKey":"AIzaSyxxxxxxxxx","authDomain":"project.firebaseapp.com","projectId":"project","storageBucket":"project.appspot.com","messagingSenderId":"123456789","appId":"1:123456789:web:xxxxxxxxxxxxxxxxxx"}
   NEXT_PUBLIC_VAPID_PUBLIC_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   
   # Backend (.env)
   FIREBASE_SERVER_KEY=AAAAxxxxxxx:APA91bxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   VAPID_PRIVATE_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

## 🌐 Wallet Connect

### WalletConnect
1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Create project and get Project ID:
   ```bash
   # Frontend (.env.local)
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

## ⚡ Quick Setup Commands

```bash
# Copy example files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Open files for editing
code backend/.env
code frontend/.env.local

# Or use nano
nano backend/.env
nano frontend/.env.local
```

## 🛡️ Security Best Practices

### Development
- Use test/sandbox keys for development
- Never commit `.env` files to version control
- Use different keys for each environment
- Regularly rotate API keys

### Production
- Use environment variables in deployment platform
- Enable webhook signature verification
- Set up proper CORS origins
- Monitor API usage and set up alerts
- Use secrets management services (AWS Secrets Manager, etc.)

### Key Management Checklist
- [ ] All API keys are in environment variables
- [ ] No hardcoded secrets in code
- [ ] Different keys for dev/staging/production
- [ ] Webhook secrets are set up
- [ ] Rate limiting is configured
- [ ] API keys have minimal required permissions
- [ ] Keys are rotated regularly
- [ ] Usage monitoring is set up

## 🚨 Common Issues & Solutions

### "Invalid API Key" Errors
- Verify you're using the correct environment key (test vs live)
- Check that the key has necessary permissions/scopes
- Ensure no extra spaces or characters in the key
- Confirm the key is active and not expired

### CORS Issues
- Add your domain to the service's allowed origins
- Check if your frontend and backend URLs are correctly configured
- Verify the API endpoint allows your domain

### Webhook Not Working
- Ensure webhook URL is publicly accessible (use ngrok for local testing)
- Verify webhook secret matches between service and your app  
- Check that your webhook endpoint responds with 200 status
- Review the service's webhook delivery logs

### Authentication Flow Issues
- Confirm redirect URIs match exactly (including http/https)
- Check that client IDs and secrets are correctly paired
- Verify scopes/permissions requested are granted
- Test with simple OAuth flow first

## 📞 Support Resources

- **Stripe**: [Documentation](https://stripe.com/docs) | [Support](https://support.stripe.com/)
- **PayPal**: [Developer Docs](https://developer.paypal.com/docs/) | [Support](https://www.paypal.com/us/smarthelp/contact-us)
- **Twilio**: [Docs](https://www.twilio.com/docs) | [Support](https://support.twilio.com/)
- **Firebase**: [Documentation](https://firebase.google.com/docs) | [Support](https://firebase.google.com/support)
- **AWS**: [Documentation](https://docs.aws.amazon.com/) | [Support](https://aws.amazon.com/support/)

---

For general environment setup, see [ENV_SETUP.md](./ENV_SETUP.md)  
For production deployment, see [DEPLOYMENT.md](./DEPLOYMENT.md)

# Quarterends Deployment Guide

## 🚀 Complete Deployment Instructions

This guide covers deploying the Quarterends luxury fashion e-commerce platform to Firebase Hosting.

---

## Prerequisites

✅ **Completed Setup:**
- Firebase project created (`quarterends-4e848`)
- Firebase CLI installed locally (`firebase-tools` in devDependencies)
- Production build tested (`npm run build` successful)
- All environment variables configured

---

## Deployment Steps

### 1. **Login to Firebase**

```bash
npx firebase login
```

This will open a browser window to authenticate with your Google account.

### 2. **Build Production Bundle**

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder with:
- Code splitting (lazy-loaded routes)
- Minified and compressed assets
- Tree-shaken dependencies
- Optimized chunks (~112KB gzipped for main bundle)

### 3. **Preview Build Locally (Optional)**

```bash
npm run preview
```

Test the production build locally at `http://localhost:4173`

### 4. **Deploy to Firebase Hosting**

**Option A: Deploy Everything**
```bash
npm run deploy
```

**Option B: Deploy Only Hosting**
```bash
npm run deploy:hosting
```

**Option C: Deploy Specific Services**
```bash
# Firestore rules only
npm run deploy:firestore

# Cloud Functions only
npm run deploy:functions
```

### 5. **Verify Deployment**

After deployment completes, you'll see:
```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/quarterends-4e848/overview
Hosting URL: https://quarterends-4e848.web.app
```

Visit your live site at the Hosting URL provided.

---

## Environment Variables

### Production Environment (.env.production)

Create a `.env.production` file with production values:

```bash
# Firebase Production Config
VITE_FIREBASE_API_KEY=your_production_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=quarterends-4e848.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=quarterends-4e848
VITE_FIREBASE_STORAGE_BUCKET=quarterends-4e848.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Stripe Production Keys
VITE_STRIPE_PUBLIC_KEY=pk_live_your_production_key

# OpenAI Production Key
VITE_OPENAI_API_KEY=your_production_openai_key
```

⚠️ **Security Note:** Never commit `.env.production` to version control. Add it to `.gitignore`.

---

## Custom Domain Setup

### 1. **Add Custom Domain in Firebase Console**

1. Go to [Firebase Console](https://console.firebase.google.com/project/quarterends-4e848/hosting)
2. Navigate to **Hosting** → **Add custom domain**
3. Enter your domain: `quarterends.com`
4. Follow the verification steps

### 2. **Update DNS Records**

Add these DNS records to your domain registrar:

**For Root Domain (quarterends.com):**
```
Type: A
Name: @
Value: 151.101.1.195
       151.101.65.195
```

**For WWW Subdomain (www.quarterends.com):**
```
Type: CNAME
Name: www
Value: quarterends-4e848.web.app
```

### 3. **SSL Certificate**

Firebase automatically provisions SSL certificates (usually within 24 hours).

---

## Post-Deployment Checklist

### ✅ **Functionality Testing**

- [ ] Homepage loads correctly
- [ ] Shop page displays products
- [ ] Product detail pages work
- [ ] User authentication (login/signup/Google OAuth)
- [ ] Cart operations (add/remove/update)
- [ ] Wishlist functionality
- [ ] Stripe checkout flow (test mode)
- [ ] Order confirmation and tracking
- [ ] Admin dashboard access
- [ ] AI Chatbot functionality
- [ ] Visual search feature
- [ ] Image generation in admin

### ✅ **Performance Verification**

- [ ] Lighthouse score > 90
- [ ] Core Web Vitals pass
- [ ] Images lazy load
- [ ] Routes code-split
- [ ] Assets cached properly

### ✅ **SEO Verification**

- [ ] Meta tags render correctly
- [ ] robots.txt accessible at `/robots.txt`
- [ ] sitemap.xml accessible at `/sitemap.xml`
- [ ] Open Graph tags present
- [ ] Schema markup valid

### ✅ **Security Verification**

- [ ] Firestore security rules active
- [ ] Storage security rules active
- [ ] Admin routes protected
- [ ] HTTPS enforced
- [ ] Security headers present

---

## Production Configuration

### Firebase Security Rules

**Firestore Rules (`firestore.rules`):**
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read for products
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // User-specific data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Orders
    match /orders/{orderId} {
      allow read: if request.auth != null && 
                     (resource.data.userId == request.auth.uid || 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

**Storage Rules (`storage.rules`):**
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
                      request.resource.size < 5 * 1024 * 1024 && // 5MB limit
                      request.resource.contentType.matches('image/.*');
    }
  }
}
```

### Deploy Security Rules

```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Storage rules
firebase deploy --only storage
```

---

## Monitoring & Analytics

### Firebase Performance Monitoring

Performance data is automatically tracked via `firebase/performance`:
- Page load times
- Network requests
- Custom traces

View metrics: [Firebase Console → Performance](https://console.firebase.google.com/project/quarterends-4e848/performance)

### Google Analytics

Analytics events tracked via `firebase/analytics`:
- Page views
- Product views
- Add to cart
- Purchase events
- User engagement

View analytics: [Firebase Console → Analytics](https://console.firebase.google.com/project/quarterends-4e848/analytics)

---

## Rollback Strategy

If you need to rollback to a previous deployment:

```bash
# View deployment history
npx firebase hosting:channel:list

# Rollback to previous version
npx firebase hosting:clone <source>:<channel> <destination>:<channel>
```

---

## Continuous Deployment (Optional)

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: quarterends-4e848
```

---

## Support & Maintenance

### Regular Tasks

1. **Weekly:** Check Firebase usage/quota
2. **Monthly:** Review analytics and performance
3. **Quarterly:** Update dependencies
4. **As needed:** Update security rules

### Useful Commands

```bash
# Check Firebase project info
npx firebase projects:list

# View hosting deploys
npx firebase hosting:sites:list

# Check Firestore usage
npx firebase firestore:indexes:list

# View functions logs
npx firebase functions:log
```

---

## Cost Estimation

### Firebase Free Tier Limits:
- **Hosting:** 10 GB storage, 360 MB/day transfer
- **Firestore:** 1 GB storage, 50K reads/day, 20K writes/day
- **Storage:** 5 GB storage, 1 GB/day download
- **Functions:** 2M invocations/month

### Stripe Fees:
- **Test Mode:** Free
- **Live Mode:** 2.9% + $0.30 per transaction

### OpenAI Costs:
- **GPT-3.5 Turbo:** $0.50 / 1M tokens
- **GPT-4 Vision:** $10.00 / 1M tokens
- **DALL-E 3:** $0.040 per image (1024x1024)

---

## Troubleshooting

### Common Issues

**Build Fails:**
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run build
```

**Firebase Deploy Fails:**
```bash
# Re-authenticate
npx firebase logout
npx firebase login

# Check project
npx firebase use quarterends-4e848
```

**Environment Variables Not Working:**
- Ensure variables are prefixed with `VITE_`
- Rebuild after changing .env files
- Check browser console for missing values

---

## Success! 🎉

Your Quarterends luxury e-commerce platform is now live!

**Next Steps:**
1. Share your live URL with stakeholders
2. Set up monitoring alerts
3. Configure custom domain
4. Switch Stripe to live mode for production
5. Set up backup strategies
6. Plan content updates

**Live URLs:**
- Production: `https://quarterends-4e848.web.app`
- Firebase Console: `https://console.firebase.google.com/project/quarterends-4e848`

---

*Last Updated: November 27, 2025*

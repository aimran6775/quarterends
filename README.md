# Quarterends E-commerce Platform

A world-class, AI-powered e-commerce platform built with React, TypeScript, Firebase, and OpenAI.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage, Functions, Hosting)
- **Payments**: Stripe
- **AI**: OpenAI GPT-4
- **Deployment**: Firebase Hosting

## Prerequisites

- Node.js 18+ installed
- Firebase CLI installed: `npm install -g firebase-tools`
- Firebase project created (quarterends-4e848)
- Stripe account
- OpenAI API key

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Update `.env` file with your actual Firebase API keys:

```env
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_MESSAGING_SENDER_ID=your_actual_sender_id
```

Your OpenAI key is already configured.

### 3. Firebase Setup

Login to Firebase:
```bash
firebase login
```

Initialize Firebase (already done):
```bash
firebase init
```

Select:
- Firestore
- Functions
- Hosting
- Storage

### 4. Deploy Firestore Rules and Indexes

```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
firebase deploy --only storage
```

### 5. Create First Admin User

After signing up with your email, manually set your role to 'admin' in Firestore:

1. Go to Firebase Console > Firestore Database
2. Find your user document in the `users` collection
3. Edit the document and set `role: "admin"`

### 6. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5174`

### 7. Build for Production

```bash
npm run build
```

### 8. Deploy to Firebase Hosting

```bash
firebase deploy --only hosting
```

Your site will be live at: `https://quarterends-4e848.web.app`

## Project Structure

```
/quarterends
├── /src
│   ├── /components      # Reusable UI components
│   ├── /pages          # Page components
│   ├── /contexts       # React contexts (Auth, Cart, etc.)
│   ├── /config         # Firebase and other configs
│   ├── /types          # TypeScript type definitions
│   ├── /utils          # Utility functions
│   └── /styles         # Global styles
├── /functions          # Firebase Cloud Functions
├── /public             # Static assets
├── firestore.rules     # Firestore security rules
├── storage.rules       # Storage security rules
└── firebase.json       # Firebase configuration

```

## Features Roadmap

### ✅ Phase 1: Core Frontend
- React + TypeScript + Vite setup
- Tailwind CSS styling
- Basic routing and pages
- Responsive design

### ✅ Phase 2: Firebase Authentication
- Email/Password authentication
- Google Sign-In
- User profiles
- Protected routes
- Role-based access control

### 🚧 Phase 3: Admin Dashboard
- Product management
- Image uploads
- Inventory tracking
- Order management

### 📋 Phase 4: Product Display
- Firestore integration
- Product filtering & sorting
- Search functionality
- Product detail pages

### 📋 Phase 5: Shopping Cart & Wishlist
- Cart functionality
- Persistent storage
- Wishlist management

### 📋 Phase 6: Stripe Integration
- Payment processing
- Multi-currency support
- Checkout flow

### 📋 Phase 7: Order Management
- Order tracking
- Email notifications
- Admin order panel

### 📋 Phase 8: AI Features
- Product description generator
- Personalized recommendations
- Style suggestions

### 📋 Phase 9: Advanced AI
- Shopping assistant chatbot
- Visual search
- 24/7 support bot

### 📋 Phase 10: Optimization & Launch
- SEO optimization
- Performance tuning
- Custom domain setup
- CI/CD pipeline

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `firebase deploy` - Deploy to Firebase

## Environment Variables

Required environment variables in `.env`:

```env
# Firebase
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# OpenAI
VITE_OPENAI_API_KEY=

# Stripe (Phase 6)
VITE_STRIPE_PUBLISHABLE_KEY=
```

## Security

- Firestore security rules enforce role-based access
- All sensitive operations require authentication
- Admin-only routes protected
- Environment variables for API keys
- CORS configured for production

## License

Proprietary - All rights reserved

## Support

For support, email support@quarterends.com

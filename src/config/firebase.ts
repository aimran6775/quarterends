import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAnalytics } from 'firebase/analytics'
import { getPerformance } from 'firebase/performance'

const firebaseConfig = {
  apiKey: "AIzaSyADb3I2cUfvkOv6SvEiqM7YolmLhDaanGk",
  authDomain: "quarterends-4e848.firebaseapp.com",
  projectId: "quarterends-4e848",
  storageBucket: "quarterends-4e848.firebasestorage.app",
  messagingSenderId: "21260123186",
  appId: "1:21260123186:web:46e5a110fc6fc29fd4d02b",
  measurementId: "G-FT2KLSG46V"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const analytics = getAnalytics(app)
export const performance = getPerformance(app)
export const googleProvider = new GoogleAuthProvider()

export default app

// Script to set a user as admin
// Usage: node scripts/setAdmin.js YOUR_EMAIL@example.com

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, query, where, getDocs, updateDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyADb3I2cUfvkOv6SvEiqM7YolmLhDaanGk",
  authDomain: "quarterends-4e848.firebaseapp.com",
  projectId: "quarterends-4e848",
  storageBucket: "quarterends-4e848.firebasestorage.app",
  messagingSenderId: "21260123186",
  appId: "1:21260123186:web:46e5a110fc6fc29fd4d02b",
  measurementId: "G-FT2KLSG46V"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const email = process.argv[2]

if (!email) {
  console.error('❌ Please provide an email address')
  console.log('Usage: node scripts/setAdmin.js YOUR_EMAIL@example.com')
  process.exit(1)
}

async function setAdminRole() {
  try {
    console.log(`🔍 Looking for user with email: ${email}`)
    
    const usersRef = collection(db, 'users')
    const q = query(usersRef, where('email', '==', email))
    const snapshot = await getDocs(q)
    
    if (snapshot.empty) {
      console.error('❌ User not found. Make sure the user has signed up first.')
      process.exit(1)
    }
    
    const userDoc = snapshot.docs[0]
    await updateDoc(userDoc.ref, { role: 'admin' })
    
    console.log('✅ Successfully set admin role!')
    console.log(`📧 User: ${email}`)
    console.log(`🆔 UID: ${userDoc.id}`)
    console.log('\n🎉 You can now access the admin dashboard at: /admin')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

setAdminRole()

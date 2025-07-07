// src/firebase.js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// 🔑 여기에 본인의 Firebase 프로젝트 설정 정보 입력
const firebaseConfig = {
  apiKey: "AIzaSyApRstSLxdU0bboa6Iig7aAVNzQ2Q03qV0",
  authDomain: "cadenceflow-2ed11.firebaseapp.com",
  projectId: "cadenceflow-2ed11",
  storageBucket: "cadenceflow-2ed11.firebasestorage.app",
  messagingSenderId: "133392737235",
  appId: "1:133392737235:web:550ff01e6d7305a2284526",
  measurementId: "G-6HZ6L0ZJMD"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
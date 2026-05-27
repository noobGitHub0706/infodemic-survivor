// Firebase設定はデプロイ時に環境変数から読み込む
// 開発時はダミー値でFirebaseを無効化

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

let db = null

async function initFirebase() {
  if (!firebaseConfig.apiKey) return null
  try {
    const { initializeApp } = await import('firebase/app')
    const { getFirestore } = await import('firebase/firestore')
    const app = initializeApp(firebaseConfig)
    db = getFirestore(app)
    return db
  } catch {
    return null
  }
}

export async function saveGameResult(participantId, sessionData) {
  if (!db) await initFirebase()
  if (!db) return false
  try {
    const { doc, setDoc } = await import('firebase/firestore')
    const ref = doc(db, 'participants', participantId, 'gameData', 'infodemic_survivor')
    await setDoc(ref, { ...sessionData, savedAt: new Date().toISOString() }, { merge: true })
    return true
  } catch (e) {
    console.warn('Firebase save failed:', e)
    return false
  }
}

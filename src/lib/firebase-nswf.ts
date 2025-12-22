
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set, remove, update, onValue, off } from "firebase/database";

// Firebase configuration for NSWF
const firebaseConfig = {
  apiKey: "AIzaSyBaTVrC_s3uJpfGEp9o8im-xPDRbn6JkKw",
  authDomain: "nsfw-18-czke.firebaseapp.com",
  databaseURL: "https://nsfw-18-czke-default-rtdb.firebaseio.com",
  projectId: "nsfw-18-czke",
  storageBucket: "nsfw-18-czke.firebasestorage.app",
  messagingSenderId: "497741686374",
  appId: "1:497741686374:web:f4a08857919eb0a6efafa7"
};


// Initialize Firebase for NSWF
const nswfApp = initializeApp(firebaseConfig, "nswf");
export const nswfDatabase = getDatabase(nswfApp);

// Database helper functions for NSWF
export const fetchNswfData = async (path: string) => {
  const dataRef = ref(nswfDatabase, path);
  const snapshot = await get(dataRef);
  return snapshot.exists() ? snapshot.val() : null;
};

export const updateNswfData = async (path: string, data: any) => {
  const dataRef = ref(nswfDatabase, path);
  await update(dataRef, data);
  return data;
};

export const setNswfData = async (path: string, data: any) => {
  const dataRef = ref(nswfDatabase, path);
  await set(dataRef, data);
  return data;
};

export const removeNswfData = async (path: string) => {
  const dataRef = ref(nswfDatabase, path);
  await remove(dataRef);
  return true;
};

// Realtime listener functions for NSWF
export const subscribeToNswfData = (path: string, callback: (data: any) => void) => {
  const dataRef = ref(nswfDatabase, path);
  onValue(dataRef, (snapshot) => {
    const data = snapshot.exists() ? snapshot.val() : null;
    callback(data);
  });
  
  // Return unsubscribe function
  return () => off(dataRef);
};

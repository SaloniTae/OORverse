
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set, remove, update, onValue, off } from "firebase/database";

// Firebase configuration for NSWF
const firebaseConfig = {
  apiKey: "AIzaSyAYRZD50jryWCXTkoVIGgyBiilYz8VaI0Y",
  authDomain: "get-account-18-43109.firebaseapp.com",
  databaseURL: "https://get-account-18-43109-default-rtdb.firebaseio.com",
  projectId: "get-account-18-43109",
  storageBucket: "get-account-18-43109.firebasestorage.app",
  messagingSenderId: "776922570919",
  appId: "1:776922570919:web:58bf799181ed4d18b03b82",
  measurementId: "G-MHSXL0FN75"
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

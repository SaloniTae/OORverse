
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set, remove, update, onValue, off } from "firebase/database";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBgMSdXQF17Cx9ndtAfmaEPb8UsVTkrgBo",
  authDomain: "get-chatgpt-credentials.firebaseapp.com",
  databaseURL: "https://get-chatgpt-credentials-default-rtdb.firebaseio.com",
  projectId: "get-chatgpt-credentials",
  storageBucket: "get-chatgpt-credentials.firebasestorage.app",
  messagingSenderId: "550539005243",
  appId: "1:550539005243:web:f8ee67d3c33062c6e1bb1e",
  measurementId: "G-QCQSFLX6C3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);

// Database helper functions
export const fetchData = async (path: string) => {
  const dataRef = ref(database, path);
  const snapshot = await get(dataRef);
  return snapshot.exists() ? snapshot.val() : null;
};

export const updateData = async (path: string, data: any) => {
  const dataRef = ref(database, path);
  await update(dataRef, data);
  return data;
};

export const setData = async (path: string, data: any) => {
  const dataRef = ref(database, path);
  await set(dataRef, data);
  return data;
};

export const removeData = async (path: string) => {
  const dataRef = ref(database, path);
  await remove(dataRef);
  return true;
};

// Realtime listener functions
export const subscribeToData = (path: string, callback: (data: any) => void) => {
  const dataRef = ref(database, path);
  onValue(dataRef, (snapshot) => {
    const data = snapshot.exists() ? snapshot.val() : null;
    callback(data);
  });
  
  // Return unsubscribe function
  return () => off(dataRef);
};

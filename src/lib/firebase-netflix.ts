
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set, remove, update, onValue, off } from "firebase/database";

// Firebase configuration for Netflix
const firebaseConfig = {
  apiKey: "AIzaSyAbS_We1o4-NMtkNIuvdokO9klPAplrQ8I",
  authDomain: "oor-netflix.firebaseapp.com",
  databaseURL: "https://oor-netflix-default-rtdb.firebaseio.com",
  projectId: "oor-netflix",
  storageBucket: "oor-netflix.firebasestorage.app",
  messagingSenderId: "175251902922",
  appId: "1:175251902922:web:576c85dd6e0c00daed3f33",
  measurementId: "G-P3Z6EYW6ZH"
};
// Initialize Firebase for Netflix
const netflixApp = initializeApp(firebaseConfig, "netflix");
export const netflixDatabase = getDatabase(netflixApp);

// Database helper functions for Netflix
export const fetchNetflixData = async (path: string) => {
  const dataRef = ref(netflixDatabase, path);
  const snapshot = await get(dataRef);
  return snapshot.exists() ? snapshot.val() : null;
};

export const updateNetflixData = async (path: string, data: any) => {
  const dataRef = ref(netflixDatabase, path);
  await update(dataRef, data);
  return data;
};

export const setNetflixData = async (path: string, data: any) => {
  const dataRef = ref(netflixDatabase, path);
  await set(dataRef, data);
  return data;
};

export const removeNetflixData = async (path: string) => {
  const dataRef = ref(netflixDatabase, path);
  await remove(dataRef);
  return true;
};

// Realtime listener functions for Netflix
export const subscribeToNetflixData = (path: string, callback: (data: any) => void) => {
  const dataRef = ref(netflixDatabase, path);
  onValue(dataRef, (snapshot) => {
    const data = snapshot.exists() ? snapshot.val() : null;
    callback(data);
  });
  
  // Return unsubscribe function
  return () => off(dataRef);
};

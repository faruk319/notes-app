import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDpqdilieA67oIrqxCjD58RorCQyt91Yjo",
  authDomain: "notes-app-812c9.firebaseapp.com",
  projectId: "notes-app-812c9",
  storageBucket: "notes-app-812c9.firebasestorage.app",
  messagingSenderId: "177263480828",
  appId: "1:177263480828:web:562023fe94852328c06c79",
  measurementId: "G-KP20MRD7E4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

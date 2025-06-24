import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// const firebaseConfig = {
//   apiKey: "AIzaSyD8sUlIFoYv-FNcnGtMbxVaJwAiZ0mSVF0",
//   authDomain: "rantonme-beta.firebaseapp.com",
//   projectId: "rantonme-beta",
//   storageBucket: "rantonme-beta.firebasestorage.app",
//   messagingSenderId: "678995798792",
//   appId: "1:678995798792:web:3f06bcfc135b2787469abd",
//   measurementId: "G-KLG7RJF9E9"
// };
const firebaseConfig = {
  apiKey: "AIzaSyDMadvCE1N_nU30RTdx_kfl_3EPTX15X08",
  authDomain: "rant-on-me-4d88b.firebaseapp.com",
  projectId: "rant-on-me-4d88b",
  storageBucket: "rant-on-me-4d88b.firebasestorage.app",
  messagingSenderId: "382485827600",
  appId: "1:382485827600:web:609335987efb3cbe06fa95",
  measurementId: "G-4RW1BS9DE3"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };

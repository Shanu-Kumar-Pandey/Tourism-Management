import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAl15EeMX6EDjTIykDSUV4KOFusrmDEw8c",
    authDomain: "tourism-5da16.firebaseapp.com",
    projectId: "tourism-5da16",
    storageBucket: "tourism-5da16.appspot.com",
    messagingSenderId: "136454201866",
    appId: "1:136454201866:web:962570cb98fc24a8e6b5f3",
    measurementId: "G-RC3NNTWNF4"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);


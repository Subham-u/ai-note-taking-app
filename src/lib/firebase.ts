// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "aldeation-yt-1ca1a.firebaseapp.com",
  projectId: "aldeation-yt-1ca1a",
  storageBucket: "aldeation-yt-1ca1a.appspot.com",
  messagingSenderId: "484982148238",
  appId: "1:484982148238:web:18e780623d568eaab40ddf",
  measurementId: "G-37X63555KP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
// var admin = require("firebase-admin");

export async function uploadFileToFirebase(image_url: string, name: string) {
  try {
    const response = await fetch(image_url);
    const buffer = await response.arrayBuffer();
    console.log(buffer);
    const file_name = name.replace(" ", "") + Date.now + ".png";
    const storageRef = ref(storage, file_name);
    await uploadBytes(storageRef, buffer, {
      contentType: "image/png",
    });
    const firebase_url = await getDownloadURL(storageRef);
    return firebase_url;
  } catch (error) {
    console.error(error);
  }
}
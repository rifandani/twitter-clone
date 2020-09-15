import app, { initializeApp } from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDirqUiRMSKHbCMDPjfo33PBOuxuteUf-Y',
  authDomain: 'rifandani-twitter-clone.firebaseapp.com',
  databaseURL: 'https://rifandani-twitter-clone.firebaseio.com',
  projectId: 'rifandani-twitter-clone',
  storageBucket: 'rifandani-twitter-clone.appspot.com',
  messagingSenderId: '562962606109',
  appId: '1:562962606109:web:5944f91ff3d7ba53c0fef4',
  measurementId: 'G-RWJV6N07DY',
};

initializeApp(firebaseConfig);

export const db = app.firestore();
export const auth = app.auth();
export const storage = app.storage();
export const timestamp = app.firestore.FieldValue.serverTimestamp;

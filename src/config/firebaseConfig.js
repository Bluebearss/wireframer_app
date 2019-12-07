import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// THIS IS USED TO INITIALIZE THE firebase OBJECT
// PUT YOUR FIREBASE PROJECT CONFIG STUFF HERE
const firebaseConfig = {
    apiKey: "AIzaSyA3yiv9D2FsgiDCbpaECZ1WMV_jGsoQDSc",
    authDomain: "wireframer-rrf-316.firebaseapp.com",
    databaseURL: "https://wireframer-rrf-316.firebaseio.com",
    projectId: "wireframer-rrf-316",
    storageBucket: "wireframer-rrf-316.appspot.com",
    messagingSenderId: "902804541049",
    appId: "1:902804541049:web:9f870164cb66a51ad9cea8",
    measurementId: "G-50ERCWR9EJ"
  };
firebase.initializeApp(firebaseConfig);

// NOW THE firebase OBJECT CAN BE CONNECTED TO THE STORE
export default firebase;
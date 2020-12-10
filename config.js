import firebase from"firebase"
require("firebase/firestore")
var firebaseConfig = {
    apiKey: "AIzaSyDye2MGe1tyH_zmrGlWHJ4oNqFhfHfiLnY",
    authDomain: "e-library-a0507.firebaseapp.com",
    projectId: "e-library-a0507",
    storageBucket: "e-library-a0507.appspot.com",
    messagingSenderId: "334132987877",
    appId: "1:334132987877:web:8aebb72bc5da63a98ad10c"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  export default firebase.firestore()
import * as firebase from 'firebase';
require ('@firebase/firestore')

var firebaseConfig = {
  apiKey: "AIzaSyDJtoC3YtPkoaT12XS6TLkEYLs2MZZQOeQ",
  authDomain: "willy-app-782dc.firebaseapp.com",
  databaseURL: "https://willy-app-782dc.firebaseio.com",
  projectId: "willy-app-782dc",
  storageBucket: "willy-app-782dc.appspot.com",
  messagingSenderId: "595325771768",
  appId: "1:595325771768:web:c55c3c39934e703342400d"
};
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();
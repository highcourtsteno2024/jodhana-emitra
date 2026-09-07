const firebaseConfig = {
  apiKey: "AIzaSyCrRPdpey7KfDU4A0NhC8VJ9M0uqyu5dOQ",
  authDomain: "jodhana-emitra.firebaseapp.com",
  projectId: "jodhana-emitra",
  storageBucket: "jodhana-emitra.firebasestorage.app",
  messagingSenderId: "297148194647",
  appId: "1:297148194647:web:137469ce539a2d36fce812"
}; if (!firebase.apps.length) { firebase.initializeApp(firebaseConfig); } const db = firebase.firestore(); const storage = firebase.storage();

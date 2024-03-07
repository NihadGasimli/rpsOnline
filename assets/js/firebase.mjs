  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
  import { getDatabase } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBvGNeg6H8Bt5YvfksnQMPdajrDbuWBIE0",
    authDomain: "rpsonline-bbff0.firebaseapp.com",
    projectId: "rpsonline-bbff0",
    storageBucket: "rpsonline-bbff0.appspot.com",
    messagingSenderId: "585341553116",
    appId: "1:585341553116:web:987556f5103ae424eaa719"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  const db = getDatabase(app);

  export default db;

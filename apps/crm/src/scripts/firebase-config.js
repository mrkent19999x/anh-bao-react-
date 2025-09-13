// Firebase configuration for CRM
const firebaseConfig = {
    apiKey: "AIzaSyCQ7R-GyZjSY_iPQ1iooF_uFOa35gViM18",
    authDomain: "anhbao-373f3.firebaseapp.com",
    databaseURL: "https://anhbao-373f3-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "anhbao-373f3",
    storageBucket: "anhbao-373f3.firebasestorage.app",
    messagingSenderId: "599456783339",
    appId: "1:599456783339:web:cd57a672317cfaf2d617ae"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();

// Database references
const customersRef = db.collection('customers');
const employeesRef = db.collection('employees');
const tasksRef = db.collection('tasks');
const chatsRef = db.collection('chats');

// Debug: Log Firebase status
console.log('Firebase initialized:', firebase.apps.length > 0);
console.log('Auth object:', auth);
console.log('Firestore object:', db); 
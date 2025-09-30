// Firebase configuration for CRM
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY || "CHANGE_ME_IN_PRODUCTION",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "anhbao-373f3.firebaseapp.com",
    databaseURL: process.env.FIREBASE_DATABASE_URL || "https://anhbao-373f3-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: process.env.FIREBASE_PROJECT_ID || "anhbao-373f3",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "anhbao-373f3.firebasestorage.app",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "599456783339",
    appId: process.env.FIREBASE_APP_ID || "1:599456783339:web:cd57a672317cfaf2d617ae"
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
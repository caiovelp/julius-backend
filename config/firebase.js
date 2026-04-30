require('dotenv').config();

const { initializeApp } = require('firebase/app');

function requiredEnv(name) {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value;
}

const firebaseConfig = {
    apiKey: requiredEnv('FIREBASE_API_KEY'),
    authDomain: requiredEnv('FIREBASE_AUTH_DOMAIN'),
    projectId: requiredEnv('FIREBASE_PROJECT_ID'),
    storageBucket: requiredEnv('FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: requiredEnv('FIREBASE_MESSAGING_SENDER_ID'),
    appId: requiredEnv('FIREBASE_APP_ID'),
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const appFirebase = initializeApp(firebaseConfig);

module.exports = {
    appFirebase,
    firebaseConfig,
};

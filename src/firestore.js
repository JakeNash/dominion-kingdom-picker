var firebase = require('firebase/app');
require('firebase/firestore');

const firebaseConfig = {
  apiKey: '<SET ME>',
  authDomain: 'dominion-kingdom-picker.firebaseapp.com',
  databaseURL: 'https://dominion-kingdom-picker.firebaseio.com',
  projectId: 'dominion-kingdom-picker',
  storageBucket: 'dominion-kingdom-picker.appspot.com',
  messagingSenderId: '111172060442',
  appId: '1:111172060442:web:f9c9bf8c10a72f9354d8a3',
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

export default db;

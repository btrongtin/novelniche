var admin = require("firebase-admin");

var serviceAccount = require("../config/mern-commerce-55384-firebase-adminsdk-q9div-6aa65b3891.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  apiKey: "AIzaSyA6MmJg8xsyO09UFDLVWBhUoxdWAxzDyjk",
  authDomain: "mern-commerce-55384.firebaseapp.com",
  projectId: "mern-commerce-55384",
  storageBucket: "mern-commerce-55384.appspot.com",
  messagingSenderId: "759215364090",
  appId: "1:759215364090:web:83bc929498b8207032f643"
  // databaseURL: "https://ecommerce-225c8.firebaseio.com",
});

module.exports = admin;

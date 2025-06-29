const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://my-inventory-project-9dccf-default-rtdb.firebaseio.com"
});

// Export Firebase services
const db = admin.firestore();
const auth = admin.auth();

module.exports = {
  admin,
  db,
  auth
}; 
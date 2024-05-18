const { Firestore } = require('@google-cloud/firestore');
const { GoogleAuth } = require('google-auth-library');

const auth = new GoogleAuth({
  credentials: require('./submissionmlgc-muhammadfaqihs-3f650124c82b.json'),
  scopes: ['https://www.googleapis.com/auth/datastore'],
});

async function storeData(id, data) {
  // Authenticate with Firestore
  const db = new Firestore({
    projectId: 'submissionmlgc-muhammadfaqihs',
    auth: auth, // Provide authentication credentials
  });

  const predictCollection = db.collection('predictions');
  return predictCollection.doc(id).set(data);
}

module.exports = { storeData };

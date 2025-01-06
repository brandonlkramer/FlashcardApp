import admin from 'firebase-admin';
import fs from 'fs';
import { writeToStream } from 'fast-csv'; // Correct function for writing CSVs

// Path to your service account JSON file
const serviceAccountPath = './vocab-review-app-1a54293d546d.json';

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'))
  ),
});

const db = admin.firestore();

async function exportData() {
  const data = [];
  const collectionRef = db.collection('study_data');

  try {
    const folderPath = './FirestoreData';
    // Get current date and time
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-'); // Format the timestamp
    const filePath = `${folderPath}/exported_data_${timestamp}.csv`;

    // Ensure the FirestoreData folder exists
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    const snapshot = await collectionRef.get();
    if (snapshot.empty) {
      console.log('No documents found.');
      return;
    }

    snapshot.forEach(doc => {
      data.push({ id: doc.id, ...doc.data() });
    });

    // Write data to a CSV file with date and time in the filename
    const ws = fs.createWriteStream(filePath);
    writeToStream(ws, data, { headers: true })
      .on('finish', () => console.log(`Data has been exported to ${filePath}`))
      .on('error', error => console.error('Error writing to CSV:', error));
  } catch (error) {
    console.error('Error exporting data:', error);
  }
}

exportData();

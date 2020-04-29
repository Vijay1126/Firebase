import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'

admin.initializeApp(functions.config().firebase)

export const helloWorld = functions.https.onRequest((request, response) => {
 response.send('Hello from Firebase!\n\n');
});

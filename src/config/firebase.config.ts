import * as admin from 'firebase-admin';
import { credential } from 'firebase-admin';
import applicationDefault = credential.applicationDefault;

admin.initializeApp({
  credential: applicationDefault(),
  storageBucket: `stockup-tec.appspot.com`,
});

export const storage = admin.storage().bucket();

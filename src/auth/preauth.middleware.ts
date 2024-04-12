import { Injectable, NestMiddleware } from '@nestjs/common';
import * as admin from 'firebase-admin';

const firebaseConfig = {
  apiKey: 'AIzaSyBIF8mxFQ6G8TYjYBzO8nR4rBH-t72e4zc',
  authDomain: 'stockup-tec.firebaseapp.com',
  projectId: 'stockup-tec',
  storageBucket: 'stockup-tec.appspot.com',
  messagingSenderId: '138905939414',
  appId: '1:138905939414:web:fa3bc2080445186d0d8877',
  measurementId: 'G-KP7NQ98Y52',
};

@Injectable()
export class PreauthMiddleware implements NestMiddleware {
  private defaultApp: any;

  constructor() {
    this.defaultApp = admin.initializeApp(firebaseConfig);
  }

  use(req: any, res: any, next: (error?: any) => void): any {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).send({ message: 'Unauthorized' });
    }
    this.defaultApp
      .auth()
      .verifyIdToken(token)
      .then((decodedToken: any) => {
        req.user = decodedToken;
        next();
      })
      .catch((error: any) => {
        console.error('Error while verifying Firebase ID token:', error);
        return res.status(403).send({ message: 'Unauthorized' });
      });
  }
}

import { Injectable } from '@nestjs/common';
import {
  getAuth,
  signInWithCredential,
  GoogleAuthProvider,
} from 'firebase/auth';
@Injectable()
export class AuthService {
  async loginWithGoogle(token: string) {
    const auth = getAuth();
    const credential = GoogleAuthProvider.credential(token);
    try {
      return await signInWithCredential(auth, credential);
    } catch (error) {
      console.error('Error while verifying Firebase ID token:', error);
      return null;
    }
  }
}

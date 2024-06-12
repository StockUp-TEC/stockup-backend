// firebase-storage.service.ts
import { Injectable } from '@nestjs/common';
import { storage } from '../config/firebase.config';

@Injectable()
export class FirebaseStorageService {
  async uploadProfilePicture(
    fileBuffer: Buffer,
    fileName: string,
  ): Promise<string> {
    const file = storage.file(`profile-pictures/${fileName}`);
    await file.save(fileBuffer, {
      resumable: false,
      metadata: {
        contentType: 'image/jpeg',
      },
    });

    return file
      .getSignedUrl({
        action: 'read',
        expires: '03-01-2500',
      })
      .then((urls) => urls[0]);
  }
}

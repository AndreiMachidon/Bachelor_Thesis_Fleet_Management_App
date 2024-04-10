
import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { TOKEN_ENCRYPTION_SECRET } from 'src/app/contants';

@Injectable({
  providedIn: 'root'
})
export class TokenEncryptionService {

  constructor() {}

  encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, TOKEN_ENCRYPTION_SECRET).toString();
  }

  decrypt(textToDecrypt: string): string {
    const bytes = CryptoJS.AES.decrypt(textToDecrypt, TOKEN_ENCRYPTION_SECRET);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}

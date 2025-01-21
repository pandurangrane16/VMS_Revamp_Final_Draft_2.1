import { Injectable } from '@angular/core';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class EncdecService {
    private key = CryptoJS.enc.Utf8.parse(environment.EncryptKey);
    private iv = CryptoJS.enc.Utf8.parse(environment.EncryptIV);
    constructor() {}
    // Methods for the encrypt and decrypt Using AES
    encryptUsingAES256(text:string): any {
        var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(text), this.key, {
            keySize: 128 / 8,
            iv: this.iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.toString();
    }
    decryptUsingAES256(decString:string) {
        var decrypted = CryptoJS.AES.decrypt(decString, this.key, {
            keySize: 128 / 8,
            iv: this.iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
    }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Login } from 'src/app/models/request/Login';
import { UserFacadeService } from '../../facade_services/user-facade.service';
import { HttpService } from '../common/http.service';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private key = CryptoJS.enc.Utf8.parse(environment.EncryptKey);
  private iv = CryptoJS.enc.Utf8.parse(environment.EncryptIV);

  constructor(private http: HttpClient,
    private _httpService: HttpService) { }
  login(credentials: Login): Observable<any> {
    //credentials.Password = this.encryptUsingAES256(credentials.Password);
    //credentials.VectorBase64 = this.generateIV();
    return this._httpService._postMethod(credentials, 'User_API/api/User/LoginRequest');
  }

  getMenuByRoleId(role_id: number): Observable<any> {
    return this._httpService._getMethod('user_API/api/Role/GetMenuListById?id=' + role_id);
  }

  encryptUsingAES256(text:any): any {
    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(text), this.key, {
        keySize: 128 / 8,
        iv: this.iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}
decryptUsingAES256(decString:any) {
    var decrypted = CryptoJS.AES.decrypt(decString, this.key, {
        keySize: 128 / 8,
        iv: this.iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}
  generateIV(): string {
    const iv = CryptoJS.lib.WordArray.random(16); // IV length for AES is typically 16 bytes (128 bits)
    return CryptoJS.enc.Base64.stringify(iv); // Convert the IV to a Base64 string
  }
}

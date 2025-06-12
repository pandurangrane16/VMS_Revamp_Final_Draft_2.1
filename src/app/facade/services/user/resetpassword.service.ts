import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../common/http.service';

@Injectable({
  providedIn: 'root'
})
export class ResetpasswordService {
  constructor(private http: HttpClient,
    private _httpService: HttpService,
    private _http: HttpClient) { }

 
  SendOtp(username: any, email:any) {
    return this._httpService._getMethod('user_api/api/User/SendOtp?username='+username+'&email='+email);
  }
  ValidateOTP(username: any, otp:any) {
    return this._httpService._getMethod('user_api/api/User/ValidateOTP?username='+username+'&otp='+otp);
  }

  ResetPassword(_data: any) {
    return this._httpService._postMethod(_data,'user_api/api/User/ResetPassword');
  }






 

}

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


    getUserOtp(username: any, password: any) {
        return this._httpService._getMethod('user_api/api/User/GetUserDetails?username=' + username);
    }

}

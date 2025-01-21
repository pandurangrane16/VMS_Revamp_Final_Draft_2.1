import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../common/http.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient,
    private _httpService: HttpService,
    private _http: HttpClient) { }

  getUsers(_data: any) {
    return this._httpService._postMethod(_data, 'user_api/api/User/GetUserMaster');
  }
  getUserDetails(_data: any) {
    return this._httpService._getMethod('user_api/api/User/GetUserDetails?id='+_data);
  }
  addUser(_data: any) {
    return this._httpService._postMethod(_data, 'user_api/api/User/PostUserMaster');
  }

  updateUser(_data: any) {
    return this._httpService._postMethod(_data, 'user_api/api/User/PutUserMaster');
  }

  ValidateUserName(_data: any) {
    return this._httpService._getMethod('user_api/api/User/ValidateUserName?username='+_data);
  }
}

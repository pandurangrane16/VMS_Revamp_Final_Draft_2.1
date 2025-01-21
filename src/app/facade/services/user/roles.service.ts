import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../common/http.service';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  constructor(private http: HttpClient,
    private _httpService: HttpService,
    private _http: HttpClient) { }
  jsonurl: string = '/assets/config/config.json';


  getRoles(_data: any) {
    return this._httpService._postMethod(_data, 'user_api/api/Role/GetRoles');
  }

  addRoles(_data: any) {
    return this._httpService._postMethod(_data, 'user_api/api/Role/postRoleMaster');
  }

  updateRoles(_data: any) {
    return this._httpService._postMethod(_data, 'user_api/api/Role/putRoleMaster');
  }


}

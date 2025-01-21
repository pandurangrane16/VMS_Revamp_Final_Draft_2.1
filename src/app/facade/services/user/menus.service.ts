import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../common/http.service';

@Injectable({
  providedIn: 'root'
})
export class MenusService {
  constructor(private http: HttpClient,
    private _httpService: HttpService,
    private _http: HttpClient) { }
  jsonurl: string = '/assets/config/config.json';


  getMenus() {
    return this._httpService._getMethod('user_api/api/MenuMaster/GetMenuMaster');
  }

  getRoleMenuAccessData(id:number){
    return this._httpService._getMethod("user_api/api/RoleMenu/GetRoleMenuRelationsByRoleId?roleId="+id);
  }

  updateRoleAccess(data:any) {
    return this._httpService._postMethod(data,"user_api/api/RoleMenu/PostRoleMenuRelation");
  }
}

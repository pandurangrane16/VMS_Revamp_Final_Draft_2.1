import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../common/http.service';

@Injectable({
  providedIn: 'root'
})
export class VmscommService {

  constructor(private http: HttpClient,
    private _httpService: HttpService
  ) { }

 

  AddFontDetails(_data:any) {       
    return this._httpService._postMethod(_data,'Vcms_API/api/VMSComm/AddFontDetails');
 }



}

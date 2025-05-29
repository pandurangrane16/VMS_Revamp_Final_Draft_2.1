import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService } from '../common/http.service';

@Injectable({
  providedIn: 'root'
})
export class MediaschedulerserviceService {

  constructor(private http: HttpClient,
       private _httpService: HttpService,
       
       private _http: HttpClient) { }
       jsonurl: string = '/assets/config/config.json';
       getMediaschedulerDetails(_data: any) {
        return this._httpService._getMethod('Vcms_API/api/MediaUpload/GetDetails'+_data);
      }
      SaveMediascheduler(_data: any) {        
        return this._httpService._postMethod(_data,'Vcms_API/api/MediaScheduler/SaveMediaSchedulerMaster');
      }

      CheckDuplicateMediaSchedulerName(name: any) {        
        return this._httpService._getMethod('Vcms_API/api/MediaScheduler/CheckDuplicateMediaSchedulerName?name='+ name);
      }
     
      UpdateMediascheduler(_data: any) {
        return this._httpService._putMethod(_data,'Vcms_API/api/MediaScheduler/PutMediaSchedulerMaster');
      }

      getMediaschedulerByIpAddress(ipAdd: string) {
        return this._httpService._getMethod('vcms_api/api/MediaScheduler/GetMediaSchedulerByIpAddress?_ipAddress=' + ipAdd);
      }

     

      GetMediaSchedulerById(id: string) {
        return this._httpService._getMethod('vcms_api/api/MediaScheduler/GetMediaSchedulerById?id=' + id);
      }

      getMediaschedulersList(_data: any,type:number){
        return this._httpService._postMethod(_data,'Vcms_API/api/MediaScheduler/GetMediaScheduler?type=' + type);
      }
      GetFilteredList(_data: any,type:number){
        return this._httpService._postMethod(_data,'Vcms_API/api/MediaScheduler/GetFilteredList?type=' + type);
      }
      getKeysDataForConfig(key: string) {
        return this._http.get(this.jsonurl);
      }

      getMediaSchedulerById(id: number) {
        return this._httpService._getMethod('Vcms_API/api/MediaScheduler/GetMediaSchedulerById?id=' + id);
      }
      
}

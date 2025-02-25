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
  
       getMediaschedulerDetails(_data: any) {
        return this._httpService._getMethod('Vcms_API/api/MediaUpload/GetDetails'+_data);
      }
      SaveMediascheduler(_data: any) {        
        return this._httpService._postMethod(_data,'Vcms_API/api/MediaScheduler/SaveMediaSchedulerMaster');
      }
     
      UpdateMediascheduler(_data: any) {
        return this._httpService._putMethod(_data,'Vcms_API/api/MediaScheduler/PutMediaSchedulerMaster');
      }

      getMediaschedulerByIpAddress(ipAdd: string) {
        return this._httpService._getMethod('vcms_api/api/MediaScheduler/GetMediaSchedulerByIpAddress?_ipAddress=' + ipAdd);
      }

      getMediaschedulersList(_data: any,type:number){
        return this._httpService._postMethod(_data,'Vcms_API/api/MediaScheduler/GetMediaScheduler?type=' + type);
      }

      getMediaSchedulerById(id: number,body:any) {
        return this._httpService._postMethod(body,'Vcms_API/api/MediaScheduler/GetMediaScheduler?id=' + id);
      }
      
}

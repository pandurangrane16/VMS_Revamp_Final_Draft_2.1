import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../common/http.service';

@Injectable({
  providedIn: 'root'
})
export class MedialiveplayService {

  constructor(private http: HttpClient,
    private _httpService: HttpService
  ) { }

  PlayEmergencyMedia(data: any) {    
    return this._httpService._postMethod(data, 'Vcms_API/api/LivePlay/SaveLivePlayMaster');    
  }
  GetEmergencyMediaList(type:number,data:any) {       
     return this._httpService._postMethod(data,'Vcms_API/api/LivePlay/GetDetails?type=' + type);
  }

    CancelPlay(data: any) {    
    return this._httpService._postMethod(data, 'Vcms_API/api/PlayCancel/GetDetails');    
  }
      PostPlayCancel(data: any) {    
    return this._httpService._postMethod(data, 'Vcms_API/api/PlayCancel/PostPlayCancel');    
  }


}

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
    // return this._httpService._postMethod(data, 'Vcms_API/api/VMSComm/PlayEmergencyMedia?ipAddress=' + inputReq);
    return this._httpService._postMethod(data, 'Vcms_API/api/LivePlay/SaveLivePlayMaster');
    
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService } from '../common/http.service';

@Injectable({
  providedIn: 'root'
})
export class MediauploadserviceService {

  constructor(private http: HttpClient,
    private _httpService: HttpService,
    private _http: HttpClient) { }

    getMediauploadDetails(inputReq:any,type:number) {
      return this._httpService._postMethod(inputReq,'Vcms_API/api/MediaUpload/GetDetails?type='+type);
    }
    SaveMediaupload(_data: any) {
      return this._httpService._postMethod(_data,'Vcms_API/api/MediaUpload/SaveMediaUploadMaster');
    }
   
    UpdateMediaupload(_data: any) {
      return this._httpService._postMethod(_data,'Vcms_API/api/MediaUpload/PutMediaUploadMaster');
    }
}

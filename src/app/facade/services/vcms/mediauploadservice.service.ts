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

  getMediauploadDetails(inputReq: any, type: number) {
    return this._httpService._postMethod(inputReq, 'Vcms_API/api/MediaUpload/GetDetails?type=' + type);
  }
  SaveMediaupload(_data: any) {
    return this._httpService._postMethod(_data, 'Vcms_API/api/MediaUpload/SaveMediaUploadMaster');
  }


  UpdateMediaupload(_data: any) {
    return this._httpService._postMethod(_data, 'Vcms_API/api/MediaUpload/PutMediaUploadMaster');
  }
  getMdUploadForMdPlayer(ipAddress: string, type: string) {
    return this._httpService._getMethod("vcms_api/api/MediaUpload/GetMediaDetailsForIpAddress?IpAddress=" + ipAddress + "&mediaType=" + type);
  }
  getTextDataForMdPlayer(ipAddress: string,port:string,_token:string) {
    return this._httpService._getMethodNotCommon("http://"+ipAddress+":"+port+"/media/getMediaDetails","eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJWbXNBZG1pbiIsInJvbGVzIjpbIkFkbWluIl0sImlhdCI6MTczODMxNDAzNiwiZXhwIjoxNzM4MzMyMDM2fQ.NHg-vQaAGPy1jELHvQXxnv0IqROCvqXNZ2IfPvSeUls");
  }

  getTokenByIpAddress(ipAddress:string) {
    return this._httpService._getMethod("vcms_api/api/VMSComm/GetCacheByIpAddress?ipAdd="+ipAddress);
  }
}

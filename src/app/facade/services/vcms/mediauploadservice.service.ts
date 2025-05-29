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
    jsonurl: string = '/assets/config/config.json';

  GetUploadMediaListDetails(inputReq :any,type : number){
    //return this._httpService._getMethod('Vcms_API/api/MediaUpload/GetVMSMasterUploadDetails_new');
    return this._httpService._postMethod(inputReq,'Vcms_API/api/MediaUpload/GetMediaUploadPaging?type=' + type);
  }

  GetFilteredList(inputReq :any,type:any) {
    return this._httpService._postMethod(inputReq,'Vcms_API/api/MediaUpload/GetFilteredList?type='+type);
  }
  getMediauploadDetails(inputReq: any, type: number) {
     return this._httpService._postMethod(inputReq, 'Vcms_API/api/MediaUpload/GetDetails?type=' + type);
  }
  SaveMediaupload(_data: any) {
    return this._httpService._postMethod(_data, 'Vcms_API/api/MediaUpload/SaveMediaUploadMaster');
  }
  SpaceCheck(ipadd: any) {
    return this._httpService._postMethod(undefined,"Vcms_API/api/DeviceDetails/SpaceCheck?ipadd="+ ipadd);
  }
  getKeysDataForConfig(key: string) {
    return this._http.get(this.jsonurl);
  }

  UpdateMediaupload(_data: any) {
    return this._httpService._postMethod(_data, 'Vcms_API/api/MediaUpload/PutMediaUploadMaster');
  }
  getMdUploadForMdPlayer(ipAddress: string, type: string) {
    return this._httpService._getMethod("vcms_api/api/MediaUpload/GetMediaDetailsForIpAddress?IpAddress=" + ipAddress + "&mediaType=" + type);
  }
  getTextDataForMdPlayer(ipAddress: string,port:string,_token:string) {
    //return this._httpService._getMethodNotCommon("http://"+ipAddress+":"+port+"/media/getMediaDetails",_token);
    return this._httpService._getMethod("Vcms_API/api/MediaUpload/Getmediadetails_controller?_ipaddres="+ipAddress);
    
  }

  getTokenByIpAddress(ipAddress:string) {
    return this._httpService._getMethod("vcms_api/api/VMSComm/GetCacheByIpAddress?ipAdd="+ipAddress);
  }

  generateToken(ipAdd:string) {
    return this._httpService._postMethod(undefined,"vcms_api/api/VMSComm/GenerateToken?_ipaddress="+ipAdd);
  }
  CheckDuplicateMediaName(mediaName:string,ipAdd:string){
    return this._httpService._getMethod("Vcms_API/api/MediaUpload/CheckDuplicateMediaName?pMediaName="+mediaName+"&_ipaddres="+ipAdd);
  }


  GetVMSNameForIpAddress(ipAdd:string){
    return this._httpService._getMethod("Vcms_API/api/MediaUpload/GetVMSNameForIpAddress?_ipaddres="+ipAdd);
  }

  

  
}

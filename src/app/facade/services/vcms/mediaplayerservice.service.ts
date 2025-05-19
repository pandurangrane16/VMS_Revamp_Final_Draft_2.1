import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../common/http.service';

@Injectable({
  providedIn: 'root'
})
export class MediaplayerserviceService {

  constructor(private http: HttpClient,
    private _httpService: HttpService,
    private _http: HttpClient) { }


  getUploadMediaDetails(inputReq :any) {
    return this._httpService._postMethod(inputReq,'Vcms_API/api/Mediaplayer/GetMediaPlayer');
  }

 

 
  DeleteMediaPlayerFromController(id: any,ipadd:any) {

    return this._httpService._getMethod('Vcms_API/api/Mediaplayer/DeleteMediaPlayerFromController?_mdPlyerId='+id+'&_ipaddres='+ ipadd);
  }

  SaveMedia(_data: any) {

    return this._httpService._postMethod(_data, 'Vcms_API/api/Mediaplayer/SaveMediaPlayerMaster');
  }

  UpdateMedia(_data: any) {
    return this._httpService._putMethod(_data, 'Vcms_API/api/Mediaplayer/PutMediaPlayerMaster');
  }
  getMediaPlayerByIpAddress(ipAdd: string) {
    return this._httpService._getMethod('Vcms_API/api/Mediaplayer/GetMediaPlayerByIpAddress?_ipAddress=' + ipAdd);
  }
  getMediaPlayer(type: number) {
    return this._httpService._getMethod('Vcms_API/api/Mediaplayer/GetFilterData?type='+0)

  }
  getMediaPlayerById(id: number,body:any) {
    return this._httpService._postMethod(body,'Vcms_API/api/Mediaplayer/GetMediaPlayer?id=' + id);
  }
  
  

  CheckDuplicateMediaPlayerName(mediaPlayerName:string,ipAdd:string){    
    return this._httpService._getMethod("Vcms_API/api/Mediaplayer/CheckDuplicateMediaPlayerName?pMediaPlayerName="+mediaPlayerName+"&_ipaddres="+ipAdd);
  }

  GetMediaPlayerListDetails(inputReq :any,type : number){    
    return this._httpService._postMethod(inputReq,"Vcms_API/api/Mediaplayer/GetMediaPlayerPaging?type=" + type);
  }
}


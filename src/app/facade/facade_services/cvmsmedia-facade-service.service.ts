import { Injectable } from '@angular/core';
import { MediaplayerserviceService } from '../services/vcms/mediaplayerservice.service';
import { MediauploadserviceService } from '../services/vcms/mediauploadservice.service';
import { BehaviorSubject, Observable, forkJoin, of, take, tap } from 'rxjs';
import { MedialiveplayService } from '../services/vcms/medialiveplay.service';
import { MediaschedulerserviceService } from '../services/vcms/mediaschedulerservice.service';

@Injectable({
  providedIn: 'root'
})
export class CVMSMediaFacadeServiceService {

  constructor(private _mediaplayer: MediaplayerserviceService,
    private _mediascheduler:MediaschedulerserviceService,
    private _mediupload:MediauploadserviceService,
    private _medialive: MedialiveplayService
  ) { }

  GetMediaPlayer(inputReq :any,) {
    return this._mediaplayer.getUploadMediaDetails(inputReq);
  }

  SaveMediaPlayer(data:any){   
    return this._mediaplayer.SaveMedia(data);
  }

  UpdateMediaPlayer(data:any){
    return this._mediaplayer.UpdateMedia(data);
  }

  GetMediaUploadDetails(inputReq :any,type : number) {
    return this._mediupload.getMediauploadDetails(inputReq,type);
  }
  GetUploadMediaListDetails(inputReq :any,type : number) {
    return this._mediupload.GetUploadMediaListDetails(inputReq,type);
  }

  GetMediaPlayerListDetails(inputReq :any,type : number) {
    return this._mediaplayer.GetMediaPlayerListDetails(inputReq,type);
  }
  

  SaveMediaUpload(data:any){
   
    return this._mediupload.SaveMediaupload(data);
  }
  SaveMediaScheduler(data:any){
    
    return this._mediascheduler.SaveMediascheduler(data);
  }


  UpdateMediascheduler(data:any){
    
    return this._mediascheduler.UpdateMediascheduler(data);
  }




  UpdateMediaUpload(data:any){
    return this._mediupload.UpdateMediaupload(data);
  }

  getMediaPlayerByIpAdd(ipAdd:string){
    return this._mediaplayer.getMediaPlayerByIpAddress(ipAdd);
  }
  
  getMediaPlayer(type:number){
    return this._mediaplayer.getMediaPlayer(0);
  }
 
  PlayEmergencyMedia(data:any) {       
    return this._medialive.PlayEmergencyMedia(data);
  }
  GetEmergencyMediaList(unit:number,data:any) {       
    return this._medialive.GetEmergencyMediaList(unit,data);
  }

  getMediaschedulersList(_data: any,type:number) {       
    return this._mediascheduler.getMediaschedulersList(_data,type);
  }

  GenerateToken(ipAdd:string) {
    return this._mediupload.generateToken(ipAdd);
  }
  CheckDuplicateMediaName(mediaName:string,ipAdd:string){
    return this._mediupload.CheckDuplicateMediaName(mediaName,ipAdd);
  }
  CheckDuplicateMediaPlayerName(mediaPlayerName:string,ipAdd:string){
    return this._mediaplayer.CheckDuplicateMediaPlayerName(mediaPlayerName,ipAdd);
  }
  GetVMSNameForIpAddress(ipAdd:string){
    return this._mediupload.GetVMSNameForIpAddress(ipAdd);
  }

  getMediaPlayerById(id: number,body :any) {
    return this._mediaplayer.getMediaPlayerById(id,body);
  }
  
  getMediaSchedulerById(id: number) {
    return this._mediascheduler.getMediaSchedulerById(id);
  }


}



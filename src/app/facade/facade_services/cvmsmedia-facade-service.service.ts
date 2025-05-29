import { Injectable } from '@angular/core';
import { MediaplayerserviceService } from '../services/vcms/mediaplayerservice.service';
import { MediauploadserviceService } from '../services/vcms/mediauploadservice.service';
import { BehaviorSubject, Observable, forkJoin, of, take, tap } from 'rxjs';
import { MedialiveplayService } from '../services/vcms/medialiveplay.service';
import { MediaschedulerserviceService } from '../services/vcms/mediaschedulerservice.service';
import { VmscommService  } from '../services/vcms/vmscomm.service';

@Injectable({
  providedIn: 'root'
})
export class CVMSMediaFacadeServiceService {

  constructor(private _mediaplayer: MediaplayerserviceService,
    private _mediascheduler:MediaschedulerserviceService,
    private _mediupload:MediauploadserviceService,
    private _medialive: MedialiveplayService,
    private _vmscomm :VmscommService
  ) { }

  GetMediaPlayer(inputReq :any,) {
    return this._mediaplayer.getUploadMediaDetails(inputReq);
  }
  GetFilteredListP(inputReq :any,type:any) {
    return this._mediaplayer.GetFilteredList(inputReq,type);
  }
  GetFilteredListM(inputReq :any,type:any) {
    return this._mediupload.GetFilteredList(inputReq,type);
  }
 

  
  DeleteMediaPlayerFromController(id: any,ipadd:any){   
    return this._mediaplayer.DeleteMediaPlayerFromController(id,ipadd);
  }
  

  SaveMediaPlayer(data:any){   
    return this._mediaplayer.SaveMedia(data);
  }

  AddFontDetails(data:any){   
    return this._vmscomm.AddFontDetails(data);
  }
  
  UpdateFontMasterStatus(isdeleted: boolean, fontName: string){   
    return this._vmscomm.UpdateFontMasterStatus(isdeleted,fontName);
  }
  CheckFontName(fontName: string) {
    return this._vmscomm.CheckFontName(fontName);
  }
  GetFontMaster(data:any){   
    return this._vmscomm.GetFontMaster(data);
  }
  
  AddFontUploadDetails(data:any){   
    return this._vmscomm.AddFontUploadDetails(data);
  }
 
  SaveFontuploadMaster(data:any){   
    return this._vmscomm.SaveFontuploadMaster(data);
  }
  
  GetFontupload(data:any){   
    return this._vmscomm.GetFontupload(data);
  }
  GetFontuploaddata(data:any){   
    return this._vmscomm.GetFontuploaddata(data);
  }
  
  
  GetFontupload_font(data:any){   
    return this._vmscomm.GetFontupload_font(data);
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
  SpaceCheck(ipadd:any){
   
    return this._mediupload.SpaceCheck(ipadd);
  }
  
  SaveMediaScheduler(data:any){
    
    return this._mediascheduler.SaveMediascheduler(data);
  }

  CheckDuplicateMediaSchedulerName(name:any){
    
    return this._mediascheduler.CheckDuplicateMediaSchedulerName(name);
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
  getKeysDataForConfig(key: string) {
    return this._mediupload.getKeysDataForConfig(key);
  }
 

  getMediaschedulersList(_data: any,type:number) {       
    return this._mediascheduler.getMediaschedulersList(_data,type);
  }
  GetFilteredList(_data: any,type:number) {       
    return this._mediascheduler.GetFilteredList(_data,type);
  }
  
 

  GetPlaybackDetails(_data:any,fromdate: string, todate: string, ipadd?: string, type?: string ,pdf_excel?:string){   
    return this._vmscomm.GetPlaybackDetails(_data,fromdate,todate,ipadd,type,pdf_excel);
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



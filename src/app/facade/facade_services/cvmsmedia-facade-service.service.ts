import { Injectable } from '@angular/core';
import { MediaplayerserviceService } from '../services/vcms/mediaplayerservice.service';
import { MediaschedulerserviceService } from '../services/vcms/mediaschedulerservice.service';
import { MediauploadserviceService } from '../services/vcms/mediauploadservice.service';
import { BehaviorSubject, Observable, forkJoin, of, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CVMSMediaFacadeServiceService {

  constructor(private _mediaplayer: MediaplayerserviceService,
    private _mediascheduler:MediaschedulerserviceService,
    private _mediupload:MediauploadserviceService
  ) { }

  GetMediaPlayer() {
    return this._mediaplayer.getUploadMediaDetails();
  }

  SaveMediaPlayer(data:any){
    console.log("*" + JSON.stringify(data) + "*");
    return this._mediaplayer.SaveMedia(data);
  }

  UpdateMediaPlayer(data:any){
    return this._mediaplayer.UpdateMedia(data);
  }

  GetMediaUploadDetails(inputReq :any,type : number) {
    return this._mediupload.getMediauploadDetails(inputReq,type);
  }

  SaveMediaUpload(data:any){
   
    return this._mediupload.SaveMediaupload(data);
  }

  UpdateMediaUpload(data:any){
    return this._mediupload.UpdateMediaupload(data);
  }

  getMediaPlayerByIpAdd(ipAdd:string){
    return this._mediaplayer.getMediaPlayerByIpAddress(ipAdd);
  }
}



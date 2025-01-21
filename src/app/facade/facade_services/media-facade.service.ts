import { Injectable } from '@angular/core';
import { MediaUploadService } from '../services/media/media-upload.service';
import { PlaylistService } from '../services/media/playlist.service';
import { AdminFacadeService } from './admin-facade.service';
import { MediaAuditService } from '../services/media/media-audit.service';
import { PlAuditService } from '../services/media/pl-audit.service';
import { PlaylistStatusService } from '../services/media/playlist-status.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MediaFacadeService {
  fileSizeUnit: number = 1024;
  public isApiSetup = false;
  constructor(private _mediaUploadService: MediaUploadService,
    private _playlistService: PlaylistService,
    private _adminFacade: AdminFacadeService,
    private _mediaAudit : MediaAuditService,
    private _plAudit : PlAuditService,
    private _plProcess : PlaylistStatusService) { }
  getMediaUploadDetails(data: any) {
    return this._mediaUploadService.getuploaddetails(data);
  }

  uploadMedia(data: any) {
    return this._mediaUploadService.UploadMediaDetails(data);
  }

  getMediaByUsID(data: any) {
    return this._mediaUploadService.getMediaByUploadSetId(data);
  }
  getTextByUsID(data: any) {
    return this._mediaUploadService.getTextUploadDetailsByUploadSetId(data);
  }

  getMediaString(data: any) {
    return this._mediaUploadService.getMediaString(data);
  }
  updateMediaUpload(data: any) {
    return this._mediaUploadService.updateMediaUpload(data);
  }

  getAvailableFont() {
    return this._mediaUploadService.getSystemFont();
  }
  addTextDetails(data: any) {
    return this._mediaUploadService.addTextDetails(data);
  }

  addPlaylistMaster(data: any) {
    return this._playlistService.addPlaylistMaster(data);
  }
  updatePlaylistMaster(data: any) {
    return this._playlistService.updatePlaylistMaster(data);
  }
  getAllMediaDetails() {
    return this._playlistService.getAllMediaDetails();
  }
  getAllTextDetails() {
    return this._playlistService.getAllTextDetails();
  }
  getVideoDuration(data: any) {
    return this._playlistService.GetVideoDurationFromAPI(data);
  }

  getPartyData(data: any) {
    return this._adminFacade.getParties(data);
  }
  getTarrifData(data: any) {
    return this._adminFacade.getTarrifs(data);
  }
  addPlaylistMedia(data: any,type :number) {
    return this._playlistService.addPlaylistMedia(data,type);
  }
  addBlockDetails(data: any) {
    return this._playlistService.AddBlockDetails(data);
  }
  getBlockDetailsByPlID(plid:number){
    return this._playlistService.GetBlockDetailsByPlid(plid);
  }
  getSelectedMedia(plid:number){
    return this._playlistService.GetSelectedMediaData(plid);
  }
  getSelectedText(plid:number){
    return this._playlistService.GetSelectedTextData(plid);
  }
  getPlBlData(plid:number){
    return this._playlistService.GetPlBlData(plid);
  }
  getMediaUpload(data:any,status:number) {
    return this._mediaUploadService.getMediaUploadDetails(data,status);
  }
  getMediaBySetID(data:any) {
    return this._mediaUploadService.getMediaByUploadSetId(data);
  }
  updateMediaSetDetails(data: any) {
    return this._mediaAudit.updateMediaSetDetails(data);
  }
  updatePlaylistData(data:any){
    return this._playlistService.updatePlaylistMaster(data);
  }
  GetMediaBlockWise(plId:number) {
    return this._plAudit.GetMediaByBlockWise(plId);
  }
  ValidatePlaylistName(plName:string) {
    return this._playlistService.ValidatePlaylistName(plName);
  }
  GetPlaylistProcessStatus() {
    return this._plProcess.GetPlaylistProcessStatus();
  }

  // for file upload progress

  getFileSize(fileSize: number): number {
    if (fileSize > 0) {
      if (fileSize < this.fileSizeUnit * this.fileSizeUnit) {
        fileSize = parseFloat((fileSize / this.fileSizeUnit).toFixed(2));
      } else if (
        fileSize <
        this.fileSizeUnit * this.fileSizeUnit * this.fileSizeUnit
      ) {
        fileSize = parseFloat(
          (fileSize / this.fileSizeUnit / this.fileSizeUnit).toFixed(2)
        );
      }
    }

    return fileSize;
  }

  getFileSizeUnit(fileSize: number) {
    let fileSizeInWords = 'bytes';

    if (fileSize > 0) {
      if (fileSize < this.fileSizeUnit) {
        fileSizeInWords = 'bytes';
      } else if (fileSize < this.fileSizeUnit * this.fileSizeUnit) {
        fileSizeInWords = 'KB';
      } else if (
        fileSize <
        this.fileSizeUnit * this.fileSizeUnit * this.fileSizeUnit
      ) {
        fileSizeInWords = 'MB';
      }
    }

    return fileSizeInWords;
  }

  public textProcess = new BehaviorSubject<boolean>(false);

  setProcess(changeToggle: boolean) {
    this.textProcess.next(changeToggle);
  }

  getProcess() {
    return this.textProcess.asObservable();
  }
  
}

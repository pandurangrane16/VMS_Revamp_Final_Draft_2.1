import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MediaFacadeService } from 'src/app/facade/facade_services/media-facade.service';
import { SessionService } from 'src/app/facade/services/common/session.service';

@Component({
  selector: 'app-cm-media-modal',
  templateUrl: './cm-media-modal.component.html',
  styleUrls: ['./cm-media-modal.component.css']
})
export class CmMediaModalComponent implements OnInit {
  isViewMedia: boolean = false;
  isVideo: boolean = false;
  isImage: boolean = false;
  isText: boolean = false;
  imgData: string;
  mediaType: string = "";
  @Input() data: any;
  viewData: any[] = [];
  type: string = "Media Upload";
  constructor(private _mediaFacade: MediaFacadeService,
    private _toast: ToastrService,
    private _session: SessionService,
    private modal: NgbModal) {

  }
  ngOnInit() {
    this.mediaType = this.data.content.mediaType;
    if (this.data.modalType == "mediaupload") {
      let _uploadSetId = this.data.content.uploadSetId;
      if (this.mediaType != "Text") {
        this._mediaFacade.getMediaByUsID(_uploadSetId).subscribe(res => {
          if (res == undefined || res == null)
            this._toast.error("Something is wrong, Please contact sytem administration", "Error", { positionClass: "toast-right-bottom" });
          else if (res.length == 0)
            this._toast.error("No active media found against Upload Set ID : " + _uploadSetId, "Error", { positionClass: "toast-right-bottom" });
          else {
            this.viewData = res;
          }
        })
      }
      else {
        this._mediaFacade.getTextByUsID(_uploadSetId).subscribe(res => {
          if (res == undefined || res == null)
            this._toast.error("Something is wrong, Please contact sytem administration", "Error", { positionClass: "toast-right-bottom" });
          else if (res.length == 0)
            this._toast.error("No active media found against Upload Set ID : " + _uploadSetId, "Error", { positionClass: "toast-right-bottom" });
          else {
            this.viewData = res;
          }
        })
      }

    }
    else if (this.data.modalType == "playlistcreation") {
      this.type = "View Media";
      this.mediaType = this.data.content.fileType;
      let plData = { "fileName": this.data.content.fileName, "filePath": this.data.content.filePath, "fileType": this.data.content.fileType }
      this.viewData.push(plData);
      this.ViewMedia(this.data.content.filePath, this.data.content.fileType);
    }
  }

  passBack() {
    this.modal.dismissAll();
  }
  ViewMedia(filepath: string, type: string) {
    if (this.data.modalType == "mediaupload") {
      let strFilePath = "";
      if (this.data.content.mediaType == "Text") {
        let mediaPath = this._session.getnetworkreportXview();
        strFilePath = mediaPath + this.data.content.uploadSetId + "//" + filepath;
        this.imgData = strFilePath;
        this.isViewMedia = true;
        this.isImage = true;
      } else {
        strFilePath = filepath;
        let data = { "mediaPath": strFilePath, "mediaType": type };
        this._mediaFacade.getMediaString(data).subscribe(res => {
          if (res != null) {
            this.isViewMedia = true;
            if (type == "Video")
              this.isImage = false;
            else
            {  this.isImage = true;}
              this.imgData = res;
            
          }
          else {
            this._toast.error("Something is wrong, Please contact sytem administration", "Error", { positionClass: "toast-right-bottom" });
          }
        })
      }

    }
    if (this.data.modalType == "playlistcreation") {
      if (this.data.content.fileType == "Text") {
        let data = { "mediaPath": this.data.content.filePath, "mediaType": type };
        this._mediaFacade.getMediaString(data).subscribe(res => {
          if (res != null) {
            this.isViewMedia = true;
            this.isImage = true;
            this.imgData = res;
          }
          else {
            this._toast.error("Something is wrong, Please contact sytem administration", "Error", { positionClass: "toast-right-bottom" });
          }
        })
      }
      else if (this.data.content.fileType == "Image") {
        this.isViewMedia = true;
        this.isImage = true;
        this.isVideo = false;
        this.imgData = this.data.content.filePath;
      }
      else if (this.data.content.fileType == "Video") {
        this.isViewMedia = true;
        this.isImage = false;
        this.isVideo = true;
        this.imgData = this.data.content.filePath;
      }
    }
  }

} 

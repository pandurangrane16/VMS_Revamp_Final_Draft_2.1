import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { getErrorMsg } from 'src/app/utils/utils';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InputRequest } from 'src/app/models/request/inputReq';
import { MediaFacadeService } from 'src/app/facade/facade_services/media-facade.service';
import { AdminFacadeService } from 'src/app/facade/facade_services/admin-facade.service';
import { CommonFacadeService } from 'src/app/facade/facade_services/common-facade.service';
import { CommonSelectList } from 'src/app/models/common/cmSelectList';
import { CmMediaModalComponent } from 'src/app/widget/cm-media-modal/cm-media-modal.component';
import { CVMSMediaModalComponent } from '../cvmsmedia-modal/cvmsmedia-modal.component';
import { PlaylistApproval } from 'src/app/models/media/PlAudit';
import { date, json, numeric } from '@rxweb/reactive-form-validators';
import { tileLayer } from 'leaflet';
import { timestamp } from 'rxjs';
import { disable } from 'ol/rotationconstraint';
import { Mediaplayer } from 'src/app/models/vcms/mediaplayer';
import { CVMSMediaFacadeServiceService } from 'src/app/facade/facade_services/cvmsmedia-facade-service.service';

interface Media {
  name: string;
  mediaLoopCount: number;
  tiles: Playlist[];

}

interface TextStyle {
  fontSize: number;
  fontColor: string;
  backgroundColor: string;
}



interface PlaylistItem {
  playOrder: number;
  imageTextDuration: number;
  mediaId: number;
  mediaName: string;
  videoLoopCount: number;
  textStyle: TextStyle;
}

interface Playlist {
  tileNo: number;
  playlistLoopCount: number;
  playlist: PlaylistItem[];
}

@Component({
  selector: 'app-mediaplayer',
  templateUrl: './mediaplayer.component.html',
  styleUrls: ['./mediaplayer.component.css']
})


export class MediaplayerComponent implements OnInit {

  form: any = [];
  mediauploadtype: string;
  isFileTypeText: boolean = false;
  isFileTypeImage: boolean = false;
  FileTypes: any[];
  totalRecords: number;
  totalPages: number;
  listOfMedialist: [];
  recordPerPage: number;
  btnArray: [];
  _inputVmsData: any;
  _request: any = new InputRequest();
  submitting: boolean;
  mediatype: string = '';
  MediaName: string;
  mediaLoopCount: number;
  playlistLoopCount: number;
  playOrder: number;
  Visible: boolean = false;
  AddTiles: boolean = false;
  AddTileList: boolean = false;
  controllerName: string;
  ShowTiles: boolean = false;
  currentNumber: number = 0;
  rowCount: number = 0; // Initial number of rows
  rows: any[] = []; // Array to hold the dynamic rows
  selectedId: any;
  playlist: Playlist[];
  media: Media;
  selectedMediaId: any[] = [];
  disabledImageType: boolean = true;
  disabledTextType: boolean = true;
  ShowSaveBtn: boolean = false;


  tileNo: number = 0;
  TileJson: any = {};
  PlaylisJson: any = {};
  textStyle: any = {};
  TilesjsonData: any[] = []; // Initial empty JSON array
  PlaylistjsonData: any[] = []; // Initial empty JSON array
  divs: any[] = [];
  rowMediaName: string;
  rowMediaId: number;

  constructor(private formBuilder: FormBuilder,
    private toast: ToastrService,
    private _media: MediaFacadeService,
    private adminFacade: AdminFacadeService,
    public _commonFacade: CommonFacadeService,
    private _CVMSfacade: CVMSMediaFacadeServiceService,
    private modalService: NgbModal,
  ) {
    this.FileTypes = this.getFileType();
    this.BuildForm();

  }


  getFileType() {
    return ['media', 'text'];
  }

  ngOnInit(): void {
    this.GetVmsDetails();

  }

  createPlaylist1(): Media {

    let media = {
      mediaLoopCount: 10,
      name: "ashish",
      tiles: []
    }

    for (let i = 0; i < 10; i++) {


    }

    return media;
  }


  createPlaylist(): Media {
    return {
      name: "ASHISH",
      mediaLoopCount: 0,
      tiles: [
        {
          tileNo: 1,
          playlistLoopCount: 0,
          playlist: [
            {
              playOrder: 1,
              imageTextDuration: 10,
              mediaId: 1,
              mediaName: "Sample Text",
              videoLoopCount: 0,
              textStyle: {
                fontSize: 16,
                fontColor: "#FFFFFF",
                backgroundColor: "#000000"
              }
            }
          ]
        }
      ],

    };
  }
  getJson(): string {
    return JSON.stringify(this.playlist, null, 2);
  }
  get Playlistf() { return this.form.controls; }

  // get newrows():FormArray{
  //   return this.form.get('newrows') as FormArray;
  // }


  // addcontrol(){
  //   this.form.push(this.form.control('',Validators.required))
  // }

  BuildForm() {
    this.form = this.formBuilder.group({
      mediaName: ['', [Validators.required, Validators.pattern("[A-Za-z0-9][A-Za-z0-9 ]*$")]],
      MediaFileName: ['', ''],
      mediatype: ['', ''],
      controllerName: ['', ''],
      mediaLoopCount: ['', [Validators.required, Validators.pattern("[0-9][0-9]*$")]],
      tileNo: ['', ''],
      playlistLoopCount: ['', [Validators.required, Validators.pattern("[0-9][0-9]*$")]],
      playOrder: ['', [Validators.required, Validators.pattern("[0-9][0-9]*$")]],
      videoLoopCount: ['', [Validators.required, Validators.pattern("[0-9][0-9]*$")]],
      imageTextDuration: ['', [Validators.required, Validators.pattern("[0-9][0-9]*$")]],
      fontSize: ['', [Validators.required, Validators.pattern("0-9][0-9]*$")]],
      fontColor: ['', [Validators.required, Validators.pattern("[A-Za-z0-9][A-Za-z0-9 ]*$")]],
      backgroundColor: ['', [Validators.required, Validators.pattern("[A-Za-z0-9][A-Za-z0-9 ]*$")]],
      addNewMedia: ['', ''],
      SaveDetails: ['', ''],
      AddTiles: ['', ''],
      rowMediaName: ['', ''],
      rowMediaId: ['', ''],
    });
  }



  // Function to handle the selected ID from the child
  onIdSelected(id: number): void {
    this.selectedId = id;
    //console.log('Selected ID from Child:', this.selectedId);
  }

  GetVmsDetails() {
    this.adminFacade.getVmss(this._request).subscribe(data => {
      if (data != null) {
        let commonList: CommonSelectList[] = [];
        data.data.forEach((ele: any) => {
          if (ele.vmdType == 2) {
            var _commonSelect = new CommonSelectList();
            _commonSelect.displayName = ele.description;
            _commonSelect.value = ele.ipAddress;
            commonList.push(_commonSelect);
          }
        });
        let _data = {
          data: commonList,
          disabled: false
        }
        this._inputVmsData = _data;
      }
    });
  }

  onUploadTypeChange(element: any) {
    if (this.mediauploadtype == 'text') {
      this.isFileTypeText = true;
      this.isFileTypeImage = false;
    }
    else {
      this.isFileTypeImage = true;
      this.isFileTypeText = false;
    }
  }



  getMedialistData() {
    this._media.getAllMediaDetails().subscribe(res => {
      if (res != null && res.length > 0) {
        this.listOfMedialist = res;
      }
      else
        this.toast.error("Failed to failed media details.", "Error", { positionClass: "toast-bottom-right" });
    }, (err) => { console.log(err) });
  }

  Showplaylist() {
    this.generateSequentialNumber();
    this.divs.push(this.divs.length + 1);
    this.ShowTiles = true;
    this.createJosn();
  }
  generateSequentialNumber(): void {
    this.currentNumber += 1;  // Increment by 1 each time the button is clicked

  }

  // Method to generate rows
  generateRows() {
    //console.log(JSON.stringify(this.selectedMediaId))
    this.rows = []; // Clear existing rows
    this.rowCount = 0;
    this.rowCount = this.selectedMediaId.length;

    for (let i = 0; i <= this.rowCount; i++) {
      //this.rows.push({ id: i + 1, filename: JSON.stringify(this.selectedMediaId[i].fileName), filtype: JSON.stringify(this.selectedMediaId[i].fileType) });
      this.rows.push({ filename: this.selectedMediaId[i].fileName, id: this.selectedMediaId[i].id });
    }


  }
  RemoveRow(id: number): void {
    this.rows = this.rows.filter(row => row.id !== id);
    this.selectedMediaId = this.selectedMediaId.filter(row => row.id !== id);

    this.rowCount--;

  }
  ShowTables() {
    this.generateRows();

  }

  ShowMediaPopup(type: string) {

    const modalRef = this.modalService.open(CVMSMediaModalComponent, { ariaLabelledBy: 'modal-basic-title', size: 'xl' });
    if (type == "Media") {
      this.mediauploadtype = "media";
      let _reqdata = { "action": "view", urls: [], modalType: "mediaupload", content: this.listOfMedialist };
      modalRef.componentInstance.data = _reqdata;
      modalRef.componentInstance.selectedId.subscribe((selectedId: any) => {
        //console.log(selectedId);
        this.selectedMediaId.push(selectedId);
        //console.log(this.selectedMediaId);
        this.ShowTables();
      })

    }
    else {
      let _reqdata = { "action": "view", urls: [], modalType: "textupload", content: this.listOfMedialist };
      this.mediauploadtype = "text";
      modalRef.componentInstance.data = _reqdata;
      modalRef.componentInstance.selectedId.subscribe((selectedId: any) => {
        //console.log(selectedId);
        this.selectedMediaId.push(selectedId);
        this.ShowTables();
      })

    }
    this.ShowSaveBtn = true;
  }
  createJosn() {
    this.PlaylistjsonData = [];
    const Tiles = {
      ["name"]: this.form.controls.mediaName.value != "" ? this.form.controls.mediaName.value : null,
      ["mediaLoopCount"]: this.form.controls.mediaLoopCount.value != 0 ? this.form.controls.mediaLoopCount.value : 0,
      ["tiles"]: [{
        ["tileNo"]: this.form.controls.tileNo.value != "" ? this.form.controls.tileNo.value : 0,
        ["playlistLoopCount"]: this.form.controls.playlistLoopCount.value != "" ? this.form.controls.playlistLoopCount.value : 0,
        ["playlist"]: this.PlaylistjsonData
      }]
    }
    this.TilesjsonData.push(Tiles);

  }



  getErrorMessage(_controlName: any, _controlLable: any, _isPattern: boolean = false, _msg: string) {
    return getErrorMsg(this.form, _controlName, _controlLable, _isPattern, _msg);
  }




  OnSavePlaylistDetails(): void {

    // for (let i = 0; i < this.rowCount; i++) {
    //   const playlistrow = {
    //     ["playOrder"]: this.form.controls.playOrder.value != "" ? this.form.controls.playOrder.value : 0,
    //     ["imageTextDuration"]: this.form.controls.imageTextDuration.value != 0 ? this.form.controls.imageTextDuration.value : 0,
    //     ["mediaId"]: this.form.controls.rowMediaId.value != "" ? this.form.controls.rowMediaId.value : null,
    //     ["mediaName"]: this.form.controls.mediaName.value != "" ? this.form.controls.mediaName.value : 0,
    //     ["videoLoopCount"]: this.form.controls.videoLoopCount.value != "" ? this.form.controls.videoLoopCount.value : 0,
    //     ["textStyle"]: {
    //       ["fontSize"]: this.form.controls.fontSize.value != "" ? this.form.controls.fontSize.value : null,
    //       ["fontColor"]: this.form.controls.fontColor.value != "" ? this.form.controls.fontColor.value : null,
    //       ["backgroundColor"]: this.form.controls.backgroundColor.value != "" ? this.form.controls.backgroundColor.value : null,
    //     }
    //   }
    // }

    let _tileCount = this.form.controls['tiles'].length;
    for (var i = 0; i < _tileCount; i++) {
      let _plCount = this.form.controls['tiles'].controls[i].controls["playlist"].length;
      for (var j = 0; j < _plCount; j++) {
        let _backGroundColor = this.form.controls['tiles'].controls[i].controls["playlist"].controls[j].controls["textStyle"].value.backgroundColor;
        let fontSize = this.form.controls['tiles'].controls[i].controls["playlist"].controls[j].controls["textStyle"].value.fontSize;
        let fontColor = this.form.controls['tiles'].controls[i].controls["playlist"].controls[j].controls["textStyle"].value.fontColor;
        let _textStyle = {
          "backgroundColor": _backGroundColor,
          "fontSize": fontSize,
          "fontColor": fontColor
        }
        this.patchTileValue(i, j, _textStyle);
      }
    }
    let _textStyle: TextStyle;
    //this.registrationForm.controls['tiles'].controls[0].controls["playlist"].controls[0].controls["textStyle"].value
    this.form.controls['tiles'].controls[i].controls["playlist"].controls[0].controls["textStyle"].value
    //this.PlaylistjsonData.push(playlistrow);
    //console.log(JSON.stringify(this.jsonData))
    let _vcmsmediplayerdata = new Mediaplayer();
    _vcmsmediplayerdata.IpAddress = this.form.controls.controllerName.value //"172.19.32.51"
    _vcmsmediplayerdata.medianame = this.form.controls.mediaName.value;
    _vcmsmediplayerdata.status = 0;
    _vcmsmediplayerdata.AuditedBy = "Ashish S";
    _vcmsmediplayerdata.IsAudited = true;
    _vcmsmediplayerdata.AuditedTime = new Date();
    _vcmsmediplayerdata.Reason = "Upload Data for MediaPlayer";
    _vcmsmediplayerdata.createddate = new Date();
    _vcmsmediplayerdata.RequestData = JSON.stringify(this.TilesjsonData);

    this._CVMSfacade.SaveMediaPlayer(_vcmsmediplayerdata).subscribe(data => {
      if (data == 0) {
        this.toast.error("Error occured while saving data for " + _vcmsmediplayerdata.IpAddress);
      }
      else {

        this.toast.success("Saved successfully for " + _vcmsmediplayerdata.IpAddress);
      }
    });
  }

  patchTileValue(i: number, j: number, _data: any) {
    var _tile = this.form.controls['tiles'].controls[i].controls["playlist"].controls[j].controls["textStyle"]
    //const tile = this.tiles.at(index);

    // Use patchValue to update only the 'name' field
    _tile.patchValue({
      fontSize: _data.fontSize,
      fontColor: _data.fontColor,
      backgroundColor: _data.backgroundColor
    });
  }
}

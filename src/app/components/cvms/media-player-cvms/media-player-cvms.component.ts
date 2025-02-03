import { Component, numberAttribute } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminFacadeService } from 'src/app/facade/facade_services/admin-facade.service';
import { CommonSelectList } from 'src/app/models/common/cmSelectList';
import { InputRequest } from 'src/app/models/request/inputReq';
import { getErrorMsg } from 'src/app/utils/utils';
import { CVMSMediaModalComponent } from '../cvmsmedia-modal/cvmsmedia-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlaylistMedia, SelectedMediaVCMS } from 'src/app/models/vcms/selectedMedia';
import { Mediaplayer } from 'src/app/models/vcms/mediaplayer';
import { CVMSMediaFacadeServiceService } from 'src/app/facade/facade_services/cvmsmedia-facade-service.service';
import { ToastrService } from 'ngx-toastr';
import { event } from 'jquery';
import { any } from 'core-js/fn/promise';
import { Router } from '@angular/router';
import { pipe } from 'rxjs';
import { disable } from 'ol/rotationconstraint';
import { Globals } from 'src/app/utils/global';
import { json, numeric } from '@rxweb/reactive-form-validators';
import { MediaFacadeService } from 'src/app/facade/facade_services/media-facade.service';
import { FileServiceService } from 'src/app/facade/services/vcms/file-service.service';


@Component({
  selector: 'app-media-player-cvms',
  templateUrl: './media-player-cvms.component.html',
  styleUrls: ['./media-player-cvms.component.css']
})



export class MediaPlayerCvmsComponent {

  currentTile: number = -1;
  registrationForm: any;
  disabledTextType: boolean = false;
  _inputVmsData: any;
  MediaName: string;
  _request: any = new InputRequest();
  mediauploadtype: string;
  selectedMediaPlaylist: any = [];
  selectedMediaId: any = [];
  listOfMedialist: any = [];
  rows: any[];
  rowCount: number;
  ShowSaveBtn: boolean = false;
  vmsIds: any[] = [];
  SelectedControllerId: any;
  


  constructor(private fb: FormBuilder,
    private toast: ToastrService,
    private global: Globals,
    private _media: MediaFacadeService,
    private adminFacade: AdminFacadeService,
    private _router: Router,
    private _CVMSfacade: CVMSMediaFacadeServiceService,
    private fileService: FileServiceService,
    private modalService: NgbModal,) {
    this.global.CurrentPage = "Create Media Player CVMS";
  }

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern("[A-Za-z0-9][A-Za-z0-9 ]*$")]],
      mediaLoopCount: ['', [Validators.required, Validators.pattern("[0-9][0-9]*$")]],
      tiles: this.fb.array([])
    });
    this.GetVmsDetails();
  }
  get f() { return this.registrationForm.controls; }

  // Function to create a single user form group
  createUser(): FormGroup {
    return this.fb.group({
      tileNo: ['', Validators.required],
      playlistLoopCount: ['', [Validators.required, Validators.pattern("[0-9][0-9]*$")]],
      playlist: this.fb.array([])
    });
  }
  createPlaylistItem(ele: any): FormGroup {
    return this.fb.group({
      playOrder: [ele.playOrder, [Validators.required, Validators.pattern("[0-9][0-9]*$")]],
      imageTextDuration: [ele.imageTextDuration, [Validators.required]],
      mediaId: [ele.mediaId, Validators.required],
      mediaName: [ele.mediaName, [Validators.required]],
      videoLoopCount: [ele.videoLoopCount, [Validators.required]],
      textStyle: this.fb.group({
        fontSize: [0],
        fontColor: [''],
        backgroundColor: [''],
      }),
    });
  }


  GetVmsDetails() {
    this.adminFacade.getVmss(this._request).subscribe(data => {
      if (data != null) {
        let commonList: CommonSelectList[] = [];
        data.data.forEach((ele: any) => {
          if (ele.vmdType == 2) {
            var _commonSelect = new CommonSelectList();
            _commonSelect.displayName = ele.description;
            _commonSelect.value = ele.ipAddress + "|" + ele.id;
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

  // Get the form array
  get userDetails(): FormArray {
    return this.registrationForm.get('tiles') as FormArray;
  }

  getPlaylist(userIndex: number): FormArray {
    return (this.userDetails.at(userIndex).get('playlist') as FormArray);
  }


  getPlForCreate(userIndex: number) {
    const tileFormGroup = this.userDetails.at(userIndex);
    const playlistFormArray = tileFormGroup.get('playlist') as FormArray;
    var _len = playlistFormArray.length;
    return (playlistFormArray.at(_len) as FormArray);
  }
  getErrorMessage(_controlName: any, _controlLable: any, _isPattern: boolean = false, _msg: string) {
    return getErrorMsg(this.registrationForm, _controlName, _controlLable, _isPattern, _msg);
  }
  // Add a new user to the form array
  addTile(): void {
    this.currentTile++;
    let _tileDetails = new SelectedMediaVCMS();
    _tileDetails.tileNo = this.currentTile;
    this.selectedMediaPlaylist.push(_tileDetails);
    this.userDetails.push(this.createUser());

  }

  // Remove a user form group from the form array
  removeUser(index: number): void {
    this.userDetails.removeAt(index);
    this.selectedMediaPlaylist.splice(index, 1);
  }

  // Submit the form
  onSubmit(): void {
    if (this.registrationForm.valid) {
      console.log(this.registrationForm.value);
    }
  }

  ShowMediaPopup(type: string, idx: number) {
    let ipAddress = this.SelectedControllerId[0];
    const modalRef = this.modalService.open(CVMSMediaModalComponent, { ariaLabelledBy: 'modal-basic-title', size: 'xl' });
    if (type == "Media") {
      this.mediauploadtype = "media";
      let _reqdata = { "action": "view", urls: [], modalType: "mediaupload", content: this.listOfMedialist, _crrTile: this.currentTile,"ipAddress":ipAddress };
      modalRef.componentInstance.data = _reqdata;
      modalRef.componentInstance.selectedId.subscribe((selectedId: any) => {
        //console.log(selectedId);
        this.selectedMediaId.push(selectedId);
        this.ShowTables(idx);
      })

    }
    else {
      let _reqdata = { "action": "view", urls: [], modalType: "textupload", content: this.listOfMedialist, _crrTile: this.currentTile,"ipAddress":ipAddress };
      this.mediauploadtype = "text";
      modalRef.componentInstance.data = _reqdata;
      modalRef.componentInstance.selectedId.subscribe((selectedId: any) => {
        //console.log(selectedId);
        this.selectedMediaId.push(selectedId);
        this.ShowTables(idx);
      })
    }
  }

  ShowTables(idx: number) {
    this.generateRows(idx);
    this.ShowSaveBtn = true;

  }
  generateRows(idx: number) {
    //console.log(JSON.stringify(this.selectedMediaId))

    this.rows = []; // Clear existing rows
    this.rowCount = 0;
    this.rowCount = this.selectedMediaId[0].length;
    const playlistArray = this.getPlaylist(idx); // Get the playlist form array for the last user
    //playlistArray.clear();
    let _plMediaList = [];
    for (let i = 0; i < this.rowCount; i++) {
      // Push a new playlist group (with the selected media) into the respective userDetails playlist array.
      let _plMedia = new PlaylistMedia();
      // Add a new item to the playlist FormArray
      let _textStyle = {
        "fontSize": 0,
        "fontColor": "",
        "backgroundColor": ""
      }
      _plMedia.imageTextDuration = this.selectedMediaId[0][i].mediaDetails.imageTextDuration;
      _plMedia.mediaId = this.selectedMediaId[0][i].responseId;
      _plMedia.mediaName = this.selectedMediaId[0][i].mediaDetails.displayname;
      _plMedia.playOrder = this.selectedMediaId[0][i].mediaDetails.playOrder;
      _plMedia.videoLoopCount = this.selectedMediaId[0][i].mediaDetails.videoLoopCount;
      _plMedia.textStyle = _textStyle;
      _plMediaList.push(_plMedia);

    }

    this.selectedMediaId = [];
    this.selectedMediaPlaylist[idx].playlist = _plMediaList;
    this.selectedMediaPlaylist[idx].playlist.forEach((ele: any) => {
      this.addPlaylist(idx, ele);
    });
    //console.log(this.selectedMediaPlaylist);
  }

  RemoveRow(userIndex: number, id: number) {
    const playlistArray = this.getPlaylist(userIndex);  // Get the specific playlist FormArray for the user
    playlistArray.removeAt(id);
    this.selectedMediaId.splice(id, 1);
  }
  getSelectedVms(eve: any) {
    const selectElement = eve.target as HTMLSelectElement;
    const colindex = selectElement.value.indexOf(":");
    if (colindex !== -1) {
      this.SelectedControllerId =  selectElement.value.slice(colindex + 1, selectElement.value.length).replace(/\s+/g, '').split("|");     
      
    }
  }
  BacktoList() {
    this._router.navigate(['cvms/createMediaPlayerAndPlaylist']);
  }

  isNameValid(medianame: string): boolean {
    const fileType = this.fileService.checkFileType(medianame);

    if (fileType == "image") {
      return true;
    }
    else if (fileType == "video") {
      return true;
    }
    else {
      return false;
    }
  }

  // getMedialistData(plid: number): boolean {
  //   this._media.GetMediaDetails(plid).subscribe(res => {
  //     if (res != null && res.length > 0) {
       
  //       if(res[0].fileType == 'Video'){
  //           return false;
  //       }
  //       else if(res[0].fileType == 'Image'){
  //         return true;        
  //       }       
  //     }
  //     else
  //       this.toast.error("Failed to failed media details.", "Error", { positionClass: "toast-bottom-right" });
  //     return true;
  //   }, (err) => { console.log(err) });
  //   return true;
  // }

  OnSavePlaylistDetails(): void {

    if (this.SelectedControllerId == undefined || this.SelectedControllerId.length < 1) {
      this.toast.error("No controller selected. Please select at least one controller to proceed.");
      return;
    }
    let _tileCount = this.registrationForm.controls['tiles'].length;
    for (var i = 0; i < _tileCount; i++) {
      let _plCount = this.registrationForm.controls['tiles'].controls[i].controls["playlist"].length;
      for (var j = 0; j < _plCount; j++) {
        let _backGroundColor = this.registrationForm.controls['tiles'].controls[i].controls["playlist"].controls[j].controls["textStyle"].value.backgroundColor;
        let fontSize = this.registrationForm.controls['tiles'].controls[i].controls["playlist"].controls[j].controls["textStyle"].value.fontSize;
        let fontColor = this.registrationForm.controls['tiles'].controls[i].controls["playlist"].controls[j].controls["textStyle"].value.fontColor;
        let _textStyle = {
          "backgroundColor": _backGroundColor,
          "fontSize": fontSize,
          "fontColor": fontColor
        }
        this.patchTileValue(i, j, _textStyle);
      }
    }
    //this.registrationForm.controls['tiles'].controls[0].controls["playlist"].controls[0].controls["textStyle"].value
    //this.registrationForm.controls['tiles'].controls[i].controls["playlist"].controls[0].controls["textStyle"].value
    if (this.registrationForm.valid) {

      let _vcmsmediplayerdata = new Mediaplayer();
      _vcmsmediplayerdata.VmsId =  Number.parseInt(this.SelectedControllerId[1]);
      _vcmsmediplayerdata.IpAddress = this.SelectedControllerId[0];
      _vcmsmediplayerdata.medianame = this.registrationForm.controls["name"].value;
      _vcmsmediplayerdata.status = 0;
      _vcmsmediplayerdata.AuditedBy = "System";
      _vcmsmediplayerdata.IsAudited = true;
      _vcmsmediplayerdata.AuditedTime = new Date();
      _vcmsmediplayerdata.Reason = "Upload Data for new MediaPlayer";
      _vcmsmediplayerdata.createddate = new Date();
      _vcmsmediplayerdata.RequestData = JSON.stringify(this.registrationForm.value);

      this._CVMSfacade.SaveMediaPlayer(_vcmsmediplayerdata).subscribe(data => {
        if (data == 0) {
          this.toast.error("Error occured while saving data for " + _vcmsmediplayerdata.IpAddress);
        }
        else {
          this.toast.success("Saved successfully for " + _vcmsmediplayerdata.IpAddress);
          
          this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this._router.navigate(['cvms/createMediaPlayerAndPlaylist']);
          }); 
          
        }
      });     
    }
  }

  patchTileValue(i: number, j: number, _data: any) {
    var _tile = this.registrationForm.controls['tiles'].controls[i].controls["playlist"].controls[j].controls["textStyle"]
    //const tile = this.tiles.at(index);

    // Use patchValue to update only the 'name' field
    _tile.patchValue({
      fontSize: _data.fontSize,
      fontColor: _data.fontColor,
      backgroundColor: _data.backgroundColor
    });
  }

  addPlaylist(index: number, ele: any) {
    //var playlist = this.getPlForCreate(index);
    //if(playlist == undefined)
    var playlist = this.getPlaylist(index);
    const playlistItem = this.createPlaylistItem(ele);
    playlist.push(playlistItem);
  }

  checkValue(event:any) {
    if (event.target.value <= 0) {
      event.target.value = 1;
    }
  }
}

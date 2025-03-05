import { Component, numberAttribute } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  public colorFont = '#cccccc';
  public colorBg = '#cccccc';
  isSeqValidate: boolean = false;
  partyDetails: any[] = [];
  tarrifDetails: any[] = [];
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
  isPlayOrder: boolean = true;
  dupliactefound: boolean;
  formValid: boolean = false;


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
      name: ['', ''],
      mediaLoopCount: ['', [Validators.required, Validators.pattern("[0-9][0-9]*$")]],
      tiles: this.fb.array([])
    });

    this.UpdateValidations();
    // this.registrationForm.get('name')?.valueChanges.subscribe((Method:any)=>{
    //   this.UpdateValidations(Method);
    // })
    this.GetVmsDetails();
    this.getPartyDetails();
    this.getTariffDetails();
  }
  get f() { return this.registrationForm.controls; }

  getTariffDetails() {
    let _data = { "currentPage": "0", "pageSize": "0", "startId": "0", "searchItem": null };
    this.adminFacade.getTarrifs(_data).subscribe(res => {
      if (res != null)
        this.tarrifDetails = res.data;
    });
  }
  getPartyDetails() {
    let _data = { "currentPage": "0", "pageSize": "0", "startId": "0", "searchItem": null };
    this.adminFacade.getParties(_data).subscribe(res => {
      if (res != null)
        this.partyDetails = res.data;
    });
  }
  UpdateValidations() {

    const name = this.registrationForm.get('name')
    const tiles = this.registrationForm.get('tiles')
    const tileNo = this.registrationForm.get('tileNo')

    const imageTextDuration = this.registrationForm.get('imageTextDuration')

    name?.setValidators([Validators.required, Validators.pattern("[A-Za-z0-9][A-Za-z0-9 ]*$"), this.noLeadingEndingWhitespace]);
    tileNo?.setValidators([Validators.required, Validators.pattern("[0-9][0-9]*$"), this.noLeadingEndingWhitespace]);
    imageTextDuration?.setValidators([Validators.required]);

    tiles.clearValidators();

    name?.updateValueAndValidity();
    tiles?.updateValueAndValidity();
    tileNo?.updateValueAndValidity();
    imageTextDuration?.updateValueAndValidity();
  }

  // Function to create a single user form group
  createUser(): FormGroup {
    return this.fb.group({
      tileNo: ['', [Validators.required, Validators.pattern("[1-999][1-999]*$")]],
      isPlayOrder: [0],
      duration: [0],
      mediaLoopCount: [0],
      partyIdCommon: [''],
      tarrifIdCommon: [''],
      fontSizeCommon: [0],
      //playlistLoopCount: ['', ''],
      playlistLoopCount: ['', [Validators.required, Validators.pattern("[0-9][0-9]*$")]],
      playlist: this.fb.array([])
    });
  }
  createPlaylistItem(ele: any, cnt: number): FormGroup {
    return this.fb.group({
      playOrder: [{ value: cnt, disabled: true }, Validators.required],
      // imageTextDuration:[ele.imageTextDuration],
      // mediaId:[ele.mediaId,''],
      // mediaName:[ele.mediaName,''],
      // videoLoopCount:[ele.videoLoopCount,''],
      imageTextDuration: [ele.imageTextDuration, [Validators.required]],
      mediaId: [ele.mediaId, ''],
      mediaName: [ele.mediaName, ''],
      videoLoopCount: [ele.videoLoopCount, Validators.required],
      partyId: ['', Validators.required],
      tarrifId: ['', Validators.required],
      textStyle: this.fb.group({
        fontSize: [0],
        fontColor: [''],
        backgroundColor: ['']
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

    if (!this.SelectedControllerId?.length) {
      this.toast.error("No controller selected. Please select at least one controller to proceed.");
      return;
    }
    let ipaddress = this.SelectedControllerId[0];
    let mediaplayername = this.registrationForm.controls["name"].value;

    this._CVMSfacade.CheckDuplicateMediaPlayerName(mediaplayername, ipaddress).subscribe(data => {

      if (JSON.parse(data) == 1) {
        this.toast.error("Media Player Name already exists in the System.");
        this.registrationForm.setErrors({ duplicateName: true });
        return;
      }
      else {
        this.currentTile++;
        let _tileDetails = new SelectedMediaVCMS();
        _tileDetails.tileNo = this.currentTile;
        this.selectedMediaPlaylist.push(_tileDetails);
        this.userDetails.push(this.createUser());
      }
    });

  }

  // Remove a tiles form group from the form array
  removeTiles(index: number): void {
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
      let _reqdata = { "action": "view", urls: [], modalType: "mediaupload", content: this.listOfMedialist, _crrTile: this.currentTile, "ipAddress": ipAddress };
      modalRef.componentInstance.data = _reqdata;
      modalRef.componentInstance.selectedId.subscribe((selectedId: any) => {
        //console.log(selectedId);

        this.selectedMediaId.push(selectedId);
        this.ShowTables(idx);
      })

    }
    else {
      let _reqdata = { "action": "view", urls: [], modalType: "textupload", content: this.listOfMedialist, _crrTile: this.currentTile, "ipAddress": ipAddress };
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
      if (this.selectedMediaId[0][i].mediaDetails != null) {
        _plMedia.imageTextDuration = this.selectedMediaId[0][i].mediaDetails.imageTextDuration;
        _plMedia.mediaId = this.selectedMediaId[0][i].resposneId;
        _plMedia.mediaName = this.selectedMediaId[0][i].mediaDetails.displayname;
        _plMedia.playOrder = this.selectedMediaId[0][i].mediaDetails.playOrder;
        _plMedia.videoLoopCount = this.selectedMediaId[0][i].mediaDetails.videoLoopCount;
        _plMedia.imageTextDuration=this.selectedMediaId[0][i].mediaDetails.duration;
        console.log("video", this.selectedMediaId[0])
      }
      else {
        //_plMedia.imageTextDuration = this.selectedMediaId[0][i].imageTextDuration;
        _plMedia.mediaId = this.selectedMediaId[0][i].id;
        _plMedia.mediaName = this.selectedMediaId[0][i].name;
        console.log("text", this.selectedMediaId[0])
        //_plMedia.playOrder = this.selectedMediaId[0][i].mediaDetails.playOrder;
        //_plMedia.videoLoopCount = this.selectedMediaId[0][i].mediaDetails.videoLoopCount;
      }
      _plMedia.textStyle = _textStyle;
      _plMediaList.push(_plMedia);

    }

    this.selectedMediaId = [];
    this.selectedMediaPlaylist[idx].playlist = _plMediaList;

    var playlist = this.getPlaylist(idx);
    var cnt = playlist.length;
    this.selectedMediaPlaylist[idx].playlist.forEach((ele: any) => {
      cnt++;
      this.addPlaylist(idx, ele, cnt);
    });
    //console.log(this.selectedMediaPlaylist);
  }

  RemoveRow(userIndex: number, id: number) {
    const playlistArray = this.getPlaylist(userIndex);  // Get the specific playlist FormArray for the user
    playlistArray.removeAt(id);
    this.selectedMediaId.splice(id, 1);

    this.changeSequence(userIndex, id, 1);
  }
  changeSequence(userIndex: number, id: number, type: number) {
    const playlistArray = this.getPlaylist(userIndex);
    if (type == 0) {
      var cnt = 0;
      playlistArray.controls.forEach((ele: any) => {
        cnt++;
        ele.get('playOrder')?.enable();
      });
    } else {
      var cnt = 0;
      playlistArray.controls.forEach((ele: any) => {
        cnt++;
        ele.patchValue({ playOrder: cnt });
      });
    }
  }

  validateSequence(userIndex: number, type: number) {

    const playlistArray = this.getPlaylist(userIndex);
    var _okaySequence = true;
    var prevVal = 0;
    playlistArray.controls.forEach((ele: any) => {
      let val = ele.controls["playOrder"].value;
      if (val == prevVal) {
        _okaySequence = false;
      }
      prevVal = val;
    });

    if (_okaySequence == true) {
      var startPoint = 1;
      var endPoint = playlistArray.length;
      var _okaySeq = true;
      for (var i = startPoint; i <= endPoint; i++) {
        let valFound = false;
        playlistArray.controls.forEach((ele: any) => {
          let val = ele.controls["playOrder"].value;
          if (val == i)
            valFound = true;
        });
        if (valFound == false) {
          _okaySeq = false;
        }
      }
      if (_okaySeq == false) {
        if (type == 0)
          this.toast.error("Sequence values are missing");
      } else {
        playlistArray.controls.forEach((ele: any) => {
          ele.get('playOrder')?.disable();
        });
      }
    }
    else {
      if (type == 0)
        this.toast.error("Invalid sequence number occured");
    }
    return _okaySequence;
  }
  getSelectedVms(eve: any) {
    const selectElement = eve.target as HTMLSelectElement;
    const colindex = selectElement.value.indexOf(":");
    if (colindex !== -1) {
      this.SelectedControllerId = selectElement.value.slice(colindex + 1, selectElement.value.length).replace(/\s+/g, '').split("|");

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
  validateFields() {
    let len = this.registrationForm.controls['tiles'].length;

    for (var i = 0; i < len; i++) {
      this.isSeqValidate = this.validateSequence(i, 1);
      if (this.isSeqValidate == false) {
        break;
      }
    }
  }
  OnSavePlaylistDetails_new(): void {
    this.validateFields();
    if (this.isSeqValidate) {
      const ipAddress = this.SelectedControllerId[0];
      const mediaPlayerName = this.registrationForm.controls["name"].value;

      // Check for duplicate media player name
      this._CVMSfacade.CheckDuplicateMediaPlayerName(mediaPlayerName, ipAddress).subscribe(data => {
        if (data === 1) {
          this.toast.error("Media Player Name already exists in the System.");
          this.registrationForm.setErrors({ duplicateName: true });
          return;
        }
      });

      const tiles = this.registrationForm.controls['tiles'];
      const tileCount = tiles.length;

      if (tileCount === 0) {
        this.toast.error("At least one playlist must be created to set up the media player.");
        return;
      }

      // Iterate through tiles and playlists to extract text styles
      tiles.controls.forEach((tile: any, i: number) => {
        tile.controls["playlist"].controls.forEach((playlist: any, j: number) => {
          const textStyle = playlist.controls["textStyle"].value;
          const formattedTextStyle = {
            backgroundColor: textStyle.backgroundColor,
            fontSize: textStyle.fontSize,
            fontColor: textStyle.fontColor
          };
          this.patchTileValue(i, j, formattedTextStyle);
        });
      });

      if (!this.registrationForm.valid) {
        this.toast.error("There was a problem saving your data. Please review your input for any errors.");
        return;
      }

      // Create and populate Mediaplayer object
      const mediaPlayerData = new Mediaplayer();
      mediaPlayerData.VmsId = Number.parseInt(this.SelectedControllerId[1]);
      mediaPlayerData.IpAddress = ipAddress;
      mediaPlayerData.mediaplayername = mediaPlayerName;
      mediaPlayerData.status = 0;
      mediaPlayerData.AuditedBy = "System";
      mediaPlayerData.IsAudited = true;
      mediaPlayerData.AuditedTime = new Date();
      mediaPlayerData.Reason = "Upload Data for new MediaPlayer";
      mediaPlayerData.CreationTime = new Date();
      mediaPlayerData.RequestData = JSON.stringify(this.registrationForm.value);
      mediaPlayerData.RequestType="/mediaPlayer/createMediaPlayerAndPlaylist";


      // Save media player data
      this._CVMSfacade.SaveMediaPlayer(mediaPlayerData).subscribe(data => {
        if (data === 0) {
          this.toast.error(`Error occurred while saving data for ${mediaPlayerData.IpAddress}`);
        } else {
          this.toast.success(`Saved successfully for ${mediaPlayerData.IpAddress}`);
          this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this._router.navigate(['cvms/createMediaPlayerAndPlaylist']);
          });
        }
      });
    } else {
      this.toast.error("Invalid sequence available in tiles");
    }


  }

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
          "fontColor": fontColor,
        }
        this.patchTileValue(i, j, _textStyle);
      }
      if (_plCount == 0) {
        this.toast.error("At least one playlist must be created to set up the media player.");
        return;
      }
    }
    if (_tileCount == 0) {
      this.toast.error("At least one Tiles and Playlist must be created to set up the media player.");
      return;
    }

    if (this.registrationForm.valid) {
      this.toast.error("There was a problem saving your data. Please review your input for any errors.");
      return;
    }

    let _vcmsmediplayerdata = new Mediaplayer();
    _vcmsmediplayerdata.VmsId = Number.parseInt(this.SelectedControllerId[1]);
    _vcmsmediplayerdata.IpAddress = this.SelectedControllerId[0];
    _vcmsmediplayerdata.mediaplayername = this.registrationForm.controls["name"].value;
    _vcmsmediplayerdata.status = 0;
    _vcmsmediplayerdata.AuditedBy = "System";
    _vcmsmediplayerdata.IsAudited = true;
    _vcmsmediplayerdata.AuditedTime = new Date();
    _vcmsmediplayerdata.Reason = "Upload Data for new MediaPlayer";
    _vcmsmediplayerdata.CreationTime = new Date();
    _vcmsmediplayerdata.RequestData = JSON.stringify(this.registrationForm.value);
    _vcmsmediplayerdata.RequestType = "/mediaplayer/createMediaPlayerAndPlaylist";

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

  addPlaylist(index: number, ele: any, cnt: number) {
    //var playlist = this.getPlForCreate(index);
    //if(playlist == undefined)
    var playlist = this.getPlaylist(index);
    const playlistItem = this.createPlaylistItem(ele, cnt);
    playlist.push(playlistItem);
  }

  checkValue(event: any) {
    if (event.target.value <= 0) {
      event.target.value = 1;
    }
  }
  noLeadingEndingWhitespace(control: FormControl) {

    if (control.value && control.value.trimStart().length !== control.value.length) {
      return { leadingWhitespace: true };
    }
    else if (control.value && control.value.trimEnd().length !== control.value.length) {
      return { leadingWhitespace: true };
    }
    return null;
  }

  ToAllDuration(idx: number) {
    let val = this.registrationForm.controls['tiles'].controls[idx].controls['duration'].value;
    const playlistArray = this.getPlaylist(idx);
    playlistArray.controls.forEach((ele: any) => {
      ele.patchValue({ imageTextDuration: val });
    });
  }
  ToAllLoop(idx: number) {
    let val = this.registrationForm.controls['tiles'].controls[idx].controls['mediaLoopCount'].value;
    const playlistArray = this.getPlaylist(idx);
    playlistArray.controls.forEach((ele: any) => {
      ele.patchValue({ videoLoopCount: val });
    });
  }

  ToAllParty(idx: number) {
    let val = this.registrationForm.controls['tiles'].controls[idx].controls['partyIdCommon'].value;
    const playlistArray = this.getPlaylist(idx);
    playlistArray.controls.forEach((ele: any) => {
      ele.patchValue({ partyId: val });
    });
  }
  ToAllTarrif(idx: number) {
    let val = this.registrationForm.controls['tiles'].controls[idx].controls['tarrifIdCommon'].value;
    const playlistArray = this.getPlaylist(idx);
    playlistArray.controls.forEach((ele: any) => {
      ele.patchValue({ tarrifId: val });
    });
  }
  ToAllFontSize(idx: number) {
    let val = this.registrationForm.controls['tiles'].controls[idx].controls['fontSizeCommon'].value;
    const playlistArray = this.getPlaylist(idx);
    playlistArray.controls.forEach((ele: any) => {
      if (!this.isNameValid(ele.get('mediaName')?.value)) {
        ele.controls['textStyle'].patchValue({ fontSize: val });
      }
    });
  }
  setColor(color: any) {
    // this.field.update(color, true, true);
  }

  onChangeColor(color: string, tileIndex: number, playlistIndex: number, colorType: string, type: string) {
    // Dynamically update the corresponding color field in the form array
    const control = this.registrationForm.controls['tiles'].at(tileIndex).get('playlist').at(playlistIndex);
    if (type == "all") {
      const playlistArray = this.getPlaylist(tileIndex);
      playlistArray.controls.forEach((ele: any) => {
        if (!this.isNameValid(ele.get('mediaName')?.value)) {
          if (colorType === 'fontColor')
            ele.controls["textStyle"].patchValue({ fontColor: color });
          else if (colorType === 'backgroundColor')
            ele.controls["textStyle"].patchValue({ backgroundColor: color });
        }

      });
    } else if (colorType === 'fontColor') {
      control.get('textStyle').patchValue({ fontColor: color });
    } else if (colorType === 'backgroundColor') {
      control.get('textStyle').patchValue({ backgroundColor: color });
    }
  }

}

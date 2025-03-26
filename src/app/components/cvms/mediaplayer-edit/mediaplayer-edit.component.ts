import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Globals } from 'src/app/utils/global';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AdminFacadeService } from 'src/app/facade/facade_services/admin-facade.service';
import { CVMSMediaFacadeServiceService } from 'src/app/facade/facade_services/cvmsmedia-facade-service.service';
import { MediaFacadeService } from 'src/app/facade/facade_services/media-facade.service';
import { Mediaplayer } from 'src/app/models/vcms/mediaplayer';
import { PlaylistMedia, SelectedMediaVCMS } from 'src/app/models/vcms/selectedMedia';
import { CVMSMediaModalComponent } from '../cvmsmedia-modal/cvmsmedia-modal.component';
import { getErrorMsg } from 'src/app/utils/utils';
import { ToastrService } from 'ngx-toastr';
import { FileServiceService } from 'src/app/facade/services/vcms/file-service.service';
import { CommonSelectList } from 'src/app/models/common/cmSelectList';
import { InputRequest } from 'src/app/models/request/inputReq';
@Component({
  selector: 'app-mediaplayer-edit',
  templateUrl: './mediaplayer-edit.component.html',
  styleUrls: ['./mediaplayer-edit.component.css']
})

export class MediaPlayerEditComponent {

  initiate: boolean = true;
  public colorFont = '#cccccc';
  public colorBg = '#cccccc';
  isSeqValidate: boolean = false;
  isvideo: boolean = false;
  editForm: any;

  mediaId!: number;
  SelectedControllerId: any;
  item: any;
  tile: any;
  selectedMediaPlaylist: any = [];
  currentTile: number = -1;
  mediauploadtype: string;
  _inputVmsData: any;
  MediaName: string;
  listOfMedialist: any = [];
  partyDetails: any[] = [];
  tarrifDetails: any[] = [];
  selectedMediaId: any = [];
  _request: any = new InputRequest();
  rows: any[];
  selectedMediaPlayerId: number | null = null;
  vmsid: number;

  ShowSaveBtn: boolean = false;
  rowCount: number;

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private global: Globals,
    private _media: MediaFacadeService,
    private adminFacade: AdminFacadeService,
    private _router: Router,
    private _ActivatedRoute: ActivatedRoute,
    private _CVMSfacade: CVMSMediaFacadeServiceService,
    private fileService: FileServiceService,
    private modalService: NgbModal,) {
    this.global.CurrentPage = "Create Media Player CVMS";
  }

  ngOnInit(): void {
    this.addTile();
    this.mediaId = Number(this._ActivatedRoute.snapshot.paramMap.get('id'));

    // this.populateFormWithData(this.getMockData()); 
    //this.getDataForMediaPlayer(this.mediaId);
    this.editForm = this.fb.group({
      name: ['', ''],
      mediaLoopCount: ['', [Validators.required, Validators.pattern("[0-9][0-9]*$")]],
      tiles: this.fb.array([]),
      SelectedControllerId: ['', Validators.required],
      id:[0]
    });
    // this.populateFormWithData(this.getMockData()); 
    //setTimeout(() => { this.addTile(); }, 100);
    this.getDataForMediaPlayer(this.mediaId);
    this.getPartyDetails();
    this.getTariffDetails();
    //setTimeout(() => { this.addTile(); }, 100);

    // this.UpdateValidations();

    //this.GetVmsDetails();

    //   ngOnInit(): void {
    //     this.mediaId = Number(this._ActivatedRoute.snapshot.paramMap.get('id'));
    //     this.initializeForm();
    //      this.loadMediaData();
    //   }

  }

  ToAllDuration(idx: number) {
    let val = this.editForm.controls['tiles'].controls[idx].controls['duration'].value;
    const playlistArray = this.getPlaylist(idx);
    playlistArray.controls.forEach((ele: any) => {
      ele.patchValue({ imageTextDuration: val });
    });
  }
  ToAllLoop(idx: number) {
    let val = this.editForm.controls['tiles'].controls[idx].controls['mediaLoopCount'].value;
    const playlistArray = this.getPlaylist(idx);
    playlistArray.controls.forEach((ele: any) => {
      ele.patchValue({ videoLoopCount: val });
    });
  }

  ToAllParty(idx: number) {
    let val = this.editForm.controls['tiles'].controls[idx].controls['partyIdCommon'].value;
    const playlistArray = this.getPlaylist(idx);
    playlistArray.controls.forEach((ele: any) => {
      ele.patchValue({ partyId: val });
    });
  }
  ToAllTarrif(idx: number) {
    let val = this.editForm.controls['tiles'].controls[idx].controls['tarrifIdCommon'].value;
    const playlistArray = this.getPlaylist(idx);
    playlistArray.controls.forEach((ele: any) => {
      ele.patchValue({ tarrifId: val });
    });
  }
  ToAllFontSize(idx: number) {
    let val = this.editForm.controls['tiles'].controls[idx].controls['fontSizeCommon'].value;
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
    const control = this.editForm.controls['tiles'].at(tileIndex).get('playlist').at(playlistIndex);
    if (type == "all") {
      const playlistArray = this.getPlaylist(tileIndex);
      playlistArray.controls.forEach((ele: any) => {
        if (!this.isNameValid(ele.get('mediaName')?.value)) {
          if (colorType === 'fontColor')
            ele.controls['textStyle'].patchValue({ fontColor: color })
          //control.controls["textStyle"].controls.get('fontColor').patchValue({ fontColor: color });
          else if (colorType === 'backgroundColor')
            ele.controls['textStyle'].patchValue({ backgroundColor: color })
          //control.controls["textStyle"].controls.get('backgroundColor').patchValue({ backgroundColor: color });
        }
        else {
          this.toast.error("Not able to perform this action, required text.");
          control.controls["textStyle"].controls.control.get('fontColor').patchValue({ backgroundColor: '#cccccc' });
          control.controls["textStyle"].controls.control.get('backgroundColor').patchValue({ backgroundColor: '#cccccc' });
        }

      });
    } else if (!this.isNameValid(control.controls['mediaName'].value)) {
      if (colorType === 'fontColor') {
        control.controls["textStyle"].controls.control.get('fontColor').patchValue({ fontColor: color });
      } else if (colorType === 'backgroundColor') {
        control.controls["textStyle"].controls.control.get('backgroundColor').patchValue({ backgroundColor: color });
      }
    } else {
      this.toast.error("Not able to perform this action, required text.");
      control.controls["textStyle"].controls.control.get('fontColor').patchValue({ fontColor: '#cccccc' });
      control.controls["textStyle"].controls.control.get('backgroundColor').patchValue({ backgroundColor: '#cccccc' });
    }

  }
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
  getDataForMediaPlayer(id: number): void {
    let body = {
      "searchItem": "",
      "pageSize": 0,
      "currentPage": 0,
      "startId": 0,
      "cachekey": "string"
    }
    this._CVMSfacade.getMediaPlayerById(id, body).subscribe(response => {

      const data = response.data[0];

      if (data) {

        this.populateFormWithData(data);  // Populate the form with fetched data

      } else {
        this.toast.error('No data found for the selected media player.');
      }
    }, error => {
      this.toast.error('Error fetching data.');
    });



  }

  populateFormWithData(data: any): void {

    const requestData = JSON.parse(data.requestData);
    const responseid= data.responseId

    const mediaPlayerName = requestData.name;
    const mediaLoopCount = requestData.mediaLoopCount;
    this.selectedMediaPlayerId = data.id;
    this.vmsid = data.vmsId;


    const tiles = requestData.tiles;
    const ipaddress = data.ipAddress;
    console.log("This is the ip", ipaddress);
    this.editForm.patchValue({
      name: mediaPlayerName,
      mediaLoopCount: mediaLoopCount,
      SelectedControllerId: ipaddress,
      id:responseid

    });

    const tilesFormArray = this.editForm.get('tiles') as FormArray;
    tiles.forEach((tile: any) => {


      tilesFormArray.push(this.fb.group({
        tileNo: [tile.tileNo],
        playlistLoopCount: [tile.playlistLoopCount],
        playlist: this.fb.array(tile.playlist.map((item: any) => this.fb.group({
          playOrder: [item.playOrder],
          imageTextDuration: [item.imageTextDuration],
          mediaId: [item.mediaId],
          mediaName: [item.mediaName],
          videoLoopCount: [item.videoLoopCount],
          textStyle: this.fb.group({
            fontSize: [item.textStyle.fontSize],
            fontColor: [item.textStyle.fontColor],
            backgroundColor: [item.textStyle.backgroundColor]
          })
        })))
      }));


      let _tileDetails = new SelectedMediaVCMS();
      _tileDetails.tileNo = tile.tileNo;
      _tileDetails.playlist = tile.playlist.map((item: any) => ({
        playOrder: item.playOrder,
        imageTextDuration: item.imageTextDuration,
        mediaId: item.mediaId,
        mediaName: item.mediaName,
        videoLoopCount: item.videoLoopCount,
        textStyle: {
          fontSize: item.textStyle.fontSize,
          fontColor: item.textStyle.fontColor,
          backgroundColor: item.textStyle.backgroundColor,
        },
      }));

      // add the code for pushing into the selectedmediaplaylist

      this.selectedMediaPlaylist.push(_tileDetails);

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

  get f() { return this.editForm.controls; }

  Getting_id(): void {
    if (!this.selectedMediaPlayerId) {
      this.toast.error("No media player ID found. Cannot update.");
      return;
    }
    this.OnSavePlaylistDetails_new(this.selectedMediaPlayerId);
  }
  OnSavePlaylistDetails_new(id: number): void {
    this.validateFields();
    if (this.isSeqValidate) {
      const ipAddress = this.SelectedControllerId[0];
      const mediaPlayerName = this.editForm.controls["name"].value;

      // Check for duplicate media player name
      this._CVMSfacade.CheckDuplicateMediaPlayerName(mediaPlayerName, ipAddress).subscribe(data => {
        if (data === 1) {
          this.toast.error("Media Player Name already exists in the System.");
          this.editForm.setErrors({ duplicateName: true });
          return;
        }
      });

      const tiles = this.editForm.controls['tiles'];
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

      if (!this.editForm.valid) {
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
      mediaPlayerData.RequestData = JSON.stringify(this.editForm.value);
      mediaPlayerData.RequestType = "/mediaPlayer/createMediaPlayerAndPlaylist";



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
  OnSavePlaylistDetails(id: number): void {

    let _tileCount = this.editForm.controls['tiles'].length;
    for (var i = 0; i < _tileCount; i++) {
      let _plCount = this.editForm.controls['tiles'].controls[i].controls["playlist"].length;
      for (var j = 0; j < _plCount; j++) {
        let _backGroundColor = this.editForm.controls['tiles'].controls[i].controls["playlist"].controls[j].controls["textStyle"].value.backgroundColor;
        let fontSize = this.editForm.controls['tiles'].controls[i].controls["playlist"].controls[j].controls["textStyle"].value.fontSize;
        let fontColor = this.editForm.controls['tiles'].controls[i].controls["playlist"].controls[j].controls["textStyle"].value.fontColor;
        let _textStyle = {
          "backgroundColor": _backGroundColor,
          "fontSize": fontSize,
          "fontColor": fontColor
        }
        this.patchTileValue(i, j, _textStyle);
      }
    }

    if (_tileCount == 0) {
      this.toast.error("At least one playlist must be created to set up the media player.");
      return;
    }


    if (this.editForm.valid) {

      let _vcmsmediplayerdata = new Mediaplayer();
      _vcmsmediplayerdata.VmsId = this.vmsid;
      _vcmsmediplayerdata.IpAddress = this.editForm.controls['SelectedControllerId'].value;
      //_vcmsmediplayerdata.medianame = this.editForm.controls["name"].value;
      _vcmsmediplayerdata.status = 0;
      _vcmsmediplayerdata.AuditedBy = "System";
      _vcmsmediplayerdata.IsAudited = true;
      _vcmsmediplayerdata.AuditedTime = new Date();
      _vcmsmediplayerdata.Reason = "Upload Data for new MediaPlayer";
      _vcmsmediplayerdata.createddate = new Date();
      _vcmsmediplayerdata.RequestData = JSON.stringify(this.editForm.value);
      _vcmsmediplayerdata.RequestType="/mediaPlayer/updateMediaPlayer";

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
    else {
      this.toast.error("There was a problem saving your data. Please review your input for any errors.");
      return;
    }
  }
  patchTileValue(i: number, j: number, _data: any) {
    var _tile = this.editForm.controls['tiles'].controls[i].controls["playlist"].controls[j].controls["textStyle"]
    //const tile = this.tiles.at(index);

    // Use patchValue to update only the 'name' field
    _tile.patchValue({
      fontSize: _data.fontSize,
      fontColor: _data.fontColor,
      backgroundColor: _data.backgroundColor
    });
  }
 
  getPlForCreate(userIndex: number) {
    const tileFormGroup = this.userDetails.at(userIndex);
    const playlistFormArray = tileFormGroup.get('playlist') as FormArray;
    var _len = playlistFormArray.length;
    return (playlistFormArray.at(_len) as FormArray);
  }
  UpdateValidations() {

    const name = this.editForm.get('name')
    const tiles = this.editForm.get('tiles')
    const tileNo = this.editForm.get('tileNo')

    const imageTextDuration = this.editForm.get('imageTextDuration')

    name?.setValidators([Validators.required, Validators.pattern("[A-Za-z0-9][A-Za-z0-9 ]*$"), this.noLeadingEndingWhitespace]);
    tileNo?.setValidators([Validators.required, Validators.pattern("[0-9][0-9]*$"), this.noLeadingEndingWhitespace]);
    imageTextDuration?.setValidators([Validators.required]);

    tiles.clearValidators();

    name?.updateValueAndValidity();
    tiles?.updateValueAndValidity();
    tileNo?.updateValueAndValidity();
    imageTextDuration?.updateValueAndValidity();
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






  addTile(): void {
    this.currentTile++;
    let _tileDetails = new SelectedMediaVCMS();
    _tileDetails.tileNo = this.currentTile;
    if (this.initiate) {
      this.initiate = false;
    }
    else {
      this.userDetails.push(this.createUser());
    }
  }
  addTile2(): void {

    if (!this.SelectedControllerId?.length) {
      this.toast.error("No controller selected. Please select at least one controller to proceed.");
      return;
    }
    let ipaddress = this.SelectedControllerId[0];
    let mediaplayername = this.editForm.controls["name"].value;

    this._CVMSfacade.CheckDuplicateMediaPlayerName(mediaplayername, ipaddress).subscribe(data => {

      if (JSON.parse(data) == 1) {
        this.toast.error("Media Player Name already exists in the System.");
        this.editForm.setErrors({ duplicateName: true });
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
  createUser2(): FormGroup {
    return this.fb.group({
      tileNo: ['', [Validators.required, Validators.pattern("[1-999][1-999]*$")]],
      playlistLoopCount: ['', [Validators.required, Validators.pattern("[0-9][0-9]*$")]],
      playlist: this.fb.array([])
    });
  }

  createUser(): FormGroup {
    let len = this.editForm.controls['tiles'].length;
    return this.fb.group({
      tileNo: [(len+1), [Validators.required, Validators.pattern("[1-999][1-999]*$")]],
      isPlayOrder: [0],
      duration: [0],
      mediaLoopCount: [0],
      partyIdCommon: [''],
      tarrifIdCommon: [''],
      fontSizeCommon: [0],
      //playlistLoopCount: ['', ''],
      playlistLoopCount: ['', [Validators.required, Validators.pattern("[0-9][0-9]*$")]],
      colorFont: [''],
      colorBg: [''],
      playlist: this.fb.array([])
    });
  }
  get userDetails(): FormArray {
    return this.editForm.get('tiles') as FormArray;
  }



 


  getErrorMessage(_controlName: any, _controlLable: any, _isPattern: boolean = false, _msg: string) {
    return getErrorMsg(this.editForm, _controlName, _controlLable, _isPattern, _msg);
  }

  loadMediaData() {
    let _mediaplayer = new Mediaplayer();
    this._CVMSfacade.GetMediaPlayer(0).subscribe(data => {
      this.editForm.patchValue({
        name: data.name,
        mediaLoopCount: data.mediaLoopCount
      });




      const tilesArray = this.editForm.get('tiles') as FormArray;
      data.tiles.forEach((tile: any) => {
        tilesArray.push(this.fb.group({
          tileNo: [{ value: tile.tileNo, disabled: true }],
          playlistLoopCount: [{ value: tile.playlistLoopCount, disabled: true }],
          playlist: this.fb.array(tile.playlist.map((p: any) =>
            this.fb.group({
              mediaName: [{ value: p.mediaName, disabled: true }],
              playOrder: [{ value: p.playOrder, disabled: true }],
              imageTextDuration: [{ value: p.imageTextDuration, disabled: true }],
              videoLoopCount: [{ value: p.videoLoopCount, disabled: true }],
              textStyle: this.fb.group({
                fontSize: [{ value: p.textStyle.fontSize, disabled: true }],
                fontColor: [{ value: p.textStyle.fontColor, disabled: true }],
                backgroundColor: [{ value: p.textStyle.backgroundColor, disabled: true }]
              })
            })
          ))
        }));
      });
    });
  }

  get tiles(): FormArray {
    return this.editForm.get('tiles') as FormArray;
  }

  getPlaylist2(index: number): FormArray {
    return this.tiles.at(index).get('playlist') as FormArray;
  }
  getPlaylist(userIndex: number): FormArray {
    return (this.userDetails.at(userIndex).get('playlist') as FormArray);
  }

  BacktoList() {
    this._router.navigate(['cvms/createMediaPlayerAndPlaylist']);
  }

  removeTiles2(index: number): void {
    this.userDetails.removeAt(index);
    this.selectedMediaPlaylist.splice(index, 1);
  }
  removeTiles(index: number): void {
    this.editForm.controls['tiles'].length;
    let cnt = 0;
    
    this.userDetails.removeAt(index);
    this.selectedMediaPlaylist.splice(index, 1);
    this.editForm.controls['tiles'].controls.forEach((ele:any) => {
      cnt = cnt+1;
      ele.patchValue({tileNo:cnt});
    });
  }
  ShowMediaPopup(type: string, idx: number) {
    let ipAddress = this.editForm.controls['SelectedControllerId'].value;
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
  checkValue(event: any) {
    if (event.target.value <= 0) {
      event.target.value = 1;
    }
  }
  ShowTables(idx: number) {
    this.generateRows(idx);
    this.ShowSaveBtn = true;


  }
  // generateRows2(idx: number) {
  //   //console.log(JSON.stringify(this.selectedMediaId))

  //   this.rows = []; // Clear existing rows
  //   this.rowCount = 0;
  //   this.rowCount = this.selectedMediaId[0].length;
  //   const playlistArray = this.getPlaylist(idx); // Get the playlist form array for the last user
  //   //playlistArray.clear();
  //   let _plMediaList = [];
  //   for (let i = 0; i < this.rowCount; i++) {
  //     // Push a new playlist group (with the selected media) into the respective userDetails playlist array.
  //     let _plMedia = new PlaylistMedia();
  //     // Add a new item to the playlist FormArray
  //     let _textStyle = {
  //       "fontSize": 0,
  //       "fontColor": "",
  //       "backgroundColor": ""
  //     }
  //     if (this.selectedMediaId[0][i].mediaDetails != null) {
  //       _plMedia.imageTextDuration = this.selectedMediaId[0][i].mediaDetails.imageTextDuration;
  //       _plMedia.mediaId = this.selectedMediaId[0][i].resposneId;
  //       _plMedia.mediaName = this.selectedMediaId[0][i].mediaDetails.displayname;
  //       _plMedia.playOrder = this.selectedMediaId[0][i].mediaDetails.playOrder;
  //       _plMedia.videoLoopCount = this.selectedMediaId[0][i].mediaDetails.videoLoopCount;

  //     }
  //     else {
  //       //_plMedia.imageTextDuration = this.selectedMediaId[0][i].imageTextDuration;
  //       _plMedia.mediaId = this.selectedMediaId[0][i].id;
  //       _plMedia.mediaName = this.selectedMediaId[0][i].name;
  //       //_plMedia.playOrder = this.selectedMediaId[0][i].mediaDetails.playOrder;
  //       //_plMedia.videoLoopCount = this.selectedMediaId[0][i].mediaDetails.videoLoopCount;
  //     }
  //     _plMedia.textStyle = _textStyle;
  //     _plMediaList.push(_plMedia);

  //   }

  //   this.selectedMediaId = [];
  //   this.selectedMediaPlaylist[idx].playlist = _plMediaList;
  //   this.selectedMediaPlaylist[idx].playlist.forEach((ele: any) => {
  //     this.addPlaylist(idx, ele);
  //   });
  //   //console.log(this.selectedMediaPlaylist);
  // }
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
        if (this.selectedMediaId[0][i].mediaDetails.duration != null) {
          _plMedia.imageTextDuration = this.selectedMediaId[0][i].mediaDetails.duration;

        }
        // console.log("video", this.selectedMediaId[0])
      }
      else {
        //_plMedia.imageTextDuration = this.selectedMediaId[0][i].imageTextDuration;
        _plMedia.mediaId = this.selectedMediaId[0][i].id;
        _plMedia.mediaName = this.selectedMediaId[0][i].name;
        //console.log("text", this.selectedMediaId[0])
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
      this.isvideo = false;
      if (ele.imageTextDuration) {
        this.isvideo = true;
      }
      this.addPlaylist(idx, ele, cnt, this.isvideo);
    });
    //console.log(this.selectedMediaPlaylist);
  }
  // addPlaylist2(index: number, ele: any) {
  //   //var playlist = this.getPlForCreate(index);
  //   //if(playlist == undefined)
  //   var playlist = this.getPlaylist(index);
  //   const playlistItem = this.createPlaylistItem(ele);
  //   playlist.push(playlistItem);
  // }
  addPlaylist(index: number, ele: any, cnt: number, video: boolean) {
    //var playlist = this.getPlForCreate(index);
    //if(playlist == undefined)
    var playlist = this.getPlaylist(index);

    const playlistItem = this.createPlaylistItem(ele, cnt, video);
    playlist.push(playlistItem);
  }
  createPlaylistItem2(ele: any): FormGroup {
    return this.fb.group({
      playOrder: [ele.playOrder, ''],
      // imageTextDuration:[ele.imageTextDuration],
      // mediaId:[ele.mediaId,''],
      // mediaName:[ele.mediaName,''],
      // videoLoopCount:[ele.videoLoopCount,''],
      imageTextDuration: [ele.imageTextDuration, [Validators.required]],
      mediaId: [ele.mediaId, ''],
      mediaName: [ele.mediaName, ''],
      videoLoopCount: [ele.videoLoopCount, ''],
      textStyle: this.fb.group({
        fontSize: [0],
        fontColor: [''],
        backgroundColor: [''],
      }),
    });
  }

  createPlaylistItem(ele: any, cnt: number, video: boolean): FormGroup {
    return this.fb.group({



      playOrder: [{ value: cnt, disabled: true }, Validators.required],
      // imageTextDuration:[ele.imageTextDuration],
      // mediaId:[ele.mediaId,''],
      // mediaName:[ele.mediaName,''],
      // videoLoopCount:[ele.videoLoopCount,''],

      //imageTextDuration: [ele.imageTextDuration, [Validators.required]],
      imageTextDuration: [{ value: ele.imageTextDuration, disabled: video }, [Validators.required]],

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
    }
    );
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
  validateFields() {
    let len = this.editForm.controls['tiles'].length;

    for (var i = 0; i < len; i++) {
      this.isSeqValidate = this.validateSequence(i, 1);
      if (this.isSeqValidate == false) {
        break;
      }
    }
  }
  onSubmit(): void {
    if (this.editForm.valid) {
      console.log(this.editForm.value);
    }
  }
}

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
    //setTimeout(() => { this.addTile(); }, 100);
    this.mediaId = Number(this._ActivatedRoute.snapshot.paramMap.get('id'));

    // this.populateFormWithData(this.getMockData()); 
    //this.getDataForMediaPlayer(this.mediaId);
    this.editForm = this.fb.group({
      name: ['', ''],
      mediaLoopCount: ['', [Validators.required, Validators.pattern("[0-9][0-9]*$")]],
      tiles: this.fb.array([]),
      SelectedControllerId: ['', Validators.required]
    });
    // this.populateFormWithData(this.getMockData()); 
    //setTimeout(() => { this.addTile(); }, 100);
    this.getDataForMediaPlayer(this.mediaId);
    //setTimeout(() => { this.addTile(); }, 100);

    // this.UpdateValidations();

    //this.GetVmsDetails();

    //   ngOnInit(): void {
    //     this.mediaId = Number(this._ActivatedRoute.snapshot.paramMap.get('id'));
    //     this.initializeForm();
    //      this.loadMediaData();
    //   }

  }


  getDataForMediaPlayer(id: number): void {
    let body = {
      "searchItem": "string",
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
      SelectedControllerId: ipaddress

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
    this.OnSavePlaylistDetails(this.selectedMediaPlayerId);
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
      _vcmsmediplayerdata.id = id;
      _vcmsmediplayerdata.RequestType="/mediaPlayer/updateMediaPlayer";

      this._CVMSfacade.UpdateMediaPlayer(_vcmsmediplayerdata).subscribe(data => {
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
  createUser(): FormGroup {
    return this.fb.group({
      tileNo: ['', [Validators.required, Validators.pattern("[1-999][1-999]*$")]],
      playlistLoopCount: ['', [Validators.required, Validators.pattern("[0-9][0-9]*$")]],
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

  getPlaylist(index: number): FormArray {
    return this.tiles.at(index).get('playlist') as FormArray;
  }

  BacktoList() {
    this._router.navigate(['cvms/createMediaPlayerAndPlaylist']);
  }

  removeTiles(index: number): void {
    this.userDetails.removeAt(index);
    this.selectedMediaPlaylist.splice(index, 1);
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

      }
      else {
        //_plMedia.imageTextDuration = this.selectedMediaId[0][i].imageTextDuration;
        _plMedia.mediaId = this.selectedMediaId[0][i].id;
        _plMedia.mediaName = this.selectedMediaId[0][i].name;
        //_plMedia.playOrder = this.selectedMediaId[0][i].mediaDetails.playOrder;
        //_plMedia.videoLoopCount = this.selectedMediaId[0][i].mediaDetails.videoLoopCount;
      }
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
  addPlaylist(index: number, ele: any) {
    //var playlist = this.getPlForCreate(index);
    //if(playlist == undefined)
    var playlist = this.getPlaylist(index);
    const playlistItem = this.createPlaylistItem(ele);
    playlist.push(playlistItem);
  }
  createPlaylistItem(ele: any): FormGroup {
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

  RemoveRow(userIndex: number, id: number) {
    const playlistArray = this.getPlaylist(userIndex);  // Get the specific playlist FormArray for the user
    playlistArray.removeAt(id);
    this.selectedMediaId.splice(id, 1);
  }
  onSubmit(): void {
    if (this.editForm.valid) {
      console.log(this.editForm.value);
    }
  }
}

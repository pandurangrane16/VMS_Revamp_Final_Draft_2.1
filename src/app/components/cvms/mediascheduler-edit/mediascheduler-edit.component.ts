import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Globals } from 'src/app/utils/global';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AdminFacadeService } from 'src/app/facade/facade_services/admin-facade.service';
import { CVMSMediaFacadeServiceService } from 'src/app/facade/facade_services/cvmsmedia-facade-service.service';
import { MediaFacadeService } from 'src/app/facade/facade_services/media-facade.service';
import { PlaylistMedia, SelectedMediaVCMS } from 'src/app/models/vcms/selectedMedia';
import { CVMSMediaModalComponent } from '../cvmsmedia-modal/cvmsmedia-modal.component';
import { getErrorMsg } from 'src/app/utils/utils';
import { ToastrService } from 'ngx-toastr';
import { FileServiceService } from 'src/app/facade/services/vcms/file-service.service';
import { CommonSelectList } from 'src/app/models/common/cmSelectList';
import { InputRequest } from 'src/app/models/request/inputReq';
import { Mediascheduler } from 'src/app/models/vcms/mediascheduler';
import { catchError } from 'rxjs';
@Component({
  selector: 'app-mediascheduler-edit',
  templateUrl: './mediascheduler-edit.component.html',
  styleUrls: ['./mediascheduler-edit.component.css']
})

export class MediaSchedulerEditComponent {

  initiate: boolean = true;

  //editForm: any;

  mediaId!: number;
  form: any = [];
  SelectedControllerId: any;
  item: any;
  tile: any;
  minDate: any;
  name: string;
  cronExpression: any;
  submitting: boolean = false;
  label2: string = "Select Media Player";
  selectedMediaPlaylist: any = [];
  currentTile: number = -1;
  mediauploadtype: string;
  _inputVmsData: any;
  MediaName: string;
  _inputPlayerData: any = [];
  listOfMedialist: any = [];
  selectedMediaId: any = [];
  _request: any = new InputRequest();
  rows: any[];
  selectedMediaPlayerId: number | null = null;
  vmsid: number;
  FileTypes: any[];
  playersIds: any[] = [];
  inputVmsData: any;
  ShowSaveBtn: boolean = false;
  rowCount: number;
  dropdownSettingsVms: any;

  constructor(
    private fb: FormBuilder,
    private _toast: ToastrService,
    private global: Globals,
    private _media: MediaFacadeService,
    private adminFacade: AdminFacadeService,
    private _router: Router,
    private formBuilder: FormBuilder,
    private _ActivatedRoute: ActivatedRoute,
    private _CVMSfacade: CVMSMediaFacadeServiceService,
    private fileService: FileServiceService,
    private modalService: NgbModal,) 
    
    {
        this.FileTypes = ['Image File', 'Media Text']
        this.BuildForm();
        this.GetVmsDetails();
        this.global.CurrentPage = "Create Media Scheduler CVMS";
        this.dropdownSettingsVms = {
          singleSelection: true,
          idField: 'value',
          textField: 'displayName',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          itemsShowLimit: 5,
          allowSearchFilter: true,
        };
      }

      BuildForm() {
        this.form = this.formBuilder.group({
          globalFromDt: ["", Validators.required],
          globalFromTm: ["", Validators.required],
          globalToDt: ["", Validators.required],
          globalToTm: ["", Validators.required],
          schedulename: ['', [Validators.required, Validators.pattern("[A-Za-z0-9][A-Za-z0-9 ]*$"), this.noLeadingEndingWhitespace]],
    
          cronexpression: ['', ''],
        });
      }

  ngOnInit(): void {
    this.mediaId = Number(this._ActivatedRoute.snapshot.paramMap.get('id'));
    let _date = new Date();
    let _day = _date.getUTCDate();
    let _mon = _date.getMonth() + 1;
    let _year = _date.getFullYear();
    this.minDate = {
      year: _year,
      month: _mon,
      day: _day
    }
    this.addTile();
    this.getDataForMediaPlayer(this.mediaId);
   

  }

  BacktoList() {
    this._router.navigate(['cvms/MediaPlayerSchedulerList']);
  }
  keyPress(event: KeyboardEvent) {
    event.preventDefault();
  }
    OnSaveDetails() {
  
      if (this.SelectedControllerId == undefined || this.SelectedControllerId.length < 1) {
        this._toast.error("No controller selected. Please select at least one controller to proceed.");
        return;
      }
  
      if (this.playersIds == undefined || this.playersIds.length < 1) {
        this._toast.error("No Media Player selected. Please select at least one Media Player to proceed.");
        return;
      }
      if (this.form.valid) {
        let _vcmsmedischedulerdata = new Mediascheduler();
        let pubFromDt = this.form.controls["globalFromDt"].value;
        let pubToDt = this.form.controls["globalToDt"].value;
        let pubFromTime = this.form.controls["globalFromTm"].value;
        let pubToTime = this.form.controls["globalToTm"].value;
  
        // let globalFromDate = ("0" + pubFromDt.day).slice(-2) + ("0" + pubFromDt.month).slice(-2) + pubFromDt.year + ("0" + pubFromTime.hour).slice(-2) + ("0" + pubFromTime.minute).slice(-2) + ("0" + pubFromTime.second).slice(-2);
        // let globalToDate = ("0" + pubToDt.day).slice(-2) + ("0" + pubToDt.month).slice(-2) + pubFromDt.year + ("0" + pubToTime.hour).slice(-2) + ("0" + pubToTime.minute).slice(-2) + ("0" + pubToTime.second).slice(-2);
  
        let globalFromDate = pubFromDt.year + ("0" + pubFromDt.month).slice(-2) + ("0" + pubFromDt.day).slice(-2) + ("0" + pubFromTime.hour).slice(-2) + ("0" + pubFromTime.minute).slice(-2) + ("0" + pubFromTime.second).slice(-2);
        let globalToDate = pubToDt.year + ("0" + pubToDt.month).slice(-2) + ("0" + pubToDt.day).slice(-2) + ("0" + pubToTime.hour).slice(-2) + ("0" + pubToTime.minute).slice(-2) + ("0" + pubToTime.second).slice(-2);
  
        const year = parseInt(globalFromDate.substring(0, 4), 10);
        const month = parseInt(globalFromDate.substring(4, 6), 10) - 1; // Month is 0-indexed in JavaScript Date
        const day = parseInt(globalFromDate.substring(6, 8), 10);
        const hours = parseInt(globalFromDate.substring(8, 10), 10);
        const minutes = parseInt(globalFromDate.substring(10, 12), 10);
        const seconds = parseInt(globalFromDate.substring(12, 14), 10);
  
        const date = new Date(year, month, day, hours, minutes, seconds);
  
  
        const dayFormatted = date.getDate().toString().padStart(2, '0');
        const monthFormatted = (date.getMonth() + 1).toString().padStart(2, '0'); // Add 1 because getMonth() is 0-indexed
        const yearFormatted = date.getFullYear();
        const hoursFormatted = date.getHours().toString().padStart(2, '0');
        const minutesFormatted = date.getMinutes().toString().padStart(2, '0');
  
  
        const year1 = parseInt(globalToDate.substring(0, 4), 10);
        const month1 = parseInt(globalToDate.substring(4, 6), 10) - 1; // Month is 0-indexed in JavaScript Date
        const day1 = parseInt(globalToDate.substring(6, 8), 10);
        const hours1 = parseInt(globalToDate.substring(8, 10), 10);
        const minutes1 = parseInt(globalToDate.substring(10, 12), 10);
        const seconds1 = parseInt(globalToDate.substring(12, 14), 10);
  
        const date1 = new Date(year1, month1, day1, hours1, minutes1, seconds1);
  
  
        const dayFormatted1 = date1.getDate().toString().padStart(2, '0');
        const monthFormatted1 = (date1.getMonth() + 1).toString().padStart(2, '0'); // Add 1 because getMonth() is 0-indexed
        const yearFormatted1 = date1.getFullYear();
        const hoursFormatted1 = date1.getHours().toString().padStart(2, '0');
        const minutesFormatted1 = date1.getMinutes().toString().padStart(2, '0');
  
  
        let jsonfromdate = dayFormatted + "/" + monthFormatted + "/" + yearFormatted + " " + hoursFormatted + ":" + minutesFormatted;
        let jsontodate = dayFormatted1 + "/" + monthFormatted1 + "/" + yearFormatted1 + " " + hoursFormatted1 + ":" + minutesFormatted1;
  
        // const todate = new Date(todateString);
  
        let displayid = this.playersIds[0].value
        let displayName = this.playersIds[0].displayName;
  
        let _requestTextData = {
          "mediaPlayerId": displayid,
          "mediaPlayerName": displayName, //this.form.controls["mediaplayername"].value,
          "name": this.form.controls["schedulename"].value,
          "fromDate": jsonfromdate,
          "toDate": jsontodate,
          "cronExpression": "* * * * *",
        }
        _vcmsmedischedulerdata.IpAddress = this.SelectedControllerId[0];
        _vcmsmedischedulerdata.VmsId = Number.parseInt(this.SelectedControllerId[1]);
        _vcmsmedischedulerdata.RequestData = JSON.stringify(_requestTextData);
        _vcmsmedischedulerdata.CreationTime = new Date();
        _vcmsmedischedulerdata.IsAudited = true;
        _vcmsmedischedulerdata.AuditedBy = "System";
        _vcmsmedischedulerdata.AuditedTime = new Date();
        _vcmsmedischedulerdata.status = 0;
        _vcmsmedischedulerdata.Reason = "Create Media Scheduler";
        _vcmsmedischedulerdata.requesttype="/mediaSchedule/createMediaPlayerScheduler";
  
  
        this._CVMSfacade.SaveMediaScheduler(_vcmsmedischedulerdata).pipe(catchError((err) => {
          this._toast.error("Error occured while saving data for " + err);
          throw err;
        })).subscribe(data => {
          if (data == 0) {
            this._toast.error("Error occured while saving data for " + _vcmsmedischedulerdata.IpAddress);
          }
          else {
  
            this._toast.success("Saved successfully for " + _vcmsmedischedulerdata.IpAddress);
            this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this._router.navigate(['cvms/MediaPlayerSchedulerList']);
            });
          }
        })
      }
      else {
        this._toast.error("Error occured while saving data. Please select Input Values.");
      }
    }
    ValidateTime() {
        console.log(this.form);
        let FromDt = this.form.controls["globalFromDt"].value;
        let ToDt = this.form.controls["globalToDt"].value;
        let FromTime = this.form.controls["globalFromTm"].value;
        let ToTime = this.form.controls["globalToTm"].value;
        let globalFromDate = FromDt.year + ("0" + FromDt.month).slice(-2) + ("0" + FromDt.day).slice(-2) + ("0" + FromTime.hour).slice(-2) + ("0" + FromTime.minute).slice(-2) + ("0" + FromTime.second).slice(-2);
        let globalToDate = ToDt.year + ("0" + ToDt.month).slice(-2) + ("0" + ToDt.day).slice(-2) + ("0" + ToTime.hour).slice(-2) + ("0" + ToTime.minute).slice(-2) + ("0" + ToTime.second).slice(-2);
    
        if (Number(globalFromDate) >= Number(globalToDate)) {
          this._toast.error("Invalid DateTime selected From Date and To Date Or From Date Should be greater than Current Date");
          this.form.patchValue({
            globalFromDt: "",
            globalToDt: "",
            globalFromTm: "",
            globalToTm: ""
          })
        }
      }

      getErrorMessage(_controlName: any, _controlLable: any, _isPattern: boolean = false, _msg: string) {
        return getErrorMsg(this.form, _controlName, _controlLable, _isPattern, _msg);
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
            this.inputVmsData = _data;
          }
        });
      }
      getSelectedPlayer(eve: any, type: any) {
        if (eve.length > 0) {
          if (type == 1) {
            eve.forEach((vms: any) => {
              this.playersIds = [];
              this.playersIds.push(vms);
            });
          }
          else {
            eve.forEach((ele: any) => {
              var idx = 0;
              this.playersIds.forEach(element => {
                if (element.value == eve.value) {
                  this.playersIds.splice(idx, 1);
                }
                idx++;
              });
            });
          }
        }
        else if (eve.length == 0)
          this.playersIds = [];
        else {
          if (type == 1) {
            this.playersIds = [];
            this.playersIds.push(eve);
          }
          else {
            var idx = 0;
            this.playersIds.forEach(element => {
              //this.playersIds.splice(idx, 1);
              if (element.value == eve.value) {
                this.playersIds.splice(idx, 1);
              }
              idx++;
            });
          }
        }
      }
      getMediaPlayerList() {

        let _vmsIpAdd = this.SelectedControllerId[0];
        this._inputPlayerData = [];
        this._CVMSfacade.getMediaPlayerByIpAdd(_vmsIpAdd).subscribe(res => {
          if (res != null) {
            if (res.length > 0) {
              let commonList: CommonSelectList[] = [];
              res.forEach((ele: any) => {
                let _responseId = ele.responseId;
                let _data = JSON.parse(ele.requestData);
                var _commonSelect = new CommonSelectList();
                _commonSelect.displayName = _data.name;
                _commonSelect.value = _responseId;
                commonList.push(_commonSelect);
              });
              let _data = {
                data: commonList,
                disabled: false
              }
              this._inputPlayerData = _data;
            }
          }
        })
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
        this._toast.error('No data found for the selected media player.');
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

  get f() { return this.form.controls; }

  Getting_id(): void {
    if (!this.selectedMediaPlayerId) {
      this.toast.error("No media player ID found. Cannot update.");
      return;
    }
    this.OnSavePlaylistDetails(this.selectedMediaPlayerId);
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

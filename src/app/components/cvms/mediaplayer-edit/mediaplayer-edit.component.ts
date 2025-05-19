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
import { Mediaplayer, mediaPlayerSave, MediaPlayerTiles, mpPlaylist } from 'src/app/models/vcms/mediaplayer';
import { CVMSMediaModalComponent } from '../cvmsmedia-modal/cvmsmedia-modal.component';
import { getErrorMsg } from 'src/app/utils/utils';
import { ToastrService } from 'ngx-toastr';
import { FileServiceService } from 'src/app/facade/services/vcms/file-service.service';
import { CommonSelectList } from 'src/app/models/common/cmSelectList';
import { InputRequest } from 'src/app/models/request/inputReq';

declare var $: any;
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

  url: string = "";
  
  format: string = "";
  fileName: string = "";

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
    this.global.CurrentPage = "Media Player Management";
  }

  ngOnInit(): void {
    this.addTile();
    this.mediaId = Number(this._ActivatedRoute.snapshot.paramMap.get('id'));

    // this.populateFormWithData(this.getMockData()); 
    //this.getDataForMediaPlayer(this.mediaId);
    this.editForm = this.fb.group({
      name: ['', ''],
      mediaLoopCount: ['', [ Validators.pattern("[0-9][0-9]*$")]],
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

  async ViewMedia(userIndex: number, id: number) {
    const playlistArray = this.getPlaylist(userIndex); 
    const mediaName = playlistArray.at(0)?.get('mediaName')?.value;

    const filepath = playlistArray.at(0)?.get('filepath')?.value;
    const baseUrl = 'https://172.19.32.51:8025/medialists';

    // Extract folder and file name from the local path
    const parts = filepath.split('\\');
    const folderName = parts[2]; // Assuming the 3rd part is the folder name
    const fileName = parts[3];   // The last part is the file name
  
    // Construct the URL
    const url = `${baseUrl}/${folderName}/${fileName}`;
    const fileType = this.fileService.checkFileType(url);
    this.url = url
    this.fileName = mediaName
    if (fileType == "image")
      this.format = "image";
    else
      this.format = "video";
    $('#myModal').modal('show');
    $('.modal-backdrop').remove();
    //const fileType = await fileTypeFromStream(media.filePath);
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
  removeModal() {
    $('#myModal').modal('hide');

    // Remove the modal-backdrop class after the modal is closed
    $('.modal-backdrop').remove();
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
        isPlayOrder: [0],
        duration: [0],
        mediaLoopCount: [0],
        partyIdCommon: [''],
        tarrifIdCommon: [''],
        fontSizeCommon: [0],
        colorFont: [''],
        colorBg: [''],
        filepath:[''],

        // playlist: this.fb.array(tile.playlist.map((item: any) => this.fb.group({

        //   const  isVideo = item.mediaName?.toLowerCase().endsWith('.mp4'),

        //    const formGroup = this.fb.group({

        //   playOrder: [item.playOrder],
        //   imageTextDuration: [item.imageTextDuration],
        //   mediaId: [item.mediaId],
        //   mediaName: [item.mediaName],
        //   videoLoopCount: [item.videoLoopCount],
        //   partyId: [item.partyId],
        //   tarrifId: [item.tarrifId],
        //   textStyle: this.fb.group({
        //     fontSize: [item.textStyle.fontSize],
        //     fontColor: [item.textStyle.fontColor],
        //     backgroundColor: [item.textStyle.backgroundColor]



        //   })
        // })

        // if (isVideo) {
        //   formGroup.get('imageTextDuration')?.disable();
        // }
        // })))
        playlist: this.fb.array(tile.playlist.map((item: any) => {
          // Define inside the map function
          const isVideo = item.mediaName?.toLowerCase().endsWith('.mp4')||item.mediaName?.toLowerCase().endsWith('.avi')||item.mediaName?.toLowerCase().endsWith('.mkv') ;
        
          const formGroup = this.fb.group({
            playOrder: [item.playOrder],
            filepath:[item.filepath],
            imageTextDuration: [item.imageTextDuration],
            mediaId: [item.mediaId],
            mediaName: [item.mediaName],
            videoLoopCount: [item.videoLoopCount],
            partyId: [item.partyId],
            tarrifId: [item.tarrifId],
            textStyle: this.fb.group({
              fontSize: [item.textStyle.fontSize],
              fontColor: [item.textStyle.fontColor],
              backgroundColor: [item.textStyle.backgroundColor]
            })
          });
        
          // Conditionally disable the control based on isVideo
          if (isVideo) {
            formGroup.get('imageTextDuration')?.disable();
          }
        
          return formGroup;
        }))
        
      }));


      let _tileDetails = new SelectedMediaVCMS();
      _tileDetails.tileNo = tile.tileNo;
      _tileDetails.playlist = tile.playlist.map((item: any) => ({
        playOrder: item.playOrder,
        filepath:item.filepath,
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
    if (this.isSeqValidate) 
      
    {
      const ipAddress = this.editForm.controls["SelectedControllerId"].value;
      const mediaPlayerName = this.editForm.controls["name"].value;

      // Check for duplicate media player name
      // this._CVMSfacade.CheckDuplicateMediaPlayerName(mediaPlayerName, ipAddress).subscribe(data => {
      //   if (data === 1) {
      //     this.toast.error("Media Player Name already exists in the System.");
      //     this.editForm.setErrors({ duplicateName: true });
      //     return;
      //   }
    
      const tiles = this.editForm.controls['tiles'];
      const tileCount = tiles.length;

      if (tileCount === 0) 
      {
        this.toast.error("At least one playlist must be created to set up the media player.");
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
      this.RemovePlaylist();
      if (!this.editForm.valid) {
        this.toast.error("There was a problem saving your data. Please review your input for any errors.");
        return;
      }


      // Create and populate Mediaplayer obje
                let _newPlayer = new mediaPlayerSave();
                _newPlayer.controllerName = ipAddress;
                _newPlayer.mediaLoopCount = this.editForm.controls["mediaLoopCount"].value;
                _newPlayer.name = this.editForm.controls["name"].value;
          
                let tileLength = this.editForm.controls.tiles.controls.length;
                let _playerArray :any[]=[];
                for (var i = 0; i < tileLength; i++) {
                  let _plArray : any[]=[];
                  let _tiles = new MediaPlayerTiles();
                  _tiles.playlistLoopCount = this.editForm.controls.tiles.controls[i].controls.playlistLoopCount.value;
                  _tiles.tileNo = this.editForm.controls.tiles.controls[i].controls.tileNo.value;
                  let plLength = this.editForm.controls.tiles.controls[i].controls.playlist.length;
                  for (var j = 0; j < plLength; j++) {
                    let plData = new mpPlaylist();
                    plData.playOrder = this.editForm.controls.tiles.controls[i].controls.playlist.controls[j].controls.playOrder.value;
                    plData.imageTextDuration = this.editForm.controls.tiles.controls[i].controls.playlist.controls[j].controls.imageTextDuration.value;
                    plData.mediaId = this.editForm.controls.tiles.controls[i].controls.playlist.controls[j].controls.mediaId.value;
                    plData.mediaName = this.editForm.controls.tiles.controls[i].controls.playlist.controls[j].controls.mediaName.value;
                    plData.partyId = this.editForm.controls.tiles.controls[i].controls.playlist.controls[j].controls.partyId.value;
                    plData.tarrifId = this.editForm.controls.tiles.controls[i].controls.playlist.controls[j].controls.tarrifId.value;
                    plData.videoLoopCount = this.editForm.controls.tiles.controls[i].controls.playlist.controls[j].controls.videoLoopCount.value;
                   // plData.filesize = this.editForm.controls.tiles.controls[i].controls.playlist.controls[j].controls.filesize.value;
                    plData.filepath = this.editForm.controls.tiles.controls[i].controls.playlist.controls[j].controls.filepath.value;
                    plData.textStyle = {
                      fontSize : this.editForm.controls.tiles.controls[i].controls.playlist.controls[j].controls.textStyle.controls['fontSize'].value,
                      fontColor : this.editForm.controls.tiles.controls[i].controls.playlist.controls[j].controls.textStyle.controls['fontColor'].value,
                      backgroundColor : this.editForm.controls.tiles.controls[i].controls.playlist.controls[j].controls.textStyle.controls['backgroundColor'].value
                    }
          
                    _plArray.push(plData);
                  }
                  _tiles.playlist = _plArray;
                  _playerArray.push(_tiles);
                }
                _newPlayer.tiles = _playerArray;










      // Create and populate Mediaplayer object
      const mediaPlayerData = new Mediaplayer();
      mediaPlayerData.VmsId = this.vmsid;
      mediaPlayerData.IpAddress = ipAddress;
      mediaPlayerData.mediaplayername = mediaPlayerName;
      mediaPlayerData.status = 0;
      mediaPlayerData.AuditedBy = "System";
      mediaPlayerData.IsAudited = true;
      mediaPlayerData.AuditedTime = new Date();
      mediaPlayerData.Reason = "Upload Data for new MediaPlayer";
      mediaPlayerData.CreationTime = new Date();
      mediaPlayerData.RequestData = JSON.stringify(_newPlayer);
      mediaPlayerData.RequestType = "/mediaPlayer/createMediaPlayerAndPlaylist";
      mediaPlayerData.id=this.mediaId;

      // sending a copy
      let body = {
        "searchItem": "",
        "pageSize": 0,
        "currentPage": 0,
        "startId": 0,
        "cachekey": "string"
      }
      this._CVMSfacade.getMediaPlayerById(this.mediaId, body).subscribe(response => {
  
        const data = response.data[0];
  
        if (data) 
          
        {
          
          let data2=JSON.parse(JSON.stringify(data));
          let requestDataObj = JSON.parse(data.requestData);
          let responseid=data.responseId
          let ipadd=data.ipAddress
          requestDataObj.name = requestDataObj.name + "_01";
          data.requestData = JSON.stringify(requestDataObj);
          delete data.id;

          this._CVMSfacade.SaveMediaPlayer(data).subscribe(data => {
          if (data === 0) 
            {
              this.toast.error(`Error occurred while creating copy for ${mediaPlayerData.IpAddress}`);
              return;
            } 
          else
            {  
               this._CVMSfacade.DeleteMediaPlayerFromController(responseid,ipadd).subscribe(data => {
               if (data === 1) 
               {  
                let requestDataObj = JSON.parse(data2.requestData);
                let name = requestDataObj.name + "_01";
                let requestDataObj2= {"mediaPlayerId":responseid,"mediaPlayerName":name}              
                data2.requestData = JSON.stringify(requestDataObj2);
                delete data2.id;
                data2.RequestType="/mediaPlayer/deleteMediaPlayer";

                this._CVMSfacade.SaveMediaPlayer(data2).subscribe(data => {
                  if (data === 0) 
                  {
                    this.toast.error(`Player deleted : no request for delete in table.`);
                    return;
                  } 
                  else
                  {
                    this._CVMSfacade.UpdateMediaPlayer(mediaPlayerData).subscribe(data => {
                      if (data === 0) 
                      {
                        this.toast.error(`Error occurred while updating data for ${mediaPlayerData.IpAddress}`);
                        return;
                      } 
                      else 
                      {
                        this.toast.success(`Saved successfully for ${mediaPlayerData.IpAddress}`);
                        this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                        this._router.navigate(['cvms/createMediaPlayerAndPlaylist']);});
                      }
                      });
                  } 
                       
          
          
                      });
                }
                else
                {
                  this.toast.error(`Error occured in deleting the original player from the controller`);
                  return;

                }
                    
                    });
            }
                });
               
  
        } 
        else 
        {
          this.toast.error('No data found for the selected media player.');
        }
      }, error => {
        this.toast.error('Error fetching data.');
      });


    }
    else 
    {
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
      playlistLoopCount: ['', [ Validators.pattern("[0-9][0-9]*$")]],
      playlist: this.fb.array([])
    });
  }

  createUser(): FormGroup {
    let len = this.editForm.controls['tiles'].length;
    return this.fb.group({
      tileNo: [(len+1), [Validators.required, Validators.pattern("[1-999][1-999]*$")]],
      isPlayOrder: [0 , [Validators.required]],
      duration: [0 , [Validators.required]],
      mediaLoopCount: [0],
      partyIdCommon: [''],
      tarrifIdCommon: [''],
      fontSizeCommon: [0],
      //playlistLoopCount: ['', ''],
      playlistLoopCount: ['', [ Validators.pattern("[0-9][0-9]*$")]],
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
      
    const val = event.target.value;

    if (val === '') {
     
      return;
    }

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
        _plMedia.imageTextDuration = this.selectedMediaId[0][i].mediaDetails.duration;
        _plMedia.mediaId = this.selectedMediaId[0][i].resposneId;
        _plMedia.mediaName = this.selectedMediaId[0][i].mediaDetails.displayname;
        _plMedia.playOrder = this.selectedMediaId[0][i].mediaDetails.playOrder;
        _plMedia.videoLoopCount = this.selectedMediaId[0][i].mediaDetails.videoLoopCount;
        _plMedia.textStyle = _textStyle;
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
        if (this.selectedMediaId[0][i].fileType == "TEXT") {
          let _textStyle2 = {
            "fontSize": 20,
            "fontColor": "#ffffff",
            "backgroundColor": "#000000"
          }
          _plMedia.textStyle = _textStyle2;
        }
        else{
          _plMedia.textStyle = _textStyle;
        }

      }
     
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
        fontSize: [ele.textStyle?.fontSize ?? 0],
        fontColor: [ele.textStyle?.fontColor ?? ''],
        backgroundColor: [ele.textStyle?.backgroundColor ?? '']
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
      filepath :[ele.filepath,''],
      mediaId: [ele.mediaId, ''],
      mediaName: [ele.mediaName, ''],
      videoLoopCount: [ele.videoLoopCount],
      partyId: ['', Validators.required],
      tarrifId: ['', Validators.required],
      textStyle: this.fb.group({
        fontSize: [ele.textStyle?.fontSize ?? 0],
        fontColor: [ele.textStyle?.fontColor ?? ''],
        backgroundColor: [ele.textStyle?.backgroundColor ?? '']
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

  RemovePlaylist(){
//     let _vcmsuploadmediadata = new Mediaplayer();

//     _vcmsuploadmediadata.controllerName = this.editForm.controls["controllerName"].value;
//    // _vcmsuploadmediadata.IpAddress = this.vmsIds[0];

//     _vcmsuploadmediadata.IpAddress = this.editForm.controls["controllerName"].value;
//     _vcmsuploadmediadata.VmsId=this.editForm.controls["vmsId"].value;

//    // _vcmsuploadmediadata.VmsId = Number.parseInt(this.vmsId[0]);

//     _vcmsuploadmediadata.status = 0;
//     _vcmsuploadmediadata.AuditedBy = "System";
//     _vcmsuploadmediadata.IsAudited = true;
//     _vcmsuploadmediadata.AuditedTime = new Date();
//     _vcmsuploadmediadata.Reason = "Upload Data for test";
//     //_vcmsuploadmediadata.createddate = new Date();
//     _vcmsuploadmediadata.CreationTime = new Date();
//     _vcmsuploadmediadata.RequestType ="/mediaPlayer/deleteMediaPlayer"
//     _vcmsuploadmediadata.medianame=element.mediaName;
   
//     let requestData2 = JSON.parse(element.requestData); // Parse requestData from element
//     let mediaName = requestData2.name;
//     let requestData = {
//      mediaPlayerId: element.responseId,
//      mediaPlayerName: mediaName
   
//    };
//    _vcmsuploadmediadata.RequestData = JSON.stringify(requestData);
//      // _vcmsuploadmediadata.RequestData = JSON.stringify(_requestTextData);
    


//     this.mediaFacade.SaveMediaPlayer(_vcmsuploadmediadata).subscribe(data => {
//       if (data == 0) {
//         this.toast.error("Error occured while saving data for ");
//       }
//       else {
//        this.listOfMediaUpload = this.listOfMediaUpload.filter((media: any) => media.id !== element.id);



//  this.toast.success("Data deleted successfully ");

 
//   this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
//    this._router.navigate(['cvms/createMediaPlayerAndPlaylist']);
//   });
//       }
//     });
  }


  ToAllDuration(idx: number) {
    const val = this.editForm.controls['tiles'].controls[idx].get('duration')?.value;
    const playlistArray = this.getPlaylist(idx);
  
    playlistArray.controls.forEach((ele: any) => {
      const mediaName: string = ele.get('mediaName')?.value || '';
      if(!mediaName.toLowerCase().endsWith('.mp4') && !mediaName.toLowerCase().endsWith('.avi') && !mediaName.toLowerCase().endsWith('.mkv')) 
      {
        ele.patchValue({ imageTextDuration: val });
      }
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
}

import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminFacadeService } from 'src/app/facade/facade_services/admin-facade.service';
import { CommonSelectList } from 'src/app/models/common/cmSelectList';
import { InputRequest } from 'src/app/models/request/inputReq';
import { getErrorMsg } from 'src/app/utils/utils';
import { CVMSMediaModalComponent } from '../cvmsmedia-modal/cvmsmedia-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlaylistMedia, SelectedMediaVCMS } from 'src/app/models/vcms/selectedMedia';

@Component({
  selector: 'app-media-player-cvms',
  templateUrl: './media-player-cvms.component.html',
  styleUrls: ['./media-player-cvms.component.css']
})
export class MediaPlayerCvmsComponent {

  currentTile: number = -1;
  registrationForm: FormGroup;
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

  constructor(private fb: FormBuilder,
    private adminFacade: AdminFacadeService,
    private modalService: NgbModal,) { }

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      name: '',
      mediaLoopCount: '0',
      tiles: this.fb.array([])
    });
    this.GetVmsDetails();
  }

  // Function to create a single user form group
  createUser(): FormGroup {
    return this.fb.group({
      tileNo: ['', Validators.required],
      playlistLoopCount: ['', [Validators.required, Validators.pattern("[0-9][0-9]*$")]],
      playlist: this.fb.array([])
    });
  }

  createPlaylist(): FormGroup {
    return this.fb.group({
      playOrder: ['', [Validators.required]],
      imageTextDuration: ['0', [Validators.required]],
      mediaId: ['0', Validators.required],
      mediaName: ['', [Validators.required]],
      videoLoopCount: ['0', [Validators.required]],
      textStyle: [{}, Validators.required]
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

  // Get the form array
  get userDetails(): FormArray {
    return this.registrationForm.get('tiles') as FormArray;
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
    this.selectedMediaPlaylist.splice(index,1);
  }

  // Submit the form
  onSubmit(): void {
    if (this.registrationForm.valid) {
      console.log(this.registrationForm.value);
    }
  }
  getPlaylist(userIndex: number): FormArray {
    return (this.userDetails.at(userIndex).get('playlist') as FormArray);
  }
  ShowMediaPopup(type: string,idx : number) {
    const modalRef = this.modalService.open(CVMSMediaModalComponent, { ariaLabelledBy: 'modal-basic-title', size: 'xl' });
    if (type == "Media") {
      this.mediauploadtype = "media";
      let _reqdata = { "action": "view", urls: [], modalType: "mediaupload", content: this.listOfMedialist, _crrTile: this.currentTile };
      modalRef.componentInstance.data = _reqdata;
      modalRef.componentInstance.selectedId.subscribe((selectedId: any) => {
        //console.log(selectedId);
        this.selectedMediaId.push(selectedId);
        //console.log(this.selectedMediaId);
        this.ShowTables(idx);
      })

    }
    else {
      let _reqdata = { "action": "view", urls: [], modalType: "textupload", content: this.listOfMedialist, _crrTile: this.currentTile };
      this.mediauploadtype = "text";
      modalRef.componentInstance.data = _reqdata;
      modalRef.componentInstance.selectedId.subscribe((selectedId: any) => {
        //console.log(selectedId);
        this.selectedMediaId.push(selectedId);
        this.ShowTables(idx);
      })

    }
    //this.ShowSaveBtn = true;
  }

  ShowTables(idx:number) {
    this.generateRows(idx);

  }
  generateRows(idx:number) {
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
      _plMedia.imageTextDuration = this.selectedMediaId[0][i].imageTextDuration;
      _plMedia.mediaId = this.selectedMediaId[0][i].id;
      _plMedia.mediaName = this.selectedMediaId[0][i].fileName;
      _plMedia.playOrder = this.selectedMediaId[0][i].playOrder;
      _plMedia.videoLoopCount = this.selectedMediaId[0][i].videoLoopCount;
      _plMedia.textStyle = _textStyle;
      _plMediaList.push(_plMedia);

    }

    this.selectedMediaId = [];
    this.selectedMediaPlaylist[idx].playlist = _plMediaList;
    this.selectedMediaPlaylist[idx].playlist.forEach((ele: any) => {
      playlistArray.push(this.fb.group({
        playOrder: [ele.playOrder, [Validators.required]],
        imageTextDuration: [ele.imageTextDuration, [Validators.required]],
        mediaId: [ele.mediaId, Validators.required],
        mediaName: [ele.mediaName, [Validators.required]],
        videoLoopCount: [ele.videoLoopCount, [Validators.required]],
        textStyle: [ele.textStyle, Validators.required]
      }));
    });
    console.log(this.selectedMediaPlaylist);
  }

  RemoveRow(userIndex: number, id: number) {
    const playlistArray = this.getPlaylist(userIndex);  // Get the specific playlist FormArray for the user
    playlistArray.removeAt(id);
    this.selectedMediaId.splice(id, 1);
  }
}

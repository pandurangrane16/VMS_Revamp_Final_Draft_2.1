import { AfterViewInit, Component, ElementRef, EventEmitter, Injectable, Input, OnDestroy, Output, Renderer2, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct, NgbModal, NgbTimeStruct, NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import Stepper from 'bs-stepper';
import * as $ from 'jquery';
import { Globals } from 'src/app/utils/global';
import { getErrorMsg } from 'src/app/utils/utils';
import { ToastrService } from 'ngx-toastr';
import { MediaFacadeService } from 'src/app/facade/facade_services/media-facade.service';
import { MediaDetails, MediaDuration, PlBlMdDetails, PlaylistMaster } from 'src/app/models/media/PlaylistMaster';
import { Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CmMediaModalComponent } from 'src/app/widget/cm-media-modal/cm-media-modal.component';
import { CommonFacadeService } from 'src/app/facade/facade_services/common-facade.service';
import { BlockDetails } from 'src/app/models/media/BlockDetails';
import { ConfirmationDialogService } from 'src/app/facade/services/confirmation-dialog.service';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from 'src/app/facade/services/common/session.service';
//import 'rxjs/add/operator/filter';
/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {
  readonly DELIMITER = '-';

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10),
      };
    }
    return null;
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : null;
  }
}

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
  readonly DELIMITER = '/';
  active = 1;
  activeNav: number = 1;
  parse(value: string): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10),
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : '';
  }
}
@Component({
  selector: 'app-playlist-configure',
  templateUrl: './playlist-configure.component.html',
  styleUrls: ['./playlist-configure.component.css']
})
export class PlaylistConfigureComponent implements OnDestroy, AfterViewInit {
  tarrifDetails: any[] = [];
  status: number = 0;
  partyDetails: any[] = [];
  items:any;
  @ViewChild("table", { static: false }) table: any;
  plid: number = 0;
  seqData: any[] = [];
  dataSource: MediaDetails[];
  plBlData: any[] = [];
  searchText: string = "";
  alignlist: any = [];
  nodeLeft: number;
  nodeTop: number;
  nodeHeight: number;
  nodeWidth: number;
  widthtxt: number = 500;
  currentBlock: number = 1;
  heighttxt: number = 500;
  nodeDetails: any = [];
  isCollide: boolean = false;
  active = 1;
  isActive: boolean = true;
  submitted = false;
  isCompleted = false;
  model2!: string;
  model3!: string;
  blockNo: number = 1;
  time: NgbTimeStruct = { hour: 24, minute: 0, second: 0 };
  time2: NgbTimeStruct = { hour: 24, minute: 0, second: 0 };
  seconds = true;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  form!: FormGroup;
  disabled = false;
  ShowFilter = false;
  limitSelection = false;
  //   selectedItems:Array<any> = [];
  dropdownSettings: IDropdownSettings = {};
  zones: Array<any> = [];
  vms: Array<any> = [];
  url: any;
  clicked = false;
  undoClicked = false; isView: boolean = false; isCopy: boolean = false;
  // appendedHtml: string = '<div><b>this appended html</b></div>';
  @ViewChild('resizeDragDiv') div!: ElementRef<HTMLDivElement>;
  @ViewChild('resizeDragDiv2') div2!: ElementRef<HTMLDivElement>;
  edge = {
    top: true,
    bottom: true,
    left: true,
    right: true,
  };
  stepper: Stepper;
  inBounds = true;
  mainTextDetails: any[] = [];
  mainMediaDetails: any[] = [];
  textDetails: any[] = [];
  mediaDetails: any[] = [];
  selectedMedia: any[] = [];
  constructor(public activeModal: NgbActiveModal,
    public router: Router,
    public route: ActivatedRoute,
    private config: NgbTimepickerConfig,
    private fb: FormBuilder,
    private global: Globals,
    private toast: ToastrService,
    private _media: MediaFacadeService,
    private modalService: NgbModal,
    private _common: CommonFacadeService,
    private _session: SessionService
  ) { config.seconds = true; config.spinners = false; this.global.CurrentPage = "Playlist Configuration" }

  ngAfterViewInit(): void {

  }

  name = 'Angular';

  next() {
    this.stepper.next();
  }

  onSubmit() {
    return false;
  }
  position: any;


  newPosition(event: any) {
    console.log(event);
    const boundingRect = event.currentTarget.getBoundingClientRect();
    const element = event.currentTarget;

    // const x = event.pageX - boundingRect.left;
    const x = element.offsetLeft;
    const y = element.offsetTop;

    this.position = "(" + x + ", " + y + ")";
    console.log(boundingRect);
  }
  getErrorMessage(_controlName: any, _controlLable: any, _isPattern: boolean = false, _msg: string) {
    return getErrorMsg(this.form, _controlName, _controlLable, _isPattern, _msg);
  }
  get f() { return this.form.controls; }
  ngOnInit() {
    this.isView = false;
    this.form = this.fb.group({
      playlistName: ['', Validators.required],
      height: ['', Validators.required],
      width: ['', Validators.required],
      isActive: [false, Validators.required],
    });
    this.stepper = new Stepper(document.querySelector('#stepper1') as HTMLElement, {
      linear: false,
      animation: true
    });
    this.CheckOperationType();
    this.GetTarrifDetails();
    this.GetPartyDetails();
  }
  StepNext(step: number) {
    if (step == 0) {
      if (this.ValidationCheck(0)) {
        this.heighttxt = this.form.controls["height"].value;
        this.widthtxt = this.form.controls["width"].value;
        var _master = new PlaylistMaster();
        _master.id = 0;
        _master.isActive = this.form.controls["isActive"].value;
        _master.createdBy = this.global.UserCode;
        _master.height = this.form.controls["height"].value;
        _master.width = this.form.controls["width"].value;
        _master.playlistName = this.form.controls["playlistName"].value;
        _master.status = 0;

        if (this.isView != true) {
          if (this.isCopy != true) {
            let node = {
              id: 1,
              maxheight: this.heighttxt,
              maxwidth: this.widthtxt,
              height: 0,
              width: 0,
              left: 0,
              top: 0
            }
            this.nodeDetails.push(node);
            this.nodeHeight = 50;
            this.nodeWidth = 50;
            this.nodeTop = 0;
            this.nodeLeft = 0;
            this.nodeDetails[0].maxheight = this.heighttxt;
            this.nodeDetails[0].maxWidth = this.widthtxt;
            this.nodeDetails[0].height = 50;
            this.nodeDetails[0].width = 50;
          }
          this.ValidatePlaylistName(_master);
        }
        if (this.isCopy == true) {
          this.form.patchValue({ playlistName: "" });
          this.ValidatePlaylistName(_master);
          this.GetplBlData();
        }
        else
          this.stepper.next();
      }
    }
    else if (step == 1) {
      if (this.isView == true) {
        this._media.getSelectedMedia(this.plid).subscribe(res => {
          this.selectedMedia = [];
          this.textDetails = [];
          res.forEach((element: any) => {
            if (element != null) {
              var _ele = {
                id: element.id,
                fileName: element.displayName,
                isChecked: true
              }
              this.mediaDetails.push(_ele);
            }
          });

          this._media.getSelectedText(this.plid).subscribe(res => {
            this.selectedMedia = [];
            res.forEach((element: any) => {
              if (element != null) {
                var _ele = {
                  id: element.id,
                  textContent: element.textContent,
                  isChecked: true
                }
                this.textDetails.push(_ele);
              }
            });
          });
        });
      } else {

        this.getMediaDetails();
      }
      this.stepper.next();
    }
    else if (step == 2) {
      if (this.isView == true) {
        this.dataSource = [];
        this.GetplBlData();
      }
      else {
        if (this.selectedMedia.length > 0) {
          if (this.isCopy == true) {
            //this.dataSource = [];
            this.form.patchValue({ playlistName: "" });
            this.selectedMedia.forEach(ele => {
              ele.fileName = ele.displayName;
              if(ele.fileName != undefined)
                this.dataSource.push(ele);
            });
          }
          else
            this.dataSource = this.selectedMedia;
          console.log(this.dataSource);
        }
        else
          this.toast.error("Media not selected", "Error", { positionClass: "toast-bottom-right" });
      }

      this.stepper.next();
    }
    else if (step == 3) {
      if (this.isView != true) {
        if (this.nodeDetails.length > 0) {
          var data: BlockDetails[] = [];
          this.nodeDetails.forEach(
            (node: any) => {
              let block = new BlockDetails();
              block.blockNo = node.id;
              block.height =
                Math.round(node.height) < 0 ? 0 : Math.round(node.height);
              block.id = 0;
              block.blLeft =
                Math.round(node.left) < 0 ? 0 : Math.round(node.left);
              block.playlistid = this.plid;
              block.blTop = Math.round(node.top) < 0 ? 0 : Math.round(node.top);
              block.width =
                Math.round(node.width) < 0 ? 0 : Math.round(node.width);
              data.push(block);
            });
          this._media.addBlockDetails(data).subscribe(res => {
            if (res != undefined && res != null) {
              console.log("Block Saved Successfully.");
              this.changeSequence();
              var r = this.ValidationCheck(3);
              if (r) {
                let type = 0;
                if (this.isCopy == true)
                  type = 1;
                this.plBlData = [];
                let res: boolean = false;
                for (var i = 0; i < this.dataSource.length; i++) {
                  let _pl = new PlBlMdDetails();
                  this.dataSource[i].seqNo = i + 1;
                  _pl.blId = this.dataSource[i].block;
                  _pl.duration = this.dataSource[i].duration;
                  _pl.effectIn = 0;
                  _pl.effectOut = 0;
                  if (this.isCopy == true)
                    _pl.mdId = this.dataSource[i].mdId;
                  else
                    _pl.mdId = this.dataSource[i].id;
                  _pl.partyId = this.dataSource[i].party;
                  _pl.tarrifId = this.dataSource[i].tarrif;
                  _pl.plId = this.plid;
                  _pl.sequenceNo = this.dataSource[i].seqNo;
                  _pl.mdType = this.dataSource[i].mdType;
                  //_pl.mediaName = this.plid + "_" + this.dataSource[i].seqNo + ".avi";
                  _pl.mediaName = this.dataSource[i].displayName;
                  if (_pl.duration == undefined || _pl.duration == "0" || _pl.duration == "") {
                    res = true;
                    this.dataSource[i].duration = ""; 
                    break;
                  } else if (_pl.tarrifId == undefined || _pl.tarrifId == "0" || _pl.tarrifId == "") {
                    res = true;
                    this.dataSource[i].tarrif = "";
                    break;
                  } else if (_pl.partyId == undefined || _pl.partyId == "0" || _pl.partyId == "") {
                    res = true;
                    this.dataSource[i].party = "";
                    break;
                  }
                  this.plBlData.push(_pl);
                }
                if (res == false) {
                  console.log(this.plBlData);
                  this._media.addPlaylistMedia(this.plBlData, type).subscribe(res => {
                    if (res != undefined && res != null && res.length != 0) {
                      this.toast.success("Saved Successfully.");
                      this.router.navigate(['medias/playlist-creation']);
                    }
                  }, (error) => {
                    this.toast.error("Invalid data entered in fields.");
                    console.log(error);
                  });
                } else {
                  this.toast.error("Invalid data entered in fields.");
                }

              }
            }
            else {
              console.log(res);
            }
          })
        }
      }
    }
  }

  GetplBlData() {
    this.dataSource = [];
    this._media.getPlBlData(this.plid).subscribe(res => {
      if (res != null) {
        res.forEach((ele: any) => {
          ele.block = ele.blId;
          ele.fileName = ele.mediaName;
          ele.displayName = ele.mediaName;
          ele.party = ele.partyId;
          ele.tarrif = ele.tarrifId;
          ele.fileType = ele.mdType;
          this.dataSource.push(ele);
          if (this.isCopy == true) {
            var _ele = {
              id: ele.mdId,
              fileName: ele.mediaName,
              isChecked: true,
              fileType: ele.fileType
            }
            this.selectedMedia.push(_ele);
          }
        });
      }
    })
  }
  ValidationCheck(step: number) {
    if (step == 0) {
      let val = this.form.controls["playlistName"].value;
      let height = this.form.controls["height"].value;
      let width = this.form.controls["width"].value;
      if (val.trim() == "" || val == undefined) {
        this.toast.error("Invalid data in Playlist Name", "Error", { positionClass: "toast-bottom-right" });
        return false;
      }
      else if (height < 50 || width < 50) {
        this.toast.error("Height and Width values should be more than 50.", "Error", { positionClass: "toast-bottom-right" });
        return false;
      }
    }
    if (step == 3) {
      if (this.plBlData.length == 0) {
        this.toast.error("Data not found.", "Error", { positionClass: "toast-bottom-right" });
        return false;
      }
    }
    return true;
  }
  appendBlock() { }
  undoBlock() { }
  prev() {

  }
  BackToList() {
    this.router.navigate(['medias/playlist-creation']);
  }
  ResetForm(form: number) {
    if (form == 0)
      this.router.navigate(['medias/playlist-creation']);
    else if (form == 1) {
      this.form.reset();
    }
    else if (form == 2) {
      //this.nodeDetails = [];
      // this.heighttxt = this.form.controls["height"].value;
      // this.widthtxt = this.form.controls["width"].value;
      var _master = new PlaylistMaster();
      _master.id = 0;
      _master.isActive = true;
      _master.createdBy = this.global.UserCode;
      _master.height = this.heighttxt;
      _master.width = this.widthtxt;
      _master.playlistName = this.form.controls["playlistName"].value;
      _master.status = 0;
      this.nodeHeight = 50;
      this.nodeWidth = 50;
      this.nodeTop = 0;
      this.nodeLeft = 0;
      this.nodeDetails[0].maxheight = this.heighttxt;
      this.nodeDetails[0].maxWidth = this.widthtxt;
      this.nodeDetails[0].height = 50;
      this.nodeDetails[0].width = 50;
    }
    else if (form == 3) {
      this.mainMediaDetails.forEach(element => {
        element.isChecked = false;
      });
      this.mainTextDetails.forEach(element => {
        element.isChecked = false;
      });
    }
    else if (form == 4) {
      this.dataSource = [];
      this.selectedMedia = [];
    }
  }
  addNewBlock() {
    this.stepper.to(2);
    var maxId = Math.max.apply(
      Math,
      this.nodeDetails.map(function (o: any) {
        return o.id;
      })
    );
    var nextid = maxId + 1;
    if (nextid != 0) {
      var left = 0;
      var top = 0;
      if (this.nodeDetails[nextid - 2].width < this.widthtxt - 50)
        left = this.nodeDetails[nextid - 2].width;
      else left = 0;
      if (this.nodeDetails[nextid - 2].height < this.heighttxt - 50)
        top = this.nodeDetails[nextid - 2].height;
      else top = 0;
      let nd = {
        id: nextid,
        width: 50,
        height: 50,
        maxheight: this.heighttxt,
        maxWidth: this.widthtxt,
        left: 0,
        top: 0,
      };
      this.nodeDetails.push(nd);
    }

    this.currentBlock = this.currentBlock + 1;
    this.manageAllignment();
  }

  addNewMedia() {
    if(this.isCopy == true)
      this.selectedMedia = [];
    this.getMediaDetails();
    this.stepper.to(3);
    this.textDetails = this.mainTextDetails;
    this.mediaDetails = this.mainMediaDetails;
  }

  manageAllignment() {
    var collidal = 0;
    if (this.nodeDetails.length > 1) {
      for (var i = 0; i < this.nodeDetails.length; i++) {
        var _currDv = this.nodeDetails[i];
        var _currHt = _currDv.height;
        var _currWt = _currDv.width;
        var _currLeft = _currDv.left;
        var _currTop = _currDv.top;
        var _currDistFromTop = _currTop + _currHt;
        var _currDistFromLeft = _currLeft + _currWt;
        for (var j = 0; j < this.nodeDetails.length; j++) {
          var _destDistFromTop =
            this.nodeDetails[j].top + this.nodeDetails[j].height;
          var _destDistFromLeft =
            this.nodeDetails[j].left + this.nodeDetails[j].width;

          if (this.nodeDetails[i].id != this.nodeDetails[j].id) {
            if (
              _currDistFromTop < this.nodeDetails[j].top ||
              _currTop > _destDistFromTop ||
              _currDistFromLeft < this.nodeDetails[j].left ||
              _currLeft > _destDistFromLeft
            ) {
              collidal = 1;
            } else {
              collidal = 0;
              break;
            }
          }
        }
        console.log(collidal);
        if (collidal == 0) {
          this.isCollide = true;
          break;
        } else {
          this.isCollide = false;
        }
      }
    }
  }

  //Draggable Div
  onMoving(eve: any, id: number) {
    if (this.isView == true) {
      this.toast.warning("Cannot be edited while in View mode.");
      return false;
    } else {
      this.nodeLeft = eve.x;
      this.nodeTop = eve.y;
      this.nodeDetails.forEach((node: any) => {
        if (node.id == id) {
          if (eve.x < 0) {
            node.left = 0;
            this.nodeLeft = 0;
          } else {
            node.left = eve.x;
            node.top = eve.y;
          }
          if (eve.y < 0) {
            node.top = 0;
            this.nodeTop = 0;
          } else {
            node.left = eve.x;
            node.top = eve.y;
          }
        }
      });
      this.manageAllignment();
      return true;
    }
  }
  //
  //Resiable Div
  onResizing(eve: any, id: number) {
    if (this.isView == true) {
      this.toast.warning("Cannot be edited while in View mode.");
      this.nodeDetails.forEach((node: any) => {
        if (node.id == id) {
          node.height = node.height;
          node.width = node.width;
        }
      });
      return false;
    } else {
      this.nodeHeight = eve.size.height;
      this.nodeWidth = eve.size.width;
      this.nodeDetails.forEach((node: any) => {
        if (node.id == id) {
          node.height = eve.size.height;
          node.width = eve.size.width;
        }
      });
      this.manageAllignment();
      return true;
    }
  }
  //
  tabChange() { }

  getMediaDetails() {
    this._media.getAllMediaDetails().subscribe(res => {
      if (res != null && res.length > 0) {
        this.mainMediaDetails = res;
        this.mediaDetails = res;
        this.getTextDetails();
      }
      else
        this.toast.error("Failed to failed media details.", "Error", { positionClass: "toast-bottom-right" });
    }, (err) => { console.log(err) })
  }
  getTextDetails() {
    this._media.getAllTextDetails().subscribe(res => {
      if (res != null && res.length > 0) {
        this.mainTextDetails = res;
        this.textDetails = res;
      }
      else
        this.toast.error("Failed to failed text details.", "Error", { positionClass: "toast-bottom-right" });
    }, (err) => { console.log(err) })
  }

  Search() {

    let _d: any[] = [];
    this.mainMediaDetails.forEach(ele => {
      let _data = this.selectedMedia.find(x => x.id == ele.id);
      if (_data == undefined)
        ele.isChecked = false;
      if (ele.fileName.toLocaleLowerCase().includes(this.searchText.toLocaleLowerCase())) {
        _d.push(ele);
      }
    });
    this.mediaDetails = _d;

    _d = [];
    this.mainTextDetails.forEach(ele => {
      let _data = this.selectedMedia.find(x => x.id == ele.id);
      if (_data == undefined)
        ele.isChecked = false;
      if (ele.textContent.toLocaleLowerCase().includes(this.searchText.toLocaleLowerCase())) {
        _d.push(ele);
      }
    });
    this.textDetails = _d;
  }

  MediaCheck(_data: any, event: any, type: any) {
    if (type == 0) {
      _data.mdId = _data.id;
      if (_data.fileType.toLocaleLowerCase() == "video" && event.currentTarget.checked == true) {
        var _mPath = new MediaDuration();
        _mPath.path = _data.filePath;
        _data.isChecked = true;
        _data.mdType = "Video";
        this._media.getVideoDuration(_mPath).subscribe(res => {
          _data.duration = Math.round(res);
          _data.block = this.currentBlock;
          this.selectedMedia.push(_data);
        });
      }
      else if (event.currentTarget.checked == false) {
        _data.isChecked = false;
        for (var i = 0; i < this.selectedMedia.length; i++) {
          if (this.selectedMedia[i].id == _data.id)
            this.selectedMedia.splice(i, 1);
        }
      }
      else if (_data.fileType.toLocaleLowerCase() == "image") {
        _data.isChecked = true;
        _data.mdType = "Image";
        _data.block = this.currentBlock;
        this.selectedMedia.push(_data);
      }
    }
    else {
      if (event.currentTarget.checked == false) {
        _data.isChecked = false;
        for (var i = 0; i < this.selectedMedia.length; i++) {
          if (this.selectedMedia[i].id == _data.id)
            this.selectedMedia.splice(i, 1);
        }
      }
      else {
        _data.mdType = "Text";
        _data.isChecked = true;
        _data.block = this.currentBlock;
        _data.fileType = "Text";
        _data.displayName = _data.fileName;
        this.selectedMedia.push(_data);
      }
    }
  }


  dropTable(event: CdkDragDrop<any[]>) {
    var r = 1;//this.FormValidation();
    if (r == 1) {
      const prevIndex = this.selectedMedia.findIndex((d) => d === event.item.data);
      moveItemInArray(this.selectedMedia, prevIndex, event.currentIndex);
      this.table.renderRows();
      var dCurr = this.selectedMedia[event.currentIndex];
      var dPrev = this.selectedMedia[prevIndex];
      var currSeq = this.seqData[event.currentIndex];
      this.changeSequence();
    }
  }
  changeSequence() {
    this.plBlData = [];
    for (var i = 0; i < this.dataSource.length; i++) {
      let _pl = new PlBlMdDetails();
      this.dataSource[i].seqNo = i + 1;
      _pl.blId = this.dataSource[i].block;
      _pl.duration = this.dataSource[i].duration;
      _pl.effectIn = 0;
      _pl.effectOut = 0;
      _pl.mdId = this.dataSource[i].id;
      _pl.partyId = this.dataSource[i].party;
      _pl.tarrifId = this.dataSource[i].tarrif;
      _pl.plId = this.plid;
      _pl.sequenceNo = this.dataSource[i].seqNo;
      _pl.mediaName = this.plid + "_" + this.dataSource[i].seqNo + ".avi";
      this.plBlData.push(_pl);
    }
  }

  TarrifChange(ele: any, val: any, idx: number) {
    debugger;
    let i: number = 0;
    if (this.dataSource.length > 0) {
      this.dataSource.forEach((eleDta) => {
        var d = this.dataSource.filter((x) => x.id == ele.id);
        if (d.length == 0) {
          this.addAndUpdatePlBlData(ele, 6, val.target.value);
        }
        if (idx == i) {
          this.updatePlBlData(ele, 6, val.target.value, i);
        }

        i++;
      });
      // var d = this.dataSource.filter((x) => x.id == ele.id);
      // if (d.length > 0) {
      //   this.updatePlBlData(ele, 6, val.target.value, i);
      // } else {
      //   this.addAndUpdatePlBlData(ele, 6, val.target.value);
      // }
    }
  }
  PartyChange(ele: any, val: any, idx: Number) {
    let i: number = 0;
    if (this.dataSource.length > 0) {
      var d = this.dataSource.filter((x) => x.id == ele.id);
      if (d.length == 0) {
        this.addAndUpdatePlBlData(ele, 5, val.target.value);
      }
      if (idx == i) {
        this.updatePlBlData(ele, 5, val.target.value, i);
      }
      i++;
      // var d = this.dataSource.filter((x) => x.id == ele.id);
      // if (d.length > 0) {
      //   this.updatePlBlData(ele, 5, val.target.value, i);
      // } else {
      //   this.addAndUpdatePlBlData(ele, 5, val.target.value);
      // }
    }
  }

  updatePlBlData(ele: any, type: any, val: any, idx: number) {
    let i: number = 0;
    this.dataSource.forEach((eleDta) => {
      if (i == idx) {
        if (type == 1) {
          eleDta.block = val;
        } else if (type == 2) {
          eleDta.duration = val;
        } else if (type == 3) {
          eleDta.eIn = val;
        } else if (type == 4) {
          eleDta.eOut = val;
        } else if (type == 5) {
          eleDta.party = val;
        } else if (type == 6) {
          eleDta.tarrif = val;
        }
      }
      i++;
    });
    console.log(this.plBlData);
  }
  addAndUpdatePlBlData(ele: any, type: any, val: any) {
    console.log("Before add : " + this.plBlData);
    if (type == 1) {
      ele.blId = val;
      this.plBlData.push(ele);
    } else if (type == 2) {
      ele.duration = val;
      this.plBlData.push(ele);
    } else if (type == 3) {
      ele.effectIn = val;
      this.plBlData.push(ele);
    } else if (type == 4) {
      ele.effectOut = val;
      this.plBlData.push(ele);
    } else if (type == 5) {
      ele.partyId = val;
      this.plBlData.push(ele);
    } else if (type == 6) {
      ele.tarrifId = val;
      this.plBlData.push(ele);
    }

    console.log("After add : " + this.plBlData);
  }

  GetTarrifDetails() {
    let _data = { "currentPage": "0", "pageSize": "0", "startId": "0", "searchItem": null };
    this._media.getTarrifData(_data).subscribe(res => {
      this.tarrifDetails = res.data;
    });
  }

  GetPartyDetails() {
    let _data = { "currentPage": "0", "pageSize": "0", "startId": "0", "searchItem": null };
    this._media.getPartyData(_data).subscribe(res => {
      this.partyDetails = res.data;
    });
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.dataSource, event.previousIndex, event.currentIndex);
    this.changeSequence();
  }

  RemoveFromDt(_data: any, idx: number) {
    for (var i = 0; i < this.dataSource.length; i++) {
      if (i == idx) {
        this.dataSource.splice(i, 1);
        break;
      }
    }
  }

  ViewMedia(_data: any) {
    let mediaPath = this._session.getnetworkreportXview();
    if (_data.textContent != undefined && _data.textContent != "") {
      let strFilePath = mediaPath + _data.uploadSetId + "//" + _data.fileName;
      let _inputData = { "filePath": strFilePath, "fileName": _data.fileName, modalType: "playlistcreation", mediaType: "playlistcreation", "fileType": "Image", "uploadSetId": _data.uploadSetId };
      const modalRef = this.modalService.open(CmMediaModalComponent, { ariaLabelledBy: 'modal-basic-title', size: 'xl' });
      let _reqdata = { "action": "view", urls: [], modalType: "playlistcreation", content: _inputData };
      modalRef.componentInstance.data = _reqdata;
    }
    else {
      let _inputData = { "filePath": _data.filePath, "fileName": _data.fileName, modalType: "playlistcreation", mediaType: "playlistcreation", "fileType": _data.fileType, "uploadSetId": _data.uploadSetId };
      const modalRef = this.modalService.open(CmMediaModalComponent, { ariaLabelledBy: 'modal-basic-title', size: 'xl' });
      let _reqdata = { "action": "view", urls: [], modalType: "playlistcreation", content: _inputData };
      modalRef.componentInstance.data = _reqdata;
    }

  }

  onDuration(val: any, ele: any, idx: number) {
    let i: number = 0;
    this.dataSource.forEach((eleDta) => {
      // if (eleDta.id == ele.id && ele.uploadSetId == eleDta.uploadSetId) {
      //   eleDta.duration = val;
      // }
      if (i == idx) {
        eleDta.duration = val;
      }
      i++;
    });
  }

  ngOnDestroy(): void {
    this._common.setSession("playlistData", null);
  }
  isJsonString(str: string) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  CheckOperationType() {
    var data = this._common.getSession("playlistData");
    if (data?.includes(":") == true) {
      this.route.queryParams
        .subscribe(params => {
          this.status = params['status'];
          this.plid = params['plid'];
          if (params['isCopy'] == 'true') {
            this.isCopy = true;
            this.isView = false;
            this.form.controls["height"].disable();
            this.form.controls["width"].disable();
            console.log("IsCopy True")
          }
          else if (params['isCopy'] == 'false') {
            this.isCopy = false;
            this.isView = true;
            console.log("IsCopy False")
          }
        }
        );
      let _json = JSON.parse(data);
      this.plid = _json.id;
      let isAct = false;
      if (_json.isActive == 'Active') {
        isAct = true;
        this.isActive = true;
      }
      this.form.patchValue({ playlistName: _json.playlistName, height: _json.height, width: _json.width, isActive: isAct })
      this.heighttxt = _json.height;
      this.widthtxt = _json.width;
      this._media.getBlockDetailsByPlID(this.plid).subscribe(res => {
        if (res != undefined) {
          res.forEach((ele: any) => {
            let node = {
              id: ele.blockNo,
              height: ele.height,
              width: ele.width,
              left: ele.blLeft,
              top: ele.blTop
            }
            this.nodeDetails.push(node);
          });

          console.log(this.nodeDetails);
        }
      });
    }
  }

  ActiveStatusChange() {
    var _master = new PlaylistMaster();
    _master.id = 0;
    _master.isActive = this.form.controls["isActive"].value;
    _master.createdBy = this.global.UserCode;
    _master.height = this.form.controls["height"].value;
    _master.width = this.form.controls["width"].value;
    _master.playlistName = this.form.controls["playlistName"].value;
    _master.status = this.status;
    _master.id = this.plid;
    this._media.updatePlaylistData(_master).subscribe(res => {
      if (res != null && res != 0) {
        this.toast.success("Updated Successfully");
        this.plid = res;
        //this.router.navigate(['medias/playlist-creation']);
      } else {
        this.toast.error("An error occured while processing your request.", "Error", { positionClass: "toast-botton-right" });
      }
    });
  }

  ValidatePlaylistName(_master: any) {
    let plName = this.form.controls["playlistName"].value;
    this._media.ValidatePlaylistName(plName).subscribe(res => {
      if (res == 1) {
        this.toast.error("Playlist Name already in use.");
        this.form.patchValue({
          playlistName: ""
        });
      }
      else {
        if (_master != null && _master != undefined) {
          this._media.addPlaylistMaster(_master).subscribe(res => {
            if (res != null && res != 0) {
              this.toast.success("Saved Successfully");
              this.form.reset();
              this.plid = res;
              if (this.isCopy == true)
                this.stepper.to(4);
              // else 
              //   this.stepper.next();
              //this.router.navigate(['medias/playlist-creation']);
            } else {
              this.toast.error("An error occured while processing your request.", "Error", { positionClass: "toast-botton-right" });
            }
          });
        }

      }
    })
  }

  TarrifAll(_data: any) {
    if (_data.tarrif == undefined || _data.tarrif == "") {
      this.toast.error("Tarrif not selected.");
    } else {
      this.dataSource.forEach(element => {
        element.tarrif = _data.tarrif;
      });
    }
  }
  PartyAll(_data: any) {
    if (_data.party == undefined || _data.party == "") {
      this.toast.error("Party not selected.");
    } else {
      this.dataSource.forEach(element => {
        element.party = _data.party;
      });
    }
  }

  plblForm : FormGroup;
  
  createItem(): FormGroup {
    return this.fb.group({ 
      plId: '',
      blId: '',
      duration: '',
      effectIn: '',
      effectOut: '',
      mdId: '',
      sequenceNo: '',
      mdType: '',
      mediaName: '',
    });
  }

  CreateFinalForm(){
    this.plblForm = this.fb.group({
      items: this.fb.array([])
    })
  }

}




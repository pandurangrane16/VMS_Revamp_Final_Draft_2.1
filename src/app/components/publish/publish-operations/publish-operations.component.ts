import { ChangeDetectorRef, Component, Injector, Input, OnInit, ViewChild, inject } from '@angular/core';
import Stepper from 'bs-stepper';
import { ToastrService } from 'ngx-toastr';
import { PublishFacadeService } from 'src/app/facade/facade_services/publish-facade.service';
import { CommonSelectList } from 'src/app/models/common/cmSelectList';
import { InputRequest } from 'src/app/models/request/inputReq';
import { Globals } from 'src/app/utils/global';
import { NgbTimeStruct, NgbDateStruct, NgbPopoverConfig, NgbPopover, NgbDatepicker, NgbCalendar, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { noop } from 'rxjs';
import { FormArray, FormBuilder, FormGroup, NgControl, Validators } from '@angular/forms';
import { DateTimeModel } from 'src/app/models/DateTimeModel';
import { PublishMaster } from 'src/app/models/publish/publishmaster';
import { publishDetails, publishTime } from 'src/app/models/publish/PublishDetails';
import { NavigationExtras, Router } from '@angular/router';
import { CronMngComponent } from '../cron-mng/cron-mng.component';
import { PublishCron, PublishCronVM } from 'src/app/models/publish/PublishCron';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-publish-operations',
  templateUrl: './publish-operations.component.html',
  styleUrls: ['./publish-operations.component.css']
})
export class PublishOperationsComponent implements OnInit {
  _currentIndex: number = 0;
  today = inject(NgbCalendar).getToday();
  minDate: any;
  maxDate: any;
  cnt: number = 0;
  ishidevms: boolean = false;
  isSearch: boolean = false;
  globalFromDt: any;
  globalToDt: any;
  globalFromTm: any;
  globalToTm: any;
  model: NgbDateStruct;
  date: { year: number; month: number };
  stepper: Stepper;
  searchText: string;
  _request: any = new InputRequest();
  _inputVmsData: any;
  _inputZoneData: any;
  $zones: any;
  totalPages: number = 1;
  pager: number = 1;
  totalRecords!: number;
  recordPerPage: number = 10;
  startId!: number;
  label1: string;
  label2: string = "Select Controller";
  dropdownSettings: any;
  dropdownSettingsVms: any;
  _common: CommonSelectList;
  selectedTime: any;
  selectedZones: any[] = [];
  selectedVMS: any[] = [];
  playlistList: any[] = [];
  selectedPlaylist: any[] = [];
  filteredPlaylist: any[] = [];
  selectedDate: any;
  ngControl: any;
  publishMaster: any[] = [];
  form: any;
  items: any;
  globalFrom: any;
  globalTo: any;
  _publishMaster: any;
  IsCustom: boolean = false;
  IsReg: boolean = true;
  cron: any;
  headerArr = [
    { "Head": "ID", "FieldName": "id", "type": "number" },
    { "Head": "Playlist Name", "FieldName": "playlistName", "type": "string" },
    { "Head": "Selection", "FieldName": "checkbox", "type": "checkbox" }
  ];
  fromTimeArr = {
    "inputDatetimeFormat": "dd-MM-yyyy HH:mm:ss",
    "yearDisabled": false,
    "monthDisabled": true,
    "dayDisabled": true,
    "timeDisabled": true
  }

  constructor(private global: Globals,
    private _publish: PublishFacadeService,
    private _toast: ToastrService,
    private config: NgbPopoverConfig,
    private inj: Injector,
    private fb: FormBuilder,
    private router: Router,
    private cdf: ChangeDetectorRef,
    private modalService: NgbModal,
    private datePipe: DatePipe
  ) {
    this.global.CurrentPage = "Publish Operations";
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'value',
      textField: 'displayName',
      selectAllText: 'Select All',
      unSelectAllText: 'DeSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true,
    };

    this.dropdownSettingsVms = {
      singleSelection: false,
      idField: 'value',
      textField: 'displayName',
      selectAllText: 'Select All',
      unSelectAllText: 'DeSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true,
    };

    config.autoClose = 'outside';
    config.placement = 'auto';

    this.form = this.fb.group({
      globalFromDt: ["", Validators.required],
      globalFromTm: ["", Validators.required],
      globalToDt: ["", Validators.required],
      globalToTm: ["", Validators.required],
      items: this.fb.array([])
    })
  }
  changeDetect() {
    this.cdf.detectChanges();
  }
  createItem(): FormGroup {
    return this.fb.group({
      playlistName: [{ value: '', disabled: true }],
      plid: '',
      fromDate: '',
      toDate: '',
      fromTime: '',
      toTime: '',
      isSchedule: [{ value: false, disabled: true }],
      scheduleMsg: [{ value: 'SCHEDULE NOT DONE', disabled: true }],
    });
  }
  
  getErrorMessage(_controlName: any, _controlLable: any, _isPattern: boolean = false, _msg: string) {
    //return getErrorMsg(this.form, _controlName, _controlLable, _isPattern, _msg);
  }
  addPlaylist(plid: number) {

  }
  resetStepper() {
    // this.playlistList = [];
    // this.filteredPlaylist= [];
    // this._currentIndex = 0;
    // // this.GetAllZoneDetails();
    // this.selectedPlaylist = [];
    this.stepper.to(1);
  }
  BackToList(type: number) {
    // if (type == 0) {
    //   this.router.navigate(['publish/media-status']);
    // } else if (type == 1) {
    //   this.resetStepper();
    // }
    let objToSend: NavigationExtras = {
      queryParams: {
        isReset: true
      }
    }
    this.router.navigate(['publish/media-status'], { state: { isReset: objToSend } });
  }
  BuildForm() {

  }
  ngOnInit(): void {
    this.stepper = new Stepper(document.querySelector('#stepper1') as HTMLElement, {
      linear: false,
      animation: true
    });
    this.GetAllZoneDetails();
    let _date = new Date();
    let _day = _date.getUTCDate();
    let _mon = _date.getMonth() + 1;
    let _year = _date.getFullYear();
    this.minDate = {
      year: _year,
      month: _mon,
      day: _day
    }

    this.cron = new PublishCronVM();
  }

  GetAllZoneDetails() {
    this.label1 = "Select Zone";
    this._request.currentPage = this.pager;
    this._request.pageSize = this.recordPerPage;
    this._request.startId = this.startId;
    this._request.searchItem = "";
    this._publish.getZonesForPublish(this._request).subscribe(res => {
      if (res != null && res.data.length > 0) {
        this.$zones = res.data;
        let commonList: CommonSelectList[] = [];
        this.$zones.forEach((ele: any) => {
          var _commonSelect = new CommonSelectList();
          _commonSelect.displayName = ele.zoneName;
          _commonSelect.value = ele.id;
          commonList.push(_commonSelect);
        });
        let _data = {
          data: commonList,
          disabled: false
        }
        this._inputZoneData = _data;
      } else {
        this._toast.error("An error occured while receiving data, please contact system administrator.")
      }
    })
  }
  get getScheduleMsg() { return this.form.get('items') as FormArray }
  getSelectedZone(eve: any, type: number) {
    if (type == 1) {
      this.ishidevms = false;
      if (eve.length > 0) {
        eve.forEach((ele: any) => {
          this.selectedZones.push(ele.value);
        });
      }
      else {
        this.selectedZones.push(eve.value);
      }
    }
    else {
      if (eve.length == 0) {
        var _idx = 0;
        // this.selectedZones.forEach(element => {
        //   _idx++;
        //     this.selectedZones.splice(_idx - 1, 1);
        // });
        this.selectedZones = [];
        this.ishidevms = true;
        this.selectedVMS = [];
      }
      else if (eve.displayName == undefined) {
        // this.selectedZones.forEach(element => {
        //   _idx++;
        //     this.selectedZones.splice(_idx - 1, 1);
        // });
        this.selectedZones = [];
        this.ishidevms = true;
        this.selectedVMS = [];
      }
      else {
        var _idx = 0;
        this.selectedZones.forEach(element => {
          _idx++;
          if (eve.value == element)
            this.selectedZones.splice(_idx - 1, 1);
        });
      }
      this._inputVmsData = [];
      //this.ishidevms = true;
    }
    this._publish.getVmsDetailsByZone(this.selectedZones).subscribe(res => {
      if (res != null && res.length > 0) {
        let commonList: CommonSelectList[] = [];
        res.forEach((ele: any) => {
          var _commonSelect = new CommonSelectList();
          _commonSelect.displayName = ele.description;
          _commonSelect.value = ele.id;
          commonList.push(_commonSelect);
        });
        let _data = {
          data: commonList,
          disabled: false
        }
        this._inputVmsData = _data;
      }
    })
  }

  getSelectedVms(eve: any, type: number) {
    if (type == 1) {
      if (eve.length > 0) {
        eve.forEach((ele: any) => {
          this.selectedVMS.push(ele.value);
        });
      }
      else
        this.selectedVMS.push(eve.value);
    }
    else {
      if (this.selectedVMS.length > 0) {
        var _idx = 0;
        this.selectedVMS.forEach(element => {
          _idx++;
          if (element == eve.value)
            this.selectedVMS.splice(_idx - 1, 1);
        });
      }
    }
  }
  StepPrev(step: number) {
    this._currentIndex = step - 1;
    if (step == 2) {
      this._publish.getPlaylistMasterData().subscribe(res => {
        if (res != null && res.length > 0) {
          this.playlistList = res;
          this.filteredPlaylist = res;
        }
        else {
          this._toast.error("Something went wrong");
        }
      })
    }
    this.stepper.to(step);
  }
  StepNext(step: number) {
    if (step == 1) {
      if (this.stepperValidation(step)) {
        this._publish.getPlaylistMasterData().subscribe(res => {
          if (res != null && res.length > 0) {
            this.playlistList = res;
            this.filteredPlaylist = res;
          }
          else {
            this._toast.error("Something went wrong");
          }
        })
        this.selectedPlaylist = [];
        this.stepper.next();
        this._currentIndex = step;
      }
    }
    else if (step == 2) {
      if (this.selectedPlaylist.length == 0)
        this._toast.error("Please select playlist.");
      else {
        this.items = this.form.get('items') as FormArray;
        var _itemLen = this.items.length;
        var len = this.selectedPlaylist.length;
        for (var i = 0; i < len; i++) {
          if (i > _itemLen - 1)
            this.items.push(this.createItem());
        }
        _itemLen = this.items.length;
        for (var j = 0; j < _itemLen; j++) {
          this.items.at(j).patchValue({
            plid: this.selectedPlaylist[j].id,
            playlistName: this.selectedPlaylist[j].playlistName,
          });
        }
        this.stepper.next();
        this._currentIndex = step;
        this.changeDetect();
      }
    }
  }
  stepperValidation(step: number) {
    if (step == 1) {
      if (this.selectedZones.length == 0) {
        this._toast.error("Please select zone");
        return false;
      }
      else if (this.selectedVMS.length == 0) {
        this._toast.error("Please select controller(VMS)");
        return false;
      }
      else
        return true;
    }
    else
      return false;
  }

  //Table 
  onPager(pager: number) {
    this._request.pageSize = this.recordPerPage;
    this.pager = pager;
    this.startId = (this.pager - 1) * this.recordPerPage;
    //this.getPlaylistData();
  }

  onRecordPageChange(recordPerPage: number) {
    this._request.pageSize = recordPerPage;
    this.pager = recordPerPage;
    this.recordPerPage = recordPerPage;
    this.startId = 0;
    this.pager = 1;
    //this.getPlaylistData();
  }

  onPageSearch(search: string) {
    this.searchText = search;
    this.isSearch = true;
    this.filteredPlaylist = [];
    this.playlistList.forEach(element => {
      if (element.playlistName.includes(search)) {
        this.filteredPlaylist.push(element);
      }
    });
  }

  checked(_data: any, type: number) {
    if (type == 1) {
      this.cnt++;
      _data.uniqueId = this.cnt;
      this.selectedPlaylist.push(_data);
    }
    else {
      var idx = this.selectedPlaylist.find(x => x.id == _data.id);
      this.selectedPlaylist.splice(idx, 1);
    }
  }

  ValidateAndSubmit() {
    try {
      let hasError: boolean = false;
      var _pubTime = new publishDetails();
      _pubTime.zones = this.selectedZones;
      _pubTime.vms = this.selectedVMS;
      _pubTime.username = this.global.UserCode;
      if (this._publishMaster == undefined || this._publishMaster.length > 0) {
        hasError = true;
        this._toast.error("Invalid data found in Publish From Date/ Publish To Date", "Error");
      }
      else if (this._publishMaster.fromtime != undefined)
        _pubTime.pubFrom = this._publishMaster.fromtime;
      else {
        this._toast.error("Invalid data in Publish From Date", "Error");
        hasError = true;
      }
      if (this._publishMaster.totime != undefined)
        _pubTime.pubTo = this._publishMaster.totime;
      else {
        this._toast.error("Invalid data in Publish To Date", "Error");
        hasError = true;
      }
      if (!hasError) {
        var _currentTime = new Date();
        let _playTime: publishTime[] = [];
        if (this.form.value.items.length > 0) {
          var seq = 0;
          let valid: boolean = false;
          for (var i = 0; i < this.form.value.items.length; i++) {
            seq++;
            let _play = new publishTime();
            _play.sequence = seq;
            _play.plId = this.form.value.items[i].plid;
            _play.endDate = "" + this.form.value.items[i].toDate.year + "-" + ("0" + this.form.value.items[i].toDate.month).slice(-2) + "-" + ("0" + this.form.value.items[i].toDate.day).slice(-2) + " " + ("0" + this.form.value.items[i].toTime.hour).slice(-2) + ":" + ("0" + this.form.value.items[i].toTime.minute).slice(-2) + ":" + ("0" + this.form.value.items[i].toTime.second).slice(-2) + "";
            _play.startDate = "" + this.form.value.items[i].fromDate.year + "-" + ("0" + this.form.value.items[i].fromDate.month).slice(-2) + "-" + ("0" + this.form.value.items[i].fromDate.day).slice(-2) + " " + ("0" + this.form.value.items[i].fromTime.hour).slice(-2) + ":" + ("0" + this.form.value.items[i].fromTime.minute).slice(-2) + ":" + ("0" + this.form.value.items[i].fromTime.second).slice(-2) + "";
            _play.startTime = "" + this.form.value.items[i].fromDate.year + "-" + ("0" + this.form.value.items[i].fromDate.month).slice(-2) + "-" + ("0" + this.form.value.items[i].fromDate.day).slice(-2) + " " + ("0" + this.form.value.items[i].fromTime.hour).slice(-2) + ":" + ("0" + this.form.value.items[i].fromTime.minute).slice(-2) + ":" + ("0" + this.form.value.items[i].fromTime.second).slice(-2) + "";
            _play.endTime = "" + this.form.value.items[i].toDate.year + "-" + ("0" + this.form.value.items[i].toDate.month).slice(-2) + "-" + ("0" + this.form.value.items[i].toDate.day).slice(-2) + " " + ("0" + this.form.value.items[i].toTime.hour).slice(-2) + ":" + ("0" + this.form.value.items[i].toTime.minute).slice(-2) + ":" + ("0" + this.form.value.items[i].toTime.second).slice(-2) + "";

            let plStartDt = this.form.value.items[i].fromDate.year + ("0" + this.form.value.items[i].fromDate.month).slice(-2) + ("0" + this.form.value.items[i].fromDate.day).slice(-2) + ("0" + this.form.value.items[i].fromTime.hour).slice(-2) + ("0" + this.form.value.items[i].fromTime.minute).slice(-2) + ("0" + this.form.value.items[i].fromTime.second).slice(-2);
            let plEndDt = this.form.value.items[i].toDate.year + ("0" + this.form.value.items[i].toDate.month).slice(-2) + ("0" + this.form.value.items[i].toDate.day).slice(-2) + ("0" + this.form.value.items[i].toTime.hour).slice(-2) + ("0" + this.form.value.items[i].toTime.minute).slice(-2) + ("0" + this.form.value.items[i].toTime.second).slice(-2);
            // if (_currentTime.getHours() == this.form.value.items[i].fromTime.hour && _currentTime.getMinutes() > this.form.value.items[i].fromTime.minute) {
            //   _playTime.push(_play);
            //   valid = true;
            // } else if (_currentTime.getHours() > this.form.value.items[i].fromTime.hour) {
            //   valid = false;
            //   break;
            // } else {
            //   _playTime.push(_play);
            //   valid = true;
            // }
            if (Number(plStartDt) >= Number(plEndDt)) {
              valid = false;
              break;
            } else {
              _playTime.push(_play);
              valid = true;
            }
          }
          _pubTime.status = 0;
          if (valid == true && this.IsReg) {
            _pubTime.pubType = "Regular";
            _pubTime.pubTime = _playTime;
            let globalFromDate = new Date(_pubTime.pubFrom);
            let globalToDate = new Date(_pubTime.pubTo);
            if (globalToDate < globalFromDate) {
              this._toast.error("Publish end date should not be greater than from date.");
            }
            var d = this.checkTimeOverlap(_pubTime);
            if (d) {
              this._publish.addPublishDetails(_pubTime).subscribe(res => {
                if (res != null && res != undefined) {
                  if (res != 0) {
                    this._toast.success("Publish saved successfully.");
                    this.router.navigate(['publish/media-status']);
                  } else {
                    this._toast.error("Something went wrong.");
                  }
                }
              }, (error => {
                this._toast.error("Invalid data entered in some field.");
              }))
            } else {
              this._toast.error("Time overlap between playlist from date and to date");
            }

          } else {
            _pubTime.pubType = "Cron";
            if (this.cron != null) {
              this._publish.addPublishCron(this.cron).subscribe(res => {
                if (res != null)
                  if (res != 0) {
                    this._toast.success("Successfully submitted.");
                    this.router.navigate(['publish/media-status']);
                  } else {
                    this._toast.error("Something went wrong.");
                  }
              })
            }
          }

        } else {
          this._toast.error("Playlist time not selected");
        }
      }
    }
    catch (err: any) {
      this._toast.error(err);
    }

  }
  GetTime(eve: any, type: number) {

    let _date = new Date();
    var _day = ("0" + eve.controls["selectedDayG"].value).slice(-2);
    var _month = ("0" + eve.controls["selectedMonthG"].value).slice(-2);
    var _year = eve.controls["selectedYearG"].value;
    var _time = eve.controls["selectedTimeG"].value;

    if (type == 0) {
      this._publishMaster = new PublishMaster();
      if (_date.getUTCDate() >= Number(_day) && (_date.getMonth() + 1) >= Number(_month) && _date.getFullYear() >= Number(_year)) {
        this._publishMaster.createdby = this.global.UserCode;
        this._publishMaster.id = 0;
        this._publishMaster.fromtime = _year + "-" + _month + "-" + _day + " " + _time;
        this.selectedTime = this._publishMaster.totime
        this._publishMaster.isactive = true;
        this._publishMaster.totime = _year + "-" + _month + "-" + _day + " " + _time;
      }
      else
        this._toast.error("Invalid date selected.");
    }
    else if (type == 1) {
      if (_date.getUTCDate() <= Number(_day) && (_date.getMonth() + 1) <= Number(_month) && _date.getFullYear() <= _year) {
        this._publishMaster.totime = _year + "-" + _month + "-" + _day + " " + _time;

        let _fromDate = new Date(this._publishMaster.fromtime);
        let _toDate = new Date(this._publishMaster.totime);
        if (_fromDate >= _toDate) {
          this._toast.error("Invalid date selected.");
        }
      } else
        this._toast.error("Invalid date selected.");
    }
  }
  ValidateTime() {
    console.log(this.form);
    let pubFromDt = this.form.controls["globalFromDt"].value;
    let pubToDt = this.form.controls["globalToDt"].value;
    let pubFromTime = this.form.controls["globalFromTm"].value;
    let pubToTime = this.form.controls["globalToTm"].value;
    let globalFromDate = pubFromDt.year + ("0" + pubFromDt.month).slice(-2) + ("0" + pubFromDt.day).slice(-2) + ("0" + pubFromTime.hour).slice(-2) + ("0" + pubFromTime.minute).slice(-2) + ("0" + pubFromTime.second).slice(-2);
    let globalToDate = pubToDt.year + ("0" + pubToDt.month).slice(-2) + ("0" + pubToDt.day).slice(-2) + ("0" + pubToTime.hour).slice(-2) + ("0" + pubToTime.minute).slice(-2) + ("0" + pubToTime.second).slice(-2);
    if (Number(globalFromDate) >= Number(globalToDate)) {
      this._toast.error("Invalid DateTime selected for Publish From and Publish To.");
      this.form.patchValue({
        globalFromDt: "",
        globalToDt: "",
        globalFromTm: "",
        globalToTm: ""
      })
    } else {
      this._publishMaster = new PublishMaster();
      let _fromTime = ("0" + pubFromTime.hour).slice(-2) + ":" + ("0" + pubFromTime.minute).slice(-2) + ":" + ("0" + pubFromTime.second).slice(-2);
      let _toTime = ("0" + pubToTime.hour).slice(-2) + ":" + ("0" + pubToTime.minute).slice(-2) + ":" + ("0" + pubToTime.second).slice(-2);
      this._publishMaster.fromtime = pubFromDt.year + "-" + ("0" + pubFromDt.month).slice(-2) + "-" + ("0" + pubFromDt.day).slice(-2) + " " + _fromTime;
      this._publishMaster.totime = pubToDt.year + "-" + ("0" + pubToDt.month).slice(-2) + "-" + ("0" + pubToDt.day).slice(-2) + " " + _toTime;
    }
  }
  keyPress(event: KeyboardEvent) {
    event.preventDefault();
  }
  RemovePlaylist(item: any) {
    for (var i = 0; i < this.selectedPlaylist.length; i++) {
      if (this.selectedPlaylist[i].id == item.id) {
        this.selectedPlaylist.splice(i, 1);
        break;
      }
    }
    for (var j = 0; j < this.items.value.length; j++) {
      if (this.items.value[i].plid == item.id) {
        (<FormArray>this.form.controls['items']).removeAt(i);
        break;
      }
    }
    this.changeDetect();
  }
  checkTimeOverlap(data: any) {
    let _pubFromDate = new Date(data.pubFrom);
    let _pubToDate = new Date(data.pubTo);
    for (var i = 0; i < data.pubTime.length; i++) {
      let startdate = new Date(data.pubTime[i].startDate);
      let enddate = new Date(data.pubTime[i].endDate);
      if (_pubFromDate > startdate) {
        return false;
      }
      else if (_pubToDate < enddate) {
        return false;
      }
      else if (startdate > enddate) {
        return false;
      }
    }
    return true;
  }

  CustomScheduled(eve: any) {
    let valFrom = this.form.controls["globalFromDt"].value;
    let valTo = this.form.controls["globalToDt"].value;
    if (valFrom == "" || valTo == "") {
      this._toast.error("Please enter global from date and to date.");
    } else {
      console.log(eve);
      let _PlIds: any[] = [];
      if (eve == 'All') {
        this.selectedPlaylist.forEach(element => {
          let Pl = {
            "id": element.id,
            "playlistName": element.playlistName,
            "uniqueId" : element.uniqueId
          };
          _PlIds.push(Pl);
        });
      } else {
        let Pl = {
          "id": eve.id,
          "playlistName": eve.playlistName,
          "uniqueId" : eve.uniqueId
        };
        _PlIds.push(Pl);
      }
      let type = 0;
      if (this.IsReg)
        type = 0;
      else if (eve == 'All')
        type = 1;
      else {
        type = 2;
      }
        
      let _data = {
        PlaylistIds: _PlIds,
        ScheduleType: type,
        GlobalFrom: this.globalFrom,
        GlobalTo: this.globalTo,
        vmsIds: this.selectedVMS.toString(),
        cronData : this.cron,
      }
      const modalRef = this.modalService.open(CronMngComponent, { ariaLabelledBy: 'modal-basic-title', size: 'lg' });
      modalRef.componentInstance.data = _data;
      //modalRef.componentInstance.playlistAudit = true;
      //modalRef.componentInstance.mediaAudit = false;
      modalRef.componentInstance.cronEntry.subscribe((receivedEntry: any) => {
        if (receivedEntry != 'failed') {
          let globalFromDate = new Date(this._publishMaster.fromtime);
          let globalToDate = new Date(this._publishMaster.totime);
          let _cron = new PublishCronVM();
          _cron.globalFrom = this.datePipe.transform(globalFromDate, "yyyy-MM-dd HH:mm:ss");
          _cron.globalTo = this.datePipe.transform(globalToDate, "yyyy-MM-dd HH:mm:ss");
         
          this.cron.globalFrom = _cron.globalFrom;
          this.cron.globalTo = _cron.globalTo;
          if (type == 2) {
            var _idx = this.selectedPlaylist.findIndex(x=>x.uniqueId == receivedEntry.uniqueId);
            if(this.cron.publishCrons.length > 0) {
              this.cron.publishCrons.forEach((ele:any) => {
                let idx = ele.uniqueId;
                if(idx == receivedEntry.uniqueId) {
                  var chk = this.cron.publishCrons.findIndex((x:any)=>x.uniqueId == receivedEntry.uniqueId);
                  this.cron.publishCrons.splice(chk,1);
                }
              });
            } 
            _cron.publishCrons = receivedEntry;
            this.getScheduleMsg.at(_idx).patchValue({
              "isSchedule": true,
              "scheduleMsg": "Schedule Set (" + receivedEntry.cronStartTime + " -- " + receivedEntry.cronEndTime + ")"
            })
            this.cron.publishCrons.push(_cron.publishCrons);
          }
          else if (type == 1) {
            var _plid = "";
            this.cron.publishCrons = [];
            for (var i = 0; i < this.selectedPlaylist.length; i++) {
              if (i == (this.selectedPlaylist.length - 1)) {
                _plid += this.selectedPlaylist[i].id
              } else {
                _plid += this.selectedPlaylist[i].id + ",";
              }
              this.getScheduleMsg.at(i).patchValue({
                "isSchedule": true,
                "scheduleMsg": "Schedule Set (" + receivedEntry.cronStartTime + " -- " + receivedEntry.cronEndTime + ")"
              })
            }
            receivedEntry.PlaylistId = _plid;
            _cron.publishCrons = receivedEntry;
            this.cron.publishCrons.push(_cron.publishCrons);
          }
        }
        console.log(this.cron);
        // _cronJob = receivedEntry;
        // _cronJob.VmsId = this.selectedVMS.toString();
        // if(_cronJob != null) {
        //   this._publish.addPublishCron(_cronJob).subscribe(res=>{
        //     if(res != null) 
        //       if(res != 0) {
        //         this._toast.success("Successfully submitted.");
        //       } else {
        //         this._toast.error("Something went wrong.");
        //       }
        //   })
        // }
      })

    }
  }

  RadioChange(type: number) {
    if (type == 0) {
      this.IsReg = true;
      this.IsCustom = false;
    } else if (type == 1) {
      this.IsReg = false;
      this.IsCustom = true;
    }
  }
}

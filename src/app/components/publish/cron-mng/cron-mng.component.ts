import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PublishCron } from 'src/app/models/publish/PublishCron';

@Component({
  selector: 'app-cron-mng',
  templateUrl: './cron-mng.component.html',
  styleUrls: ['./cron-mng.component.css']
})
export class CronMngComponent implements OnInit {
  @Input() data: any;
  selectedType: any;
  fromTimeHrs: any;
  toTimeHrs: any;
  weekdays: any = [];
  selectedWeekDays: any;
  days: any = [];
  hoursVisible: boolean = false;
  daysVisible: boolean = false;
  monthsVisible: boolean = false;
  selectedDays: any;
  @Output() cronEntry: EventEmitter<any> = new EventEmitter();
  playlistId: string = "";
  dropdownSettings: any;
  plId: number;
  constructor(private modal: NgbModal, private toast: ToastrService) { }


  ngOnInit(): void {
    console.log(this.data);
    this.data.PlaylistIds.forEach((ele: any) => {
      this.playlistId += ele.playlistName + " | ";
    });
    if (this.data.ScheduleType == "2") {
      this.plId = this.data.PlaylistIds[0].id;
    }
    this.weekdays = [{ "displayName": "Sunday", "value": 1 },
    { "displayName": "Monday", "value": 2 },
    { "displayName": "Tuesday", "value": 3 },
    { "displayName": "Wednesday", "value": 4 },
    { "displayName": "Thursday", "value": 5 },
    { "displayName": "Friday", "value": 6 },
    { "displayName": "Saturday", "value": 7 }]

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'value',
      textField: 'displayName',
      selectAllText: 'Select All',
      unSelectAllText: 'DeSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true,
    };

    let val = { "displayName": "All", "value": 0 }
    for (var i = 1; i <= 31; i++) {
      let val = { "displayName": ("0" + i.toString()).slice(-2), "value": i }
      this.days.push(val);
    }

  }

  CronTypeChange() {
    if (this.selectedType == "D") {
      this.hoursVisible = true;
      this.daysVisible = false;
      this.monthsVisible = false;
      this.resetSelectionDays();
    } else if (this.selectedType == "W") {
      this.daysVisible = true;
      this.monthsVisible = false;
      this.hoursVisible = false;
    } else if (this.selectedType == "M") {
      this.monthsVisible = true;
      this.hoursVisible = true;
      this.daysVisible = false;
    }
  }

  ChangeSelectedDays(eve: any, val: number) {
    if (eve != undefined && eve != null) {
      this.hoursVisible = true;
    }
  }
  resetSelectionDays() {
    this.selectedDays = [];
  }
  CloseModal() {
    this.cronEntry.emit("failed");
    this.modal.dismissAll();
  }
  SubmitCron() {
    var _cron = new PublishCron();
    let _selectDays = (this.selectedDays == undefined || this.selectedDays == null || this.selectedDays == "") ? '*' : this.selectedDays.map((xx: { value: any; }) => xx.value).toString();
    let selectedWeekDays = (this.selectedWeekDays == undefined || this.selectedWeekDays == null || this.selectedWeekDays == "") ? '*' : this.selectedWeekDays.map((xx: { value: any; }) => xx.value).toString();
    let _fromTime = ("0" + this.fromTimeHrs.hour).slice(-2) + ":" + ("0" + this.fromTimeHrs.minute).slice(-2) + ":" + ("0" + this.fromTimeHrs.second).slice(-2);
    let _toTime = ("0" + this.toTimeHrs.hour).slice(-2) + ":" + ("0" + this.toTimeHrs.minute).slice(-2) + ":" + ("0" + this.toTimeHrs.second).slice(-2);
    _cron.id = 0;
    _cron.cronStartTime = _selectDays + "|" + (selectedWeekDays.toString()) + "|" + ("0" + this.fromTimeHrs.hour).slice(-2) + ":" + ("0" + this.fromTimeHrs.minute).slice(-2) + ":" + ("0" + this.fromTimeHrs.second).slice(-2);
    _cron.cronEndTime = _selectDays + "|" + (selectedWeekDays.toString()) + "|" + ("0" + this.toTimeHrs.hour).slice(-2) + ":" + ("0" + this.toTimeHrs.minute).slice(-2) + ":" + ("0" + this.toTimeHrs.second).slice(-2);
    _cron.isDeleted = false;
    _cron.isProcessed = false;
    _cron.vmsId = this.data.vmsIds;
    if (this.data.ScheduleType == 1)
      _cron.playlistId = this.data.PlaylistIds[0].id;
    else
      _cron.playlistId = this.plId.toString();
    _cron.publishId = 0;
    
    _cron.uniqueId = this.data.PlaylistIds[0].uniqueId;
    console.log(this.ValidateSchedule(_fromTime, _toTime,this.data.PlaylistIds[0].uniqueId));
    if (this.ValidateSchedule(_fromTime, _toTime,this.data.PlaylistIds[0].uniqueId)) {
      this.cronEntry.emit(_cron);
      this.modal.dismissAll();
    } else {
      this.toast.error("Time overlap between playlist schedule");
    }
  }
  onItemSelect(eve: any, type: number) {
    if (type == 1) {
      this.hoursVisible = true;
    }
  }

  ValidateSchedule(fromTime: any, toTime: any, uniId :number): boolean {
    let _val: boolean = true;
    let _data = this.data.cronData.publishCrons;
    if (_data.length > 0) {
      for (var i = 0; i < _data.length; i++) {
        let _eleFromTimeArr = Number(_data[i].cronStartTime.split('|')[2].replaceAll(':', ''));
        let _eleToTimeArr = Number(_data[i].cronEndTime.split('|')[2].replaceAll(':', ''));
        let _uniqueId = Number(_data[i].uniqueId);
        if (_uniqueId != uniId) {
          let _from = Number(fromTime.replaceAll(':', ''));
          let _to = Number(toTime.replaceAll(':', ''))
          if (_eleFromTimeArr == _from) {
            _val = false;
            break;
          } else if (_eleToTimeArr == _to) {
            _val = false;
            break;
          } else if (_from > _eleFromTimeArr) {
            if (_from <= _eleToTimeArr) {
              _val = false;
              break;
            }
          } else if (_from < _eleFromTimeArr) {
            if(_to > _eleFromTimeArr && _to <= _eleToTimeArr) {
              _val = false;
              break;
            }
          }
        }
      }
    }
    return _val;

    //return null;
  }
}

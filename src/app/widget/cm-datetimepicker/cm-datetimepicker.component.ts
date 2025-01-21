import { Component, OnInit, Input, forwardRef, ViewChild, AfterViewInit, Injector, EventEmitter, Output } from '@angular/core';
import { NgbTimeStruct, NgbDateStruct, NgbPopoverConfig, NgbPopover, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NgControl, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DateTimeModel } from '../../models/DateTimeModel';
import { noop } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'cm-datetimepicker',
  templateUrl: './cm-datetimepicker.component.html',
  styleUrls: ['./cm-datetimepicker.component.css'],
  providers: [
    DatePipe,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CmDatetimepickerComponent),
      multi: true
    }
  ]
})
export class CmDatetimepickerComponent implements OnInit, AfterViewInit {
  @Input() type: string = 'from';
  @Input() inputData: any;
  @Input() fromYear: any;
  @Input() toYear: any;
  @Input() isFromComplete: any;
  @Input() selectedTimeG : any;
  @Output() selectedTime = new EventEmitter();
  months: any;
  years: any[] = [];
  days: any[] = [];
  timeText: string;
  totalYearsCount: number = 0;
  daysCount: number = 31;
  hours: any[] = [];
  minutes: any[] = [];
  selectedHour: any;
  timeForm: any = [];
  isFormValidate: boolean = false;

  constructor(private config: NgbPopoverConfig,
    private inj: Injector,
    private toast: ToastrService, private formBuilder: FormBuilder) {
    config.autoClose = 'outside';
    config.placement = 'auto';

    this.BuildForm();
  }


  get f() { return this.timeForm.controls; }
  BuildForm() {
    this.timeForm = this.formBuilder.group({
      selectedYearG: [{ value: '0', disabled: false }, [Validators.required]],
      selectedMonthG: [{ value: '', disabled: true }, [Validators.required]],
      selectedDayG: [{ value: '', disabled: true }, [Validators.required]],
      selectedTimeG: [{ value: '', disabled: true }, [Validators.required]],
    });
  }
  ngOnInit(): void {

    let _monthsArr = [{ "monthName": "January", "value": 1 }, { "monthName": "February", "value": 2 }, { "monthName": "March", "value": 3 },
    { "monthName": "April", "value": 4 }, { "monthName": "May", "value": 5 }, { "monthName": "June", "value": 6 }, { "monthName": "July", "value": 7 },
    { "monthName": "August", "value": 8 }, { "monthName": "September", "value": 9 }, { "monthName": "October", "value": 10 }, { "monthName": "November", "value": 11 },
    { "monthName": "December", "value": 12 }];
    this.months = _monthsArr;
    this.totalYearsCount = this.toYear - this.fromYear;
    let currentYear = this.fromYear;
    for (var i = 0; i < this.totalYearsCount; i++) {
      this.years.push(Number(this.fromYear) + i);
    }

    for (var i = 0; i < 31; i++) {
      if (i < 9)
        this.days.push("0" + (i + 1));
      else
        this.days.push((i + 1));
    }
    for (var i = 0; i < 24; i++) {
      this.hours.push(i + 1);
    }
    for (var i = 0; i < 60; i++) {
      this.minutes.push(i);
    }
    if(this.selectedTimeG != undefined) {
      this.timeForm.patchValue({"selectedTimeG" : this.selectedTimeG});
    }
  }

  ngAfterViewInit(): void {

  }

  ValidateTime(ele: any) {
    this.timeText = this.timeForm.controls["selectedTimeG"].value;
    if (this.timeText == undefined || this.timeText.length != 8) {
      let c = ele.key;
      if (c >= '0' && c <= '9') {
        if (this.timeText != undefined && this.timeText.length == 2) {
          if (this.timeText > '23') {
            this.toast.error("Hours should be less than 24");
            this.isFormValidate = false;
            return false;
          }
          this.timeText = this.timeText + ":";
          this.timeForm.patchValue({ selectedTimeG: this.timeText });
        }
        else if (this.timeText != undefined && this.timeText.length == 5) {
          let _value = this.timeText.substr(3, 2);
          if (_value > '59') {
            this.toast.error("Minutes should be less than 60");
            this.isFormValidate = false;
            return false;
          }
          this.timeText = this.timeText + ":";
          this.timeForm.patchValue({ selectedTimeG: this.timeText });
        }
        else if (this.timeText != undefined && this.timeText.length == 7) {
          let _value = this.timeText.substr(6, 1);
          _value = _value + c;
          if (_value > '59') {
            this.toast.error("Seconds should be less than 60");
            this.isFormValidate = false;
            return false;
          }
        }
        return true;
      } else {
        this.isFormValidate = false;
        return false;
      }
    }
    else return false;

  }

  ValidateAndSubmit() {
    if (this.timeForm.valid) {
      var _currentTime = new Date();
      let time = this.timeForm.controls["selectedTimeG"].value.split(":");
      let year = this.timeForm.controls["selectedYearG"].value;
      let month = this.timeForm.controls["selectedMonthG"].value;
      let day = this.timeForm.controls["selectedDayG"].value;
      if ( year == _currentTime.getFullYear() && month == (_currentTime.getMonth()+1) && day == _currentTime.getDate() &&  _currentTime.getHours() >= time[0] && _currentTime.getMinutes() > time[1]) {
        this.toast.error("Time should be greater than current time.");
        this.timeForm.patchValue({selectedTimeG : ""});
        this.isFromComplete = 2;
      }
      else {
        this.selectedTime.emit(this.timeForm);        
        this.isFromComplete = 2;
      }
    } else {
      this.isFromComplete = 2;
    }
  }
  ChangeDate(type: number) {
    var _date = new Date();
    let _currentYear = _date.getUTCFullYear();
    let _currentMonth = _date.getUTCMonth() + 1;
    let _currentDay = _date.getUTCDate()
    let _selectedYear = this.timeForm.controls["selectedYearG"].value;
    let _selectedMonth = this.timeForm.controls["selectedMonthG"].value;
    let _selectedDay = this.timeForm.controls["selectedDayG"].value;
    if (type == 0) {
      if (_currentYear != 0 && _selectedYear >= _currentYear) {
        this.DisabledControls("selectedMonthG", false);
      }
      else {
        this.DisabledControls("selectedMonthG", true);
        this.DisabledControls("selectedDayG", true);
        this.DisabledControls("selectedTimeG", true);
        this.toast.error("Invalid Year Selected");
      }
    }
    else if (type == 1) {
      if (_currentMonth != 0 && _selectedYear >= _currentYear && _currentMonth <= _selectedMonth) {
        this.DisabledControls("selectedDayG", false);
      } else {
        this.DisabledControls("selectedMonthG", true);
        this.DisabledControls("selectedDayG", true);
        this.DisabledControls("selectedTimeG", true);
        this.toast.error("Invalid Month Selected");
      }
    }
    else if (type == 2) {
      if (_currentDay != 0 && _selectedYear >= _currentYear && ((_currentMonth < _selectedMonth) || (_currentMonth == _selectedMonth && _currentDay <= _selectedDay))) {
        this.DisabledControls("selectedTimeG", false);
      } else {
        this.DisabledControls("selectedDayG", true, 1);
        this.DisabledControls("selectedTimeG", true);
        this.toast.error("Invalid Day Selected");
      }
    }
  }

  DisabledControls(_formControl: string, disable: boolean, val?: any) {
    const ctrl = this.timeForm.get(_formControl);
    if (val == 1) {
      ctrl.patchValue(0);
    }
    else if (disable == false) {
      ctrl.enable();
      ctrl.patchValue(0);
    } else {
      ctrl.disable();
      ctrl.patchValue(0);
    }
  }
}
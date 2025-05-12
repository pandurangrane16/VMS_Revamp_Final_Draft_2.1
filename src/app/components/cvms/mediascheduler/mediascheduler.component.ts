import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminFacadeService } from 'src/app/facade/facade_services/admin-facade.service';
import { CommonFacadeService } from 'src/app/facade/facade_services/common-facade.service';
import { CVMSMediaFacadeServiceService } from 'src/app/facade/facade_services/cvmsmedia-facade-service.service';
import { CommonSelectList } from 'src/app/models/common/cmSelectList';
import { InputRequest } from 'src/app/models/request/inputReq';
import { Mediascheduler } from 'src/app/models/vcms/mediascheduler';
import { Globals } from 'src/app/utils/global';
import { getErrorMsg } from 'src/app/utils/utils';
import { parse, format, isValid } from 'date-fns';
import { DatePipe } from '@angular/common';
import { catchError } from 'rxjs';
import cronstrue from 'cronstrue';




@Component({
  selector: 'app-mediascheduler',
  templateUrl: './mediascheduler.component.html',
  styleUrls: ['./mediascheduler.component.css']
})
export class MediaschedulerComponent {
  form: any = [];
  mediauploadtype: string;
  isFileTypeText: boolean = false;
  isFileTypeImage: boolean = false;
  FileTypes: any[];
  _request: any = new InputRequest();
  MediaName: string;
  SelectedControllerId: any;
  inputVmsData: any;
  name: string;
  minDate: any;
  maxDate: any;
  cronExpression: any;
  submitting: boolean = false;
  _inputPlayerData: any = [];
  dropdownSettingsVms: any;
  playersIds: any[] = [];
  label2: string = "Select Media Player";
  showCustomize: boolean = false;


  selectedMinutes: string='*'; // Default to every minute
  startHour: string='*'; // Default start hour
  endHour: string ='*'; // Default end hour
  Duration : any;
  selectedDays: string[] = [];
  weekdaysselect :any=[]

  minutesOptions = Array.from({ length: 60 }, (_, i) => ({
    value: `*/${i}`,
    display: `${i}`
  }));
  hoursOptions = Array.from({ length: 24 }, (_, i) => ({
    value: i.toString(),
    display: i.toString().padStart(2, '0') // Ensures "0" appears as "00", "1" as "01", etc.
  }));
  weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  daysOptions:any =[];
  humanReadableCron: string;

  get f() { return this.form.controls; }

  constructor(private formBuilder: FormBuilder,
    private global: Globals,
    private _router: Router,
    private _CVMSfacade: CVMSMediaFacadeServiceService,
    private adminFacade: AdminFacadeService,
    private fb: FormBuilder,
    private _toast: ToastrService,
    
    private _commonFacade: CommonFacadeService,
    public datepipe: DatePipe,

  ) {
    this.FileTypes = ['Image File', 'Media Text']
    this.BuildForm();
    this.GetVmsDetails();
    this.global.CurrentPage = "Create Media Scheduler CVMS";
    this.dropdownSettingsVms = {
      singleSelection: false,
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
      selectedMinutes:[''],
      startHour: [''],
      endHour: [''],
      weekdaysselect: [[]],
      cronexpression: [''],
      Duration:[''],
    });
  }

  ngOnInit(): void {
    let _date = new Date();
    let _day = _date.getUTCDate();
    let _mon = _date.getMonth() + 1;
    let _year = _date.getFullYear();
    this.minDate = {
      year: _year,
      month: _mon,
      day: _day
    }
    this.daysOptions = this.weekDays.map((day, i) => ({
      value: i.toString(),
      displayName: day
    }));
    let _data = {
      data: this.daysOptions,
      disabled: false
    }
    this.weekdaysselect = _data;
    //this.refreshPage();
  }

  refreshPage() {
    setInterval(() => {
      //window.location.reload();
      //this._router.navigate([this._router.url]);
    }, 5000);
  }

  getSelectedVms(eve: any) {
    const selectElement = eve.target as HTMLSelectElement;
    const colindex = selectElement.value.indexOf(":");
    if (colindex !== -1) {
      this.SelectedControllerId = selectElement.value.slice(colindex + 1, selectElement.value.length).replace(/\s+/g, '').split("|");
      this.getMediaPlayerList();
    }
  }
  keyPress(event: KeyboardEvent) {
    event.preventDefault();
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
    console.log(this.playersIds);
  }
  

    getSelectedDays(event: any, action: number) {
      if (action === 1) {
        // Handling Select All
        if (Array.isArray(event)) {
          this.selectedDays = event.map(item => item.value);
        } else {
          this.selectedDays.push(event.value);
        }
      } else {
        // Handling Unselect All
        if (Array.isArray(event)) {
          this.selectedDays = [];
        } else {
          this.selectedDays = this.selectedDays.filter(day => day !== event.value);
        }
      }
      this.form.patchValue({
        weekdaysselect:this.selectedDays
      })
    }
    
    generateCron() {
      // Ensure that endHour is greater than or equal to startHour
      const start = this.startHour !== '*' ? parseInt(this.startHour, 10) : '*';
      const end = this.endHour !== '*' ? parseInt(this.endHour, 10) : '*';
    
      if (start !== '*' && end !== '*' && end < start) {
        alert("End hour cannot be less than start hour.");
        return;
      }
    
      // Format Hours
      let hourValue;
      if (start === '*' || end === '*') {
        hourValue = '*';
      } else {
        hourValue = start === end ? `${start}` : `${start}-${end}`;
      }
    
      // Ensure selectedMinutes defaults to '*' if no selection is made
      const minutesValue = this.selectedMinutes !== '*' ? this.selectedMinutes : '*';
    
      // Ensure selectedDays defaults to '*' if no selection is made
      const daysValue = this.selectedDays.length > 0 ? this.selectedDays.join(",") : "*";
    
      // Construct the cron expression
      this.cronExpression = `${minutesValue} ${hourValue} * * ${daysValue}`;
    
      try {
        this.humanReadableCron = cronstrue.toString(this.cronExpression);
      } catch (error) {
        console.error("Error converting cron:", error);
        this.humanReadableCron = "Invalid cron expression";
      }
    
      console.log("Cron:", this.cronExpression);
      this.form.patchValue({
        cronexpression :this.cronExpression
      })
      console.log("Readable:", this.humanReadableCron);
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

            // let  total_duration=0;
            // if (Array.isArray(_data.tiles)) {
            //   _data.tiles.forEach((tile:any) => {
            //     // Check if playlist exists and is an array
            //     if (Array.isArray(tile.playlist)) {
            //       tile.playlist.forEach((item:any) => {
            //         const duration = Number(item.imageTextDuration) || 0;
            //         total_duration += duration;
            //       });
            //     } else {
            //       console.log('tile.playlist is not an array:', tile.playlist);
            //     }
            //   });
            // } else {
            //   console.log('_data.tiles is not an array:', _data.tiles);
            // }
            

            // console.log("Total Image Text Duration:", total_duration);

            var _commonSelect = new CommonSelectList();
            _commonSelect.displayName = _data.name;
            _commonSelect.value = _responseId;
           //  _commonSelect.Tduration=total_duration
            commonList.push(_commonSelect);
          });
          let _data = {
            data: commonList,
            disabled: false
          }
          this._inputPlayerData = _data;
          console.log("inputplayerdata:",_data)
        }
      }
    })
  }
  toggleCustomize() {
    this.showCustomize = !this.showCustomize;
  
      // if (this.showCustomize) {
      // // Add validators when Customize is shown
      // this.form.get('selectedMinutes')?.setValidators([Validators.required]);
      // this.form.get('startHour')?.setValidators([Validators.required]);
      // this.form.get('endHour')?.setValidators([Validators.required]);
      // this.form.get('Duration')?.setValidators([Validators.required, Validators.min(1)]);
      // this.form.get('weekdaysselect')?.setValidators([Validators.required]);
      // this.form.get('cronexpression')?.setValidators([Validators.required]);
      // }
    //   else {
    //   // Remove validators when hidden
    //   this.form.get('selectedMinutes')?.clearValidators();
    //   this.form.get('startHour')?.clearValidators();
    //   this.form.get('endHour')?.clearValidators();
    //   this.form.get('Duration')?.clearValidators();
    //   this.form.get('weekdaysselect')?.setValidators([Validators.required]);
    //   this.form.get('cronexpression')?.setValidators([Validators.required]);
    
  
     
    // }
  
    // // Update the form's validity
    // this.form.updateValueAndValidity();
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

    if(this.form.controls["globalFromDt"].value =='' || this.form.controls["globalFromTm"].value == '')
    {
      this._toast.error("Either From Date or Time missing ,Please select From Date and Time for Media Scheduler");
      return;
    }
    
    if( this.form.controls["globalToDt"].value == '' || this.form.controls["globalToTm"].value == ''){
      this._toast.error("Either To Date or Time missing, Please select To Date and Time for Media Scheduler. ");
      return; 
    }

      // if (this.showCustomize) {
      // // Add validators when Customize is shown
      // this.form.get('selectedMinutes')?.setValidators([Validators.required]);
      // this.form.get('startHour')?.setValidators([Validators.required]);
      // this.form.get('endHour')?.setValidators([Validators.required]);
      // this.form.get('Duration')?.setValidators([Validators.required, Validators.min(1)]);
      // this.form.get('weekdaysselect')?.setValidators([Validators.required]);
      // this.form.get('cronexpression')?.setValidators([Validators.required]);
      
      // }
      if (this.showCustomize) {
        const fields = ['selectedMinutes', 'startHour', 'endHour', 'Duration', 'weekdaysselect', 'cronexpression'];
        fields.forEach(field => {
          this.form.get(field)?.setValidators([Validators.required]);
          this.form.get(field)?.updateValueAndValidity();
        });
      }

      if (!this.showCustomize) {
        const fields = ['selectedMinutes', 'startHour', 'endHour', 'Duration', 'weekdaysselect', 'cronexpression'];
        fields.forEach(field => {
          this.form.get(field)?.clearValidators();
          this.form.get(field)?.updateValueAndValidity();
        });
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
        "cronExpression": this.cronExpression,
        "playerDuration" : this.form.controls["Duration"].value,

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
      
          this._CVMSfacade.CheckDuplicateMediaSchedulerName(this.form.controls["schedulename"].value).subscribe(data => {
      
            if (JSON.parse(data) == 1) {
              this._toast.error("Media Player Name already exists in the System.");
              
              return;
            }
            else {
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
          });




     
    }
    else {
      this._toast.error("Error occured while saving data. Please select Input Values.");
    }
  }
  BacktoList() {
    this._router.navigate(['cvms/MediaPlayerSchedulerList']);
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

}

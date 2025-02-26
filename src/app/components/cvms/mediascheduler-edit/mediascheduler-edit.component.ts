
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

import cronstrue from 'cronstrue';



@Component({
  selector: 'app-mediascheduler-edit',
  templateUrl: './mediascheduler-edit.component.html',
  styleUrls: ['./mediascheduler-edit.component.css']
})

export class MediaSchedulerEditComponent {

  initiate: boolean = true;
  croncheck :boolean = false;
 
  selectedDays: string[] = [];
  //form: any;

  mediaId!: number;
  form: any = [];
  SelectedControllerId: any;
  item: any;
  vmsId: any;
  tile: any;
  Mpn : any;
  minDate: any;
  ID : any;
  id_atcontroller: any;
  name: string;
  cronExpression: any;
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
  submitting: boolean = false;
  label2: string = "Select Media Player";
  selectedMediaPlaylist: any = [];
  SelectedMediaPlayer:any;
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
    // User Selections
    selectedMinutes: string='*'; // Default to every minute
    startHour: string='*'; // Default start hour
    endHour: string ='*'; // Default end hour
    showScheduleOptions = false;
   
  
    // Generated Cron Expression
   

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
        //this.GetVmsDetails();
       
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
          SelectedControllerId: ['', Validators.required],
          cronexpression: ['', ''],
          SelectedMediaPlayer: ['', Validators.required],
          selectedMinutes:['', Validators.required],
          startHour: ['', Validators.required],
          endHour: ['', Validators.required],
          
          weekdaysselect: [[], Validators.required],
          


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
    console.log("Days Options: ", this.daysOptions);
   this.getmockdata(this.mediaId);
   //this.getMediaPlayerList();
;
  console.log("Days Options: ", this.daysOptions); 

  }
  onDaysChange(event: any) {
    this.selectedDays = Array.from(event.target.selectedOptions).map((option: any) => option.value);
  }
  BacktoList() {
    this._router.navigate(['cvms/MediaPlayerSchedulerList']);
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
   
    this.croncheck=true;
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
    this.form.patchValue({
      cronexpression :this.cronExpression
    })
    console.log("Cron:", this.cronExpression);
    console.log("Readable:", this.humanReadableCron);
  }
  
  
  keyPress(event: KeyboardEvent) {
    event.preventDefault();
  }
    OnSaveDetails(id: number) {
  
  
      if (this.form.controls['SelectedMediaPlayer'] == undefined || this.form.controls['SelectedMediaPlayer'].length < 1) {
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
       
        
        const selectedPlayer1 = this._inputPlayerData.data.find(
          (player: any) => player.value === this.form.controls['SelectedMediaPlayer'].value
        );
        
       
        let displayid = selectedPlayer1.value
        let displayName = selectedPlayer1.displayName;
  
        let _requestTextData = {
          "id" : this.id_atcontroller,
          "mediaPlayerId": displayid,
          "mediaPlayerName": displayName, //this.form.controls["mediaplayername"].value,
          "name": this.form.controls["schedulename"].value,
          "fromDate": jsonfromdate,
          "toDate": jsontodate,
         "cronExpression": this.cronExpression,
        }
        _vcmsmedischedulerdata.IpAddress = this.form.controls['SelectedControllerId'].value;

        _vcmsmedischedulerdata.VmsId = this.vmsId;

        _vcmsmedischedulerdata.RequestData = JSON.stringify(_requestTextData);
        _vcmsmedischedulerdata.CreationTime = new Date();
        _vcmsmedischedulerdata.IsAudited = true;
        _vcmsmedischedulerdata.AuditedBy = "System";
        _vcmsmedischedulerdata.AuditedTime = new Date();
        _vcmsmedischedulerdata.status = 0;
        _vcmsmedischedulerdata.Reason = "Create Media Scheduler";
        _vcmsmedischedulerdata.requesttype="/mediaSchedule/updateMediaPlayerScheduler";
        _vcmsmedischedulerdata.id= id;
  
  
        this._CVMSfacade.UpdateMediascheduler(_vcmsmedischedulerdata).pipe(catchError((err) => {
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
  
    toggleScheduleOptions() {
      if (this.showScheduleOptions) {
          // Navigate to a different page when clicking "Cancel"
          this._router.navigate(['cvms/MediaPlayerSchedulerList']);
      }
      this.showScheduleOptions = !this.showScheduleOptions;
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

        let _vmsIpAdd = this.form.controls['SelectedControllerId'].value;
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

              const selectedPlayer = this._inputPlayerData.data.find(
                (player: any) => player.displayName === this.Mpn
              );
              
              // If found, store its value into SelectedMediaPlayer
              if (selectedPlayer) {
                this.form.patchValue({
                  SelectedMediaPlayer: selectedPlayer.value
                });
              } 
              console.error('Media player not found for:', selectedPlayer);
              

            }
          }
        })
      }
   getmockdata(id:number) :void{
    let data ={
      
      "vmsId": 41,
      "ipAddress": "172.19.32.51",
      "creationTime": "2025-02-07T12:30:46.014",
      "responseId": 77,
      "status": 1,
      "isAudited": true,
      "auditedBy": "System",
      "auditedTime": "2025-02-07T12:30:46.014",
      "reason": "Create Media Scheduler",
      "requestData": "{\"mediaPlayerId\":43,\"mediaPlayerName\":\"Media Player351\",\"name\":\"Media PlayerSch351\",\"fromDate\":\"08/02/2025 10:00\",\"toDate\":\"08/02/2025 10:20\",\"cronExpression\":\"*/7 3 * * 3,2\"}",
      "requestType": null,
      "responseData": "{\"status\":\"error\",\"error\":null,\"data\":null,\"message\":\"Start time must be at least 5 minutes from now.\"}",
      "id": 183
 
    }
    this.populateFormWithData(data); 
   }
  getDataForMediaPlayer(id: number): void {
    let body = {
      "searchItem": "string",
      "pageSize": 0,
      "currentPage": 0,
      "startId": 0,
      "cachekey": "string"
    }
    this._CVMSfacade.getMediaSchedulerById(id, body).subscribe(response => {

      const data = response.data[0];

      if (data) {

        this.populateFormWithData(data);  // Populate the form with fetched data

      } else {
        this._toast.error('No data found for the selected media player.');
      }
    }, error => {
      this._toast.error('Error fetching data.');
    });



  }

  convertToDateObject(dateString: string) {
    let parts = dateString.split(" ")[0].split("/");
    return { day: parseInt(parts[0]), month: parseInt(parts[1]), year: parseInt(parts[2]) };
  }
  
  convertToTimeObject(dateString: string) {
    let parts = dateString.split(" ")[1].split(":");
    return { hour: parseInt(parts[0]), minute: parseInt(parts[1]), second: 0 };
  }
  
  populateFormWithData(data: any): void {
    
    this.daysOptions = this.weekDays.map((day, i) => ({
      value: i.toString(),
      displayName: day
    }));
    let _data = {
      data: this.daysOptions,
      disabled: false
    }
    this.weekdaysselect = _data;

    const requestData = JSON.parse(data.requestData);
 
      this.ID = data.id;
      this.id_atcontroller=data.responseId;

      this.cronExpression=requestData.cronExpression;
      try {
        this.humanReadableCron = cronstrue.toString(this.cronExpression);
      } catch (error) {
        console.error("Error converting cron:", error);
        this.humanReadableCron = "Invalid cron expression";
      }
      const cron= this.humanReadableCron;


      this.vmsId=data.vmsId;
      this.name = requestData.name;
      this.Mpn = requestData.mediaPlayerName;
      this.getMediaPlayerList();
      this.form.patchValue({


      schedulename: requestData.name,
      
      SelectedControllerId: data.ipAddress,
      SelectedMediaPlayer : requestData.mediaPlayerName,
      globalFromDt: this.convertToDateObject(requestData.fromDate),
      globalFromTm: this.convertToTimeObject(requestData.fromDate),
      globalToDt: this.convertToDateObject(requestData.toDate),
      globalToTm: this.convertToTimeObject(requestData.toDate),
      cronexpression:requestData.cronExpression,
      
    });
    this.getMediaPlayerList();
    
    //this.playersIds.push(requestData.mediaPlayerName)
   
   
    
  }


 
  get f() { return this.form.controls; }

  Getting_id(): void {
    if (!this.ID) {
      this._toast.error("No media player ID found. Cannot update.");
      return;
    }
    this.OnSaveDetails(this.ID);
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

 

  checkValue(event: any) {
    if (event.target.value <= 0) {
      event.target.value = 1;
    }
  }
 
 
 
 
 
  onSubmit(): void {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }
}

import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminFacadeService } from 'src/app/facade/facade_services/admin-facade.service';
import { CVMSMediaFacadeServiceService } from 'src/app/facade/facade_services/cvmsmedia-facade-service.service';
import { CommonSelectList } from 'src/app/models/common/cmSelectList';
import { InputRequest } from 'src/app/models/request/inputReq';
import { Mediascheduler } from 'src/app/models/vcms/mediascheduler';
import { Globals } from 'src/app/utils/global';
import { getErrorMsg } from 'src/app/utils/utils';

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

  get f() { return this.form.controls; }
  
  constructor(private formBuilder: FormBuilder,
    private global: Globals,
    private _router: Router,
    private _CVMSfacade: CVMSMediaFacadeServiceService,
    private adminFacade: AdminFacadeService,
    private fb: FormBuilder,
    private _toast: ToastrService,

  ) {
    this.FileTypes = ['Image File', 'Media Text']
    this.BuildForm();
    this.GetVmsDetails();
    this.global.CurrentPage = "Create Media Scheduler CVMS";
  }

  BuildForm() {
    this.form = this.formBuilder.group({
      globalFromDt: ["", Validators.required],
      globalFromTm: ["", Validators.required],
      globalToDt: ["", Validators.required],
      globalToTm: ["", Validators.required],
      schedulename: ['', [Validators.required, Validators.pattern("[A-Za-z0-9][A-Za-z0-9 ]*$")]],
      mediaplayername: ['', [Validators.required, Validators.pattern("[A-Za-z0-9][A-Za-z0-9 ]*$")]],
      cronexpression: ['', [Validators.required, Validators.pattern("[A-Za-z0-9][A-Za-z0-9 ]*$")]],
    });
  }


  getSelectedVms(eve: any) {
    const selectElement = eve.target as HTMLSelectElement;
    const colindex = selectElement.value.indexOf(":");
    if (colindex !== -1) {
      this.SelectedControllerId = selectElement.value.slice(colindex + 1, selectElement.value.length).replace(/\s+/g, '');
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
      this._toast.error("Invalid DateTime selected From Date and To Date.");
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
            _commonSelect.value = ele.ipAddress;
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

  OnSaveDetails() {

    if(this.SelectedControllerId == undefined || this.SelectedControllerId.length < 1){
      this._toast.error("No controller selected. Please select at least one controller to proceed.");
      return;
    }    

    let _vcmsmedischedulerdata = new Mediascheduler();

    let _requestTextData = {
      mediaPlayerId: 1,
      mediaPlayerName: this.form.controls["mediaplayername"].value,
      name: this.form.controls["schedulename"].value,
      fromdate: this.form.controls["globalFromDt"].value,
      todate: this.form.controls["globalToDt"].value,
      cronExpression:  this.form.controls["cronexpression"].value,
    }
    _vcmsmedischedulerdata.IpAddress = this.SelectedControllerId;
    _vcmsmedischedulerdata.RequestData = JSON.stringify(_requestTextData);
    _vcmsmedischedulerdata.CreationTime = new Date();
    _vcmsmedischedulerdata.IsAudited = true;
    _vcmsmedischedulerdata.AuditedBy = "System";
    _vcmsmedischedulerdata.AuditedTime = new Date();
    _vcmsmedischedulerdata.status = 0;
    _vcmsmedischedulerdata.Reason = "Create Media Scheduler";


    this._CVMSfacade.SaveMediaScheduler(_vcmsmedischedulerdata).subscribe(data => {
      if (data == 0) {
        this._toast.error("Error occured while saving data for " + _vcmsmedischedulerdata.IpAddress);
      }
      else {

        this._toast.success("Saved successfully for " + _vcmsmedischedulerdata.IpAddress);
      }
    });
    this._router.navigate(['cvms/MediaPlayerSchedulerList']);
  }
  BacktoList() {
    this._router.navigate(['cvms/MediaPlayerSchedulerList']);
  }


}

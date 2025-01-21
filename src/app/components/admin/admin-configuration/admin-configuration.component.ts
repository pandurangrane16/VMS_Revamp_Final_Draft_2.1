import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';
import { AdminFacadeService } from 'src/app/facade/facade_services/admin-facade.service';
import { UserFacadeService } from 'src/app/facade/facade_services/user-facade.service';
import { LoaderService } from 'src/app/facade/services/common/loader.service';
import { PrmGlobal } from 'src/app/models/request/config';
import { getErrorMsg } from 'src/app/utils/utils';

@Component({
  selector: 'app-admin-configuration',
  templateUrl: './admin-configuration.component.html',
  styleUrls: ['./admin-configuration.component.css']
})
export class AdminConfigurationComponent implements AfterViewInit {
    form : any=[];
    id?: string;
    title!: string;
    loading = false;
    submitting = false;
    submitted = false;
    _configData:any=[];
    _parameterData : any=[];
  active = 1;
  model2: string | undefined;
  model3: string | undefined;
  @Input() public user: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private _adminFacade :AdminFacadeService,
    private _toastr : ToastrService,
    private _cdr:ChangeDetectorRef,
    private _userFacade:UserFacadeService,
    private _loader:LoaderService
) { }
ngAfterViewInit(){
  this._cdr.detectChanges();
}

ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    // form with validation rules
    this.form = this.formBuilder.group({
        prmUnit: ['', Validators.required],
        prmKey: ['', Validators.required],
        prmValue: ['', [Validators.required]],
        //longitude: ['', [Validators.required,Validators.pattern('^-?([0-9]{1,2}|1[0-7][0-9]|180)(\.[0-9]{1,10})$')]]
    });

  this.title = 'Configuration';
    if (this.id) {
        // edit mode
     //   this.title = 'Edit User';
        this.loading = true;
       
    }

    this.GetUnitData();
}

// convenience getter for easy access to form fields
get f() { return this.form.controls; }

onSubmit() {
    this.submitted = true;


    // stop here if form is invalid
    if (this.form.invalid) {
        return;
    }
}

saveConfiguration() {
  //Latitude
  var _data = new PrmGlobal();
  _data.id = 0;
  _data.prmkey = this.form.controls["prmKey"].value;
  _data.prmunit = this.form.controls["prmUnit"].value;
  _data.prmvalue = this.form.controls["prmValue"].value;
  _data.prmuserid = this._userFacade.user.username;
  var valid = true;
  this._parameterData.forEach((ele:any) => {
      if(ele.key == _data.prmkey)
      {
          if(ele.type == "coords")
          {
            var re = RegExp("^-?([0-9]{1,2}|1[0-7][0-9]|180)(\.[0-9]{1,10})$");
            if(!re.test(_data.prmvalue))
            {
              this._toastr.error("Invalid data in "+ele.value);
              valid = false;
            }
          }
          else if(ele.type == "api")
          {
            if(!_data.prmvalue.includes("http") || !_data.prmvalue.includes("//") || !_data.prmvalue.includes(":"))
            {
              this._toastr.error("Invalid data in "+ele.value);
              valid = false;
            }
          }
      }
  });
  if(valid == true) {
    //this._loader.showLoader();
    this._adminFacade.AddConfigData(_data).subscribe(res => {
      if(res == 1)
      {
        this._toastr.success("Data successfully submitted.");
      }
      else 
        this._toastr.error("Something went wrong.");
    },(err)=>{
      this._toastr.error(err);
    })
  }
  console.log(_data);
}

passBack() {
    this.passEntry.emit();
    this.modalService.dismissAll();
  }

  getErrorMessage(_controlName: any, _controlLable: any, _isPattern: boolean = false, _msg: string) {
    return getErrorMsg(this.form, _controlName, _controlLable, _isPattern, _msg);
  }
  GetUnitData(){
    var _unit = "";
    this._adminFacade.getKeysDataForConfig(_unit).subscribe(res=>{
      this._configData=res;
      console.log(this._configData);
    });
  }

  UnitChange(){
    var _unit = this.form.controls["prmUnit"].value;
    this.LoadParameter(_unit);
  }

  LoadParameter(_unit:string){
    this._configData.config_keys.forEach((ele:any) => {
      if(Object.keys(ele)[0] == _unit)
      {
        this._parameterData = ele[_unit];
      }
    });
    this._cdr.detectChanges();
  }
}



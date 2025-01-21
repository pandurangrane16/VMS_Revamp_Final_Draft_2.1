import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AdminFacadeService } from 'src/app/facade/facade_services/admin-facade.service';
import { CommonFacadeService } from 'src/app/facade/facade_services/common-facade.service';
import { ConfirmationDialogService } from 'src/app/facade/services/confirmation-dialog.service';
import { VmsMaster } from 'src/app/models/admin/VMSMaster';
import { InputRequest } from 'src/app/models/request/inputReq';
import { Globals } from 'src/app/utils/global';
import { getErrorMsg } from 'src/app/utils/utils';
import { CmMapBoxComponent } from 'src/app/widget/cm-map-box/cm-map-box.component';
declare let $: any;

@Component({
  selector: 'app-add-vms',
  templateUrl: './add-vms.component.html',
  styleUrls: ['./add-vms.component.css']
})
export class AddVmsComponent implements OnInit {
  id: number = 0;
  form: any = [];
  brightness: number = 130;
  vmsOn: boolean = false;
  active: boolean = false;
  range: any;
  tooltip: any;
  vmdTypes: any[] = [];
  selectedVmdType:any;
  setValue: any;
  newPosition: any;
  loading: boolean = false;
  submitting: boolean = false;
  zones: any[] = [];
  latVal: number = 0;
  lonVal: number = 0;
  selectedZone: number = 0;
  installDate!: any;
  _request: any = new InputRequest();
  _zoneCoords: any[] = [];
  constructor(private router: Router,
    private global: Globals,
    private formBuilder: FormBuilder,
    private adminFacade: AdminFacadeService,
    private toaster: ToastrService,
    private confirmationDialogService: ConfirmationDialogService,
    private modalService: NgbModal,
    private commonFacade: CommonFacadeService) {
    this.global.CurrentPage = "Add VMS";
    this.BuildForm();
  }
  ngOnInit(): void {
    let data = this.commonFacade.getSession("ModelShow");
    debugger;
    this.FillForm(data == null ? "" : JSON.parse(data));

    $(document).ready(() => {
      this.range = document.getElementById("range"),
        this.tooltip = document.getElementById("tooltip"),
        this.setValue = () => {
          const newValue = Number(
            ((this.range.value - this.range.min) * 100) / (this.range.max - this.range.min)
          ),
            newPosition = 16 - newValue * 0.32;
          this.tooltip.innerHTML = `<span>${this.range.value}</span>`;
          this.brightness = this.range.value;
          this.tooltip.style.left = `calc(${newValue}% + (${newPosition}px))`;
          document.documentElement.style.setProperty(
            "--range-progress",
            `calc(${newValue}% + (${newPosition}px))`
          );
        };
      document.addEventListener("DOMContentLoaded", this.setValue);
      this.range.addEventListener("input", this.setValue);
    });

  }
  get f() { return this.form.controls; }

  FillForm(data: any) {
    if (data != "") {
      this.id = data.id;
      if (data.isActive == "Active")
        this.active = true;
      else
        this.active = false;
      this.vmsOn = data.vmsOn;
      this.selectedZone = data.zoneId;
      this.installDate = data.installDate.slice(0, 10);
      this.brightness = data.brightnessCtrl;
      this.selectedVmdType = data.vmdType;
      this.form.setValue({
        vmsId: data.vmsId,
        serialNo: data.serialNo,
        description: data.description,
        zoneId: data.zoneId,
        installDate: this.installDate,
        longitude: data.longitude,
        latitude: data.latitude,
        height: data.height,
        width: data.width,
        ipAddress: data.ipAddress,
        isActive: data.isActive,
        brightnessCtrl: data.brightnessCtrl,
        vmson: data.vmsOn,
        vmdType: data.vmdType
      })
    }
  }
  BuildForm() {
    this.form = this.formBuilder.group({
      vmsId: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9]*$")]],
      zoneId: ['', Validators.required],
      serialNo: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9]*$")]],
      description: ['', [Validators.required]],
      installDate: ['', [Validators.required]],
      latitude: ['', [Validators.required, Validators.pattern('^([0-9]{1,2}|1[0-7][0-9]|180)(\.[0-9]{1,20})$')]],
      longitude: ['', [Validators.required, Validators.pattern('^([0-9]{1,2}|1[0-7][0-9]|180)(\.[0-9]{1,20})$')]],
      height: ['', [Validators.required, Validators.pattern("^([0-9])*$")]],
      width: ['', [Validators.required, Validators.pattern("^([0-9])*$")]],
      ipAddress: ['', [Validators.required, Validators.pattern("(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)")]],
      isActive: [false, [Validators.required]],
      brightnessCtrl: ['', [Validators.required]],
      vmson: [false, [Validators.required]],
      vmdType: ['', Validators.required],
    });
    this.GetZones();
    this.GetVMDType();
  }

  getErrorMessage(_controlName: any, _controlLable: any, _isPattern: boolean, _msg: string) {
    return getErrorMsg(this.form, _controlName, _controlLable, _isPattern, _msg);
  }

  BackToList() {
    this.router.navigate(['masters/vms-master']);
  }
  GetVMDType() {
    this.adminFacade.getConfigurationByUnit("VMDType").subscribe(res => {
      if (res != undefined && res != null) {
        this.vmdTypes = res;
      }
    });
  }
  GetZones() {
    let _request = new InputRequest();
    _request.currentPage = 0;
    _request.pageSize = 0;
    _request.startId = 0;
    this.adminFacade.getZonesForDrp(_request).subscribe(res => {
      if (res != undefined && res != null) {
        this.zones = res.data;
        console.log(this.zones);
      }
    });
  }

  BrightnessChage() {
    this.brightness = this.form.controls.brightnessCtrl.value;
  }
  OpenZoneMap() {
    if (this.selectedZone == 0)
      this.toaster.error("Zone not selected.", "Error", { positionClass: "toast-bottom-right" })
    else {
      this.adminFacade.getZoneCoordinates(this.selectedZone).subscribe(res => {
        this._zoneCoords = res;
        let cordsArr: any[] = [];
        res.forEach((ele: any) => {
          let lat = Number(ele.latitude);
          let long = Number(ele.longitude);
          let cords = [lat, long];
          cordsArr.push(cords);
        });

        const modalRef = this.modalService.open(CmMapBoxComponent, { ariaLabelledBy: 'modal-basic-title', size: 'xl' });
        modalRef.componentInstance.zoneId = this.selectedZone;
        modalRef.componentInstance.emitService.subscribe((emmitedValue: any) => {
          this.form.controls["latitude"].setValue(emmitedValue.lat);
          this.form.controls["longitude"].setValue(emmitedValue.lng);
          this.latVal = emmitedValue.lat;
          this.lonVal = emmitedValue.lng;
        });

      });
    }
  }
  onSubmit() {
    this.AddVmsMaster(0);
  }
  descriptionCheck() {
    let description = this.form.controls.description.value;
    if (description.trim() == "") {
      this.getErrorMessage("description", "Description", false, "Invalid data in description");
      this.form.patchValue({ description: "" });
    }
  }
  AddVmsMaster(type?: any) {
    let _vmsMaster = new VmsMaster();
    if (this.id != 0)
      _vmsMaster.id = this.id;
    _vmsMaster.vmsId = this.form.controls.vmsId.value;
    _vmsMaster.zoneId = this.form.controls.zoneId.value;
    _vmsMaster.serialNo = this.form.controls.serialNo.value;
    _vmsMaster.description = this.form.controls.description.value;
    _vmsMaster.height = this.form.controls.height.value;
    _vmsMaster.width = this.form.controls.width.value;
    _vmsMaster.latitude = this.form.controls.latitude.value;
    _vmsMaster.longitude = this.form.controls.longitude.value;
    _vmsMaster.ipAddress = this.form.controls.ipAddress.value;
    _vmsMaster.createdBy = this.global.UserCode;
    _vmsMaster.brightnessCtrl = this.form.controls.brightnessCtrl.value;
    _vmsMaster.vmsOn = this.vmsOn;
    _vmsMaster.installDate = this.form.controls.installDate.value;
    _vmsMaster.isActive = this.active;
    if (type == 1)
      _vmsMaster.isDeleted = true;
    if (this.id != 0) {
      this.adminFacade.updateVms(_vmsMaster).subscribe(r => {
        if (r == 0) {
          this.toaster.error("Error occured while saving data");
        } else {
          this.toaster.success("Updated successfully.");
          this.clearForm();
          this.BackToList();
        }
      })
    }
    else {
      this.adminFacade.addVMS(_vmsMaster).subscribe(r => {
        if (r == 0) {
          this.toaster.error("Error occured while saving data");
        } else {
          this.toaster.success("Saved successfully.");
          this.clearForm();
          this.BackToList();
        }
      })
    }
  }

  clearForm() {
    this.id = 0;
    this.form.reset();
    this.form.controls["isActive"].setValue(false);
  }
  DeleteVMS() {
    this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to remove this VMS... ?')
      .then((confirmed) => { if (confirmed == true) this.RemoveVMS() })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }
  RemoveVMS() {
    this.AddVmsMaster(1);
    this.router.navigate(['masters/vms-master']);
  }

  ValidateVMSID() {
    let vmsid = this.form.controls["vmsId"].value;
    if (vmsid != undefined && vmsid != "") {
      this.adminFacade.ValidateVMSId(vmsid, this.id).subscribe(res => {
        if (res == 0) {
          this.form.patchValue({ vmsId: "" });
          this.toaster.error("VMSID already in use.");
        }
      })
    }
  }

  ValidateIPAddress() {
    let ipadd = this.form.controls["ipAddress"].value;
    if (ipadd != undefined && ipadd != "") {
      this.adminFacade.ValidateIPAddress(ipadd, this.id).subscribe(res => {
        if (res == 0) {
          this.form.patchValue({ ipAddress: "" });
          this.toaster.error("IP Address already in use.");
        }
      })
    }
  }



}

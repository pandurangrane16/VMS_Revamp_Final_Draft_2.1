import { ViewportScroller } from '@angular/common';
import { Component, ElementRef, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminFacadeService } from 'src/app/facade/facade_services/admin-facade.service';
import { CommonFacadeService } from 'src/app/facade/facade_services/common-facade.service';
import { ConfirmationDialogService } from 'src/app/facade/services/confirmation-dialog.service';
import { ZoneCoords, ZoneMaster } from 'src/app/models/admin/ZoneMaster';
import { Globals } from 'src/app/utils/global';
import { getErrorMsg } from 'src/app/utils/utils';

@Component({
  selector: 'app-add-zone',
  templateUrl: './add-zone.component.html',
  styleUrls: ['./add-zone.component.css']
})
export class AddZoneComponent implements OnInit {
  @ViewChild('scroll', { static: true }) scroll: any;
  form: any = [];
  loading = false;
  btnDis: boolean = false;
  submitting = false;
  isMap: boolean = false;
  lat: number = 0;
  long: number = 0;
  active: boolean = false;
  id: number = 0;
  btnSaveName!: string;
  isEdit: boolean = false;
  //   options = {
  //     layers: [
  //         tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
  //     ],
  //     zoom: 8,
  //     center: latLng(22.29985,73.19555)
  // };
  constructor(private router: Router,
    private global: Globals,
    private formBuilder: FormBuilder,
    private scroller: ViewportScroller,
    private toast: ToastrService,
    private adminFacade: AdminFacadeService,
    private confirmationDialogService: ConfirmationDialogService,
    private common: CommonFacadeService) {
    this.global.CurrentPage = "Add Zone";
    this.BuildForm();
  }
  ngOnInit(): void {
    this.btnSaveName = "Configured Co-Ordinates";
    this.id = 0;
    let data = this.common.getSession("ModelShow");
    this.FillForm(data == null ? "" : JSON.parse(data));
  }
  get f() { return this.form.controls; }
  BuildForm() {
    let _configData = this.adminFacade.getConfiguration().subscribe(res => {
      _configData = res;
      var latitude = res.find((x: any) => x.prmkey == 'lat');
      this.lat = latitude.prmvalue;
      var latitude = res.find((x: any) => x.prmkey == 'long');
      this.long = latitude.prmvalue;
    })
    this.form = this.formBuilder.group({
      zoneName: ['', [Validators.required, Validators.pattern("[A-Za-z0-9][A-Za-z0-9 ]*$")]],
      description: ['', [Validators.required, Validators.pattern("[A-Za-z0-9][A-Za-z0-9 ]*$")]],
      isActive: ['', [Validators.required]],
      //longitude: ['', [Validators.required,Validators.pattern('^-?([0-9]{1,2}|1[0-7][0-9]|180)(\.[0-9]{1,10})$')]]
    });
  }
  getErrorMessage(_controlName: any, _controlLable: any, _isPattern: boolean = false, _msg: string) {
    return getErrorMsg(this.form, _controlName, _controlLable, _isPattern, _msg);
  }
  BackToList() {
    this.router.navigate(['masters/zone-master']);
  }
  onSubmit() {

  }
  ViewMap() {
    this.isMap = true;
    this.scroller.scrollToAnchor("bottom");
    let _zoneMaster = new ZoneMaster();
    _zoneMaster.id = this.id;
    _zoneMaster.zoneName = this.form.controls.zoneName.value;
    _zoneMaster.description = this.form.controls.description.value;
    _zoneMaster.createdBy = this.global.UserCode;
    _zoneMaster.isActive = this.active;
    if (this.id != 0) {
      this.adminFacade.updateZoneMaster(_zoneMaster).subscribe(r => {
        if (r == 0) {
          this.toast.error("Error occured while updating data");
        } else {
          this.toast.success("Updated successfully.");
          this.clearForm();
        }
      })
    }
    else {
      this.adminFacade.addZoneMaster(_zoneMaster).subscribe(r => {
        if (r == 0) {
          this.toast.error("Error occured while saving data");
        } else {
          this.id = r;
          //this.toast.success("Saved successfully.");
          //this.clearForm();

          this.form.controls['zoneName'].disable();
          this.form.controls['description'].disable();
          this.form.controls['isActive'].disable();
        }
      })
    }
  }

  FillForm(data: any) {
    if (data != "") {
      this.btnDis = true;
      this.id = data.id;
      if (this.id != 0) {
        this.isEdit = true;
      }
      if (data.isActive == "Active")
        this.active = true;
      else
        this.active = false;
      this.form.setValue({
        zoneName: data.zoneName,
        description: data.description,
        isActive: data.isActive
      });

      this.btnSaveName = "Submit";
    }
    else
      this.btnDis = false;

  }
  clearForm() {
    this.id = 0;
    this.form.reset();
    this.form.controls["isActive"].setValue(false);
  }
  scrollToBottom(): void {
    this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
  }
  GetLatLong(content: any) {
    if (this.id == 0) {
      this.toast.error("Zone is not available for this request.", "Error", { positionClass: "toast-bottom-right" })
    }
    else {
      let _zoneCoords: any[] = [];
      console.log(content);
      var count = 0;
      content[0].forEach((ele: any) => {
        var _zoneCoord = new ZoneCoords();
        _zoneCoord.id = 0;
        _zoneCoord.zoneId = this.id;
        _zoneCoord.seqNo = count + 1;
        _zoneCoord.latitude = ele.lng;
        _zoneCoord.longitude = ele.lat;
        _zoneCoords.push(_zoneCoord);
        count = count + 1;
      });

      this.adminFacade.addZoneCoordinates(_zoneCoords).subscribe(res => {
        if (res == 0 || res == undefined) {
          this.toast.error("Something Went Wrong..!!! Contact System administrator.", "Error", { positionClass: 'toast-bottom-right' });
        }
        else {
          this.toast.success("Saved Successfully.");
          this.router.navigate(['masters/zone-master']);
        }
      })
    }
  }
  DeleteZone() {
    this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to remove this zone... ?')
      .then((confirmed) => { if (confirmed == true) this.RemoveZone() })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }
  RemoveZone() {
    this.AddUpdateZone(1);
  }

  AddUpdateZone(type?: any) {
    let _zone = new ZoneMaster();
    if (this.id != 0)
      _zone.id = this.id;
    _zone.zoneName = this.form.controls.zoneName.value;
    _zone.description = this.form.controls.description.value;
    _zone.modifiedBy = this.global.UserCode;
    if (type == 1)
      _zone.isDeleted = true;
    if (this.id != 0) {
      this.adminFacade.updateZoneMaster(_zone).subscribe(r => {
        if (r == 0) {
          this.toast.error("Error occured while saving data");
        } else {
          this.toast.success("Updated successfully.");
          this.clearForm();
          this.router.navigate(['masters/zone-master']);
        }
      })
    }
  }
}

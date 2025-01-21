import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AdminFacadeService } from 'src/app/facade/facade_services/admin-facade.service';
import { DashboardService } from 'src/app/facade/services/dashboard/dashboard.service';
import { EmergencyAlert } from 'src/app/models/admin/EmergencyAlert';
import { CommonSelectList } from 'src/app/models/common/cmSelectList';
import { InputRequest } from 'src/app/models/request/inputReq';
import { Globals } from 'src/app/utils/global';

@Component({
  selector: 'app-cm-emergency',
  templateUrl: './cm-emergency.component.html',
  styleUrls: ['./cm-emergency.component.css']
})
export class CmEmergencyComponent implements OnInit {
  _request: any = new InputRequest();
  imgData: any;
  unitType: string = "second";
  unitValue: any;
  pager: number = 0;
  recordPerPage: number = 10000;
  startId: number = 0;
  selectedVMS: any[] = [];
  searchText: string = "";
  emergencyData = new EmergencyAlert();
  dropdownSettingsVms: any;
  _inputVmsData: any;
  label1: string = "Select Controller";
  constructor(private modal: NgbModal, private global: Globals,
    private toast: ToastrService,
    private dashboardFacade: DashboardService,
    private adminFacade: AdminFacadeService) {
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
  title: string = "Emergency Publish";

  passBack() {
    this.modal.dismissAll();
  }
  ngOnInit(): void {
    this.GetVmsDetails();
  }

  getSelectedVms(eve: any, type: number) {
    this.selectedVMS = [];
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
        this.selectedVMS.forEach((element: any) => {
          _idx++;
          if (element == eve.value)
            this.selectedVMS.splice(_idx - 1, 1);
        });
      }
    }
  }
  GetVmsDetails() {
    this._request.currentPage = this.pager;
    this._request.pageSize = this.recordPerPage;
    this._request.startId = this.startId;
    this._request.searchItem = this.searchText;

    this.adminFacade.getVmss(this._request).subscribe(data => {
      if (data != null) {
        let commonList: CommonSelectList[] = [];
        data.data.forEach((ele: any) => {
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
    });
  }

  readURL(event: any): void {
    if (event.target.files[0] && event.target.files[0]) {
      if (event.target.files[0].type.includes("image")) {
        const file = event.target.files[0];

        const reader = new FileReader();
        reader.onload = (e) => (this.imgData = reader.result);

        reader.readAsDataURL(file);
      } else {
        this.toast.error("An invalid file uploaded.");
      }
    }
  }

  ValidateData() {
    if (this.selectedVMS == undefined || this.selectedVMS.length == 0) {
      this.toast.error("VMD Controller is not selected.");
      return false;
    }
    else if (this.imgData == undefined || this.imgData == "") {
      this.toast.error("Media is not selected.");
      return false;
    }
    else if (this.unitValue == "" || this.unitValue == undefined) {
      this.toast.error("Duration unit is not entered.");
      return false;
    }
    return true;
  }

  SaveEmergencyData() {
    if (this.ValidateData()) {
      this.emergencyData.vmsid = this.selectedVMS;
      this.emergencyData.createdBy = this.global.UserCode;
      this.emergencyData.content = this.imgData;
      this.emergencyData.status = 0;
      this.emergencyData.type = "image";
      this.emergencyData.unitType = this.unitType == null ? "second" : this.unitType;
      this.emergencyData.unitValue = this.unitValue;
      this.dashboardFacade.addEmergencyData(this.emergencyData).subscribe(res => {
        if (res != this.selectedVMS.length -1) {
            this.toast.success("Emergency publish saved successfully.");
            this.modal.dismissAll();
        }
        else
          this.toast.error("An error occured while saving data.");
      })
    }

  }

}

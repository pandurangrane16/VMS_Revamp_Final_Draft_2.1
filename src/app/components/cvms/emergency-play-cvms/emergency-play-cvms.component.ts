import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AdminFacadeService } from 'src/app/facade/facade_services/admin-facade.service';
import { CommonFacadeService } from 'src/app/facade/facade_services/common-facade.service';
import { CVMSMediaFacadeServiceService } from 'src/app/facade/facade_services/cvmsmedia-facade-service.service';
import { ConfirmationDialogService } from 'src/app/facade/services/confirmation-dialog.service';
import { CommonSelectList } from 'src/app/models/common/cmSelectList';
import { InputRequest } from 'src/app/models/request/inputReq';
import { Globals } from 'src/app/utils/global';

@Component({
  selector: 'app-emergency-play-cvms',
  templateUrl: './emergency-play-cvms.component.html',
  styleUrls: ['./emergency-play-cvms.component.css']
})
export class EmergencyPlayCvmsComponent {
  _request: any = new InputRequest();
  constructor(private _commonFacade: CommonFacadeService,
    private global: Globals,
    private _router: Router,
    private mediaFacade: CVMSMediaFacadeServiceService,
    private confirmationDialogService: ConfirmationDialogService,
    public datepipe: DatePipe,
    private toast: ToastrService,
    public modalService: NgbModal,
    private adminFacade: AdminFacadeService) {
    this.global.CurrentPage = "CVMS Emergency Play";
    this.dropdownSettingsVms = {
      singleSelection: true,
      idField: 'value',
      textField: 'displayName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true,
    };
  }


  label1: string = "Select Controller";
  label2: string = "Select Media Player";
  vmsIds: any[] = [];
  dropdownSettingsVms: any;
  _inputVmsData: any;
  _inputPlayerData: any;
  ngOnInit(): void {
    this.GetVmsDetails();
    //this.getMedialistData();
  }
  GetVmsDetails() {
    this._request.currentPage = 0;
    this._request.pageSize = 0;
    this._request.startId = 0;
    this._request.searchItem = "";

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
        this._inputVmsData = _data;
      }
    });
  }
  getSelectedVms(eve: any, type: any) {
    if (eve.length > 0) {
      if (type == 1) {
        eve.forEach((vms: any) => {
          this.vmsIds.push(vms.value);
        });
      }
      else {
        eve.forEach((ele: any) => {
          var idx = 0;
          this.vmsIds.forEach(element => {
            if (element == ele.value) {
              this.vmsIds.splice(idx, 1);
            }
            idx++;
          });
        });
      }
    }
    else if (eve.length == 0)
      this.vmsIds = [];
    else {
      if (type == 1)
        this.vmsIds.push(eve.value);
      else {
        var idx = 0;
        this.vmsIds.forEach(element => {
          if (element == eve.value) {
            this.vmsIds.splice(idx, 1);
          }
          idx++;
        });
      }
    }
  }

  getMediaPlayerList() {
    //let _vmsIpAdd = this.vmsIds[0];
    let _vmsIpAdd = "192.100.100.300";
    this.mediaFacade.getMediaPlayerByIpAdd(_vmsIpAdd).subscribe(res => {
      if (res != null) {
        if(res.length > 0){
          let commonList: CommonSelectList[] = [];
          res.forEach((ele:any) => {
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
        }
      }
    })
  }
  
}

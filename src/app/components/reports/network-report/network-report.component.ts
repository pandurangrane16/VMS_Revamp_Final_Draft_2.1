import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AdminFacadeService } from 'src/app/facade/facade_services/admin-facade.service';
import { ReportFacadeService } from 'src/app/facade/facade_services/report-facade.service';
import { SessionService } from 'src/app/facade/services/common/session.service';
import { CommonSelectList } from 'src/app/models/common/cmSelectList';
import { NetworkReport } from 'src/app/models/reports/networkreport';
import { InputRequest } from 'src/app/models/request/inputReq';
import { Globals } from 'src/app/utils/global';

@Component({
  selector: 'app-network-report',
  templateUrl: './network-report.component.html',
  styleUrls: ['./network-report.component.css']
})
export class NetworkReportComponent implements OnInit {
  _request: any = new InputRequest();
  imgData: any;
  minDate: any;
  selectedStatus: number;
  modelFromDate: NgbDateStruct;
  modelToDate: NgbDateStruct;
  unitType: string = "second";
  unitValue: any;
  pager: number = 0;
  recordPerPage: number = 10;
  startId: number = 0;
  searchText: string = "";
  _inputVmsData: any;
  dropdownSettingsVms: any;
  label1: string = "Select Controller";
  listOfData: any;
  totalPages: number = 1;
  totalRecords!: number;
  vmsIds: any[] = [];
  headerArr = [
    { "Head": "Device ID", "FieldName": "vmsCode", "type": "string" },
    { "Head": "Device Name", "FieldName": "vmsName", "type": "string" },
    { "Head": "Status", "FieldName": "statusStr", "type": "string" },
    { "Head": "Date/Time", "FieldName": "networkTime", "type": "string" },
  ];
  xlsReportPath:any;
  constructor(
    private global: Globals,
    private adminFacade: AdminFacadeService,
    private _toast: ToastrService,
    private _reportService: ReportFacadeService,
    private _sessionService:SessionService
  ) {
    this.global.CurrentPage = "Network Report";
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
  ngOnInit(): void {
    this.GetVmsDetails();
    let _date = new Date();
    let _day = _date.getUTCDate();
    let _mon = _date.getMonth() + 1;
    let _year = _date.getFullYear() - 2;
    this.minDate = {
      year: _year,
      month: _mon,
      day: _day
    }
    this.xlsReportPath = this._sessionService.getnetworkreportXview();
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
    console.log(this.vmsIds);
  }

  onPager(pager: number) {
    this._request.pageSize = this.recordPerPage;
    this.pager = pager;
    this.startId = (this.pager - 1) * this.recordPerPage;
    this.ActionSubmit(0);
  }

  onRecordPageChange(recordPerPage: number) {
    this._request.pageSize = recordPerPage;
    this.pager = recordPerPage;
    this.recordPerPage = recordPerPage;
    this.startId = 0;
    this.pager = 1;
    console.log(this.recordPerPage);
    this.ActionSubmit(0);
  }

  onPageSearch(search: string) {
    this.searchText = search;
    this.ActionSubmit(0);
  }

  ActionSubmit(type:number) {
    let _reportRequest = new NetworkReport();
    _reportRequest.currentPage = this.pager;
    _reportRequest.pageSize = this._request.pageSize;
    _reportRequest.startId = this.startId;
    _reportRequest.fromDate = this.modelFromDate.year + "-" + this.modelFromDate.month + "-" + this.modelFromDate.day + " 00:00:00";
    _reportRequest.toDate = this.modelToDate.year + "-" + this.modelToDate.month + "-" + this.modelToDate.day + " 00:00:00";
    _reportRequest.username = this.global.UserCode;
    _reportRequest.networkStatus = this.selectedStatus;
    if (this.vmsIds.length > 0) {
      _reportRequest.vmsId = this.vmsIds;
      if(type == 0) {
        this._reportService.GetNetworkDetailsRpt(_reportRequest).subscribe(res => {
          if (res != null) {
            if(res.data.length > 0 ){
              res.data.forEach((d:any) => {
                var datePipe = new DatePipe("en-US");
                d.networkTime = datePipe.transform(d.networkTime, 'dd-MM-yyyy HH:mm:ss');
                if(d.status == 0)
                  d.statusStr = "Disconnected";
                else 
                  d.statusStr = "Connected";
              });
              this.listOfData = res.data;
              var _length = res.totalRecords / this.recordPerPage;
              if (_length > Math.floor(_length) && Math.floor(_length) != 0)
                this.totalRecords = this.recordPerPage * (_length);
              else if (Math.floor(_length) == 0)
                this.totalRecords = 10;
              else
                this.totalRecords = res.totalRecords;
              this.totalPages = this.totalRecords / this.pager;
            } else {
              this.listOfData = [];
              this._toast.error("No Records Found");
            }
            
          } else {
            this._toast.error("Something went wrong.");
          }
        })
      } else {
        this._reportService.ExpNetworkDetailsRpt(_reportRequest).subscribe(res => {
          if (res != null) {
            if(type == 1)
              window.open(this.xlsReportPath + "Network_Report.pdf");
            if(type == 2)
              window.open(this.xlsReportPath + "Network_Report.xls");
          } else {
            this._toast.error("Something went wrong.");
          }
        })
      }
     
    }
    else
      this._toast.error("Controller not selected.");
  }
}

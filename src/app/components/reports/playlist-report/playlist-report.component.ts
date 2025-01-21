import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AdminFacadeService } from 'src/app/facade/facade_services/admin-facade.service';
import { ReportFacadeService } from 'src/app/facade/facade_services/report-facade.service';
import { SessionService } from 'src/app/facade/services/common/session.service';
import { CommonSelectList } from 'src/app/models/common/cmSelectList';
import { NetworkReport } from 'src/app/models/reports/networkreport';
import { InputRequest } from 'src/app/models/request/inputReq';
import { Globals } from 'src/app/utils/global';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { SocketFacadeService } from 'src/app/facade/facade_services/socket-facade.service';
import { PlaylistRequest } from 'src/app/models/request/PlaylistRequest';

@Component({
  selector: 'app-playlist-report',
  templateUrl: './playlist-report.component.html',
  styleUrls: ['./playlist-report.component.css']
})
export class PlaylistReportComponent {
  _request: any = new InputRequest();
  imgData: any;
  minDate: any;
  selectedStatus: number;
  modelFromDate: NgbDateStruct;
  modelToDate: NgbDateStruct;
  unitType: string = "second";
  unitValue: any;
  pager: number = 0;
  recordPerPage: number = 0;
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
    { "Head": "Request ID", "FieldName": "id", "type": "number" },
    { "Head": "VMS IDs", "FieldName": "vmsIdscnt", "type": "string" },
    { "Head": "From Time", "FieldName": "fromTime", "type": "string" },
    { "Head": "To Time", "FieldName": "toTime", "type": "string" },
    { "Head": "Status", "FieldName": "statuslable", "type": "string" },
    { "Head": "Action", "FieldName": "actions", "type": "button" },
  ];
  btnArray: any[] = [{ "name": "PDF", "icon": "fa fa-file-pdf-o", "tip": "", "action": "pdf" },
    //{ "name": "Excel", "icon": "fa fa-file-excel-o", "tip": "", "action": "excel" }
  ];
  xlsReportPath: any;
  constructor(
    private global: Globals,
    private adminFacade: AdminFacadeService,
    private _toast: ToastrService,
    private _reportService: ReportFacadeService,
    private _sessionService: SessionService,
    private _socketFacade: SocketFacadeService
  ) {
    this.global.CurrentPage = "Playlist Report";
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
    //this.ConnectSocket();
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
    this.GetRequestStatus();
  }

  ConnectSocket() {
    this._socketFacade.connect();
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

  ActionSubmit(type: number) {
    let plReq = new PlaylistRequest();
    plReq.startId = this.startId;
    plReq.PageSize = this.recordPerPage == 0 ? 10 : this.recordPerPage;
    plReq.fromDate = this.modelFromDate.year + "-" + ("0" + this.modelFromDate.month).slice(-2) + "-" + ("0" + this.modelFromDate.day).slice(-2) + " 00:00:00";
    plReq.toDate = this.modelToDate.year + "-" + ("0" + this.modelToDate.month).slice(-2) + "-" + ("0" + this.modelToDate.day).slice(-2) + " 23:59:59";
    plReq.reportType = "Playlist";
    if (this.vmsIds.length > 0) {
      plReq.vmsId = this.vmsIds;
    }
    else
      this._toast.error("Controller not selected.");

    this._reportService.addReportEnquiry(plReq).subscribe(res => {
      if (res != "0") {
        this._toast.success("Request has been placed successfully. Please wait sometime to generate report.");
      } else {
        this._toast.error("Something went wrong");
        console.log(res);
      }
    })
  }

  GetRequestStatus() {
    this._reportService.getReportEnquiryDetails(0).subscribe(res => {
      if (res != null) {
        this.listOfData = res;
        this.listOfData.forEach((element: any) => {
          let ids = element.vmsIds.split(",");
          let cnt = ids.length;
          if (cnt == 0)
            element.vmsIdscnt = element.vmsIds;
          else
            element.vmsIdscnt = ids[0] + "+" + (cnt - 1);
          if (element.status == 0)
            element.statuslable = "Pending";
          else if (element.status == 1)
            element.statuslable = "Completed";
        });
      } else {
        console.log(res);
      }
    })
  }
  ButtonAction(actiondata: any) {
    let _d = this.listOfData.find((x: any) => x.id == actiondata.data.id);
    if (_d.status == 0)
      this._toast.error("Report generation process is not completed. Please wait for some time.", "Error", { positionClass: "toast-bottom-right" })
    else {
      window.open(_d.rptPath);
    }
  }
}

import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonFacadeService } from 'src/app/facade/facade_services/common-facade.service';
import { CVMSMediaFacadeServiceService } from 'src/app/facade/facade_services/cvmsmedia-facade-service.service';
import { ConfirmationDialogService } from 'src/app/facade/services/confirmation-dialog.service';
import { InputRequest } from 'src/app/models/request/inputReq';
import { Globals } from 'src/app/utils/global';

@Component({
  selector: 'app-mediascheduler-list',
  templateUrl: './mediascheduler-list.component.html',
  styleUrls: ['./mediascheduler-list.component.css']
})
export class MediaschedulerListComponent {
  minDate: any;
  modelFromDate: any;
  modelToDate: any;
  searchText!: string;
  page: any;
  tabno: number;
  listOfMediaUpload: any;
  listOfMediaUploadPending: any;
  listOfMediaUploadApproved: any;
  listOfMediaUploadRejected: any;
  totalPages: number = 1;
  pager: number = 1;
  totalRecords!: number;
  recordPerPage: number = 10;
  startId!: number;
  isSearch: boolean = false;
  closeResult!: string;
  _request: any = new InputRequest();

  headerArr = [
    // { "Head": "ID", "FieldName": "id", "type": "number" },
    { "Head": "Controller Name", "FieldName": "ipAddress", "type": "string" },
    { "Head": "ScheduleName", "FieldName": "schedulename", "type": "string" },
    { "Head": "Media Name", "FieldName": "mediaPlayerName", "type": "string" },
    //{ "Head": "From Date", "FieldName": "fromdate", "type": "string" },
    // { "Head": "To Date", "FieldName": "enddate", "type": "string" },
    { "Head": "Status", "FieldName": "statusdesc", "type": "string" },
    { "Head": "Created Date", "FieldName": "creationTime", "type": "string" },
  ];
  listOfMedialist: any = [];
  btnArray: any[] = [];

  constructor(private _commonFacade: CommonFacadeService,
    private global: Globals,
    private _router: Router,
    private mediaFacade: CVMSMediaFacadeServiceService,
    private confirmationDialogService: ConfirmationDialogService,
    public datepipe: DatePipe,
    private toast: ToastrService,
    public modalService: NgbModal) {
    this.global.CurrentPage = "Media Player Scheduler List CVMS";
  }
  OnTabChange(status: number) {
    this.tabno = status;
    this.searchText = "";
    this.isSearch = false;
    this.getMediaDetails();
  }

  //Common Functionalities
  onPager(pager: number) {
    this._request.pageSize = this.recordPerPage;
    this.pager = pager;
    this.startId = (this.pager - 1) * this.recordPerPage;
    this.getMediaDetails();
  }

  onRecordPageChange(recordPerPage: number) {
    console.log("Record Per Page : " + recordPerPage);
    this._request.pageSize = recordPerPage;
    this.pager = recordPerPage;
    this.recordPerPage = recordPerPage;
    this.startId = 0;
    this.pager = 1;
    this.getMediaDetails();
  }

  onPageSearch(search: string) {
    this.isSearch = true;
    this.searchText = search;
    this.getMediaDetails();
  }

  SearchWithId(_searchItem: any) {
    this._commonFacade.setSession("ModelShow", JSON.stringify(_searchItem));
    this._router.navigate(['users/add-user']);
  }

  ngOnInit(): void {
    this.tabno = 2;
    this.getMediaDetails();
  }
  OpenUploadMedia() {
    this._router.navigate(['cvms/createMediaPlayerScheduler']);
  }
  getMediaDetails() {
    this._request.currentPage = this.pager;
    this._request.pageSize = this.recordPerPage;
    this._request.startId = this.startId;
    this._request.searchItem = this.searchText;
    this.mediaFacade.getMediaschedulersList(this._request, this.tabno).subscribe(data => {
      if (data != null) {
        this.listOfMediaUpload = data.data;
        this.listOfMediaUpload.forEach((element: any) => {

          if (element.creationTime != null) {

            var _d = new Date(element.creationTime);
            var _dateStr = this.datepipe.transform(_d, "dd-MM-yyyy HH:mm:ss");
            element.creationTime = _dateStr;

            let _data = JSON.parse(element.requestData);
            element.schedulename = _data.name;
            element.mediaPlayerName = _data.mediaPlayerName;



            let _dtFrom = new Date(_data.fromdate);
            //console.log(_dtFrom);
            let _dtTo = new Date(_data.todate);
            let _fromDay = _dtFrom.getDate().toLocaleString();
            let _fromMonth = (_dtFrom.getMonth() + 1).toLocaleString();
            let _fromYear = _dtFrom.getFullYear();
            let _fromHrs = _dtFrom.getHours().toLocaleString();
            let _fromMins = _dtFrom.getMinutes().toLocaleString();
            let _fromSecs = _dtFrom.getSeconds().toLocaleString();
            let _toDay = _dtTo.getDate().toLocaleString();
            let _toMonth = (_dtTo.getMonth() + 1).toLocaleString();
            let _toYear = _dtTo.getFullYear();
            let _toHrs = _dtTo.getHours().toLocaleString();
            let _toMins = _dtTo.getMinutes().toLocaleString();
            let _toSecs = _dtTo.getSeconds().toLocaleString();
            element.fromdate = _fromDay.padStart(2, '0') + "-" + _fromMonth.padStart(2, '0') + "-" + _fromYear + " " + _fromHrs.padStart(2, '0') + ":" + _fromMins.padStart(2, '0') + ":" + _fromSecs.padStart(2, '0');
            element.enddate = _toDay.padStart(2, '0') + "-" + _toMonth.padStart(2, '0') + "-" + _toYear + " " + _toHrs.padStart(2, '0') + ":" + _toMins.padStart(2, '0') + ":" + _toSecs.padStart(2, '0');
            element.fromdate = this.datepipe.transform(_data.fromdate,"dd-MM-yyyy HH:mm:ss")
            element.enddate =this.datepipe.transform(_data.todate,"dd-MM-yyyy HH:mm:ss")
            // element.fromdate = this.datepipe.transform(fromdate, "dd-MM-yyyy HH:mm:ss");

            // var todate = new Date(_data.todate);
            // element.enddate = this.datepipe.transform(todate, "dd-MM-yyyy HH:mm:ss");        
          }


          if (element.status == 1) {
            element.statusdesc = "Sent Successfully"
          }
          else if (element.status == 0) {
            element.statusdesc = "Sent Pending"
          }
          else if (element.status == 2) {
            element.statusdesc = "Sent Failed"
          }
        });
        var _length = data.totalRecords / this.recordPerPage;
        if (_length > Math.floor(_length) && Math.floor(_length) != 0)
          this.totalRecords = this.recordPerPage * (_length);
        else if (Math.floor(_length) == 0)
          this.totalRecords = 10;
        else
          this.totalRecords = data.totalRecords;
        this.totalPages = this.totalRecords / this.pager;
        //this.getMediaByStatus(this.tabno);
      }
    })
  }

  getMediaByStatus(status: number) {
    if (status == 0) {
      this.listOfMediaUploadPending = this.listOfMediaUpload.filter((x: any) => x.status == 0);
    } else if (status == 1) {
      this.listOfMediaUploadApproved = this.listOfMediaUpload.filter((x: any) => x.status == 1);
    } else if (status == 2) {
      this.listOfMediaUploadRejected = this.listOfMediaUpload.filter((x: any) => x.status == 2);
    }
  }

  ButtonAction(actiondata: any) { }
}

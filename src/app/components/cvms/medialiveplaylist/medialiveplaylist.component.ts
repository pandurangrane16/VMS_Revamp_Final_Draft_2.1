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
  selector: 'app-medialiveplaylist',
  templateUrl: './medialiveplaylist.component.html',
  styleUrls: ['./medialiveplaylist.component.css']
})
export class MedialiveplaylistComponent {
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
      { "Head": "MediaPlayerName", "FieldName": "mediaPlayerName", "type": "string" },   
      { "Head": "Status", "FieldName": "statusdesc", "type": "string" },
      { "Head": "Action", "FieldName": "actions", "type": "button" },
      { "Head": "Created Date", "FieldName": "creationTime", "type": "string" },
      
    ];
    listOfMedialist:any=[];
    btnArray: any[] = [
      { 
        "name": "Error", 
        "icon": "icon-eye",  
        "tip": "View Error Message", 
        "action": "error", 
        "condition": (row: any) => row.status === 2 
      }
    ];
  
    constructor(private _commonFacade: CommonFacadeService,
      private global: Globals,
      private _router: Router,
      private mediaFacade: CVMSMediaFacadeServiceService,
      private confirmationDialogService: ConfirmationDialogService,
      public datepipe: DatePipe,
      private toast: ToastrService,
      public modalService: NgbModal) {
      this.global.CurrentPage = "Live Play List CVMS";
      
    }
    OnTabChange(status: number) {
      this.tabno = status;
      this.searchText = "";
      this.isSearch = false;
      this.getMediaDetails();
    }
  
    //Common Functionalities
    onPager(pager: number) {
      this._request.pageSize = Number(this.recordPerPage);
      this.pager = pager;
      this.startId = (this.pager - 1) * Number(this.recordPerPage);
      this.getMediaDetails();
    }
    Show_error(element?: any) {
      if (!element || !element.responseData) {
        alert("No error information available.");
        return;
      }
    
      try {
        const responseObj = JSON.parse(element.responseData);
        const message = responseObj.message || "No message field in response.";
      
        this.confirmationDialogService
          .confirm('Error Message', message)
          .catch(() => {}); 
      } catch (err) {
        this.confirmationDialogService
          .confirm('Error', 'Failed to parse error message.')
          .catch(() => {});
      }
    
    }
    onRecordPageChange(recordPerPage: number) {
      console.log("Record Per Page : " + recordPerPage);
      this._request.pageSize = Number(recordPerPage);
      this.pager = Number(recordPerPage);
      this.recordPerPage = Number(recordPerPage);
      this.startId = 0;
      this.pager = 1;
      this.getMediaDetails();
    }
  
    onPageSearch(search: string) {
      this.isSearch = true;
      this.searchText = search;
      this.getMediaDetails();
    }
   
  
    ngOnInit(): void {
      this.tabno = 2;
      this.getMediaDetails();
    }
    OpenLiveplayMedia() {
      this._router.navigate(['cvms/livePlay']);
    }
    getMediaDetails() {
      this._request.currentPage = this.pager;
      this._request.pageSize = Number(this.recordPerPage);
      this._request.startId = this.startId;
      this._request.searchItem = this.searchText;
      this.mediaFacade.GetEmergencyMediaList(this.tabno,this._request).subscribe(data => {
        if (data != null) {
          this.listOfMediaUpload = data.data;
          this.listOfMediaUpload.forEach((element: any) => {
            let _jsonVal = JSON.parse(element.requestData);
            element.mediaPlayerName =_jsonVal.mediaPlayerName
            if(element.status == 2)
              {    const parsedData2 = JSON.parse(element.responseData);
              const message= parsedData2.message;
              element.ErrorMessage=message;}
            console.log(_jsonVal);
            if (element.creationTime != null) {
              var _d = new Date(element.creationTime);
              var _dateStr = this.datepipe.transform(_d, "dd-MM-yyyy HH:mm:ss");
              element.creationTime = _dateStr;
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
          var _length = data.totalRecords / Number(this.recordPerPage);
          if (_length > Math.floor(_length) && Math.floor(_length) != 0)
            this.totalRecords = Number(this.recordPerPage) * (_length);
          else if (Math.floor(_length) == 0)
            this.totalRecords = 10;
          else
            this.totalRecords = data.totalRecords;
          this.totalPages = this.totalRecords / this.pager;
          //this.getMediaByStatus(this.tabno);
          this._router.navigate(['cvms/livePlaylist']);
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

    ButtonAction(actiondata: any) { 
      if (actiondata.action === "error") {
        this.Show_error(actiondata.data);
      }
    }
}

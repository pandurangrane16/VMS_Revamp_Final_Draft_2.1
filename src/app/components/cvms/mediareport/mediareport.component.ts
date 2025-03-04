import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminFacadeService } from 'src/app/facade/facade_services/admin-facade.service';
import { CommonFacadeService } from 'src/app/facade/facade_services/common-facade.service';
import { CVMSMediaFacadeServiceService } from 'src/app/facade/facade_services/cvmsmedia-facade-service.service';
import { CommonSelectList } from 'src/app/models/common/cmSelectList';
import { InputRequest } from 'src/app/models/request/inputReq';
import { Mediascheduler } from 'src/app/models/vcms/mediascheduler';
import { Globals } from 'src/app/utils/global';
import { getErrorMsg } from 'src/app/utils/utils';
import { parse, format, isValid } from 'date-fns';
import { DatePipe } from '@angular/common';
import { catchError } from 'rxjs';
import cronstrue from 'cronstrue';
import { NetworkReport } from 'src/app/models/reports/networkreport';
import { ReportFacadeService } from 'src/app/facade/facade_services/report-facade.service';
import { SessionService } from 'src/app/facade/services/common/session.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Mediareport } from 'src/app/models/vcms/report';




@Component({
    selector: 'app-mediareport',
    templateUrl: './mediareport.component.html',
    styleUrls: ['./mediareport.component.css']
})
export class MediareportComponent {

    _request: any = new InputRequest();
    imgData: any;
    minDate: any;
    selectedStatus: string;
    modelFromDate: NgbDateStruct;
    modelFromTime:{ hour: 0, minute: 0, second: 0 };
    modelToTime:{ hour: 0, minute: 0, second: 0 };
    fullDateTime: string = '';
    modelToDate: NgbDateStruct;
    unitType: string = "second";
    unitValue: any;
    pager: number = 0;
    recordPerPage: number = 10;
    startId: number = 0;
    searchText: string = "";
    _inputVmsData: any;
    dropdownSettingsVms: any;
    label1: string = "Select Media Player";
    listOfData: any;
    totalPages: number = 1;
    totalRecords!: number;
    vmsIds: any[] = [];
    Selectedmediaplayer: any;
    _inputPlayerData: any;
    headerArr = [
      { "Head": "ID", "FieldName": "id", "type": "number" },      
      { "Head": "Type", "FieldName": "type", "type": "string" },   
      { "Head": "SchedulerId", "FieldName": "mediaPlayerSchedulerId", "type": "number" },
      { "Head": "SchedulerName ", "FieldName": "mediaPlayerSchedulerName", "type": "string" },
      { "Head": "PlayerId ", "FieldName": "mediaPlayerId", "type": "number" },
      { "Head": "PlayerName", "FieldName": "mediaPlayerName", "type": "string" },
      { "Head": "TileNo", "FieldName": "tileNo", "type": "number" },
      { "Head": "MediaId", "FieldName": "mediaId", "type": "number" },
      { "Head": "MediaName", "FieldName": "mediaName", "type": "string" },
      { "Head": "StartTime", "FieldName": "startTime", "type": "string" },
      { "Head": "EndTime", "FieldName": "endTime", "type": "string" },
      { "Head": "DurationPlayed", "FieldName": "durationPlayed", "type": "number" },
      { "Head": "Status", "FieldName": "status", "type": "string" },

      
    ];
    xlsReportPath: any;
    constructor(
        private global: Globals,
        private adminFacade: AdminFacadeService,
        private _toast: ToastrService,
        private _reportService: ReportFacadeService,
        private _CVMSfacade: CVMSMediaFacadeServiceService,
        private _sessionService: SessionService,
        public datepipe: DatePipe,
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
        this.getMediaPlayerList();
        //this.xlsReportPath = this._sessionService.getnetworkreportXview();

    }
    btnArray: any[] = [{ "name": "PDF", "icon": "fa fa-file-pdf-o", "tip": "", "action": "pdf" },
        { "name": "Excel", "icon": "fa fa-file-excel-o", "tip": "", "action": "excel" }
      ];
 
    //   GetRequestStatus() {
    //     this._reportService.getReportEnquiryDetails(0).subscribe(res => {
    //       if (res != null) {
    //         this.listOfData = res;
    //         this.listOfData.forEach((element: any) => {
    //           let ids = element.vmsIds.split(",");
    //           let cnt = ids.length;
    //           if (cnt == 0)
    //             element.vmsIdscnt = element.vmsIds;
    //           else
    //             element.vmsIdscnt = ids[0] + "+" + (cnt - 1);
    //           if (element.status == 0)
    //             element.statuslable = "Pending";
    //           else if (element.status == 1)
    //             element.statuslable = "Completed";
    //         });
    //       } else {
    //         console.log(res);
    //       }
    //     })
    //   }
        ActionSubmit(type: number) { 
          let plReq = new Mediareport();
         
          plReq.pageSize = this.recordPerPage == 0 ? 10 : this.recordPerPage;
         
          if (this.modelFromDate  && this.modelToDate )
            
          {
            plReq.fromDate = this.modelFromDate.year + "-" + ("0" + this.modelFromDate.month).slice(-2) + "-" + ("0" + this.modelFromDate.day).slice(-2) + " 00:00:00";
            plReq.toDate = this.modelToDate.year + "-" + ("0" + this.modelToDate.month).slice(-2) + "-" + ("0" + this.modelToDate.day).slice(-2) + " 23:59:59";
        
         
          }
          else {
            this._toast.error("From Date and To Date are required.");
            return;
          }         
     
          
          plReq.type = this.selectedStatus;
          plReq.mediaplayername= this.Selectedmediaplayer;

          let data = [
            {
              id: 54,
              type: "LIVE",
              mediaPlayerSchedulerId: null,
              mediaPlayerSchedulerName: null,
              mediaPlayerId: 61,
              mediaPlayerName: "testduplicateplayorder",
              tileNo: 1,
              mediaId: 199,
              mediaName: "4_c893c82f-6557-4ba5-a215.png",
              startTime: "2025-02-12T10:37:41.566519",
              endTime: "2025-02-12T10:37:46.57069",
              durationPlayed: 5.0041711,
              status: "Completed"
            },
            {
              id: 53,
              type: "LIVE",
              mediaPlayerSchedulerId: null,
              mediaPlayerSchedulerName: null,
              mediaPlayerId: 61,
              mediaPlayerName: "testduplicateplayorder",
              tileNo: 1,
              mediaId: 200,
              mediaName: "3_d53371bc-e5f9-4489-8d6c.png",
              startTime: "2025-02-12T10:37:36.517155",
              endTime: "2025-02-12T10:37:41.519517",
              durationPlayed: 5.002362,
              status: "Completed"
            }
          ];
          this.listOfData=data;


          this.listOfData.forEach((element: any) => {

            var _s = new Date(element.startTime);
            var _dateStr = this.datepipe.transform(_s, "dd-MM-yyyy HH:mm:ss");
            element.startTime = _dateStr;

            var _e = new Date(element.endTime);
            var _dateStr = this.datepipe.transform(_e, "dd-MM-yyyy HH:mm:ss");
            element.endTime = _dateStr;

        });




         
        }
       // ActionSubmit(type: number){}
      
      getMediaPlayerList() {

        
        this._inputPlayerData = [];
        this._CVMSfacade.getMediaPlayer(0).subscribe(res => {
          if (res != null) {
            if (res.data.length > 0) {
              let commonList: CommonSelectList[] = [];
              res.data.forEach((ele: any) => {
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
  
    // getSelectedVms(eve: any, type: any) {
    //     if (eve.length > 0) {
    //         if (type == 1) {
    //             eve.forEach((vms: any) => {
    //                 this.Selectedmediaplayer.push(vms.value);
    //             });
    //         }
    //         else {
    //             eve.forEach((ele: any) => {
    //                 var idx = 0;
    //                 this.Selectedmediaplayer.forEach(element => {
    //                     if (element == ele.value) {
    //                         this.Selectedmediaplayer.splice(idx, 1);
    //                     }
    //                     idx++;
    //                 });
    //             });
    //         }
    //     }
    //     else if (eve.length == 0)
    //         this.Selectedmediaplayer = [];
    //     else {
    //         if (type == 1)
    //             this.Selectedmediaplayer.push(eve.value);
    //         else {
    //             var idx = 0;
    //             this.Selectedmediaplayer.forEach(element => {
    //                 if (element == eve.value) {
    //                     this.Selectedmediaplayer.splice(idx, 1);
    //                 }
    //                 idx++;
    //             });
    //         }
    //     }
    //     console.log(this.Selectedmediaplayer);
    // }

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

   
}

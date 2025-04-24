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

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';





@Component({
    selector: 'app-mediareport',
    templateUrl: './mediareport.component.html',
    styleUrls: ['./mediareport.component.css']
})
export class MediareportComponent {

    _request: any = new InputRequest();
    imgData: any;
    minDate: any;
    data:any;
    pdf:any;
    excel:any;
    selectedStatus: string;
    modelFromDate: NgbDateStruct;
    modelFromTime:{ hour: 0, minute: 0, second: 0 };
    modelToTime:{ hour: 0, minute: 0, second: 0 };
    fullDateTime: string = '';
    modelToDate: NgbDateStruct;
    unitType: string = "second";
    unitValue: any;
    pager: number = 1;
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
    vmsId: any[] = [];
    Selectedmediaplayer: any;
    _inputPlayerData: any;
    headerArr = [
      { "Head": "ID", "FieldName": "id", "type": "number" },      
      { "Head": "Type", "FieldName": "type", "type": "string" },   
      { "Head": "MediaName", "FieldName": "mediaName", "type": "string" },
      { "Head": "MediaplayerName", "FieldName": "mediaPlayerName", "type": "string" },
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
        ActionSubmit(type: string) { 
          let plReq = new Mediareport();
         
         // plReq.pageSize = this.recordPerPage == 0 ? 10 : this.recordPerPage;

         
          
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

          let ipAddressesString = this.vmsIds.map(item => item.split('|')[0]).join(', ');
          
          this._request.currentPage = this.pager;
          this._request.pageSize = this.recordPerPage;
          this._request.startId = this.startId;

          // if (this.vmsIds.length > 0) {
            plReq.vmsid = this.vmsIds;
            if(type == "data") {

              this._CVMSfacade.GetPlaybackDetails( this._request,plReq.fromDate, plReq.toDate,ipAddressesString,this.selectedStatus).subscribe(data2 => {
                if (!data2.data || data2.data.length === 0) {
                  this._toast.error("No data available.");
                }
                else {
                 
                  let data = data2.data.map((item:any) => JSON.parse(item));
                  this.listOfData=data;


                  this.listOfData.forEach((element: any) => {
        
                    var _s = new Date(element.startTime);
                    var _dateStr = this.datepipe.transform(_s, "dd-MM-yyyy HH:mm:ss");
                    element.startTime = _dateStr;
        
                    var _e = new Date(element.endTime);
                    var _dateStr = this.datepipe.transform(_e, "dd-MM-yyyy HH:mm:ss");
                    element.endTime = _dateStr;
                  
        
                });

                var _length = data2.totalRecords / Number(this.recordPerPage);
                if (_length > Math.floor(_length) && Math.floor(_length) != 0)
                  this.totalRecords = Number(this.recordPerPage) * (_length);
                else if (Math.floor(_length) == 0)
                  this.totalRecords = 10;
                else
                  this.totalRecords = data2.totalRecords;
                this.totalPages = this.totalRecords / this.pager;
                }
              });
          
       
      }
      else {
         
         
            if(type == "pdf")
           { this._request.pageSize =0;
            this._CVMSfacade.GetPlaybackDetails(
              this._request,
              plReq.fromDate,
              plReq.toDate,
              ipAddressesString,
              this.selectedStatus,
              "pdf"
            ).subscribe({
              next: (response: any) => {
                const fileUrl = response?.fileUrl;
            
                if (!fileUrl) {
                  this._toast.error("Error occurred while generating the PDF.");
                } else {
                  // Open the file in a new tab (or download it)
                  window.open(fileUrl, '_blank');
                  this._toast.success("PDF generated successfully!");
                }
              },
              error: () => {
                this._toast.error("Something went wrong while calling the API.");
              }
            });
            
           }
           if(type == "excel")
            { this._request.pageSize =0;
             this._CVMSfacade.GetPlaybackDetails(
               this._request,
               plReq.fromDate,
               plReq.toDate,
               ipAddressesString,
               this.selectedStatus,
               "excel"
             ).subscribe({
               next: (response: any) => {
                 const fileUrl = response?.fileUrl;
             
                 if (!fileUrl) {
                   this._toast.error("Error occurred while generating the Excel.");
                 } else {
                   // Open the file in a new tab (or download it)
                   window.open(fileUrl, '_blank');
                   this._toast.success("Excel generated successfully!");
                 }
               },
               error: () => {
                 this._toast.error("Something went wrong while calling the API.");
               }
             });
             
            }
             
          
        
      }
   // }
      // else
      // this._toast.error("Controller not selected.");



         
        }

 exportToPDF(data: any[], fileName: string = 'ExportedData.pdf') {
  const doc = new jsPDF();

  // Title
  doc.text('Playback Data', 14, 10);

  // Define table headers
  const headers = [['ID', 'Type','Media Player Name','Media Name', 'Start Time', 'End Time','Duration Played','Status']];

  // Map data for table
  const tableData = data.map(item => [
    item.id,
    item.type,
    item.mediaPlayerName,
    item.mediaName,
    item.startTime,
    item.endTime,
    item.durationPlayed,
    item.status,
  ]);

  // Generate PDF table
  autoTable(doc, {
    head: headers,
    body: tableData,
  });

  // Save PDF
  doc.save(fileName);
}
exportToExcel(data: any[], fileName: string = 'ExportedData.xlsx') {
  const worksheet = XLSX.utils.json_to_sheet(data); // Convert JSON to worksheet
  const workbook = XLSX.utils.book_new(); // Create a new workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1'); // Add worksheet to workbook

  // Generate Excel file buffer
  const excelBuffer: any = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  });

  // Convert buffer to Blob and save
  const fileData: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(fileData, fileName);
}
       // ActionSubmit(type: number){}
       getSelectedVms(eve: any, type: any) {
    
        if (eve.length > 0) {
          if (type == 1) {
            eve.forEach((vms: any) => {
              //this.vmsIds = [];
              this.vmsIds.push(vms.value);
            });
          }
          else { 
            eve.forEach((ele: any) => {
              var idx = 0;
              this.vmsIds.forEach(element => {
                if (element.value == eve.value) {
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
          let inputVal = eve.value.split('|');
          let ipaddress = inputVal[0];
          let vmsid = inputVal[1];
          if (type == 1){
            this.vmsIds.push(eve.value),
              this.vmsId.push(vmsid);
             
           }
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
        this._request.pageSize = 0;
        this._request.startId = this.startId;
        this._request.searchItem = this.searchText;
    
        this.adminFacade.getVmss(this._request).subscribe(data => {
          if (data != null) {
            this._inputVmsData = [];
            let commonList: CommonSelectList[] = [];
            data.data.forEach((ele: any) => {
              if (ele.vmdType == 2) {
                var _commonSelect = new CommonSelectList();
                _commonSelect.displayName = ele.description;
                _commonSelect.value = ele.ipAddress + "|" + ele.id;
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
  
   

    onPager(pager: number) {
        this._request.pageSize = this.recordPerPage;
        this.pager = pager;
        this.startId = (this.pager - 1) * this.recordPerPage;
        this.ActionSubmit("data");
    }

    onRecordPageChange(recordPerPage: number) {
        this._request.pageSize = recordPerPage;
        this.pager = recordPerPage;
        this.recordPerPage = recordPerPage;
        this.startId = 0;
        this.pager = 1;
        console.log(this.recordPerPage);
        this.ActionSubmit("data");
    }

    onPageSearch(search: string) {
        this.searchText = search;
        this.ActionSubmit("data");
    }

   
}

import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { json } from '@rxweb/reactive-form-validators';
import { ToastrService } from 'ngx-toastr';
import { Mediaplayer } from 'src/app/models/vcms/mediaplayer';
import { CommonFacadeService } from 'src/app/facade/facade_services/common-facade.service';
import { CVMSMediaFacadeServiceService } from 'src/app/facade/facade_services/cvmsmedia-facade-service.service';
import { ConfirmationDialogService } from 'src/app/facade/services/confirmation-dialog.service';
import { InputRequest } from 'src/app/models/request/inputReq';
import { Globals } from 'src/app/utils/global';

@Component({
  selector: 'app-mediaplayerlist',
  templateUrl: './mediaplayerlist.component.html',
  styleUrls: ['./mediaplayerlist.component.css']
})
export class MediaplayerlistComponent {
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
      { "Head": "Controller IP", "FieldName": "ipAddress", "type": "string" },      
      { "Head": "Media Player Name", "FieldName": "name", "type": "string" },   
      { "Head": "Media Player Status", "FieldName": "statusdesc", "type": "string" },
    
      { "Head": "Created Date", "FieldName": "creationTime", "type": "string" },
      { "Head": "Action", "FieldName": "actions", "type": "button" },
    ];
    listOfMedialist:any=[];
   
  
    constructor(private _commonFacade: CommonFacadeService,
      private global: Globals,
      private _router: Router,
      private mediaFacade: CVMSMediaFacadeServiceService,
     // private _CVMSfacade: CVMSMediaFacadeServiceService,
      private confirmationDialogService: ConfirmationDialogService,
      public datepipe: DatePipe,
      private toast: ToastrService,
      public modalService: NgbModal) {
      this.global.CurrentPage = "Media Player List CVMS";
    }
    OnTabChange(status: number) {
      this.tabno = status;
      this.searchText = "";
      this.isSearch = false;
      this.getMediaDetails();
    }
  
    //Common Functionalities
    onPager(pager: number) {
      this._request.pageSize =Number(this.recordPerPage);
      this.pager = pager;
      this.startId = (this.pager - 1) * Number(this.recordPerPage);
      this.getMediaDetails();
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
  
    SearchWithId(_searchItem: any) {
      this._commonFacade.setSession("ModelShow", JSON.stringify(_searchItem));
      this._router.navigate(['users/add-user']);
    }
  
    ngOnInit(): void {
      this.tabno = 2;
      this.getMediaDetails();
    }
    OpenUploadMedia() {
      this._router.navigate(['cvms/MediaPlayerPlaylist']);
    }
    getMediaDetails() {
      this._request.currentPage = this.pager;
      this._request.pageSize = Number(this.recordPerPage);
      this._request.startId = this.startId;
      this._request.searchItem = this.searchText;
      this.mediaFacade.GetMediaPlayer(this._request).subscribe(data => {

        if (data != null) {
          this.listOfMediaUpload = data.data;
          this.listOfMediaUpload.forEach((element: any) => {
           

            let _data = JSON.parse(element.requestData);
            element.schedulename = _data.name;
            element.mediaPlayerName = _data.mediaPlayerName;
            element.name = _data.name;

            if(element.status == 2)
              {    const parsedData2 = JSON.parse(element.responseData);
              const message= parsedData2.message;
              element.ErrorMessage=message;}
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
    btnArray: any[] = [
      { "name": "View", "icon": "icon-eye", "tip": "Click to View", "action": "update","condition": (row: any) => row.status === 1   },
      { "name": "Remove", "icon": "icon-trash", "tip": "Click to Remove", "action": "delete" ,"condition": (row: any) => row.status === 1  },
      {"name":"Update", "icon": "icon-write","tip": "Click to Update","action": "update", "condition": (row: any) => row.status === 1 },
      { 
        "name": "Error", 
        "icon": "icon-cross",  
        "tip": "View Error Message", 
        "action": "error", 
        "condition": (row: any) => row.status === 2 
      }
    ]; 

      ButtonAction(actiondata: any) { 
        if (actiondata.action === "delete") {
          this.deleteRecord(actiondata.data);
        }
        if (actiondata.action === "update") {
          this.updateRecord(actiondata.data);
        }
        if (actiondata.action === "error") {
          this.Show_error(actiondata.data);
        }
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
      
      updateRecord(element?: any){
        const id= element.id;
        if (id) {
          this._router.navigate(['cvms/playlist-edit/', id]); // Navigate to the edit page with ID
        } else {
          this.toast.error("Invalid record selected for update.");
        }
        
      }
       deleteRecord(element?: any) {
        this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to remove this Playlist... ?')
        .then((confirmed) => { if (confirmed == true) this.RemovePlaylist(element) })
        .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
      }
      RemovePlaylist(element?: any){
           let _vcmsuploadmediadata = new Mediaplayer();
      
           _vcmsuploadmediadata.controllerName = element.controllerName;
          // _vcmsuploadmediadata.IpAddress = this.vmsIds[0];
      
           _vcmsuploadmediadata.IpAddress = element.ipAddress;
           _vcmsuploadmediadata.VmsId=element.vmsId;
      
          // _vcmsuploadmediadata.VmsId = Number.parseInt(this.vmsId[0]);
      
           _vcmsuploadmediadata.status = 0;
           _vcmsuploadmediadata.AuditedBy = "System";
           _vcmsuploadmediadata.IsAudited = true;
           _vcmsuploadmediadata.AuditedTime = new Date();
           _vcmsuploadmediadata.Reason = "Upload Data for test";
           //_vcmsuploadmediadata.createddate = new Date();
           _vcmsuploadmediadata.CreationTime = new Date();
           _vcmsuploadmediadata.RequestType ="/mediaPlayer/deleteMediaPlayer"
           _vcmsuploadmediadata.medianame=element.mediaName;
          
           let requestData2 = JSON.parse(element.requestData); // Parse requestData from element
           let mediaName = requestData2.name;
           let requestData = {
            mediaPlayerId: element.responseId,
            mediaPlayerName: mediaName
          
          };
          _vcmsuploadmediadata.RequestData = JSON.stringify(requestData);
            // _vcmsuploadmediadata.RequestData = JSON.stringify(_requestTextData);
           
       
       
           this.mediaFacade.SaveMediaPlayer(_vcmsuploadmediadata).subscribe(data => {
             if (data == 0) {
               this.toast.error("Error occured while saving data for ");
             }
             else {
              this.listOfMediaUpload = this.listOfMediaUpload.filter((media: any) => media.id !== element.id);
      
      
      
        this.toast.success("Data deleted successfully ");
      
        
         this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this._router.navigate(['cvms/createMediaPlayerAndPlaylist']);
         });
             }
           });
         }
    
        }


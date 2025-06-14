import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonFacadeService } from 'src/app/facade/facade_services/common-facade.service';
import { CVMSMediaFacadeServiceService } from 'src/app/facade/facade_services/cvmsmedia-facade-service.service';
import { MediaFacadeService } from 'src/app/facade/facade_services/media-facade.service';
import { ConfirmationDialogService } from 'src/app/facade/services/confirmation-dialog.service';
import { InputRequest } from 'src/app/models/request/inputReq';
import { Globals } from 'src/app/utils/global';
import { Vcmsuploadmedia } from 'src/app/models/vcms/vcmsuploadmedia';
import { CVMSMediaModalComponent } from '../cvmsmedia-modal/cvmsmedia-modal.component';
import { wind } from 'ngx-bootstrap-icons';
import { Subscription, interval } from 'rxjs';


@Component({
  selector: 'app-media-upload-cvms-list',
  templateUrl: './media-upload-cvms-list.component.html',
  styleUrls: ['./media-upload-cvms-list.component.css']
})
export class MediaUploadCvmsListComponent {
  minDate: any;

 

  modelFromDate: any;
  modelToDate: any;
  searchText!: string;
  page: any;
  tabno: number;
  type: number;
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
  subscription: any;
  _request: any = new InputRequest();
  headerArr: any[] = [];
  dropdownOptions:any[] = [];
  

 filter2: boolean = false;
 buildHeader(){
  this.headerArr = [
    // { "Head": "ID", "FieldName": "id", "type": "number" },
    { "Head": "Controller Name", "FieldName": "ipAddress", "type": "string" },
    { "Head": "Media Type", "FieldName": "mediatype", "type": "string" },
    { "Head": "Media Name", "FieldName": "mediaName", "type": "string" },
    { "Head": "Status", "FieldName": "statusdesc", "type": "string" },
   
    { "Head": "Created Date", "FieldName": "creationTime", "type": "string" },
    { "Head": "Action", "FieldName": "actions", "type": "button" },
   
  ];
  if (this.filter2) {

    this.headerArr = this.headerArr.filter(header => header.Head !== "Action");
  
    this.headerArr.push(
      { "Head": "Request Type", "FieldName": "requesttype2", "type": "string" },
      { "Head": "Action", "FieldName": "actions", "type": "button" },
    );
  
    }
 }

  listOfMedialist: any = [];
  //btnArray: any[] = [];
  btnArray: any[] = [
  { "name": "Remove", "icon": "icon-trash", "tip": "Click to Remove", "action": "delete" ,"condition": (row: any) => row.status === 1  },
  { 
    "name": "Error", 
    "icon": "icon-cross",  
    "tip": "View Error Message", 
    "action": "error", 
    "condition": (row: any) => row.status === 2 
  }]; 



  constructor(private _commonFacade: CommonFacadeService,
    private global: Globals,
    private _router: Router,
    private mediaFacade: CVMSMediaFacadeServiceService,
    private confirmationDialogService: ConfirmationDialogService,
    public datepipe: DatePipe,
    private toast: ToastrService,
    private _CVMSfacade: CVMSMediaFacadeServiceService,
    public modalService: NgbModal) {
    this.global.CurrentPage = "Media Upload List CVMS";

  }
  ngOnInit(): void {
    this.mediaFacade.getKeysDataForConfig("dropdownOptions").subscribe((data2: any) => {
    
      this.dropdownOptions = data2.dropdownOptions; 
     
    });
    this.buildHeader();
    this.type = 2;
    this.getMediaDetails();
    //this.refreshPage();
  }
  refreshPage() {

    const source = interval(5000);
    this.subscription = source.subscribe((val) => this.getMediaDetails());
    // setInterval(() => {
      
    // }, 5000);
  }
  OnTabChange(status: number) {
    this.tabno = status;
    this.searchText = "";
    this.isSearch = false;
    this.getMediaDetails();
  }
  Show_error(element?: any) {
    if (!element || !element.responseData) {
      alert("No error information available.");
      return;
    }
  
    try {
      const responseObj = JSON.parse(element.responseData);
         const message = responseObj.message || responseObj.error;
    
      this.confirmationDialogService
        .confirm('Error Message', message)
        .catch(() => {}); 
    } catch (err) {
      this.confirmationDialogService
        .confirm('Error', 'Failed to parse error message.')
        .catch(() => {});
    }
  
  }
  //Common Functionalities
  onPager(pager: number) {
    this._request.pageSize = Number(this.recordPerPage);
    this.pager = pager;
    this.startId = (this.pager - 1) *  Number(this.recordPerPage);
    if(this.filter2){
      this.getFilteredList();
    }
    else{
      this.getMediaDetails();
    }
  }

  onRecordPageChange(recordPerPage: number) {
    console.log("Record Per Page : " + recordPerPage);
    this._request.pageSize = Number(recordPerPage);
    this.pager = Number(recordPerPage);
    this.recordPerPage = Number(recordPerPage);
    this.startId = 0;
    this.pager = 1;
    if(this.filter2){
      this.getFilteredList();
    }
    else{
      this.getMediaDetails();
    }
  }

  onPageSearch(search: string) {
    this.isSearch = true;
    this.searchText = search;
    if(this.filter2){
      this.getFilteredList();
    }
    else{
      this.getMediaDetails();
    }
  }

  SearchWithId(_searchItem: any) {
    this._commonFacade.setSession("ModelShow", JSON.stringify(_searchItem));
    this._router.navigate(['users/add-user']);
  }


  OpenUploadMedia() {
    this._router.navigate(['cvms/upload-media']);
  }

  getControllerName(ipAddress:string){
    this.mediaFacade.GetVMSNameForIpAddress(ipAddress).subscribe(data => {
      if (data != null) {
        this.listOfMediaUpload = data.data;       
        
      }
    })
  }
  dropdownOpen = false;

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }
  Reload(){
    if(this.filter2){
      this.buildHeader();
      this.getFilteredList();
    }
    else{
      this.buildHeader();
      this.getMediaDetails();
    }
  }
  applyFilter(status: string): void {
    switch (status) {
      case 'Sent':
        this.tabno=1;
        this.filter2=true;
        this.buildHeader();
        this.getFilteredList();
        break;
      case 'Pending':
        this.tabno=0;
        this.filter2=true;
        this.buildHeader();
        this.getFilteredList();
        break;
      case 'Failed':
        this.tabno=2;
        this.filter2=true;
        this.buildHeader();
        this.getFilteredList();
        break;
      case  'All':
        this.tabno=2;
        this.filter2=false;
        this.buildHeader();
        this.getMediaDetails();
        break;
      default:
        console.warn('Unknown filter option:', status);
    }
  
    // Close dropdown after selecting
    this.dropdownOpen = false;
  }
  getFilteredList() {
    this._request.currentPage = (this.pager-1);
    this._request.pageSize = Number(this.recordPerPage);
    this._request.startId = this.startId;
    this._request.searchItem = this.searchText;
    this.mediaFacade.GetFilteredListM(this._request, this.tabno).subscribe(data => {
      if (data != null) {
        this.listOfMediaUpload = data.data;

  

          this.listOfMediaUpload.forEach((element: any) => {
          if (element.creationTime != null) {
            var _d = new Date(element.creationTime);
            var _dateStr = this.datepipe.transform(_d, "dd-MM-yyyy HH:mm:ss");
            element.creationTime = _dateStr;
            const parsedData = JSON.parse(element.requestData);
            if(element.status == 2)
              {    const parsedData2 = JSON.parse(element.responseData);
              const message= parsedData2.message;
              element.ErrorMessage=message;}
            const mediaType = parsedData.mediaType;
            element.mediatype=mediaType;
            
          }

          if(element.requestType=="/media/uploadMedia"){
            element.requesttype2="Upload";
          }
          if(element.requestType=="/media/deleteMediaDetails"){
            let _data2 = JSON.parse(element.requestData);
            element.mediaName = _data2.mediaName;

            element.requesttype2="Delete";
          }
          if (element.status == 1) {
            console.log(element)
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
  getMediaDetails() {
    this._request.currentPage = (this.pager-1);
    this._request.pageSize = Number(this.recordPerPage);
    this._request.startId = this.startId;
    this._request.searchItem = this.searchText;
    this.mediaFacade.GetMediaUploadDetails(this._request, this.type).subscribe(data => {
      if (data != null) {
        this.listOfMediaUpload = data.data;

  

          this.listOfMediaUpload.forEach((element: any) => {
          if (element.creationTime != null) {
            var _d = new Date(element.creationTime);
            var _dateStr = this.datepipe.transform(_d, "dd-MM-yyyy HH:mm:ss");
            element.creationTime = _dateStr;
            const parsedData = JSON.parse(element.requestData);
            if(element.status == 2)
              {    const parsedData2 = JSON.parse(element.responseData);
              const message= parsedData2.message;
              element.ErrorMessage=message;}
            const mediaType = parsedData.mediaType;
            element.mediatype=mediaType;
            
          }
          if (element.status == 1) {
            console.log(element)
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
  // ButtonAction(actiondata: any) { 

  //   alert(actiondata.actions);
  // }

  ButtonAction(actiondata: any) { 
    if (actiondata.action === "delete") {
      this.deleteRecord(actiondata.data);
    }
    if (actiondata.action === "error") {
      this.Show_error(actiondata.data);
    }
  }
  deleteRecord(element?: any) {
    this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to remove this media... ?')
    .then((confirmed) => { if (confirmed == true) this.RemovePlaylist(element) })
    .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }
  RemovePlaylist(element?: any) {

     let _vcmsuploadmediadata = new Vcmsuploadmedia();

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
     _vcmsuploadmediadata.requesttype ="/media/deleteMediaDetails"
     _vcmsuploadmediadata.medianame=element.mediaName;
 
     let requestData = {
      mediaId: element.responseId,
      mediaName: element.mediaName
    
    };
    _vcmsuploadmediadata.RequestData = JSON.stringify(requestData);
      // _vcmsuploadmediadata.RequestData = JSON.stringify(_requestTextData);
     
 
 
     this._CVMSfacade.SaveMediaUpload(_vcmsuploadmediadata).subscribe(data => {
       if (data == 0) {
         this.toast.error("Error occured while saving data for " + _vcmsuploadmediadata.controllerName);
       }
       else {
        this.listOfMediaUpload = this.listOfMediaUpload.filter((media: any) => media.id !== element.id);



  this.toast.success("Data deleted successfully");

  
   this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    this._router.navigate(['cvms/uploadMedia']);
   });
       }
     });
   }

}

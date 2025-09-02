import { Component, ElementRef, HostListener, OnInit, ViewChild, numberAttribute } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { CommonFacadeService } from 'src/app/facade/facade_services/common-facade.service';
import { MediaFacadeService } from 'src/app/facade/facade_services/media-facade.service';
import { InputRequest } from 'src/app/models/request/inputReq';
import { Globals } from 'src/app/utils/global';
import { TooltipPosition } from "../../../utils/tooltip.enums";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CmMediaModalComponent } from 'src/app/widget/cm-media-modal/cm-media-modal.component';
import { CmConfirmBoxComponent } from 'src/app/widget/cm-confirm-box/cm-confirm-box.component';
import { ConfirmationDialogService } from 'src/app/facade/services/confirmation-dialog.service';
import { MediaDetails, MediaUpload, TextDetails } from 'src/app/models/media/Media';

@Component({
  selector: 'app-media-upload',
  templateUrl: './media-upload.component.html',
  styleUrls: ['./media-upload.component.css']
})
export class MediaUploadComponent implements OnInit {
  active = 1;
  activeNav: number = 1;
  result: string = '';
  myForm!: FormGroup;
  uploadSetId!: any;
  selectedFiles: any;
  searchText!: string;
  isSearch : boolean = false;
  page: any;
  listOfMediaSet: any;
  totalPages: number = 1;
  pager: number = 1;
  totalRecords!: number;
  recordPerPage: number = 10;
  startId!: number;
  closeResult!: string;
  _request: any = new InputRequest();
  _fontData: any[] = [];
  @ViewChild('InputVar') InputVar: any;
  //@ViewChild("InputVar", { static: true }) InputVar;
  //Text Data
  scrollDirection: number = 0;
  fontStyle: string = "";
  fontSize: number = 18;
  fontName: any;
  backColor: string = "#000000";
  foreColor: string = "#ffffff";
  textContent: string = "";
  textData: any[] = [];

  files: File[] = [];
  TooltipPosition: typeof TooltipPosition = TooltipPosition;
  x = 0;
  y = 0;
  coordinates = "";
  //this is your original recipe name which you had passed from previous page
  headerArr = [
    { "Head": "ID", "FieldName": "id", "type": "number" },
    { "Head": "File Type", "FieldName": "mediaType", "type": "string" },
    { "Head": "Upload Set ID", "FieldName": "uploadSetId", "type": "string" },
    { "Head": "Created Date", "FieldName": "createdDate", "type": "datetime" },
    { "Head": "Created By", "FieldName": "uploadedBy", "type": "string" },
    { "Head": "File Count", "FieldName": "fileCounts", "type": "number" },
    { "Head": "Status", "FieldName": "statusText", "type": "number" },
    { "Head": "Remarks", "FieldName": "remarks", "type": "string" },
    { "Head": "Action", "FieldName": "actions", "type": "button" }
  ];
  btnArray: any[] = [{ "name": "View", "icon": "icon-eye", "tip": "Click to View", "action": "view" }, { "name": "Remove", "icon": "icon-trash", "tip": "Click to Remove", "action": "delete" }];
  constructor(private fb: FormBuilder,
    private toast: ToastrService,
    private _commonFacade: CommonFacadeService,
    private router: Router,
    private _confirmService: ConfirmationDialogService,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer,
    private _mediaFacade: MediaFacadeService,
    private global: Globals) {
    this.global.CurrentPage = "Media/Text Upload";
  }


  ngOnInit() {
    this.generateUploadSetId();
    this.GetFontDetails();
  }
  tabChange() {
    this.generateUploadSetId();
  }
  generateUploadSetId() {
    var _date = new Date();
    var _dd = _date.getDate().toString();
    var _mm = (_date.getMonth() + 1).toString();
    var _yyyy = _date.getFullYear().toString();
    var _hh = _date.getHours().toString();
    var _min = _date.getMinutes().toString();
    var _ss = _date.getSeconds().toString();
    this.uploadSetId = _dd + _mm + _yyyy + _hh + _min + _ss;
    this.getMediaUploadData();
  }

  save(event: any): void {
    this.selectedFiles = event.target.files;
    this.files = [];
    let files = event.dataTransfer
      ? event.dataTransfer.files
      : event.target.files;
    console.log("event::::::", event);
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      
      if(file.type.toLocaleLowerCase().includes("gif")){
        this.toast.error("Only images and video files are allowed.");
        break;
      }
      if (file.type.toLocaleLowerCase().includes("video")) {
        var val = this.ValidateVDOFile(file);
        console.log(val);
      }
      //if(!this.isFileSelected(file)){
      if (this.Validations()) {
        //      if(this.isImage(file)) {
        file.objectURL = this.sanitizer.bypassSecurityTrustUrl(
          window.URL.createObjectURL(files[i])
        );
        //}
        this.files.push(files[i]);
        //  }
      }
      //}
    }
  }

  ValidateVDOFile(Vdofile: any) {
    if (Vdofile.type.toLocaleLowerCase().includes("video")) {
      const video = document.createElement('video');
      const reader = new FileReader();
      var vdoWidth = 0;
      var vdoHeight = 0;
      reader.onload = (e: any) => {
        video.src = e.target.result;
        video.addEventListener('loadedmetadata', () => {
          vdoWidth = video.videoWidth;
          vdoHeight = video.videoHeight;
          // if (vdoWidth < 1920 && vdoHeight < 1080) {
          //   this.toast.error("File resolution should be 1920*1080.");
          //   this.selectedFiles = [];
          //   this.files =[];
          //   return false;
          // } 
          // else {
          //   return true;
          // }
          return true;

        });
      }
      reader.readAsDataURL(Vdofile);
    }
  }
  Validations() {
    let res = true;
    let size=0;
    if (this.active == 1) {
      if (this.selectedFiles != undefined) {

        if (this.selectedFiles.length > 0) {
          for (var i = 0; i < this.selectedFiles.length; i++) {
            if (this.selectedFiles[i].type.includes('image') || this.selectedFiles[i].type.includes('video')) {
              size += this.selectedFiles[i].size;
            }
            else {
              res = false;
              break;
            }
          }
          if (res == false) {
            this.toast.error("Only image/video files are allowed.", "Error", { positionClass: "toast-bottom-right" });
            return res;
          }
        }
      }
      else {
        this.toast.error("Files not selected", "Error", { positionClass: "toast-bottom-right" });
      }

    }
    
    return res;
  }
  AddMediaUpload() {
    if (this.files.length > 0) {
      var formData = new FormData();
      formData.append("uploadsetid", this.uploadSetId.toString());
      formData.append("userCode", this.global.UserCode);
      let fileList = this.files;
      let size = 0; 
      for (var i = 0; i < fileList.length; i++) {
        formData.append("files.files", fileList[i]);
        size += fileList[i].size;
      }
      if(size != 0 && size > 25000000) {
        this.toast.error("File size should be less than 25 MB", "Error", { positionClass: "toast-bottom-right" });
      }
      else {
        this._mediaFacade.uploadMedia(formData).subscribe(res => {
          if (res != 0 || res != undefined) {
            this.toast.success("Saved Successfully");
            this.Reset(1);
          }
          else {
            this.toast.error("Something went wrong", "Error", { positionClass: "toast-bottom-right" });
          }
        })
      }
      
    }

  }
  RemoveFile(idx: number) {
    this.selectedFiles.slice(idx, 1);
  }
  RequestSubmit() {
    if (this.Validations() && this.active == 1) {
      this.AddMediaUpload();
    }
    else if (this.active == 2) {
      this.SaveTextData();
    }
  }
  onPager(pager: number) {
    this._request.pageSize = this.recordPerPage;
    this.pager = pager;
    this.startId = (this.pager - 1) * this.recordPerPage;
    this.getMediaUploadData();
  }

  onRecordPageChange(recordPerPage: number) {
    this._request.pageSize = recordPerPage;
    this.pager = recordPerPage;
    this.recordPerPage = recordPerPage;
    this.startId = 0;
    this.pager = 1;
    console.log(this.recordPerPage);
    this.getMediaUploadData();
  }

  onPageSearch(search: string) {
    this.isSearch = true;
    this.searchText = search;
    this.getMediaUploadData();
  }

  OpenModal(content: any) {
    // this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    //   this.closeResult = `Closed with: ${result}`;
    // }, (reason) => {
    // });
    this._commonFacade.setSession("ModelShow", null);
    //this.router.navigate(['masters/add-party']);
  }

  SearchWithId(_searchItem: any) {
    this._commonFacade.setSession("ModelShow", JSON.stringify(_searchItem));
    //this.router.navigate(['masters/add-party']);
  }

  getMediaUploadData() {
    this._request.currentPage = this.pager;
    this._request.pageSize = this.recordPerPage;
    this._request.startId = this.startId;
    this._request.searchItem = this.searchText;

    this._mediaFacade.getMediaUpload(this._request, 3).subscribe(res => {
      if (res != null && res != undefined) {
        res.data.forEach((ele: any) => {
          if (ele.status == 0) {
            ele.statusText = "Approval Pending";
            ele.class = "badge badge-info sizeStatus";
          }
          else if (ele.status == 1) {
            ele.statusText = "Approved";
            ele.class = "badge badge-success sizeStatus";
          }
          else if (ele.status == 2) {
            ele.statusText = "Rejected"
            ele.class = "badge badge-danger sizeStatus";
          }
        });
        this.listOfMediaSet = res.data;
        var _length = res.totalRecords / this.recordPerPage;
        if (_length > Math.floor(_length) && Math.floor(_length) != 0)
          this.totalRecords = this.recordPerPage * (_length);
        else if (Math.floor(_length) == 0)
          this.totalRecords = 10;
        else
          this.totalRecords = res.totalRecords;
        this.totalPages = this.totalRecords / this.pager;
      }
    })
  }
  Reset(type: number) {
    this.selectedFiles = [];
    this.generateUploadSetId();
    this.textData = [];
    this.InputVar.nativeElement.value = "";
  }

  ButtonAction(actiondata: any) {
    if (actiondata.action == "view") {
      const modalRef = this.modalService.open(CmMediaModalComponent, { ariaLabelledBy: 'modal-basic-title', size: 'xl' });
      let _data = { "action": actiondata.action, urls: [], modalType: "mediaupload", content: actiondata.data };
      modalRef.componentInstance.data = _data;
    }
    else if (actiondata.action == "delete") {
      this._confirmService.confirm("Remove Media", "Do You Really Want To Remove Upload Set : " + actiondata.data.uploadSetId, "Confirm", "Cancel", "lg")
        .then((confirmed) => {
          if (confirmed == true) {
            this.RemoveUploadSetID(actiondata.data);
          }
        })
        .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));;

    }
  }
  RemoveUploadSetID(data: any) {
    let md = new MediaUpload();
    md.id = data.id;
    md.uploadSetId = data.uploadSetId;
    md.status = data.status;
    md.remarks = data.remarks;
    md.isDeleted = true;
    md.createdBy = data.createdBy;
    md.modifiedBy = this.global.UserCode;

    this._mediaFacade.updateMediaUpload(md).subscribe(res => {
      if (res != null && res != 0) {
        this.toast.success("Successfully Removed.");
        this.modalService.dismissAll();
        this.getMediaUploadData();
      }
      else {
        this.toast.error("Something went wrong", "Error", { positionClass: "toast-bottom-right" });
      }
    })
  }

  GetFontDetails() {
    this._mediaFacade.getAvailableFont().subscribe(res => {
      if (res != null) {
        this._fontData = res;
      }
      else {
        console.log("Get Available Font Details Error");
      }

    })
  }

  AddTextData() {
    var _date = new Date();
    var _text = new TextDetails();
    _text.uploadSetId = this.uploadSetId;
    _text.fontSize = this.fontSize;
    _text.backColor = this.backColor;
    _text.foreColor = this.foreColor;
    _text.font = this.fontName;
    _text.createdBy = this.global.UserCode;
    _text.fileName = "Text_" + _date.getFullYear() + _date.getMonth() + _date.getDay() + _date.getHours() + _date.getMinutes() + _date.getSeconds();
    _text.id = 0;
    _text.isActive = true;
    _text.textContent = this.textContent;
    _text.scrollingDirection = this.scrollDirection;
    _text.fontStyle = this.fontStyle;
    this.textData.push(_text);
  }
  EditText(_text: any) {
    console.log(_text.fontName);
    this.fontName = _text.font;
    this.fontSize = _text.fontSize;
    this.fontStyle = _text.fontStyle;
    this.foreColor = _text.foreColor;
    this.backColor = _text.backColor;
    this.textContent = _text.textContent;
    this.scrollDirection = _text.scrollingDirection;
  }
  RemoveText(idx: number) {
    this.textData.splice(idx, 1);
  }
  SaveTextData() {
    this._mediaFacade.addTextDetails(this.textData).subscribe(res => {
      if (res != null && res != 0) {
        this.toast.success("Saved Successfully");
        this.textData = [];
        this.getMediaUploadData();
        this.tabChange();
      }
    })
  }
}

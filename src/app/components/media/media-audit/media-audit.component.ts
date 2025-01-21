import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonFacadeService } from 'src/app/facade/facade_services/common-facade.service';
import { MediaFacadeService } from 'src/app/facade/facade_services/media-facade.service';
import { InputRequest } from 'src/app/models/request/inputReq';
import { Globals } from 'src/app/utils/global';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CmMdAuditComponent } from 'src/app/widget/cm-md-audit/cm-md-audit.component';
import { ConfirmationDialogService } from 'src/app/facade/services/confirmation-dialog.service';
import { MediaUpload } from 'src/app/models/media/MediaUpload';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-media-audit',
  templateUrl: './media-audit.component.html',
  styleUrls: ['./media-audit.component.css']
})
export class MediaAuditComponent implements OnInit {
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
  isSearch:boolean  =false;
  closeResult!: string;
  _request: any = new InputRequest();
  headerArr = [
    { "Head": "ID", "FieldName": "id", "type": "number" },
    { "Head": "Upload Set ID", "FieldName": "uploadSetId", "type": "string" },
    { "Head": "Created Date", "FieldName": "uploadedDate", "type": "string" },
    { "Head": "Uploaded By", "FieldName": "uploadedBy", "type": "string" },
    { "Head": "Audited By", "FieldName": "modifiedBy", "type": "string" },
    { "Head": "Actions", "FieldName": "actions", "type": "button" }
  ];

  btnArray: any[] = [{ "name": "View", "icon": "icon-eye", "tip": "Click to View", "action": "view" }, { "name": "Remove", "icon": "icon-trash", "tip": "Click to Remove", "action": "remove" }];


  constructor(private _commonFacade: CommonFacadeService,
    private global: Globals,
    private _router: Router,
    private mediaFacade: MediaFacadeService,
    private confirmationDialogService: ConfirmationDialogService,
    public datepipe: DatePipe,
    private toast: ToastrService,
    public modalService: NgbModal) {
    this.global.CurrentPage = "Media Audit";
  }
  ngOnInit(): void {
    this.tabno = 0;
    this.getMediaDetails();
  }
  getMediaDetails() {
    this._request.currentPage = this.pager;
    this._request.pageSize = this.recordPerPage;
    this._request.startId = this.startId;
    this._request.searchItem = this.searchText;
    this.mediaFacade.getMediaUpload(this._request, this.tabno).subscribe(data => {
      if (data != null) {
        this.listOfMediaUpload = data.data;
        this.listOfMediaUpload.forEach((element: any) => {
          if (element.createdDate != null) {
            var _d = new Date(element.createdDate);
            var _dateStr = this.datepipe.transform(_d, "dd-MM-yyyy HH:mm:ss");
            element.uploadedDate = _dateStr;
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
        this.getMediaByStatus(this.tabno);
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
  ButtonAction(actiondata: any) {
    if (actiondata.action == "view") {
      const modalRef = this.modalService.open(CmMdAuditComponent, { ariaLabelledBy: 'modal-basic-title', size: 'xl' });
      modalRef.componentInstance.data = actiondata.data;
      modalRef.componentInstance.playlistAudit = false;
      modalRef.componentInstance.mediaAudit = true;
      modalRef.componentInstance.passEntry.subscribe((receivedEntry: any) => {
        this.getMediaDetails();
      })
    }
    else if (actiondata.action == 'remove') {
      this.DeleteMediaSet(actiondata.data);
    }
  }

  DeleteMediaSet(uploadSet: any) {
    this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to remove this Upload Set... ?')
      .then((confirmed) => { if (confirmed == true) this.RemoveMediaSet(uploadSet) })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }
  RemoveMediaSet(uploadSet: any) {
    //var data = this.listOfMediaUpload.filter((x) => x.uploadSetId == uploadSetId);
    let _uploadDetails = new MediaUpload();
    _uploadDetails.createdBy = uploadSet.createdBy;
    _uploadDetails.createdDate = uploadSet.createdDate;
    _uploadDetails.id = uploadSet.id;
    _uploadDetails.isDeleted = true;
    _uploadDetails.modifiedBy = this.global.UserCode;
    _uploadDetails.modifiedDate = new Date();
    _uploadDetails.remarks = "";
    _uploadDetails.status = uploadSet.status;
    _uploadDetails.uploadSetId = uploadSet.uploadSetId;
    this.mediaFacade.updateMediaUpload(_uploadDetails).subscribe(res => {
      if (res != null && res != 0) {
        this.toast.success("Removed Successfully.");
        this.getMediaDetails();
      }
      else {
        this.toast.error("Something went wrong.");
      }
    })
  }
}

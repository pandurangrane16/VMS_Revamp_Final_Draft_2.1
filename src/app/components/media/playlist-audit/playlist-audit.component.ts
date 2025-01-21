import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AdminFacadeService } from 'src/app/facade/facade_services/admin-facade.service';
import { CommonFacadeService } from 'src/app/facade/facade_services/common-facade.service';
import { MediaFacadeService } from 'src/app/facade/facade_services/media-facade.service';
import { ConfirmationDialogService } from 'src/app/facade/services/confirmation-dialog.service';
import { BlData, PlaylistAuditMedias } from 'src/app/models/media/PlAudit';
import { InputRequest } from 'src/app/models/request/inputReq';
import { Globals } from 'src/app/utils/global';
import { CmMdAuditComponent } from 'src/app/widget/cm-md-audit/cm-md-audit.component';

@Component({
  selector: 'app-playlist-audit',
  templateUrl: './playlist-audit.component.html',
  styleUrls: ['./playlist-audit.component.css']
})
export class PlaylistAuditComponent implements OnInit {
  searchText!: string;
  page: any;
  isSearch : boolean = false;
  tabno: number =0;
  listOfPlaylist: any;
  listOfPlaylistPending: any;
  listOfPlaylistApproved: any;
  listOfPlaylistRejected: any;
  totalPages: number = 1;
  pager: number = 1;
  totalRecords!: number;
  recordPerPage: number = 10;
  startId!: number;
  closeResult!: string;
  _request: any = new InputRequest();
  headerArr = [
    { "Head": "ID", "FieldName": "id", "type": "number" },
    { "Head": "Playlist Name", "FieldName": "playlistName", "type": "string" },
    { "Head": "Created Date", "FieldName": "createdDateFrm", "type": "string" },
    { "Head": "Created By", "FieldName": "createdBy", "type": "string" },
    { "Head": "Preview", "FieldName": "preview", "type": "string" },
    { "Head": "Audited By", "FieldName": "modifiedBy", "type": "string" },
    { "Head": "Actions", "FieldName": "actions", "type": "button" }
  ];

  btnArray: any[] = [{ "name": "View", "icon": "icon-eye", "tip": "Click to View", "action": "view" }, { "name": "Remove", "icon": "icon-trash", "tip": "Click to Remove", "action": "remove" }];

  constructor(private _commonFacade: CommonFacadeService,
    private global: Globals,
    private _router: Router,
    private mediaFacade: MediaFacadeService,
    private adminFacade: AdminFacadeService,
    private confirmationDialogService: ConfirmationDialogService,
    public datepipe: DatePipe,
    private toast: ToastrService,
    public modalService: NgbModal) {
    this.global.CurrentPage = "Playlist Audit";
  }
  ngOnInit(): void {
    this.tabno = 0;
    this.getPlaylistData();
  }

  getPlaylistData() {
    this._request.currentPage = this.pager;
    this._request.pageSize = this.recordPerPage;
    this._request.startId = this.startId;
    this._request.searchItem = this.searchText;
    this.adminFacade.getPlaylistMasterData(this._request, this.tabno).subscribe(res => {
      if (res != undefined && res != null) {
        this.listOfPlaylist = res.data;
        this.listOfPlaylist.forEach((element: any) => {
          if (element.createdDate != null) {
            var _d = new Date(element.createdDate);
            var _dateStr = this.datepipe.transform(_d, "dd-MM-yyyy HH:mm:ss");
            element.createdDateFrm = _dateStr;
            if (element.status == 1)
              element.preview = "Not Available";
            else
              element.preview = "Available";
          }
        });
        var _length = res.totalRecords / this.recordPerPage;
        if (_length > Math.floor(_length) && Math.floor(_length) != 0)
          this.totalRecords = this.recordPerPage * (_length);
        else if (Math.floor(_length) == 0)
          this.totalRecords = 10;
        else
          this.totalRecords = res.totalRecords;
        this.totalPages = this.totalRecords / this.pager;
        if (this.tabno == 0)
          this.getPlaylistByStatus(1);
        else if (this.tabno == 1)
          this.getPlaylistByStatus(3);
        else if (this.tabno == 2)
          this.getPlaylistByStatus(4);
      }
    })
  }

  getPlaylistByStatus(status: number) {
    if (status == 1 || status == 2) {
      this.listOfPlaylistPending = this.listOfPlaylist.filter((x: any) => (x.status == 1 || x.status == 2));
    } else if (status == 3) {
      this.listOfPlaylistApproved = this.listOfPlaylist.filter((x: any) => x.status == 3);
    } else if (status == 4) {
      this.listOfPlaylistRejected = this.listOfPlaylist.filter((x: any) => x.status == 4);
    }
  }

  //Common Functionalities
  onPager(pager: number) {
    this._request.pageSize = this.recordPerPage;
    this.pager = pager;
    this.startId = (this.pager - 1) * this.recordPerPage;
    this.getPlaylistData();
  }

  onRecordPageChange(recordPerPage: number) {
    this._request.pageSize = recordPerPage;
    this.pager = recordPerPage;
    this.recordPerPage = recordPerPage;
    this.startId = 0;
    this.pager = 1;
    this.getPlaylistData();
  }

  onPageSearch(search: string) {
    this.isSearch = true;
    this.searchText = search;
    this.getPlaylistData();
  }

  SearchWithId(_searchItem: any) {
    this._commonFacade.setSession("ModelShow", JSON.stringify(_searchItem));
    this._router.navigate(['users/add-user']);
  }
  ButtonAction(actiondata: any) {
    if (actiondata.action == "view") {
      if (actiondata.data.status == 1) {
        this.toast.error("Preview not available, Please check after sometime.");
      } else {
        this.mediaFacade.getBlockDetailsByPlID(actiondata.data.id).subscribe(res => {
          if (res != null) {
            var _blocks = res;
            let plAudit: PlaylistAuditMedias[] = [];
            let d: PlaylistAuditMedias;
            let bl: BlData[] = [];
            _blocks.forEach((blRes: any) => {
              let oneBl = new BlData();
              oneBl.plId = actiondata.data.id;
              oneBl.blId = blRes.id;
              oneBl.height = blRes.height;
              oneBl.width = blRes.width;
              oneBl.left = blRes.blLeft;
              oneBl.top = blRes.blTop;
              oneBl.seq = 1;
              bl.push(oneBl);
            });
            d = {
              blocks: bl,
              plHeight: actiondata.data.height,
              plWidth: actiondata.data.width,
              plMaster: actiondata.data,
              checkedUpd: true,
              title : "Playlist Audit"
            };

            const modalRef = this.modalService.open(CmMdAuditComponent, { ariaLabelledBy: 'modal-basic-title', size: 'xl' });
            modalRef.componentInstance.data = d;
            modalRef.componentInstance.playlistAudit = true;
            modalRef.componentInstance.mediaAudit = false;
            modalRef.componentInstance.passEntry.subscribe((receivedEntry: any) => {
              this.getPlaylistData();
            })
          }
        });

      }
    }
    else if (actiondata.action == 'remove') {
      this.DeletePlaylist(actiondata.data);
    }
  }

  DeletePlaylist(playlistData: any) {
    this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to remove this Playlist... ?')
      .then((confirmed) => { if (confirmed == true) this.RemovePlaylist(playlistData) })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }
  RemovePlaylist(playlistData: any) {
    playlistData.isDeleted = true;
    playlistData.modifiedBy = this.global.UserCode;
    this.mediaFacade.updatePlaylistData(playlistData).subscribe(res => {
      if (res != null && res != 0) {
        this.toast.success("Saved Successfully.");
        this.getPlaylistData();
      }
      else {
        this.toast.error("Something went wrong, Please contact system administrator.");
      }
    });
  }
  OnTabChange(status: number) {
    this.tabno = status;
    this.searchText = "";
    this.isSearch = false;
    this.getPlaylistData();
  }
}

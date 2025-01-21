import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { AdminFacadeService } from 'src/app/facade/facade_services/admin-facade.service';
import { CommonFacadeService } from 'src/app/facade/facade_services/common-facade.service';
import { MediaFacadeService } from 'src/app/facade/facade_services/media-facade.service';
import { ConfirmationDialogService } from 'src/app/facade/services/confirmation-dialog.service';
import { PlaylistMaster } from 'src/app/models/media/PlaylistMaster';
import { InputRequest } from 'src/app/models/request/inputReq';
import { Globals } from 'src/app/utils/global';

@Component({
  selector: 'app-playlist-creation',
  templateUrl: './playlist-creation.component.html',
  styleUrls: ['./playlist-creation.component.css']
})
export class PlaylistCreationComponent {
  headerArr = [
    { "Head": "ID", "FieldName": "id", "type": "number" },
    { "Head": "Playlist Name", "FieldName": "playlistName", "type": "string" },
    { "Head": "Height", "FieldName": "height", "type": "string" },
    { "Head": "Width", "FieldName": "width", "type": "string" },
    { "Head": "Uploaded By", "FieldName": "createdBy", "type": "string" },
    { "Head": "Audited By", "FieldName": "modifiedBy", "type": "string" },
    { "Head": "Status", "FieldName": "isActive", "type": "boolean" },
    { "Head": "Actions", "FieldName": "actions", "type": "button" }
  ];

  btnArray: any[] = [{ "name": "View", "icon": "icon-eye", "tip": "Click to View", "action": "view" }, { "name": "Remove", "icon": "icon-trash", "tip": "Click to Remove", "action": "remove" }, { "name": "Copy", "icon": "fa fa-copy", "tip": "Copy same playlist", "action": "copy" }];

  searchText!: string;
  page: any;
  listOfPlaylist: any;
  totalPages: number = 1;
  pager: number = 1;
  totalRecords!: number;
  recordPerPage: number = 10;
  startId!: number;
  closeResult!: string;
  isSearch: boolean = false;
  _request: any = new InputRequest();


  constructor(private global: Globals,
    public modalService: NgbModal,
    public adminFacade: AdminFacadeService,
    public _commonFacade: CommonFacadeService,
    private toast: ToastrService,
    private confirmationDialogService: ConfirmationDialogService,
    public _router: Router,
    public _media: MediaFacadeService) {
    this.global.CurrentPage = "Playlist Creation";
    this.pager = 1;
    this.totalRecords = 0;
    this._commonFacade.setSession("playlistData", null);
  }
  ngOnInit(): void {
    this.getPlaylistData();
  }
  getPlaylistData() {
    this._commonFacade.loader = true;
    this._request.currentPage = this.pager;
    this._request.pageSize = this.recordPerPage;
    this._request.startId = this.startId;
    this._request.searchItem = this.searchText;
    this.adminFacade.getPlaylistMasterData(this._request, 4).subscribe(data => {
      if (data != null || data != undefined) {
        this.listOfPlaylist = data.data;
        var _length = data.totalRecords / this.recordPerPage;
        if (_length > Math.floor(_length) && Math.floor(_length) != 0)
          this.totalRecords = this.recordPerPage * (_length);
        else if (Math.floor(_length) == 0)
          this.totalRecords = 10;
        else
          this.totalRecords = data.totalRecords;
        this.totalPages = this.totalRecords / this.pager;
      }
      this.listOfPlaylist.forEach((ele: any) => {
        if (ele.isActive == true)
          ele.isActive = "Active";
        else
          ele.isActive = "In Active";
      });
      //this._commonFacade.loader = false;
    },(error)=>{
      console.log(error);
      //this._commonFacade.loader = false;
    })
  }
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

  OpenModal(content: any) {
    // this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    //   this.closeResult = `Closed with: ${result}`;
    // }, (reason) => {
    // });
    this._commonFacade.setSession("ModelShow", null);
    this._router.navigate(['medias/playlist-configure']);
  }

  SearchWithId(_searchItem: any) {
    this._commonFacade.setSession("ModelShow", JSON.stringify(_searchItem));
    this._router.navigate(['users/add-user']);
  }
  ButtonAction(actiondata: any) {
    if (actiondata.action == 'view') {
      this._commonFacade.setSession("playlistData", JSON.stringify(actiondata.data));
      this._router.navigate(['medias/playlist-configure'], { queryParams: { isCopy: false, status: actiondata.data.status, plid: actiondata.data.plid } });
    }
    else if (actiondata.action == 'remove') {
      this.DeletePlaylist(actiondata.data);
    }
    else if (actiondata.action == 'copy') {
      this.CopyPlaylist(actiondata.data);
    }
  }

  DeletePlaylist(playlistData: any) {
    this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to remove this Playlist... ?')
      .then((confirmed) => { if (confirmed == true) this.RemovePlaylist(playlistData) })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }
  RemovePlaylist(playlistData: any) {
    if (playlistData.isActive == 'Active')
      playlistData.isActive = true;
    else playlistData.isActive = false;
    playlistData.isDeleted = true;
    this._media.updatePlaylistMaster(playlistData).subscribe(res => {
      if (res != null && res != undefined) {
        this.toast.success("Updated Successfully.")
        this.getPlaylistData();
      }
    });
  }

  CopyPlaylist(data: any) {
    this._commonFacade.setSession("playlistData", JSON.stringify(data));
    this._router.navigate(['medias/playlist-configure'], { queryParams: { isCopy: true, status: data.status, plid: data.plid } });
  }

}

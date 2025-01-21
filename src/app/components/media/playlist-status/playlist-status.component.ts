import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminFacadeService } from 'src/app/facade/facade_services/admin-facade.service';
import { CommonFacadeService } from 'src/app/facade/facade_services/common-facade.service';
import { MediaFacadeService } from 'src/app/facade/facade_services/media-facade.service';
import { InputRequest } from 'src/app/models/request/inputReq';
import { Globals } from 'src/app/utils/global';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-playlist-status',
  templateUrl: './playlist-status.component.html',
  styleUrls: ['./playlist-status.component.css']
})
export class PlaylistStatusComponent {
  playlistSub: Subscription;
  pager: number = 0; isSearch: boolean = true; startId: number = 0;
  totalRecords: number = 0; totalPages: number = 0; recordPerPage: number = 5;
  listOfPlaylist: any;
  filteredPlaylist: any;
  subscription: any;
  _request: any = new InputRequest();
  headerArr = [
    { "Head": "Playlist ID", "FieldName": "plId", "type": "number" },
    { "Head": "Playlist Name", "FieldName": "playlistName", "type": "string" },
    { "Head": "Total Count", "FieldName": "totalCount", "type": "string" },
    { "Head": "Process Count", "FieldName": "processCount", "type": "string" },
    { "Head": "Percentage", "FieldName": "processPercentage", "type": "number" },
    { "Head": "Status", "FieldName": "status", "type": "string" }
  ];
  searchText: string;
  constructor(private global: Globals,
    public _router: Router,
    public _media: MediaFacadeService,
    public adminFacade: AdminFacadeService,
    public _commonFacade: CommonFacadeService,) {
    this.global.CurrentPage = "Playlist Status";
    this.pager = 1;
    this.totalRecords = 0;
  }

  ngOnInit(): void {
    const source = interval(5000);
    this.subscription = source.subscribe((val) => this.getPlaylistData());
  }
  getPlaylistData() {
    this._commonFacade.loader = true;

    this._media.GetPlaylistProcessStatus().subscribe(data => {
      if (data != null || data != undefined) {
        this.listOfPlaylist = data;
        this.filteredPlaylist = data;
        this.Search();
      }
    }, (error) => {
      console.log(error);
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
    this.getPlaylistData();
  }
  Search() {
    this.filteredPlaylist = this.listOfPlaylist.filter((x: any) => x.playlistName.toLocaleLowerCase().includes(this.searchText.toLocaleLowerCase()));
  }

  ngOnDestroy(): void {
    if(this.subscription != undefined){
      this.subscription.unsubscribe();
      this.subscription.closed;
    }
  }
}

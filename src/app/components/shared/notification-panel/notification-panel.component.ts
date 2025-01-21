import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonFacadeService } from 'src/app/facade/facade_services/common-facade.service';
import { InputRequest } from 'src/app/models/request/inputReq';
import { Globals } from 'src/app/utils/global';

@Component({
  selector: 'app-notification-panel',
  templateUrl: './notification-panel.component.html',
  styleUrls: ['./notification-panel.component.css']
})
export class NotificationPanelComponent implements OnInit {
  isSearch: boolean = false;
  form: any = [];
  title = 'angular13';
  searchText!: string;
  page: any;
  listOfNotifications: any;
  totalPages: number = 1;
  pager: number = 1;
  totalRecords!: number;
  recordPerPage: number = 10;
  startId!: number;
  closeResult!: string;
  _request: any = new InputRequest();
  selectedType: string = "All";
  headerArr = [
    { "Head": "ID", "FieldName": "id", "type": "number" },
    { "Head": "Type", "FieldName": "type", "type": "string" },
    { "Head": "Description", "FieldName": "description", "type": "string" },
    { "Head": "Created Date", "FieldName": "createdDate", "type": "string" },
  ];

  constructor(private _commonFacade: CommonFacadeService,
    private _global: Globals,
    private _toast: ToastrService) {
    this._global.CurrentPage = "Notifications"
  }
  ngOnInit(): void {
    this.GetNotifications(this.selectedType);
  }

  onPager(pager: number) {
    this._request.pageSize = this.recordPerPage;
    this.pager = pager;
    this.startId = (this.pager - 1) * this.recordPerPage;
    this.GetNotifications(this.selectedType);
  }

  onRecordPageChange(recordPerPage: number) {
    this._request.pageSize = recordPerPage;
    this.pager = recordPerPage;
    this.recordPerPage = recordPerPage;
    this.startId = 0;
    this.pager = 1;
    console.log(this.recordPerPage);
    this.GetNotifications(this.selectedType);
  }

  onPageSearch(search: string) {
    this.isSearch = true;
    this.searchText = search;
    this.GetNotifications(this.selectedType);
  }

  OpenModal(content: any) {
    // this.commonFacade.setSession("ModelShow",null);
    // this.router.navigate(['masters/add-vms']);
  }
  SearchWithId(_searchItem: any) {
    // this.commonFacade.setSession("ModelShow", JSON.stringify(_searchItem));
    // this.router.navigate(['masters/add-vms']);
  }
  GetNotifications(type:string) {
    this._request.currentPage = this.pager;
    this._request.pageSize = this.recordPerPage;
    this._request.startId = this.startId == undefined ? 0 : this.startId;
    this._request.searchItem = this.searchText == undefined ? "" : this.searchText;
    this._request.cacheKey = "Notifications";
    this._request.filter = this.selectedType;
    this._commonFacade.getAllNotifications(type, this._request).subscribe(res => {
      if (res != null) {
        this.listOfNotifications = res.data;
        if (this.listOfNotifications != null && this.listOfNotifications != undefined) {
          var _length = res.totalRecords / this.recordPerPage;
          if (_length > Math.floor(_length) && Math.floor(_length) != 0)
            this.totalRecords = this.recordPerPage * (_length);
          else if (Math.floor(_length) == 0)
            this.totalRecords = 10;
          else
            this.totalRecords = res.totalRecords;
          this.totalPages = this.totalRecords / this.pager;
        }
        if(type.toLowerCase() == "all")
          this._global.NotificationCount = res.totalRecords;
      }
    })
  }

  TypeChange() {

    this.GetNotifications(this.selectedType);
  }

  MarkAsRead() {
    if(this.listOfNotifications.length > 0){
      this._commonFacade.setNotifMarkAsRead().subscribe(res => {
        if (res != 1)
          this._toast.error("Something went wrong");
        else {
          this._toast.success("Updated successfully");
          this.GetNotifications("all");
        }
      })
    }
    else {
      this._toast.error("Records not available.");
    }
    
  }
}

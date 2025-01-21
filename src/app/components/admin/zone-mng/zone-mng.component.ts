import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminFacadeService } from 'src/app/facade/facade_services/admin-facade.service';
import { CommonFacadeService } from 'src/app/facade/facade_services/common-facade.service';
import { InputRequest } from 'src/app/models/request/inputReq';
import { Globals } from 'src/app/utils/global';

export type eventModel = {
  id: number;
  name: string;
};

@Component({
  selector: 'app-zone-mng',
  templateUrl: './zone-mng.component.html',
  styleUrls: ['./zone-mng.component.css']
})
export class ZoneMngComponent {
  isSearch:boolean =false;
  form: any = [];
  title = 'angular13';
  searchText!: string;
  page: any;
  listOfZones: any;
  totalPages: number = 1;
  pager: number = 1;
  totalRecords!: number;
  recordPerPage: number = 10;
  startId!: number;
  closeResult!: string;
  _request: any = new InputRequest();
  constructor(private adminFacade: AdminFacadeService,
    private global: Globals,
    private modalService: NgbModal,
    private _common:CommonFacadeService,
    private router: Router) {
    this.global.CurrentPage = "Zone Management";
    this.pager = 1;
    this.totalRecords = 0;
    this.getZones();
  }

  headerArr = [
    { "Head": "ID", "FieldName": "id", "type": "number" },
    { "Head": "Zone Name", "FieldName": "zoneName", "type": "string" },
    { "Head": "Description", "FieldName": "description", "type": "string" },
    { "Head": "Status", "FieldName": "isActive", "type": "boolean" }
  ];
  getZones() {
    this._request.currentPage = this.pager;
    this._request.pageSize = this.recordPerPage;
    this._request.startId = this.startId;
    this._request.searchItem = this.searchText;
    this._request.cacheKey = "ZoneMaster";
    //get request from web api
    this.adminFacade.getZones(this._request).subscribe(data => {
      if (data != null && data != undefined) {

        this.listOfZones = data.data;
        if (this.listOfZones != null && this.listOfZones != undefined) {
          var _length = data.totalRecords / this.recordPerPage;
          if (_length > Math.floor(_length) && Math.floor(_length) != 0)
            this.totalRecords = this.recordPerPage * (_length);
          else if (Math.floor(_length) == 0)
            this.totalRecords = 10;
          else
            this.totalRecords = data.totalRecords;
          this.totalPages = this.totalRecords / this.pager;
        }
        this.listOfZones.forEach((ele: any) => {
          if (ele.isActive == true)
            ele.isActive = "Active";
          else
            ele.isActive = "In Active";
        });
      }
      else {
        this.router.navigate(['error-page']);
      }
    }, error => console.error(error));
  }

  onPager(pager: number) {
    this._request.pageSize = this.recordPerPage;
    this.pager = pager;
    this.startId = (this.pager - 1) * this.recordPerPage;
    this.getZones();
  }

  onRecordPageChange(recordPerPage: number) {
    this._request.pageSize = recordPerPage;
    this.pager = recordPerPage;
    this.recordPerPage = recordPerPage;
    this.startId = 0;
    this.pager = 1;
    console.log(this.recordPerPage);
    this.getZones();
  }

  onPageSearch(search: string) {
    this.isSearch = true;
    this.searchText = search;
    this.getZones();
  }

  OpenModal(content: any) {
    // this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    //   this.closeResult = `Closed with: ${result}`;
    // }, (reason) => {
    // });
    this._common.setSession("ModelShow",null);
    this.router.navigate(['admin/add-zone']);
  }

  
  SearchWithId(_searchItem:any){
    this._common.setSession("ModelShow",JSON.stringify(_searchItem));
    this.router.navigate(['admin/add-zone']);
  }
}

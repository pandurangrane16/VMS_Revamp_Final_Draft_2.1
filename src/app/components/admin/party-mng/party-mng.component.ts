import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminFacadeService } from 'src/app/facade/facade_services/admin-facade.service';
import { CommonFacadeService } from 'src/app/facade/facade_services/common-facade.service';
import { InputRequest } from 'src/app/models/request/inputReq';
import { Globals } from 'src/app/utils/global';

@Component({
  selector: 'app-party-mng',
  templateUrl: './party-mng.component.html',
  styleUrls: ['./party-mng.component.css']
})
export class PartyMngComponent {
  isSearch:boolean = false;
  title = 'angular13';
  searchText!: string;
  page: any;
  listOfParties: any;
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
    private _commonFacade : CommonFacadeService,
    private router: Router) {
    this.global.CurrentPage = "Party Management";
    this.pager = 1;
    this.totalRecords = 0;
    this.getParties();
  }

  headerArr = [
    { "Head": "ID", "FieldName": "id", "type": "number" },
    { "Head": "Party Code", "FieldName": "partyCode", "type": "string" },
    { "Head": "Party Name", "FieldName": "partyName", "type": "string" },
    { "Head": "Description", "FieldName": "description", "type": "string" },
    { "Head": "Status", "FieldName": "isActive", "type": "boolean" }
  ];
  getParties() {
    this._request.currentPage = this.pager;
    this._request.pageSize = this.recordPerPage;
    this._request.startId = this.startId;
    this._request.searchItem = this.searchText;
    //get request from web api
    this.adminFacade.getParties(this._request).subscribe(data => {
      if (data != null && data != undefined) {

        this.listOfParties = data.data;
        if (this.listOfParties != null && this.listOfParties != undefined) {
          var _length = data.totalRecords / this.recordPerPage;
          if (_length > Math.floor(_length) && Math.floor(_length) != 0)
            this.totalRecords = this.recordPerPage * (_length);
          else if (Math.floor(_length) == 0)
            this.totalRecords = 10;
          else
            this.totalRecords = data.totalRecords;
          this.totalPages = this.totalRecords / this.pager;
        }
        this.listOfParties.forEach((ele: any) => {
          if (ele.isActive == true)
            ele.isActive = "Active";
          else
            ele.isActive = "In Active";
        });
      }
      else {
        this.router.navigate(['error-page']);
      }
    }, (err: any) => console.error(err));
  }

  onPager(pager: number) {
    this._request.pageSize = this.recordPerPage;
    this.pager = pager;
    this.startId = (this.pager - 1) * this.recordPerPage;
    this.getParties();
  }

  onRecordPageChange(recordPerPage: number) {
    this._request.pageSize = recordPerPage;
    this.pager = recordPerPage;
    this.recordPerPage = recordPerPage;
    this.startId = 0;
    this.pager = 1;
    console.log(this.recordPerPage);
    this.getParties();
  }

  onPageSearch(search: string) {
    this.isSearch = true;
    this.searchText = search;
    this.getParties();
  }

  OpenModal(content: any) {
    // this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    //   this.closeResult = `Closed with: ${result}`;
    // }, (reason) => {
    // });
    this._commonFacade.setSession("ModelShow",null);
    this.router.navigate(['masters/add-party']);
  }

  SearchWithId(_searchItem:any){
    this._commonFacade.setSession("ModelShow",JSON.stringify(_searchItem));
    this.router.navigate(['masters/add-party']);
  }
}

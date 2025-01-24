import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonFacadeService } from 'src/app/facade/facade_services/common-facade.service';

import { InputRequest } from 'src/app/models/request/inputReq';
import { Globals } from 'src/app/utils/global';



@Component({
  selector: 'app-uploadmedialist',
  templateUrl: './uploadmedialist.component.html',
  styleUrls: ['./uploadmedialist.component.css']
})
export class UploadmedialistComponent {
  isSearch:boolean =false;
  form: any = [];  
  searchText!: string;
  page: any;
  listOfUsers: any;
  totalPages: number = 1;
  pager: number = 1;
  totalRecords!: number;
  recordPerPage: number = 10;
  startId!: number;
  closeResult!: string;
  _request: any = new InputRequest();
  constructor(private global: Globals,
    private modalService: NgbModal,
    private _commonFacade: CommonFacadeService,
    private router: Router){

  }
  headerArr = [
    { "Head": "ID", "FieldName": "id", "type": "number" },
    { "Head": "First Name", "FieldName": "userFName", "type": "string" },
    { "Head": "Last Name", "FieldName": "userLName", "type": "string" },
    { "Head": "Username", "FieldName": "username", "type": "string" },
    { "Head": "Role", "FieldName": "roleId", "type": "string" },
    { "Head": "Status", "FieldName": "isActive", "type": "boolean" }
  ];

  getUploadMediaList() {
    this._request.currentPage = this.pager;
    this._request.pageSize = this.recordPerPage;
    this._request.startId = this.startId;
    this._request.searchItem = this.searchText;
    //get request from web api
    
    
  }

  onPager(pager: number) {
    this._request.pageSize = this.recordPerPage;
    this.pager = pager;
    this.startId = (this.pager - 1) * this.recordPerPage;
    this.getUploadMediaList();
  }

  onRecordPageChange(recordPerPage: number) {
    this._request.pageSize = recordPerPage;
    this.pager = recordPerPage;
    this.recordPerPage = recordPerPage;
    this.startId = 0;
    this.pager = 1;
    console.log(this.recordPerPage);
    this.getUploadMediaList();
  }

  onPageSearch(search: string) {
    this.isSearch = true;
    this.searchText = search;
    this.getUploadMediaList();
  }

}

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonFacadeService } from 'src/app/facade/facade_services/common-facade.service';
import { UserFacadeService } from 'src/app/facade/facade_services/user-facade.service';
import { InputRequest } from 'src/app/models/request/inputReq';
import { Globals } from 'src/app/utils/global';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  isSearch:boolean =false;
  form: any = [];
  title = 'angular13';
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
  constructor(private userFacade: UserFacadeService,
    private global: Globals,
    private modalService: NgbModal,
    private _commonFacade: CommonFacadeService,
    private router: Router) {
    this.global.CurrentPage = "User Management";
    this.pager = 1;
    this.totalRecords = 0;
    this.getUsers();
  }
  ngOnInit(): void {
    
  }

  headerArr = [
    { "Head": "ID", "FieldName": "id", "type": "number" },
    { "Head": "First Name", "FieldName": "userFName", "type": "string" },
    { "Head": "Last Name", "FieldName": "userLName", "type": "string" },
    { "Head": "Username", "FieldName": "username", "type": "string" },
    { "Head": "Role", "FieldName": "roleId", "type": "string" },
    { "Head": "Status", "FieldName": "isActive", "type": "boolean" }
  ];
  getUsers() {
    this._request.currentPage = this.pager;
    this._request.pageSize = this.recordPerPage;
    this._request.startId = this.startId;
    this._request.searchItem = this.searchText;
    //get request from web api
    this.userFacade.getUsers(this._request).subscribe(data => {
      if (data != null && data != undefined) {

        this.listOfUsers = data.data;
        if (this.listOfUsers != null && this.listOfUsers != undefined) {
          var _length = data.totalRecords / this.recordPerPage;
          if (_length > Math.floor(_length) && Math.floor(_length) != 0)
            this.totalRecords = this.recordPerPage * (_length);
          else if (Math.floor(_length) == 0)
            this.totalRecords = 10;
          else
            this.totalRecords = data.totalRecords;
          this.totalPages = this.totalRecords / this.pager;
        }
        this.listOfUsers.forEach((ele: any) => {
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
    this.getUsers();
  }

  onRecordPageChange(recordPerPage: number) {
    this._request.pageSize = recordPerPage;
    this.pager = recordPerPage;
    this.recordPerPage = recordPerPage;
    this.startId = 0;
    this.pager = 1;
    console.log(this.recordPerPage);
    this.getUsers();
  }

  onPageSearch(search: string) {
    this.isSearch = true;
    this.searchText = search;
    this.getUsers();
  }

  OpenModal(content: any) {
    // this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    //   this.closeResult = `Closed with: ${result}`;
    // }, (reason) => {
    // });
    this._commonFacade.setSession("ModelShow", null);
    this.router.navigate(['users/add-user']);
  }

  SearchWithId(_searchItem: any) {
    this._commonFacade.setSession("ModelShow", JSON.stringify(_searchItem));
    this.router.navigate(['users/add-user']);
  }
}

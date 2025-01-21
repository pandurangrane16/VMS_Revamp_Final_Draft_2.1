import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonFacadeService } from 'src/app/facade/facade_services/common-facade.service';
import { UserFacadeService } from 'src/app/facade/facade_services/user-facade.service';
import { InputRequest } from 'src/app/models/request/inputReq';
import { Globals } from 'src/app/utils/global';

@Component({
  selector: 'app-role-master',
  templateUrl: './role-master.component.html',
  styleUrls: ['./role-master.component.css']
})
export class RoleMasterComponent implements OnInit {
  title = 'angular13';
  isSearch: boolean = false;
  searchText!: string;
  page: any;
  listOfRoles: any;
  totalPages: number = 1;
  pager: number = 1;
  totalRecords!: number;
  recordPerPage: number = 10;
  startId!: number;
  closeResult!: string;
  _request: any = new InputRequest();
  headerArr = [
    { "Head": "ID", "FieldName": "id", "type": "number" },
    { "Head": "Role Name", "FieldName": "roleName", "type": "string" },
    { "Head": "Description", "FieldName": "description", "type": "string" },
    { "Head": "Status", "FieldName": "isActive", "type": "boolean" }
  ];
  constructor(private global: Globals,
    private _commonFacade: CommonFacadeService,
    private router: Router,
    private _userFacade: UserFacadeService) {
    this.global.CurrentPage = "Role Management";
  }
  ngOnInit(): void {
    this.getRoles();
  }
  onPager(pager: number) {
    this._request.pageSize = this.recordPerPage;
    this.pager = pager;
    this.startId = (this.pager - 1) * this.recordPerPage;
    this.getRoles();
  }

  onRecordPageChange(recordPerPage: number) {
    this._request.pageSize = recordPerPage;
    this.pager = recordPerPage;
    this.recordPerPage = recordPerPage;
    this.startId = 0;
    this.pager = 1;
    console.log(this.recordPerPage);
    this.getRoles();
  }

  onPageSearch(search: string) {
    this.isSearch=  true;
    this.searchText = search;
    this.getRoles();
  }

  OpenModal(content: any) {
    this._commonFacade.setSession("ModelShow", null);
    this.router.navigate(['masters/add-role']);
  }

  SearchWithId(_searchItem: any) {
    this._commonFacade.setSession("ModelShow", JSON.stringify(_searchItem));
    this.router.navigate(['masters/add-role']);
  }

  getRoles() {
    this._request.currentPage = this.pager;
    this._request.pageSize = this.recordPerPage;
    this._request.startId = this.startId;
    this._request.searchItem = this.searchText;
    //get request from web api
    this._userFacade.getRoles(this._request).subscribe(data => {
      if (data != null && data != undefined) {

        this.listOfRoles = data.data;
        if (this.listOfRoles != null && this.listOfRoles != undefined) {
          var _length = data.totalRecords / this.recordPerPage;
          if (_length > Math.floor(_length) && Math.floor(_length) != 0)
            this.totalRecords = this.recordPerPage * (_length);
          else if (Math.floor(_length) == 0)
            this.totalRecords = 10;
          else
            this.totalRecords = data.totalRecords;
          this.totalPages = this.totalRecords / this.pager;
        }
        this.listOfRoles.forEach((ele: any) => {
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

}

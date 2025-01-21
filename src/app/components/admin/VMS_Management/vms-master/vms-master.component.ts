import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminFacadeService } from 'src/app/facade/facade_services/admin-facade.service';
import { CommonFacadeService } from 'src/app/facade/facade_services/common-facade.service';
import { InputRequest } from 'src/app/models/request/inputReq';
import { Globals } from 'src/app/utils/global';

@Component({
  selector: 'app-vms-master',
  templateUrl: './vms-master.component.html',
  styleUrls: ['./vms-master.component.css']
})
export class VmsMasterComponent {
  isSearch:boolean = false;
  form: any = [];
  title = 'angular13';
  searchText!: string;
  page: any;
  listOfVmss: any;
  totalPages: number = 1;
  pager: number = 1;
  totalRecords!: number;
  recordPerPage: number = 10;
  startId!: number;
  closeResult!: string;
  _request: any = new InputRequest();

  headerArr = [
    { "Head": "ID", "FieldName": "id", "type": "number" },
    { "Head": "VMSID", "FieldName": "vmsId", "type": "string" },
    { "Head": "Device Serial No", "FieldName": "serialNo", "type": "string" },
    { "Head": "Description", "FieldName": "description", "type": "string" },
    { "Head": "Status", "FieldName": "isActive", "type": "boolean" }
  ];
  constructor(private adminFacade: AdminFacadeService,
    private global: Globals,
    private modalService: NgbModal,
    private router: Router,
    private commonFacade:CommonFacadeService) {
    this.global.CurrentPage = "VMS Management";
    this.pager = 1;
    this.totalRecords = 0;
    this.GetVmsData();
  }


  onPager(pager: number) {
    this._request.pageSize = this.recordPerPage;
    this.pager = pager;
    this.startId = (this.pager - 1) * this.recordPerPage;
    this.GetVmsData();
  }

  onRecordPageChange(recordPerPage: number) {
    this._request.pageSize = recordPerPage;
    this.pager = recordPerPage;
    this.recordPerPage = recordPerPage;
    this.startId = 0;
    this.pager = 1;
    console.log(this.recordPerPage);
    this.GetVmsData();
  }

  onPageSearch(search: string) {
    this.isSearch =true;
    this.searchText = search;
    this.GetVmsData();
  }

  OpenModal(content: any) {
    this.commonFacade.setSession("ModelShow",null);
    this.router.navigate(['masters/add-vms']);
  }

  GetVmsData() {
    this._request.currentPage = this.pager;
    this._request.pageSize = this.recordPerPage;
    this._request.startId = this.startId;
    this._request.searchItem = this.searchText;
    this._request.cacheKey = "VMSMaster";
    this.adminFacade.getVmss(this._request).subscribe(data => {
      if (data != null && data != undefined) {

        this.listOfVmss = data.data;
        if (this.listOfVmss != null && this.listOfVmss != undefined) {
          var _length = data.totalRecords / this.recordPerPage;
          if (_length > Math.floor(_length) && Math.floor(_length) != 0)
            this.totalRecords = this.recordPerPage * (_length);
          else if (Math.floor(_length) == 0)
            this.totalRecords = 10;
          else
            this.totalRecords = data.totalRecords;
          this.totalPages = this.totalRecords / this.pager;
        }
        this.listOfVmss.forEach((ele: any) => {
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

  SearchWithId(_searchItem: any) {
    this.commonFacade.setSession("ModelShow", JSON.stringify(_searchItem));
    this.router.navigate(['masters/add-vms']);
  }
}

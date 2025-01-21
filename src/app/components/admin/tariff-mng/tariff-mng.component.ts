import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminFacadeService } from 'src/app/facade/facade_services/admin-facade.service';
import { CommonFacadeService } from 'src/app/facade/facade_services/common-facade.service';
import { InputRequest } from 'src/app/models/request/inputReq';
import { Globals } from 'src/app/utils/global';

@Component({
  selector: 'app-tariff-mng',
  templateUrl: './tariff-mng.component.html',
  styleUrls: ['./tariff-mng.component.css']
})
export class TariffMngComponent {
isSearch:boolean = false;
  form: any = [];
  title = 'angular13';
  searchText!: string;
  page: any;
  listOfTarrifs: any;
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
    private _commonFacade: CommonFacadeService,
    private router: Router) {
    this.global.CurrentPage = "Tariff Management";
    this.pager = 1;
    this.totalRecords = 0;
    this.getTarrifs();
  }

  headerArr = [
    { "Head": "ID", "FieldName": "id", "type": "number" },
    { "Head": "Tarrif Code", "FieldName": "tarrifCode", "type": "string" },
    { "Head": "Tarrif Type", "FieldName": "tarrifType", "type": "string" },
    { "Head": "Unit Of Measurement", "FieldName": "uomName", "type": "string" },
    { "Head": "Amount", "FieldName": "amount", "type": "string" },
    { "Head": "Tax(%)", "FieldName": "gstPer", "type": "string" },
    { "Head": "Total Amount", "FieldName": "totalAmount", "type": "string" },
    { "Head": "Status", "FieldName": "isActive", "type": "boolean" }
  ];
  getTarrifs() {
    this._request.currentPage = this.pager;
    this._request.pageSize = this.recordPerPage;
    this._request.startId = this.startId;
    this._request.searchItem = this.searchText;
    //get request from web api
    this.adminFacade.getTarrifs(this._request).subscribe(data => {
      if (data != null && data != undefined) {

        this.listOfTarrifs = data.data;
        if (this.listOfTarrifs != null && this.listOfTarrifs != undefined) {
          var _length = data.totalRecords / this.recordPerPage;
          if (_length > Math.floor(_length) && Math.floor(_length) != 0)
            this.totalRecords = this.recordPerPage * (_length);
          else if (Math.floor(_length) == 0)
            this.totalRecords = 10;
          else
            this.totalRecords = data.totalRecords;
          this.totalPages = this.totalRecords / this.pager;
        }
        this.listOfTarrifs.forEach((ele: any) => {
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
    this.getTarrifs();
  }

  onRecordPageChange(recordPerPage: number) {
    this._request.pageSize = recordPerPage;
    this.pager = recordPerPage;
    this.recordPerPage = recordPerPage;
    this.startId = 0;
    this.pager = 1;
    console.log(this.recordPerPage);
    this.getTarrifs();
  }

  onPageSearch(search: string) {
    this.isSearch = true;
    this.searchText = search;
    this.getTarrifs();
  }

  OpenModal(content: any) {
    // this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    //   this.closeResult = `Closed with: ${result}`;
    // }, (reason) => {
    // });
    this._commonFacade.setSession("ModelShow", null);
    this.router.navigate(['masters/add-tariff']);
  }

  SearchWithId(_searchItem: any) {
    this._commonFacade.setSession("ModelShow", JSON.stringify(_searchItem));
    this.router.navigate(['masters/add-tariff']);
  }
}

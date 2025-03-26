import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cm-table',
  templateUrl: './cm-table.component.html',
  styleUrls: ['./cm-table.component.css']
})
export class CmTableComponent implements OnChanges {
  listOfData: any;
  tooltip: string = "";
  searchText: string = "";
  @Input() SearchLable : string = "Search Here";
  @Input() pagination:boolean =true;
  @Input() isSearch: boolean = false;
  @Output() pager = new EventEmitter<number>();
  @Output() searchWithId = new EventEmitter<any>();
  @Output() search = new EventEmitter<string>();
  @Output() recordPerPage = new EventEmitter<number>();
  @Input() headArr: any[] = [];
  @Input() link!: string;
  @Input() isSearchBox: boolean = true;
  @Input() fieldName!: string;
  @Input() gridArr: any[] = [];
  @Input() totalRecords!: number;
  @Input() perPage: number = 10;
  @Input() totalPages: number = 1;
  @Input() collectionSize: number = 1;
  @Input() btnArray: any[] = [];
  filteredData: any = [];
  activePage: number = 0;
  @Output() btnAction = new EventEmitter<any>();
  @Output() checked = new EventEmitter<any>();
  @Output() notChecked = new EventEmitter<any>();
  constructor(private router: Router) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    if(!this.isSearch) {
      this.searchText = "";
    }
  }
  displayActivePage(activePageNumber: number) {
    this.activePage = activePageNumber
  }
  Search() {
    if (this.searchText.trim().length > 2) {
      this.search.emit(this.searchText);
    } else if (this.searchText.trim() == "") {
      this.search.emit(this.searchText);
    }
  }
  mouseEnter(msg: string) {
    this.tooltip = msg;
  }
  pageChange(pager: number) {
    this.pager.emit(pager);
  }

  onPageChange(pageNo: number) {
    this.pageChange(pageNo);
  }
  onPageRecordsChange(pageNo: number) {
    this.recordPerPage.emit(pageNo);
  }

  ShowForm(item: any) {
    if (this.btnArray.length == 0)
      this.searchWithId.emit(item);
    //this.router.navigate([this.link]);
  }
  GoToBtnAction(action: any, data: any) {
    let _sendData = { "action": action.action, "data": data };
    this.btnAction.emit(_sendData);
  }
  Checked(eve: any, data: any) {
    if (eve.target.checked == true)
      this.checked.emit(data);
    else
      this.notChecked.emit(data);
  }
}

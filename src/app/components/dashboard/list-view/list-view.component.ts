import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { DashboardFacadeService } from 'src/app/facade/facade_services/dashboard-facade.service';
import { ScreenshotListviewComponent } from '../screenshot-listview/screenshot-listview.component';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.css']
})
export class ListViewComponent {
  @ViewChild(DataTableDirective)
  datatableElement: DataTableDirective;
  listViewData : any[]=[];
  constructor(private router: Router,private modalService: NgbModal,
    private _dashboardFacade: DashboardFacadeService) { }


  ngOnInit(): void {

    // this.dtOptions = {
    //   pagingType: 'full_numbers',
    //   pageLength: 8,
    //   lengthMenu: [[8, 10, 25, 50, -1], [8, 10, 25, 50, "All"]],
    //   processing: true,
    //   // dom: 'Bfltip',
    // }

    this.getListViewData();
  }

  getListViewData() {
    this._dashboardFacade.getListViewData().subscribe(res => {
      if (res != null && res != undefined && res.length > 0) {
        this.listViewData =res;
      }
    })
  }

  BackToList() {
    this.router.navigate(['map-view']);
  }
  ViewScreenshot(data:any){
    console.log(data);

     const modalRef = this.modalService.open(ScreenshotListviewComponent, { ariaLabelledBy: 'modal-basic-title', size: 'xl' });
          modalRef.componentInstance.data = data;
          modalRef.componentInstance.passEntry.subscribe((receivedEntry: any) => {
          })
  }
}

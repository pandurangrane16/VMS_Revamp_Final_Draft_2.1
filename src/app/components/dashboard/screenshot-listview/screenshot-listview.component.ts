import { Component, Input, OnInit } from '@angular/core';
import { DashboardFacadeService } from 'src/app/facade/facade_services/dashboard-facade.service';

@Component({
  selector: 'app-screenshot-listview',
  templateUrl: './screenshot-listview.component.html',
  styleUrls: ['./screenshot-listview.component.css']
})
export class ScreenshotListviewComponent implements OnInit {
  imgSrc: string;
  @Input() data: any;

  constructor(private dashboardFacade: DashboardFacadeService) { }
  ngOnInit(): void {
    this.dashboardFacade.GetSnapShotData(this.data.vmsId).subscribe(res => {
      if (res != null && res != undefined) {
        this.imgSrc ="data:image/png;base64,"+ res.snapshot;
      }
    })
  }
}

import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as $ from 'jquery';
import { AppComponent } from 'src/app/app.component';
import { CommonFacadeService } from 'src/app/facade/facade_services/common-facade.service';
import { UserFacadeService } from 'src/app/facade/facade_services/user-facade.service';
import { SessionService } from 'src/app/facade/services/common/session.service';
import { InputRequest } from 'src/app/models/request/inputReq';
import { User } from 'src/app/models/response/User';
import { Globals } from 'src/app/utils/global';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  user?: User | null;
  title?: any;
  username: string = "";
  global: Globals;
  notificationCount: number;
  Notifications: any[];
  _request: any = new InputRequest();
  constructor(private _userFacade: UserFacadeService,
    private route: ActivatedRoute,
    private _commonFacade: CommonFacadeService,
    private globals: Globals,
    private _router: Router,
    private _appComp: AppComponent) {
    this.global = globals;
    //this.accountService.user.subscribe(x => this.user = x);
  }
  ngOnInit() {
    this.title = this.global.CurrentPage;
    this.user = this._userFacade.user;
    this.username = this.user.username;
    var body = $("body");
    $('[data-toggle="minimize"]').on("click", function () {
      if ((body.hasClass('sidebar-toggle-display')) || (body.hasClass('sidebar-absolute'))) {
        body.toggleClass('sidebar-hidden');
      } else {
        body.toggleClass('sidebar-icon-only');
      }
    });

    $('[data-toggle="offcanvas"]').on("click", function () {
      $('.sidebar-offcanvas').toggleClass('active')
    });
   // this.GetNotifications();
  }

  logout() {
    this._appComp.loggedIn = false;
    this._userFacade.ClearUserObject();
  }

  GetNotifications() {
    this._request.currentPage = 1;
    this._request.pageSize = 10;
    this._request.startId = 0;
    this._request.searchItem = "";
    this._request.cacheKey = "Notifications";
    this._request.filter = "all";
    this._commonFacade.getAllNotifications("all", this._request).subscribe((res: any) => {
      if (res != null) {
        if (res.data.length > 0)
          this.Notifications = res.data;
        this.global.NotificationCount = res.totalRecords;
        this.notificationCount = res.totalRecords;
      }
    })
  }

  NotificationPanel() {
    this._router.navigate(['notification']);
  }

}

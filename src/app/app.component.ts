import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { UserFacadeService } from './facade/facade_services/user-facade.service';
import { User } from './models/response/User';
import { NavigationStart, Router } from '@angular/router';
import { LocationStrategy } from '@angular/common';
import { SessionService } from './facade/services/common/session.service';
import { CommonFacadeService } from './facade/facade_services/common-facade.service';
import { SocketFacadeService } from './facade/facade_services/socket-facade.service';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environment';
import { UserLoggedIn } from './models/$bs/userLoggedIn';
import { HttpService } from './facade/services/common/http.service';
import { Globals } from './utils/global';
import { SocketService } from './facade/services/common/socket.service';


let browserRefresh = false;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'vms-pc';
  public _hubConnecton: HubConnection;
  message: string;
  ver: string;
  messages: any[] = [];
  config$!: Observable<any>;
  user!: User;
  loggedIn: boolean = false;
  secretCode: any;
  subscription: Subscription;
  constructor(private _facadeService: UserFacadeService,
    private _router: Router,
    private _commonFacade: CommonFacadeService,
    private chatService: SocketFacadeService,
    private _sessionService: SessionService,
    private _toast: ToastrService,
    private _httpService: HttpService,
    private _global: Globals,
    private singlarService: SocketService
  ) {
    this.ver = environment.version;
    console.log(this.loggedIn);
    // this._facadeService.isLoggedin.subscribe(x => {
    //   debugger;
    //   this.loggedIn = x.LoggedIn;
    //   if (x.LoggedIn == false)
    //     this._router.navigate(['login']);
    // });
    let val = this._sessionService._getSessionValue("isLoggedIn");
    if (val == false.toString()) {
      this.loggedIn = false;
      this._router.navigate(['login']);
    }
    else {
      //this.ConnectSocket();
      let val = this._sessionService._getSessionValue("api_url");
      this._httpService._api_url = JSON.parse(JSON.stringify(val));
      
      let _userCode = this._sessionService._getSessionValue("userId") == null ? "" : this._sessionService._getSessionValue("userId");
      var _user = new UserLoggedIn();
      _user.LoggedIn = true;
      _user.LoggedInUser = JSON.stringify(_userCode);
      _user.LoggedTime = new Date();
      var res = new User();
      res.roleId = Number(this._sessionService._getSessionValue("roleId"));
      res.status = "1";
      res.token = JSON.stringify(this._sessionService._getSessionValue("access_token"));
      res.userId = Number(this._sessionService._getSessionValue("userId"));
      res.username = JSON.stringify(this._sessionService._getSessionValue("userName"));
      this._facadeService.user = res;
      this._facadeService.isLoggedinSubject.next(_user);
      this._global.UserCode = this._commonFacade.getSession("userName");
      this.loggedIn = true;
    }
  }

  ngOnInit(): void {
    this.user = this._facadeService.user;
    this._commonFacade.setSwaggerUrl();
  }

  ConnectSocket(){
    // this.singlarService.getMessage().subscribe((msg: any) => {
    //   console.log(msg);
    //   if (msg.message.Type == "info")
    //     this._toast.info(msg.message.Message);
    //   else if (msg.message.Type == "err")
    //     this._toast.error(msg.message.Message);
    //   else if (msg.message.Type == "success")
    //     this._toast.success(msg.message.Message); 
    // })
  }

}

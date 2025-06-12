import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin, of, take, tap } from 'rxjs';
import { SessionService } from '../services/common/session.service';
import { Login } from 'src/app/models/request/Login';
import { AuthenticationService } from '../services/user/authentication.service';
import { User } from 'src/app/models/response/User';
import { Router } from '@angular/router';
import { UserLoggedIn } from 'src/app/models/$bs/userLoggedIn';
import { DashboardService } from '../services/dashboard/dashboard.service';
import { CommonFacadeService } from './common-facade.service';
import { RolesService } from '../services/user/roles.service';
import { MenusService } from '../services/user/menus.service';
import { UserService } from '../services/user/user.service';
import { ResetpasswordService } from '../services/user/resetpassword.service';

@Injectable({
  providedIn: 'root'
})
export class UserFacadeService {
  public isLoggedinSubject = new BehaviorSubject<UserLoggedIn>({
    LoggedIn: false,
    LoggedInUser: "",
    LoggedTime: new Date()
  });
  public isLoggedin: Observable<UserLoggedIn>;
  public user!: User;
  private items = new BehaviorSubject<any>([]);
  public items$ = this.items.asObservable();

  private menus = new BehaviorSubject<any>([]);
  public menus$ = this.menus.asObservable();

  constructor(private _commonaFacade: CommonFacadeService,
    private _authenticationService: AuthenticationService,
    private _route: Router,
    private _dashboard: DashboardService,
    private _roleService: RolesService,
    private _menusService: MenusService,
    private _resetpass : ResetpasswordService,
    private _userService: UserService,
    private _sessionService:SessionService) {
    this.isLoggedin = this.isLoggedinSubject.asObservable();
  }

  loginAuthenticate(_login: Login) {
    //return this._httpService._postMethod(_login,'User_API/api/User/LoginRequest');
    return this._authenticationService.login(_login)
      .pipe(tap(items => this.items.next(items)))
      .subscribe(res => {
        if (res.status == 1) {
          var user = new UserLoggedIn();
          user.LoggedIn = true;
          user.LoggedInUser = res.username;
          user.LoggedTime = new Date();
          this.isLoggedinSubject.next(user);
          this._commonaFacade.setSession("access_token", res.token);
          this.user = res;
          this._sessionService._setSessionValue("LoggedIn",true);
        }
        else {
          var user = new UserLoggedIn();
          user.LoggedIn = false;
          user.LoggedInUser = "";
          user.LoggedTime = new Date();
          this.isLoggedinSubject.next(user);
          this.user = res;
        }
      });
  }

  checkLoggedIn() {
    return of(this.isLoggedin).pipe(tap((v) => console.log(v)));
  }


  getMenuDetailsByRole(data: any) {
    this._authenticationService.getMenuByRoleId(data.RoleID).subscribe(res => {
      if (res != null) {
        this.menus.next(null);
        this.menus.next(res);
      }
    });
  }

  ClearUserObject() {
    var _user = new UserLoggedIn();
    _user.LoggedIn = false;
    _user.LoggedInUser = "";
    _user.LoggedTime = new Date();
    this.isLoggedinSubject.next(_user);
    if (this.user != undefined) {
      this.user.status = "0";
    }
    this._route.navigate(['login']);
  }

  GetDashboardCharts() {
    return this._dashboard.getDashboardChartData();
  }

  getRoles(data: any) {
    return this._roleService.getRoles(data);
  }

  addRoles(data: any) {
    return this._roleService.addRoles(data);
  }

  updateRoles(data: any) {
    return this._roleService.updateRoles(data);
  }

  getMenus() {
    return this._menusService.getMenus();
  }
  getRoleMenuAccess(id: number) {
    return this._menusService.getRoleMenuAccessData(id);
  }
  
  SendOtp(username: any, email:any) {
    return this._resetpass.SendOtp(username,email);
  }
  ValidateOTP(username: any, otp:any) {
    return this._resetpass.ValidateOTP(username,otp);
  }

  ResetPassword(_data: any) {
    return this._resetpass.ResetPassword(_data);
  }





  updateRoleAccess(data: any) {
    return this._menusService.updateRoleAccess(data);
  }

  getUsers(data: any) {
    return this._userService.getUsers(data);
  }

  addUser(data: any) {
    return this._userService.addUser(data);
  }

  updateUser(data: any) {
    return this._userService.updateUser(data);
  }

  getUserDetailsById(_data:any) {
    return this._userService.getUserDetails(_data);
  }

  validateUserName(_data:any) {
    return this._userService.ValidateUserName(_data);
  }
}

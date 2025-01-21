import { Injectable } from '@angular/core';
import { UserFacadeService } from '../facade/facade_services/user-facade.service';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree, createUrlTreeFromSnapshot } from '@angular/router';
import { Observable, map } from 'rxjs';
import {JwtHelperService} from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthGuradService implements CanActivate {
  constructor(private _userfacade : UserFacadeService,
              private _jwtHelper : JwtHelperService,
              private router:Router, private _userFacade: UserFacadeService,
              private toast:ToastrService){}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
      return this._userfacade.checkLoggedIn().pipe(map((isLoggedIn)=>
      isLoggedIn ? this.CheckTokenExpireation() : createUrlTreeFromSnapshot(route,['/','login'])
      )
  )
  }

  CheckTokenExpireation(){
    const token = sessionStorage.getItem("access_token");
    const userId = sessionStorage.getItem("userId");
    this.checkLoggedInUser(userId);
    //Check if the token is expired or not and if token is expired then redirect to login page and return false
    if (token && !this._jwtHelper.isTokenExpired(token)){
      return true;
    }
    this.router.navigate(["login"]);
    return false;
  }

  checkLoggedInUser(userId:any) {
    this._userFacade.getUserDetailsById(userId).subscribe(res=>{
      if(res != null && res.length > 0) {
        if(res[0].isActive == true)
          return true;
        else {
          this.toast.error("Your account has been deactivated by admin.");
          this.router.navigate(['login']);
          return false;
        }
      }
      else {
        
        return false;
      }
    })
  }
}

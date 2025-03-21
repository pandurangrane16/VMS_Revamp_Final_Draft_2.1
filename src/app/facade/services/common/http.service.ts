import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { UserFacadeService } from '../../facade_services/user-facade.service';
import { Login } from 'src/app/models/request/Login';
import { SessionService } from './session.service';
@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private http: HttpClient,
    private _sessionService: SessionService,
  private authService : SessionService) {
    this.getConfigDetails();
  }
  _configDataBS$ = new BehaviorSubject<any[]>([]);
  _configData$ = this._configDataBS$.asObservable();
  public _api_url = "";
  public _swagger_url = "";


  getConfigDetails() {
    return this.http.get("../../../../assets/config/config.json")
      .pipe(take(1))
      .subscribe((_config: any) => {
        this._configDataBS$.next(_config);
        this._sessionService._setSessionValue("config_data", this._configData$);
        this._api_url = _config.api_url;
        this._sessionService._setSessionValue("swagger_url", _config.swaggerUrl);
        this._sessionService._setSessionValue("api_url", _config.api_url);
        this._sessionService.setNetworkReportXlsPath(_config.networkReportPath);
        this._sessionService.setPreviewPath(_config.PreviewPath);
      })
  }

  _setSwaggerUrl() {
    return this.http.get("../../../../assets/config/config.json")
      .pipe(take(1))
      .subscribe((_config: any) => {
        this._sessionService._setSessionValue("swagger_url", _config.swagger_url);
      })
  }

  _getSwaggerUrl() {
    return this._sessionService._getSessionValue("swagger_url");
  }

  _postMethod(_object: any, _appendUrl: string, options?: any): Observable<any> {
    return this.http.post(this._api_url + _appendUrl, _object, options);
  }
  

  _putMethod(_object: any, _appendUrl: string, options?: any): Observable<any> {
    return this.http.put(this._api_url + _appendUrl, _object, options);
  }

  _getMethod(_appendUrl: string,header?:any): Observable<any> {
    return this.http.get(this._api_url + _appendUrl,{headers:header});
  }

  _getMethodNotCommon(_appendUrl: string, _token: string): Observable<any> {
    _token = _token;
    this.authService._setSessionValue("isNotHeader","1");
    const _headers = new HttpHeaders().set('Authorization', `Bearer ${_token}`);
    return this.http.get(_appendUrl, {headers:_headers});
  }
}

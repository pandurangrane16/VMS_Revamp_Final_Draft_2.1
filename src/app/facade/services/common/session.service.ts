import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() { }
  _setSessionValue(_key: string, _val:any) {
    sessionStorage.setItem(_key, _val);
  }

  _getSessionValue(_key: string) {
    return sessionStorage.getItem(_key);
  }

  _removeSessionValue(_key: string) {
    sessionStorage.removeItem(_key);
  }

  getnetworkreportXview() {
    return sessionStorage.getItem("networkReportViewX");
  }
  setNetworkReportXlsPath(data:any) {
    sessionStorage.setItem("networkReportViewX", data);
  }
}

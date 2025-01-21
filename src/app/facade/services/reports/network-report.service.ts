import { Injectable } from '@angular/core';
import { HttpService } from '../common/http.service';

@Injectable({
  providedIn: 'root'
})
export class NetworkReportService {

  constructor(private _httpService :HttpService) { }
  
  getNetworkDetailsRpt(_data:any){
    return this._httpService._postMethod(_data,"Reports_API/api/report/getnetworkReport");
  }
  expNetworkDetailsRpt(_data:any){
    return this._httpService._postMethod(_data,"Reports_API/api/report/getnetworkReportExport");
  }
  
}

import { Injectable } from '@angular/core';
import { HttpService } from '../common/http.service';

@Injectable({
  providedIn: 'root'
})
export class RptCommonService {

  constructor(private _httpService: HttpService) { }
  
  getReportEnquiryDetails(type: number) {
    return this._httpService._getMethod("Reports_API/api/report/GetReportEnquiryDetails?type=" + type);
  }

  addReportEnquiry(data:any) {
    return this._httpService._postMethod(data,"reports_api/api/Report/AddReportEnquiry");
  }
}

import { Injectable } from '@angular/core';
import { NetworkReportService } from '../services/reports/network-report.service';
import { PlaylistreportService } from '../services/reports/playlistreport.service';
import { RptCommonService } from '../services/reports/rpt-common.service';

@Injectable({
  providedIn: 'root'
})
export class ReportFacadeService {

  constructor(private _network:NetworkReportService,
              private _playlistService : PlaylistreportService,
              private _commonRpt : RptCommonService) { }

  GetNetworkDetailsRpt(_data:any){
    return this._network.getNetworkDetailsRpt(_data);
  }
  ExpNetworkDetailsRpt(_data:any){
    return this._network.expNetworkDetailsRpt(_data);
  }

  GetPlaylistReport(_data:any) {
    return this._playlistService.getPlaylistDetailsRpt(_data);
  }

  GetPlaylistReportStatus(_data:any) {
    return this._playlistService.getPlaylistRptStatus(_data);
  }

  getReportEnquiryDetails(type : number) {
    return this._commonRpt.getReportEnquiryDetails(type);
  }
  addReportEnquiry(data:any) {
    return this._commonRpt.addReportEnquiry(data);
  }
}

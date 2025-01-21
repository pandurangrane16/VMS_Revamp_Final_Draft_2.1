import { Injectable } from '@angular/core';
import { HttpService } from '../common/http.service';

@Injectable({
  providedIn: 'root'
})
export class PlaylistreportService {

  constructor(private _httpService: HttpService) { }

  getPlaylistDetailsRpt(_data: any) {
    return this._httpService._postMethod(_data, "Reports_API/api/report/GetPlaylistReportData");
  }

  getPlaylistRptStatus(_data: any) {
    return this._httpService._getMethod("Reports_API/api/report/GetPlaylistReportStatus?_recId=" + _data);
  }

}

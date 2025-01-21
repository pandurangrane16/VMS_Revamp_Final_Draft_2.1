import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../common/http.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private _httpService:HttpService,
    private _http:HttpClient) { }
    jsonurl: string = '/assets/config/config.json';

    getDashboardChartData(){
      return this._httpService._getMethod('dashboard_api/api/Dashboard/GetDashboardCharts');
    }

    getVmsStatusData(status:any,zone:any) {
      return this._httpService._getMethod('publish_api/api/PublishDetails/GetVMSStatusData?status='+status+'&zoneid='+zone);
    }

    getListViewData(){
      return this._httpService._getMethod('dashboard_api/api/Dashboard/GetDashboarListView');
    }

    addEmergencyData(_data:any) {
      return this._httpService._postMethod(_data,'Publish_API/api/PublishDetails/AddEmergencyAlert');
    }
}

import { Injectable } from '@angular/core';
import { DashboardService } from '../services/dashboard/dashboard.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardFacadeService {

  constructor(private _dashboardService: DashboardService,) { }
  getVmsStatusData(status: any,zone:any) {
    return this._dashboardService.getVmsStatusData(status,zone);
  }
  getListViewData() {
    return this._dashboardService.getListViewData();
  }

  AddEmergencyData(_data:any){
    return this._dashboardService.addEmergencyData(_data);
  }
}

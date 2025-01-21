import { Injectable } from '@angular/core';
import { PublishOpsService } from '../services/publish/publish-ops.service';

@Injectable({
  providedIn: 'root'
})
export class PublishFacadeService {
  constructor(private _publishService:PublishOpsService) { }

  getZonesForPublish(data: any) {
    return this._publishService.getZoneForPublish(data);
  }
  getVmsDetailsByZone(data:any) {
    return this._publishService.getVmsDetailsByZone(data);
  }
  getPlaylistMasterData() {
    return this._publishService.getPlaylistMasterData();
  }
  addPublishDetails(_data:any) {
    return this._publishService.AddPublishDetails(_data);
  }
  getPlaylistStatusData() {
    return this._publishService.getPlaylistStatusData();
  }
  removePublishDetails(_data:any) {
    return this._publishService.removePublishDetails(_data);
  }
  getPublishStatusData(vmsid?:number,status?: number) {
    return this._publishService.getPublishStatusData(vmsid,status);
  }

  //publish cron
  addPublishCron(_data:any) {
    return this._publishService.AddPublishCronDetails(_data);
  }
}

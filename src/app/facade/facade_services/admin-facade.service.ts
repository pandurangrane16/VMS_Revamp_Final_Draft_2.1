import { Injectable } from '@angular/core';
import { AdminService } from '../services/admin/admin.service';
import { SessionService } from '../services/common/session.service';
import { PlaylistService } from '../services/admin/playlist.service';

@Injectable({
  providedIn: 'root'
})
export class AdminFacadeService {

  constructor(private _adminService: AdminService,
    private _sessionService: SessionService,
    private _plService:PlaylistService) { }

  AddConfigData(data: any) {
    return this._adminService.addConfigurationData(data);
  }
  getConfiguration() {
    return this._adminService.getConfigurationData();
  }
  getConfigurationByUnit(unit: string) {
    return this._adminService.getConfigurationByUnit(unit);
  }
  getKeysDataForConfig(key: string) {
    return this._adminService.getKeysDataForConfig(key);
  }

  getZones(_data: any) {
    return this._adminService.getZoneMasterData(_data);
  }

  getZonesForDrp(_data: any) {
    return this._adminService.getZoneForDrp(_data);
  }
  addZoneMaster(_data: any) {
    return this._adminService.addZoneMasterData(_data);
  }

  getZoneCoordinates(_data: any) {
    return this._adminService.getZoneCoordinates(_data);
  }
  getZoneCoordinatesByZoneIds(_data: any) {
    return this._adminService.getZoneCoordsByZoneIds(_data);
  }
  addZoneCoordinates(_data: any) {
    return this._adminService.addZoneCoordinates(_data);
  }
  updateZoneMaster(_data: any) {
    return this._adminService.updateZoneMasterData(_data);
  }
  getVmss(_data: any) {
    return this._adminService.getVmsMasterData(_data);
  }
  addVMS(_data: any) {
    return this._adminService.addVmsMasterData(_data);
  }
  updateVms(_data: any) {
    return this._adminService.updateVmsMasterData(_data);
  }
  getParties(_data: any) {
    return this._adminService.getPartiesData(_data);
  }
  addParty(_data: any) {
    return this._adminService.addPartyData(_data);
  }
  updateParty(_data: any) {
    return this._adminService.updatePartyData(_data);
  }
  getTarrifs(_data: any) {
    return this._adminService.getTarrifMasterData(_data);
  }
  addTarrif(_data: any) {
    return this._adminService.addTarrifMasterData(_data);
  }
  updateTarrif(_data: any) {
    return this._adminService.updateTarrifMasterData(_data);
  }
  getMediaClearance() {
    return this._adminService.getMediaClearance();
  }
  mediaClearance(_data: any) {
    return this._adminService.mediaClearance(_data);
  }

  getPlaylistMasterData(data:any,type:number) {
    return this._plService.getPlaylistData(data,type);
  }

  validateGSTINNumber(number:any,id:number) {
    return this._adminService.ValidateGSTINNumber(number,id);
  }
  
  ValidateVMSId(vmsid:string, id :number) {
    return this._adminService.ValidateVMSID(vmsid,id);
  }

  ValidateIPAddress(ipAdd:string, id :number) {
    return this._adminService.ValidateIPAddress(ipAdd,id);
  }

  ValidateTarrifCode(trfCode:string) {
    return this._adminService.ValidateTarrifCode(trfCode);
  }
}

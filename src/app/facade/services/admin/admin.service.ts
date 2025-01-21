import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../common/http.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient,
    private _httpService: HttpService,
    private _http: HttpClient) { }
  jsonurl: string = '/assets/config/config.json';
  addConfigurationData(data: any) {
    return this._httpService._postMethod(data, 'administration_api/api/ConfigParam/AddConfigDetails');
  }

  getConfigurationData() {
    return this._httpService._getMethod('administration_api/api/ConfigParam/GetConfigDetails');
  }
  getConfigurationByUnit(unit:string) {
    return this._httpService._getMethod('administration_api/api/ConfigParam/GetConfigDetailsByUnit?unit='+unit);
  }
  
  getKeysDataForConfig(key: string) {
    return this._http.get(this.jsonurl);
  }

  getZoneMasterData(_data: any) {
    return this._httpService._postMethod(_data, 'Administration_API/api/ZoneMaster/GetZones');
  }

  getZoneForDrp(_data: any) {
    return this._httpService._postMethod(_data, 'Administration_API/api/ZoneMaster/GetZonesForPublish');
  }

  addZoneMasterData(_data: any) {
    return this._httpService._postMethod(_data, 'Administration_API/api/ZoneMaster/PostZoneMaster');
  }

  getZoneCoordinates(_data: string) {
    return this._httpService._getMethod('Administration_API/api/ZoneMaster/GetZoneCoordsByZoneId?zoneId=' + _data);
  }

  addZoneCoordinates(_data: any) {
    return this._httpService._postMethod(_data, 'Administration_API/api/ZoneMaster/PostZoneCoords');
  }

  updateZoneMasterData(_data: any) {
    return this._httpService._postMethod(_data, 'Administration_API/api/ZoneMaster/PutZoneMaster');
  }

  getVmsMasterData(_data: any) {
    return this._httpService._postMethod(_data, 'Administration_api/api/VMSMaster/GetVmsMasterDetails');
  }
  addVmsMasterData(_data: any) {
    return this._httpService._postMethod(_data, 'Administration_API/api/VMSMaster/PostVmsMaster');
  }

  updateVmsMasterData(_data: any) {
    return this._httpService._postMethod(_data, 'Administration_API/api/VMSMaster/PutVmsMaster');
  }
  getPartiesData(_data: any) {
    return this._httpService._postMethod(_data, 'administration_api/api/PartyMaster/GetParties');
  }

  addPartyData(_data: any) {
    return this._httpService._postMethod(_data, 'Administration_API/api/PartyMaster/PostPartyMaster');
  }

  updatePartyData(_data: any) {
    return this._httpService._postMethod(_data, 'Administration_API/api/PartyMaster/PutPartyMaster');
  }

  getTarrifMasterData(_data: any) {
    return this._httpService._postMethod(_data, 'Administration_API/api/Tarrif/GetTarrifs');
  }

  ValidateTarrifCode(trfCode: string) {
    return this._httpService._getMethod('Administration_API/api/Tarrif/ValidateTarrifCode?tarrifCode=' + trfCode);
  }

  addTarrifMasterData(_data: any) {
    return this._httpService._postMethod(_data, 'Administration_API/api/Tarrif/PostTarrifMaster');
  }

  updateTarrifMasterData(_data: any) {
    return this._httpService._postMethod(_data, 'Administration_API/api/Tarrif/PutTarrifMaster');
  }

  getMediaClearance() {
    return this._httpService._getMethod('Administration_API/api/VMSMaster/GetMediaSentData');
  }
  mediaClearance(_data: any) {
    return this._httpService._postMethod(_data, 'Administration_API/api/VMSMaster/RemoveMedia');
  }

  getZoneCoordsByZoneIds(_data: any) {
    return this._httpService._postMethod(_data, 'administration_api/api/ZoneMaster/GetZoneCoordsByZoneIds');
  }

  ValidateGSTINNumber(number: any, id: number) {
    return this._httpService._getMethod('Administration_API/api/PartyMaster/ValidateGSTINNumber?gstno=' + number + '&id=' + id);
  }

  ValidateVMSID(vmsId: string, id: number) {
    return this._httpService._getMethod('Administration_API/api/VMSMaster/ValidateVMSID?vmsid=' + vmsId + '&id=' + id);
  }

  ValidateIPAddress(ipAdd: string, id: number) {
    return this._httpService._getMethod('Administration_API/api/VMSMaster/ValidateIPAddress?ipAdd=' + ipAdd + '&id=' + id);
  }
}

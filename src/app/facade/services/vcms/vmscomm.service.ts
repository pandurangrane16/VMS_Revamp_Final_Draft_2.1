import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../common/http.service';

@Injectable({
  providedIn: 'root'
})
export class VmscommService {

  constructor(private http: HttpClient,
    private _httpService: HttpService
  ) { }

 

AddFontDetails(_data:any) {       
    return this._httpService._postMethod(_data,'Vcms_API/api/VMSComm/AddFontDetails');
 }
 GetFontMaster(_data:any) {       
  return this._httpService._postMethod(_data,'Vcms_API/api/VMSComm/GetFontMaster');
 }
GetFontupload(_data:any) {       
    return this._httpService._postMethod(_data,'Vcms_API/api/VMSComm/GetFontupload');
}
GetFontuploaddata(_data:any) {       
  return this._httpService._postMethod(_data,'Vcms_API/api/VMSComm/GetFontuploaddata');
}
GetFontupload_font(_data:any) {       
  return this._httpService._postMethod(_data,'Vcms_API/api/VMSComm/GetFontupload?type=1');
}
AddFontUploadDetails(_data:any) {       
  return this._httpService._postMethod(_data,'Vcms_API/api/VMSComm/AddFontUploadDetails');
}
SaveFontuploadMaster(_data:any) {       
  return this._httpService._postMethod(_data,'Vcms_API/api/VMSComm/SaveFontuploadMaster');
}
UpdateFontMasterStatus(isdeleted: boolean, fontName: string) {
  return this._httpService._getMethod("Vcms_API/api/VMSComm/UpdateFontMasterStatus?isdeleted=" + isdeleted + "&fontName=" + fontName);
}
CheckFontName(fontName: string) {
  return this._httpService._getMethod("Vcms_API/api/VMSComm/CheckFontName?name=" + fontName );
}

}

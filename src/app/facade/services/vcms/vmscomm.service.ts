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

GetPlaybackDetails2(fromdate: string, todate: string, ipadd?: string, type?: string){
  return this._httpService._postMethod(null,"Vcms_API/api/PlaybackDetails/GetPlaybackDetails?type=" + type + "&ipadd="+ipadd+ "&Fromdate="+ fromdate+ "&Todate"+ todate);
}

GetPlaybackDetails(_data:any,fromdate: string, todate: string, ipadd?: string, type?: string ,pdf_excel?:string) {
  let url = `Vcms_API/api/PlaybackDetails/GetPlaybackDetails?Fromdate=${fromdate}&Todate=${todate}`;

  if (type) {
    url += `&type2=${type}`;
  }

  if (ipadd) {
    url += `&ipadd=${ipadd}`;
  }
  if (pdf_excel) {
    url += `&pdf_excel=${pdf_excel}`;
  }

  return this._httpService._postMethod(_data, url);
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

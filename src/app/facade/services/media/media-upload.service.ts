import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../common/http.service';

@Injectable({
  providedIn: 'root'
})
export class MediaUploadService {
  constructor(private http: HttpClient,
    private _httpService: HttpService,
    private _http: HttpClient) { }

  getuploaddetails(data: any) {
    return this._httpService._postMethod(data, 'media_API/api/MediaMaster/GetMediaUploadDetails?type=3');
  }
  UploadMediaDetails(data: any) {
    return this._httpService._postMethod(data, 'media_API/api/MediaUpload/AddMediaDetails');
  }
  getMediaByUploadSetId(data: any) {
    return this._httpService._getMethod('media_api/api/MediaMaster/GetMediaUploadDetailsByUSId?uploadSetId=' + data);
  }
  getTextUploadDetailsByUploadSetId(data: any) {
    return this._httpService._getMethod('media_api/api/MediaMaster/GetTextDetailsByUSId?uploadSetId=' + data);
  }
  getMediaString(data: any) {
    return this._httpService._postMethod(data, "Media_API/api/MediaMaster/GetMediaString");
    //return this.http.post<any>("http://10.20.1.111:44364/api/MediaMaster/GetMediaString",body);
  }

  updateMediaUpload(data: any) {
    return this._httpService._postMethod(data, "Media_API/api/MediaMaster/updateMediaUpload");
  }

  getSystemFont() {
    return this._httpService._getMethod("media_api/api/MediaUpload/GetAvailableFonts");
  }
  addTextDetails(data:any) {
    return this._httpService._postMethod(data,"media_api/api/MediaUpload/AddTextDetails");
  }
  getMediaUploadDetails(data:any,status:number) {
    return this._httpService._postMethod(data,"media_api/api/MediaMaster/GetMediaUploadDetails?type="+status);
  }
}

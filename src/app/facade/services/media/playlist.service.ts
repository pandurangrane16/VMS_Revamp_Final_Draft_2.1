import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { HttpService } from '../common/http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  constructor(
    private _httpService: HttpService) { }
  getPlaylistData(data: any) {
    return this._httpService._postMethod(data, 'media_api/api/PlaylistMaster/GetPlaylistMaster');
  }
  addPlaylistMaster(data: any) {
    return this._httpService._postMethod(data, 'media_api/api/PlaylistMaster/PostPlaylistMaster');
  }
  updatePlaylistMaster(data: any) {
    return this._httpService._postMethod(data, 'media_api/api/PlaylistMaster/UpdatePlaylistMaster');
  }
  getAllMediaDetails() {
    return this._httpService._getMethod("Media_API/api/MediaMaster/GetAllMediaDetailsForBlocks");
  }
  getAllTextDetails() {
    return this._httpService._getMethod("Media_API/api/MediaMaster/GetAllTextDetails");
  }
  GetVideoDurationFromAPI(path: any) {
    return this._httpService._postMethod(path, "User_API/api/User/GetMediaDurationFromUser");
  }
  addPlaylistMedia(data: any, type: number) {
    return this._httpService._postMethod(data, 'Media_API/api/PlaylistMedia/PostPlaylistMedia?type=' + type);
  }
  AddBlockDetails(body: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        "X-Skip-Interceptor": "true",
      }),
    };
    return this._httpService._postMethod(body, "Media_API/api/BlockDetails/AddBlockDetails",httpOptions);
  }
  GetBlockDetailsByPlid(plid: number) {
    return this._httpService._getMethod("media_api/api/BlockDetails/GetBlockDetailsByPlid?plid=" + plid);
  }
  GetSelectedMediaData(plid: number) {
    return this._httpService._getMethod("Media_API/api/MediaMaster/GetMediaByPl?plid=" + plid);
  }
  GetSelectedTextData(plid: any) {
    return this._httpService._getMethod("Media_API/api/MediaMaster/GetTextMediaByPl?plid=" + plid);
  }

  GetPlBlData(plid: number) {
    return this._httpService._getMethod("media_api/api/PlaylistMedia/GetPlaylistMediaByPlid?plid=" + plid);
  }

  ValidatePlaylistName(plName: string) {
    return this._httpService._getMethod("media_api/api/PlaylistMaster/ValidatePlaylistName?plName=" + plName);
  }
}

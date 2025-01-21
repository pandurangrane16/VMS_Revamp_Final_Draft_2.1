import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../common/http.service';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  constructor(private http: HttpClient,
    private _httpService: HttpService) { }
  jsonurl: string = '/assets/config/config.json';

  getPlaylistData(data: any, type: number) {
    return this._httpService._postMethod(data, 'media_api/api/PlaylistMaster/GetPlaylistMaster?type=' + type);
  }
}

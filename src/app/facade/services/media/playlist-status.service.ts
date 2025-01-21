import { Injectable } from '@angular/core';
import { HttpService } from '../common/http.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlaylistStatusService {

  constructor(private http: HttpClient,
    private _httpService: HttpService,
    private _http: HttpClient) { }
    
    GetPlaylistProcessStatus() {
      return this._httpService._getMethod("Media_API/api/PlaylistMaster/GetPlaylistProcessStatus");
    }
}

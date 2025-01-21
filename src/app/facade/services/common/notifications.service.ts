import { Injectable } from '@angular/core';
import { HttpClient } from '@microsoft/signalr';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(
    private _httpService: HttpService) { }
  jsonurl: string = '/assets/config/config.json';

  getNotifications(_type: string, _request: any) {
    return this._httpService._postMethod(_request, 'notification_api/api/Notification/GetAllNotifications?type=' + _type);
  }
  setMarkAsRead() {
    return this._httpService._postMethod(null, 'notification_api/api/Notification/MarkAllAsRead');
  }
}

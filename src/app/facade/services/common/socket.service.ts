import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Socket } from 'ngx-socket-io';
import { ToastrService } from 'ngx-toastr';
import { Observable, Observer, map, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  constructor(private socket: Socket) { }

  sendMessage(msg:string){
    console.log(msg)
    this.socket.emit('message', msg);
  }


  getMessage(){
  return  new Observable((observer: Observer<any>)=>{
      this.socket.on('message', (message:string)=>{
        observer.next(message)
      })
    })
  }
}

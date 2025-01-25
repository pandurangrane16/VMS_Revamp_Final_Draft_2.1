import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from 'src/app/facade/services/common/socket.service';

@Component({
  selector: 'app-chat-app',
  templateUrl: './chat-app.component.html',
  styleUrls: ['./chat-app.component.css']
})
export class ChatAppComponent {
  constructor(private messageService: SocketService,
              private _toast : ToastrService) {}

  model : any;
  
  messageList: string[] = [];

  sendMessage(): void {
    console.log(this.model.msg)
    //this.messageService.sendMessage(this.model.msg)
    this.model.msg = "";
  };

ngOnInit(): void {
  // this.messageService.getMessage().subscribe((msg:any)=> {
  //   console.log(msg);
  //   this._toast.info(msg.message.Message);
  //   this.messageList.push(msg.message.Message);
  // })
}

  submitted = false;

  onSubmit() { 
    this.sendMessage()
    this.submitted = true;
    
   }
}

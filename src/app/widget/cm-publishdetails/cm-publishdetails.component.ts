import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PublishFacadeService } from 'src/app/facade/facade_services/publish-facade.service';

@Component({
  selector: 'app-cm-publishdetails',
  templateUrl: './cm-publishdetails.component.html',
  styleUrls: ['./cm-publishdetails.component.css']
})
export class CmPublishdetailsComponent implements OnInit {
  @Input() data: any;
  pubType:string = "";
  dtSendingPublish:any;
  constructor(private modalService:NgbModal,
              private publishService:PublishFacadeService){}
  ngOnInit(): void {
    this.publishService.getPublishStatusData(this.data.vmsId,this.data.status).subscribe(res=>{
      this.dtSendingPublish = [];
      if(res != null && res != undefined) {
        this.dtSendingPublish = res;
        this.pubType = this.data.type;
      }
    })
  }
  closeModal() {
    this.modalService.dismissAll();
  }
}

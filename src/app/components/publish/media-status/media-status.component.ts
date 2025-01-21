import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { PublishFacadeService } from 'src/app/facade/facade_services/publish-facade.service';
import { SocketFacadeService } from 'src/app/facade/facade_services/socket-facade.service';
import { Globals } from 'src/app/utils/global';
import { CmPublishdetailsComponent } from 'src/app/widget/cm-publishdetails/cm-publishdetails.component';

@Component({
  selector: 'app-media-status',
  templateUrl: './media-status.component.html',
  styleUrls: ['./media-status.component.css']
})
export class MediaStatusComponent {
  @Input() isReset: boolean = false;
  activetab = 1;
  selectedItems: any[];
  dtCreatedPublish: any[] = [];
  dtSendingPublish: any[] = [];
  dtRunningPublish: any[] = [];
  dtCompletePublish: any[] = [];
  savedItems: any[];
  messageList: any[] = [];
  newMessage: string;
  select_all = false;
  selection = new SelectionModel<Element>(true, []);

  @ViewChild(DataTableDirective)
  datatableElement: DataTableDirective;
  dtOptions: any = {};
  constructor(
    private httpClient: HttpClient,
    private global: Globals,
    private publish: PublishFacadeService,
    private _toast: ToastrService,
    private router: Router,
    private modalService: NgbModal,
    private chatService: SocketFacadeService
  ) {
    this.global.CurrentPage = "Media Status";
  }

  ngOnInit(): void {
    let _data = this.router.getCurrentNavigation()?.extras.state;
    console.log(_data);
    this.GetPublishStatusData(undefined,0);
    // this.chatService.createEventSource().subscribe(res=>{
    //   console.log(res);
    // });
  }

  getPublishStatusByVmsId(vmsid: number, type: string,statusVal:number) {
    const modalRef = this.modalService.open(CmPublishdetailsComponent, { ariaLabelledBy: 'modal-basic-title', size: 'xl' });
    let dataSend = {
      vmsId: vmsid,
      pubType: type,
      status : statusVal
    }
    modalRef.componentInstance.data = dataSend;
    modalRef.componentInstance.playlistAudit = true;
    modalRef.componentInstance.mediaAudit = false;
  }
  TabChange(eve: any) {
    console.log(eve);
    if (eve.nextId == 1)
      this.GetPublishStatusData(undefined, 0);
    else if (eve.nextId == 2)
      this.GetPublishStatusData(undefined, 1);
    else if (eve.nextId == 3)
      this.GetPublishStatusData(undefined, 2);
    else if (eve.nextId == 4)
      this.GetPublishStatusData(undefined, 3);
  }
  GetPublishStatusData(vmsid?: number, status?: number) {
    console.log(this.activetab);
    this.dtCreatedPublish = [];
    this.dtSendingPublish = [];
    this.dtRunningPublish = [];
    this.dtCompletePublish = [];
    this.publish.getPublishStatusData(vmsid, status).subscribe(res => {
      if (res != null) {
        res.forEach((ele: any) => {
          let _dtFrom = new Date(ele.fromTime);
          let _dtTo = new Date(ele.toTime);
          let _fromDay = _dtFrom.getDate().toLocaleString();
          let _fromMonth = (_dtFrom.getMonth() + 1).toLocaleString();
          let _fromYear = _dtFrom.getFullYear();
          let _fromHrs = _dtFrom.getHours().toLocaleString();
          let _fromMins = _dtFrom.getMinutes().toLocaleString();
          let _fromSecs = _dtFrom.getSeconds().toLocaleString();
          let _toDay = _dtTo.getDate().toLocaleString();
          let _toMonth = (_dtTo.getMonth() + 1).toLocaleString();
          let _toYear = _dtTo.getFullYear();
          let _toHrs = _dtTo.getHours().toLocaleString();
          let _toMins = _dtTo.getMinutes().toLocaleString();
          let _toSecs = _dtTo.getSeconds().toLocaleString();
          ele.fromTime = _fromDay.padStart(2, '0') + "-" + _fromMonth.padStart(2, '0') + "-" + _fromYear + " " + _fromHrs.padStart(2, '0') + ":" + _fromMins.padStart(2, '0') + ":" + _fromSecs.padStart(2, '0');
          ele.toTime = _toDay.padStart(2, '0') + "-" + _toMonth.padStart(2, '0') + "-" + _toYear + " " + _toHrs.padStart(2, '0') + ":" + _toMins.padStart(2, '0') + ":" + _toSecs.padStart(2, '0');
          if (ele.status == 0) {
            this.dtCreatedPublish.push(ele);
          } else if (ele.status == 1 || ele.status == 0) {
            debugger;
            this.dtSendingPublish.push(ele);
          } else if (ele.status == 2) {
            this.dtRunningPublish.push(ele);
          } else if (ele.status == 3) {
            this.dtCompletePublish.push(ele);
          }
        });
      }
    });
  }
  ReloadPublishStatus() {
    this.GetPublishStatusData();
  }
  ReloadPublishOps() {
    this.router.navigate(['publish/publish-operation']);
  }
  RemovePublish(data: any, type: number) {
    if (data != undefined) {
      let _request = {
        "type": "",
        "plId": data.playlistId,
        "pubId": data.pubId,
        "vmsId": data.vmsId
      }
      this.publish.removePublishDetails(_request).subscribe(res => {
        if (res != null) {
          if (res == 1) {
            this._toast.success("Published removed successfully.");
            this.GetPublishStatusData();
          } else
            this._toast.error("Something went wrong.");
        } else
          this._toast.error("An error occured while processing request.");
      });
    }
  }
}

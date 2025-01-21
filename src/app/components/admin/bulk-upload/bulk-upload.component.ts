import { Component, EventEmitter, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { getErrorMsg } from 'src/app/utils/utils';

@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.css']
})
export class BulkUploadComponent {
  form : any=[];
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  title:string = "Bulk Upload";

  constructor(private modalService: NgbModal)
  {}
passBack() {
  this.passEntry.emit();
  this.modalService.dismissAll();
}

getErrorMessage(_controlName: any, _controlLable: any, _isPattern: boolean = false, _msg: string) {
  return getErrorMsg(this.form, _controlName, _controlLable, _isPattern, _msg);
}
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CmConfirmBoxComponent } from '../../widget/cm-confirm-box/cm-confirm-box.component';
import { CmMapBoxComponent } from 'src/app/widget/cm-map-box/cm-map-box.component';

@Injectable()
export class ConfirmationDialogService {
  result: any;
  constructor(private modalService: NgbModal) { }

  public confirm(
    title: string,
    message: string,
    btnOkText: string = 'OK',
    btnCancelText: string = 'Cancel',
    dialogSize: 'sm' | 'lg' = 'sm'): Promise<boolean> {
    const modalRef = this.modalService.open(CmConfirmBoxComponent, { size: dialogSize });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;
    return modalRef.result;
  }

  btnReponse(){
    console.log("Emit Called");
  }

  public getResponse() {
    return this.result;
  }

  public mapModal(
    title: string,
    message: string,
    btnOkText: string = 'OK',
    btnCancelText: string = 'Cancel',
    dialogSize: 'lg' | 'sm' = 'lg'): Promise<boolean> {
    const modalRef = this.modalService.open(CmMapBoxComponent, { size: dialogSize });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;

    return modalRef.result;
  }

}
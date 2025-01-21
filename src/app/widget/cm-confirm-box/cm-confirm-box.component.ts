import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cm-confirm-box',
  templateUrl: './cm-confirm-box.component.html',
  styleUrls: ['./cm-confirm-box.component.css']
})
export class CmConfirmBoxComponent {
  @Input() title!: string;
  @Input() message!: string;
  @Input() btnOkText!: string;
  @Input() btnCancelText!: string;
  @Output() btnResponse : EventEmitter<any> = new EventEmitter();
  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  public decline() {
    this.btnResponse.emit(false);
    this.activeModal.close(false);
  }

  public accept() {
    this.btnResponse.emit(true);
    this.activeModal.close(true);
  }

  public dismiss() {
    this.btnResponse.emit(false);
    this.activeModal.dismiss();
  }

}

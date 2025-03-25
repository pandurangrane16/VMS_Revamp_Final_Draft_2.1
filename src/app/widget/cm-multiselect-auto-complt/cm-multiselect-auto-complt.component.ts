import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'cm-multiselect-auto-complt',
  templateUrl: './cm-multiselect-auto-complt.component.html',
  styleUrls: ['./cm-multiselect-auto-complt.component.css']
})
export class CmMultiselectAutoCompltComponent implements OnInit {
  @Input() inputData: any;
  @Input() dropdownSettings: IDropdownSettings = {};
  @Input() label: string;
  @Input() isHide:boolean = false;
  @Output() selectedItem = new EventEmitter<any>();
  @Output() deSelectedItem = new EventEmitter<any>();
  @Input() notifyIsReset: () => void;
  @ViewChild('zones') multiSelect: any;
  form: any;
  selectedItems: any[] = [];
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    console.log(this.inputData);
    this.form = this.fb.group({
      zones: [this.selectedItems]
    });
  }

  onMaterialGroupChange(event: any) {
    console.log(event);
  }
  onItemSelect(item: any, type: number) {
    if (type == 1)
      this.selectedItem.emit(item);
    else
      this.deSelectedItem.emit(item);
  }
  selectAll(item: any, type: number) {
    if (type == 1)
      this.selectedItem.emit(item);
    else {
      this.deSelectedItem.emit(item);
    }
  }

  ChangeMultiSelect(evt:any){
    console.log(evt);
  }

}

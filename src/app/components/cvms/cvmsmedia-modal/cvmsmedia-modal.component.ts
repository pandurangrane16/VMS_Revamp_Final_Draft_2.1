import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { json } from '@rxweb/reactive-form-validators';
import { forEach } from 'core-js/core/array';
import { ToastrService } from 'ngx-toastr';
import { MediaFacadeService } from 'src/app/facade/facade_services/media-facade.service';


@Component({
  selector: 'app-cvmsmedia-modal',
  templateUrl: './cvmsmedia-modal.component.html',
  styleUrls: ['./cvmsmedia-modal.component.css']
})
export class CVMSMediaModalComponent implements OnInit {
 
  type: string;
  mediaType: string = "";
  viewData: any[] = [];
  listOfMedialist: any;
  selectedMedia: any[] = [];
  selectedIds: number[] = [];
  _currentTile : number;
  @Input() data: any;  
  // Create an EventEmitter to send the selected ID to the parent component
  @Output() selectedId = new EventEmitter<any>();



  constructor(private _toast: ToastrService,
    private modal: NgbModal,
    private _media: MediaFacadeService,
    private toast: ToastrService,
  ) {


  }
  ngOnInit(): void {
    this._currentTile = this.data._crrTile;
    if (this.data.modalType == "mediaupload") {
      this.listOfMedialist = [];
      this.type = "Select Image Media";
      this._media.getAllMediaDetails().subscribe(res => {     
        if (res != null && res.length > 0) {
          this.listOfMedialist = res;
        }
        else
          this.toast.error("Failed to failed media details.", "Error", { positionClass: "toast-bottom-right" });
      }, (err) => { console.log(err) });  
    }
    else{
      
      this._media.getAllTextDetails().subscribe(res => {     
        this.listOfMedialist = [];
        this.type = "Select Text Media";
        if (res != null && res.length > 0) {
          this.listOfMedialist = res;
        }
        else
          this.toast.error("Failed to failed media details.", "Error", { positionClass: "toast-bottom-right" });
      }, (err) => { console.log(err) });  
    }
    

  }
  passBack() {
    this.modal.dismissAll();
    
  }

 // Function to select an ID and emit it to the parent
 selectId(id: number): void {
  this.selectedId.emit(id);
}

  Save(){
     this.selectedMedia.forEach((element: any) => {
      if (element != null) {
        var _ele = {
          id: element.id,
          fileName: element.displayName,
          isChecked: true,
          currentTile : this._currentTile
        }
        //this.passBack();
      }
    }); 
    
    this.selectedId.emit( this.selectedMedia);
    this.modal.dismissAll();
    
  }
  onCheckBoxChange( item: any): void {           
   
     if (item.checked) {
       this.selectedIds.push(item.id);
       this.selectedMedia.push(item);        
    }
     else {
       const index = this.selectedIds.indexOf(item.id);
       const index1 = this.selectedMedia.indexOf(item.id);
       if (index > -1) {
         this.selectedIds.splice(index, 1);
         this.selectedMedia.splice(index1, 1);         
       }
     }    
  }
}

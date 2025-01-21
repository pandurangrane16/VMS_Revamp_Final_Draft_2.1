import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { from } from 'rxjs';
declare const L: any; 
const myStyle = {
	"color": "green",
	"weight": 5,
	"opacity": 0.65
};

const markerIcon = L.icon({
	iconSize: [25, 41],
	iconAnchor: [10, 41],
	popupAnchor: [2, -40],
	// specify the path here
	iconUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png",
	shadowUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-shadow.png"
});
@Component({
  selector: 'app-cm-map-box',
  templateUrl: './cm-map-box.component.html',
  styleUrls: ['./cm-map-box.component.css']
})
export class CmMapBoxComponent implements OnInit {
  @Input() zoneId:number = 0;
	isAddFieldTask!: boolean;
  @Output() emitService = new EventEmitter();
  constructor(private activeModal:NgbActiveModal){}

  ngOnInit(): void {
  }
  modalClose() {
    this.activeModal.dismiss();
  }
  GetMarkerData(data:any){
    console.log(data);
    this.emitService.next(data);
    this.activeModal.dismiss();
  }
}

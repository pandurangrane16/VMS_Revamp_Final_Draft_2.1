import { Component, HostListener, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import View from 'ol/View';
declare const L: any;
import { OSM } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import { icon, latLng, LeafletMouseEvent, Map, MapOptions, marker, tileLayer } from 'leaflet';
import { CommonFacadeService } from 'src/app/facade/facade_services/common-facade.service';
import { Globals } from 'src/app/utils/global';
import { InputRequest } from 'src/app/models/request/inputReq';
import { AdminFacadeService } from 'src/app/facade/facade_services/admin-facade.service';
import { Subject } from 'rxjs';
import { CmLeafletComponent } from '../../shared/cm-leaflet/cm-leaflet.component';
import { Router } from '@angular/router';
import { CmEmergencyComponent } from 'src/app/widget/cm-emergency/cm-emergency.component';
import { SessionService } from 'src/app/facade/services/common/session.service';
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
L.Marker.prototype.options.icon = markerIcon;
@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css'],
})
export class MapViewComponent {
  isGmap : boolean = false;
  public map :any;
  drawnItems: any;
  cordsArr: any[] = [];
  polygon: any[] = [];
  listOfZones: any;
  totalPages: number = 1;
  pager: number = 1;
  totalRecords!: number;
  recordPerPage: number = 10;
  startId!: number;
  lat: number = 22.29985;
  lon: number = 73.19555;
  zoneIds: number[] = [];
  zoneId:string="0";
  status:string="0";
  listView: boolean = true;
  buttonName: any = 'fa fa-list';
  viewName: any = 'View List';
  hide: any;
	layers: any;
  _request: any = new InputRequest();
  options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    ],
    zoom: 8,
    center: latLng(this.lat, this.lon)
  };
  searchText: any;
  selectedFilter:Subject<any> = new Subject<any>();
  filters:any[]=[];
  @ViewChild(CmLeafletComponent) child:CmLeafletComponent;
  constructor(
    public modalService: NgbModal,
    private _commonFacade: CommonFacadeService,
    private global: Globals,
    private router : Router,
    private sessionService : SessionService,
    private adminFacade: AdminFacadeService) {
    this.global.CurrentPage = "Map View";
  }


  ngOnInit(): void {
    //   this.map = new Map({
    //   layers: [
    //     new TileLayer({
    //       source: new OSM(),
    //     }),
    //   ],
    //   target: 'map',
    //   view: new View({ 
    //     center: [0, 0],
    //     zoom: 2,maxZoom: 18, 
    //   }),
    // });
    //this.zoneId = 0;
    if(this.sessionService._getSessionValue("mapType") == "GMAP")
        this.isGmap = true;
      else this.isGmap = false;
    this.getZoneData();
  }

  openModal() {
    const modalRef = this.modalService.open(CmEmergencyComponent,  { windowClass: 'rounded-7', size: 'xl' });

    modalRef.result.then((result) => {
      if (result) {
        console.log(result);
      }
    });
    modalRef.componentInstance.passEntry.subscribe((receivedEntry:any) => {
      console.log(receivedEntry);
    })
  }


  toggle() {
    this.router.navigate(['dashboard/list-view']);
  }

  showListview() {
    this.listView = !this.listView;
    $('#filterArea').removeClass('filterArea');
    $('.content-wrapper').addClass('p-4');
    $('.content-wrapper').removeClass('p-0');

    // Change the name of the button.
    // if(this.addZone = true)  
    //   this.zoneList = false;
    // else
    //   this.zoneList = true;
  }
  @HostListener('unloaded')
  ngOnDestroy() {
    console.log('Cleared');
    $('.content-wrapper').removeClass('p-4');
    $('.content-wrapper').addClass('p-0');
    //this.modalService.dismissAll(PublishModalComponent);

  }

  ChangeFilter(){
    this.filters = [{
      "zone" : this.zoneId,
      "status" : this.status
    }];
    this.child.getVMSStatusData(this.filters);
  }
  getZoneData() {
    this._request.currentPage = this.pager;
    this._request.pageSize = this.recordPerPage;
    this._request.startId = this.startId;
    this._request.searchItem = this.searchText;
    this.adminFacade.getZones(this._request).subscribe(data => {
      if (data != undefined && data != null) {
        this.listOfZones = data.data;
        this.listOfZones.forEach((ele: any) => {
          this.zoneIds.push(ele.id);
        });

        // this.adminFacade.getZoneCoordinatesByZoneIds(this.zoneIds).subscribe(res => {
        //   if (res != null && res.length > 0) {
        //     res.forEach((ele: any) => {
        //       let lat = Number(ele.latitude);
        //       let long = Number(ele.longitude);
        //       let cords = [lat, long];
        //       this.cordsArr.push(cords);
        //     });
        //     console.log(this.cordsArr);
        //     this.polygon = this.cordsArr;
        //     if (this.polygon.length > 0) {
        //       //this.InItMap();
        //     }
        //   }
        // })
      }
    });
  }


  InItMap() {
    this.map = L.map('map',).setView([this.lat, this.lon], 8);
    //L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

    const baselayers = {
      "openstreetmap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
      //"VMap": L.tileLayer('https://maps.vnpost.vn/api/tm/{z}/{x}/{y}@2x.png?apikey=8fb3246c12d442525034be04bcd038f22e34571be4adbd4c'),

    };

    var overlays = {};

    L.control.layers(baselayers, overlays).addTo(this.map);

    baselayers["openstreetmap"].addTo(this.map);
    this.drawnItems = new L.FeatureGroup();

    this.map.addLayer(this.drawnItems);


    var options = {
      position: 'topright',
      draw: {
        //     polyline: {
        //         shapeOptions: {
        //             color: '#f357a1',
        //             weight: 10
        //         }
        //     },
        //     polygon: {
        //         allowIntersection: false, // Restricts shapes to simple polygons
        //         drawError: {
        //             color: '#e1e100', // Color the shape will turn when intersects
        //             message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
        //         },
        //         shapeOptions: {
        //             color: '#bada55'
        //         }
        //     },
        circle: false,
        circlemarker: false,// Turns off this drawing tool
        //     rectangle: {
        //         shapeOptions: {
        //             clickable: false
        //         }
        //     },
        marker:
        {

          icon: markerIcon

        }
      },
      edit: {
        featureGroup: this.drawnItems, //REQUIRED!!
        // remove: false
      }

    };

    var drawControl = new L.Control.Draw(options);
    this.map.addControl(drawControl);

    var app = this;
    this.map.on('click', (e: any) => {
      var popLocation = e.latlng;

      let val = this.isMarkerInsidePolygon(popLocation.lat, popLocation.lng, this.polygon);
      console.log(val);
    })
    this.map.on(L.Draw.Event.CREATED, (e: any) => {
      var type = e.layerType,
        layer = e.layer;

      if (type === 'marker') {
        layer.bindPopup('A popup!');
        console.log(layer.getLatLng());
      }
      else {

        this.layers = [];
        this.layers = layer.getLatLngs();
        console.log(this.layers);
      }
      app.drawnItems.addLayer(layer);
      //TODO: ask yes no
      // var r = confirm("Press a button!");
      // if (r == true) {

      //   app.drawnItems.addLayer(layer);
      //   app.shareDataService.ShareDataGeometry(e);

      // } else {

      // }

    });

    var layerPostalcodes = L.geoJSON(this.polygon, {
      style: myStyle
    }).addTo(this.map);

    this.drawnItems.addLayer(layerPostalcodes);
    // var layerGroup = new L.LayerGroup();
    // layerGroup.addTo(this.map);
    // layerGroup.addLayer(layerPostalcodes);
    // //layerGroup.removeLayer(layerPostalcodes);
    // this.map.removeLayer(layerGroup);

    //

    this.map.on("singleclick", (event: any) => {
      var lonLat = L.proj.toLonLat(event.coordinate);
      console.log(lonLat);
      //this.addMarker(lonLat[0], lonLat[1]);
    });
  }

  isMarkerInsidePolygon(lat: any, lng: any, poly: any) {
		var x = lat, y = lng;
		var polyPoints = poly[0][0];
		var inside = false;
		for (var i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
			var xi = polyPoints[i][0], yi = polyPoints[i][1];
			var xj = polyPoints[j][0], yj = polyPoints[j][1];

			var intersect = ((xi > y) != (xj > y))
				&& (x < (yj - yi) * (x - xi) / (xj - xi) + yi);
			if (intersect) {
				inside = !inside;
				break;
			}

		}

		return inside;
	};

}

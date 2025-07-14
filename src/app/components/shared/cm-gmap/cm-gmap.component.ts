import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import TileArcGISRest from 'ol/source/TileArcGISRest';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';
import { toLonLat } from 'ol/proj';
import { AdminFacadeService } from 'src/app/facade/facade_services/admin-facade.service';
import { ToastrService } from 'ngx-toastr';
import { DashboardFacadeService } from 'src/app/facade/facade_services/dashboard-facade.service';
import * as L from 'leaflet';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import Overlay from 'ol/Overlay';

@Component({
  selector: 'app-cm-gmap',
  templateUrl: './cm-gmap.component.html',
  styleUrls: ['./cm-gmap.component.css']
})
export class CmGmapComponent implements AfterViewInit {
  name = "Angular";
    markerSource: any;
    markerStyle: any;
    options: any;
    intervalId: any;
    @Input() mapType: string = "";
    @Input() type: string;
    @Input() selectedZone: any;
    @Input() selectedStatus: any;
    @Input() isEdit: any;
    layers: any;
    vmsData: any;
    map: any;
    ss_image: any;
    lat: number = 0;
    lon: number = 0;
    zoom: number = 10;
    maker!: any;
    dbmaker!: any[];
    polygon: any[] = [];
    @Output() latLng = new EventEmitter<any>();
    markers!: any[];
    drawnItems: any;
    @Input() zoneId: number = 0;
    @Input() status: number = 0;
    @Input() selectedFilter: any;
    @Input() btnDisabled: boolean = false;
    datachild: any;
    isAddFieldTask!: boolean;
    isSave!: boolean;
    @Output() markerCoords = new EventEmitter<any>();
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  @ViewChild('popup', { static: true }) popupElement!: ElementRef;
  popupOverlay!: Overlay;
  constructor(private _adminService: AdminFacadeService,
      private toast: ToastrService,
      private dashboardFacade: DashboardFacadeService,
      private cdr: ChangeDetectorRef) {

  }
  ngOnDestroy(): void {
		clearInterval(this.intervalId);
	}
	startApiCall(): void {
		this.getVMSStatusData();
	}
  ngAfterViewInit(): void {
    
    this.cdr.detectChanges();
     this.plotIcons(); // your VMS data call

    this.popupOverlay = new Overlay({
      element: this.popupElement.nativeElement, // <-- this must run after view is initialized
      autoPan: true
     
    });
   
  
  
   
    
  }

  plotIcons() {
    let _data = {
      pageSize: 0
    }
    this._adminService.getVmss(_data).subscribe(res => {
      if (res != null) {
        var actData = res.data;
        this.plotMarkes(actData);
      }
    })
  }

  plotMarkes(res: any) {
    // ...your layers setup
    const baseLayer = new TileLayer({
      source: new OSM()
    });

    const droneLayer1 = new TileLayer({
      source: new TileArcGISRest({
        url: "https://map.bhagalpursmartcity.co.in/server/rest/services/bscl_drone_image_service_1/MapServer/"
      })
    });

    const droneLayer2 = new TileLayer({
      source: new TileArcGISRest({
        url: "https://map.bhagalpursmartcity.co.in/server/rest/services/bscl_drone_image_service_2/MapServer/"
      })
    });

    const droneLayer3 = new TileLayer({
      source: new TileArcGISRest({
        url: "https://map.bhagalpursmartcity.co.in/server/rest/services/bscl_drone_image_service_3/MapServer/"
      })
    });

    const droneLayer4 = new TileLayer({
      source: new TileArcGISRest({
        url: "https://map.bhagalpursmartcity.co.in/server/rest/services/bscl_drone_image_service_4/MapServer/"
      })
    });
    const vectorSource = new VectorSource();
    const iconStyle = new Style({
      image: new Icon({
        src: 'assets/images/icon-green.png',
        anchor: [0.5, 1],
        scale: 0.13
      }),
    });
  
    let coords: any[] = [];
  
    res.forEach((r: any) => {
      const coordinate = fromLonLat([r.longitude, r.latitude]);
  
      const feature = new Feature({
        geometry: new Point(coordinate),
        data: r // attach the original data to the feature
      });
  
      feature.setStyle(iconStyle);
      vectorSource.addFeature(feature);
    });
  
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });
  
    this.map = new Map({
      target: this.mapContainer.nativeElement,
      layers: [
        new TileLayer({ source: new OSM() }),
        baseLayer,
        droneLayer1,
        droneLayer2,
        droneLayer3,
        droneLayer4,
        vectorLayer
      ],
      view: new View({
        projection: 'EPSG:3857',
        center: fromLonLat([86.988802, 25.238854]),
        zoom: 14
      })
    });
    this.map.addOverlay(this.popupOverlay);
  
    const closer = this.popupElement.nativeElement.querySelector('#popup-closer');
    closer.onclick = () => {
      this.popupOverlay.setPosition(undefined);
      closer.blur();
      return false;
    };
    // 👇 Add click handler
    this.map.on('singleclick', (event:any) => {
      const features = this.map.getFeaturesAtPixel(event.pixel);
      if (features && features.length > 0) {
        const clickedFeature = features[0];
        const markerData = clickedFeature.get('data'); // 👈 access the attached data
  
        console.log("Icon clicked:", markerData);
  
        // Optional: emit an event or open a popup
        this.toast.info(`VMS ID: ${markerData.vmsId}`);
        
          this.startApiCall();
        
       
      }
    });


    // this.map.on('singleclick', (event: MapBrowserEvent<any>) => {
    //   let clickedFeature: Feature<any> | null = null;
        
    //   const features = this.map.forEachFeatureAtPixel(event.pixel);
    //   if (features && features.length > 0) {
    //     const clickedFeature = features[0];
    //     const markerData = clickedFeature.get('data'); // 👈 access the attached data
  
    //     console.log("Icon clicked:", markerData);
  
    //     this.toast.info(`VMS ID: ${markerData.vmsId}`);
    //     this.startApiCall();
    //   }
    // });


    this.map.on('singleclick', (event: MapBrowserEvent<any>) => {
      this.map.forEachFeatureAtPixel(event.pixel, (feature: Feature<any>) => {
        console.log('Clicked feature:', feature);
        const data = feature.get('data');
console.log('Feature data:', data);
        this.startApiCall();
        return true;  // stop after first feature found
      });
    });
   
  }

  getVMSStatusData(filters?: any) {
    // 🧽 Remove old marker layers
    if (this.markers?.length) {
      this.markers.forEach(layer => this.map.removeLayer(layer));
    }
  
    // 🎯 Apply filters
    if (filters?.length) {
      this.selectedStatus = filters[0].status;
      this.selectedZone = filters[0].zone;
    }
  
    const dashStatus = this.selectedStatus ?? "0";
    const dashZone = this.selectedZone ?? "0";
  
    this.dashboardFacade.getVmsStatusData(dashStatus, dashZone).subscribe(
      (res) => {
        this.vmsData = res;
        this.markers = [];
  
        const vectorSource = new VectorSource();
  
        const greenIconStyle = new Style({
          image: new Icon({
            src: 'assets/images/icon-green.png',
            scale: 0.13,
            anchor: [0.5, 1],
          }),
        });
  
        const redIconStyle = new Style({
          image: new Icon({
            src: 'assets/images/icon-red.png',
            scale: 0.13,
            anchor: [0.5, 1],
          }),
        });
  
        res.forEach((e: any) => {
          const coordinate = fromLonLat([e.longitude, e.latitude]);
  
          const feature = new Feature({
            geometry: new Point(coordinate),
            data: e,
          });
  
          feature.setStyle(e.active === 1 ? greenIconStyle : redIconStyle);
          vectorSource.addFeature(feature);
        });
  
        const vectorLayer = new VectorLayer({
          source: vectorSource,
        });
  
        this.map.addLayer(vectorLayer);
        this.markers.push(vectorLayer);
  
        // 🖱️ Click handler
        this.map.on('singleclick', (event:any) => {
          this.map.forEachFeatureAtPixel(event.pixel, (feature: Feature<any>) => {
            const data = feature.get('data');
            if (data) {
              this.dashboardFacade.GetSnapShotData(data.id).subscribe((snapRes: any) => {
                const contentElement = this.popupElement.nativeElement.querySelector('#popup-content');
                contentElement.innerHTML = `
                  <img src="data:image/png;base64,${snapRes.snapshot}" height="150" width="200" />
                  <p><strong>VMS ID:</strong> ${data.vmsId}</p>
                  <p><strong>Description:</strong> ${data.description}</p>
                  <p><strong>IP Address:</strong> ${data.ipAddress}</p>
                  <p><strong>Height:</strong> ${data.height}</p>
                  <p><strong>Width:</strong> ${data.width}</p>
                  <p><strong>Lat/Lon:</strong> ${data.latitude}, ${data.longitude}</p>
                `;
                this.popupOverlay.setPosition(event.coordinate);
              });
              return true;
            }
            return false;
          });
        });
      },
      (err) => {
        console.error('Failed to fetch VMS data:', err);
      }
    );
  }
  
  

  // getVMSStatusData(filters?: any) {
	// 	if (this.markers != undefined && this.markers.length > 0) {
	// 		for (let i = 0; i < this.markers.length; i++) {
	// 			this.map.removeLayer(this.markers[i]);
	// 		}
	// 	}
	// 	if (filters != undefined) {
	// 		this.selectedStatus = filters[0].status;
	// 		this.selectedZone = filters[0].zone;
	// 	}
	// 	var dashStatus = this.selectedStatus;
	// 	var dashZone = this.selectedZone;
	// 	if (dashStatus == undefined) dashStatus = "0";
	// 	if (dashZone == undefined) dashZone = "0";
	// 	this.dashboardFacade.getVmsStatusData(dashStatus, dashZone).subscribe(
	// 		(res) => {
	// 			this.vmsData = res;
	// 			this.markers = [];
	// 			this.vmsData.forEach((e: any) => {
	// 				var iconFeatures = [];
	// 				if (e.active == 1) {
	// 					let icon = L.icon({
	// 						iconUrl: 'assets/images/icon-green.png',
	// 						iconSize: [38, 45], // size of the icon
	// 						iconAnchor: [16, 37],
	// 						popupAnchor: [0, -28],
	// 					})
	// 					let customPopup = `<p><img src="data:image/png;base64,` + this.ss_image + `" height=150 width=200 /></p>
	// 										 <p><i class="icon-circle-check"></i> VMS ID : ` + e.vmsId + `<br></p>
	// 										 <p><i class="icon-circle-check"></i> Description : `+ e.description + `<br></p>
	// 										 <p><i class="icon-circle-check"></i> IP Address : `+ e.ipAddress + `<br></p>
	// 										 <p><i class="icon-circle-check"></i> Height : `+ e.height + `<br></p>
	// 										 <p><i class="icon-circle-check"></i> Width : `+ e.width + `<br></p>
	// 										 <p><i class="icon-circle-check"></i> Latitude : `+ e.latitude + `<br></p>
	// 										 <p><i class="icon-circle-check"></i> Longitude : `+ e.longitude + `<br></p>`
	// 					const customOptions = { 'className': 'custom-popup' }

	// 					var marker = L.marker([e.latitude, e.longitude], { icon: icon }).addTo(this.map);

	// 					marker.bindPopup(customPopup, customOptions).on('click', () => {
	// 						this.dashboardFacade.GetSnapShotData(e.id).subscribe((res: any) => {
	// 							if (res != null) {
	// 								const updatedPopup = `<p><img src="data:image/png;base64,` + res.snapshot + `" height="150" width="200" /></p>
  //                                 <p><i class="icon-circle-check"></i> VMS ID : ` + e.vmsId + `<br></p>
  //                                 <p><i class="icon-circle-check"></i> Description : `+ e.description + `<br></p>
  //                                 <p><i class="icon-circle-check"></i> IP Address : `+ e.ipAddress + `<br></p>
  //                                 <p><i class="icon-circle-check"></i> Height : `+ e.height + `<br></p>
  //                                 <p><i class="icon-circle-check"></i> Width : `+ e.width + `<br></p>
  //                                 <p><i class="icon-circle-check"></i> Latitude : `+ e.latitude + `<br></p>
  //                                 <p><i class="icon-circle-check"></i> Longitude : `+ e.longitude + `<br></p>`;

	// 								// Update the marker's popup content with the new image
	// 								marker.setPopupContent(updatedPopup);

	// 								// Open the popup after updating
	// 								marker.openPopup();
	// 							}
	// 						})
	// 					});
	// 					this.markers.push(marker);


	// 				} else {
	// 					let icon = L.icon({
	// 						iconUrl: 'assets/images/icon-red.png',
	// 						iconSize: [38, 45], // size of the icon
	// 						iconAnchor: [16, 37],
	// 						popupAnchor: [0, -28],
	// 					})
	// 					const customPopup = `<p><img src="data:image/png;base64,` + res.snapshot + `" height=150 width=200 /></p>
	// 										 <p><i class="icon-circle-check"></i> VMS ID : ` + e.vmsId + `<br></p>
	// 										 <p><i class="icon-circle-check"></i> Description : `+ e.description + `<br></p>
	// 										 <p><i class="icon-circle-check"></i> IP Address : `+ e.ipAddress + `<br></p>
	// 										 <p><i class="icon-circle-check"></i> Height : `+ e.height + `<br></p>
	// 										 <p><i class="icon-circle-check"></i> Width : `+ e.width + `<br></p>
	// 										 <p><i class="icon-circle-check"></i> Latitude : `+ e.latitude + `<br></p>
	// 										 <p><i class="icon-circle-check"></i> Longitude : `+ e.longitude + `<br></p>`
	// 					const customOptions = { 'className': 'custom-popup' }

	// 					var marker = L.marker([e.latitude, e.longitude], { icon: icon }).addTo(this.map);
	// 					marker.bindPopup(customPopup, customOptions).on('click', () => {
	// 						this.dashboardFacade.GetSnapShotData(e.id).subscribe((res: any) => {
	// 							if (res != null) {
	// 								const updatedPopup = `<p><img src="data:image/png;base64,` + res.snapshot + `" height="150" width="200" /></p>
  //                                 <p><i class="icon-circle-check"></i> VMS ID : ` + e.vmsId + `<br></p>
  //                                 <p><i class="icon-circle-check"></i> Description : `+ e.description + `<br></p>
  //                                 <p><i class="icon-circle-check"></i> IP Address : `+ e.ipAddress + `<br></p>
  //                                 <p><i class="icon-circle-check"></i> Height : `+ e.height + `<br></p>
  //                                 <p><i class="icon-circle-check"></i> Width : `+ e.width + `<br></p>
  //                                 <p><i class="icon-circle-check"></i> Latitude : `+ e.latitude + `<br></p>
  //                                 <p><i class="icon-circle-check"></i> Longitude : `+ e.longitude + `<br></p>`;

	// 								// Update the marker's popup content with the new image
	// 								marker.setPopupContent(updatedPopup);

	// 								// Open the popup after updating
	// 								marker.openPopup();
	// 							}
	// 						})
	// 					});
	// 					this.markers.push(marker);
	// 				}
	// 			});
	// 		},
	// 		(err) => {
	// 			console.log(err);
	// 		}
	// 	);
	// }


  
}

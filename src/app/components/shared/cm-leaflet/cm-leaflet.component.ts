
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { event } from 'jquery';

declare var ol: any;
// when the docs use an import:
declare const L: any; // --> Works
import 'leaflet-draw';
import { icon1CircleFill } from 'ngx-bootstrap-icons';
import { ToastrService } from 'ngx-toastr';
import { AdminFacadeService } from 'src/app/facade/facade_services/admin-facade.service';
import { DashboardFacadeService } from 'src/app/facade/facade_services/dashboard-facade.service';
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
// const myLines = [{
// 	"type": "Polygon",
// 	"coordinates": [[
// 		[105.02517700195314, 19.433801201715198],
// 		[106.23367309570314, 18.852796311610007],
// 		[105.61843872070314, 7.768472031139744]

// 	]]
// }, {
// 	"type": "LineString",
// 	"coordinates": [[-105, 40], [-110, 45], [-115, 55]]
// }];
@Component({
	selector: 'app-cm-leaflet',
	templateUrl: './cm-leaflet.component.html',
	styleUrls: ['./cm-leaflet.component.css']
})
export class CmLeafletComponent implements AfterViewInit, OnDestroy {
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
	markerIcon = {
		icon: L.icon({
			iconSize: [25, 41],
			iconAnchor: [10, 41],
			popupAnchor: [2, -40],
			// specify the path here
			iconUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png",
			shadowUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-shadow.png"
		})
	};
	constructor(private adminFacade: AdminFacadeService,
		private toast: ToastrService,
		private dashboardFacade: DashboardFacadeService,
		private cdr: ChangeDetectorRef) {
	}
	ngOnDestroy(): void {
		clearInterval(this.intervalId);
	}
	ngAfterViewInit(): void {
		this.cdr.detectChanges();
	}
	startApiCall(): void {
		this.getVMSStatusData();
		// this.intervalId = setInterval(() => {

		// }, 10000); // Call every 5000 ms (5 seconds)
	}
	ngOnInit() {
		this.adminFacade.getConfiguration().subscribe(res => {
			var latitude = res.find((x: any) => x.prmkey == 'lat');
			this.lat = latitude.prmvalue;
			var longs = res.find((x: any) => x.prmkey == 'long');
			this.lon = longs.prmvalue;
			var zooms = res.find((x: any) => x.prmkey == 'zoomlevel');
			this.zoom = zooms.prmvalue;
			//this.InItMap();
			this.CheckCoordinates();
			// this.map.on("click", (e: any) => {
			// 	console.log(e.latlng); // get the coordinates
			// 	L.marker([e.latlng.lat, e.latlng.lng], this.markerIcon).addTo(this.map); // add the marker onclick
			// });
		});
	}
	CheckCoordinates() {
		if (this.type == "zone") {
			if (this.zoneId != 0) {
				this.adminFacade.getZoneCoordinates(this.zoneId).subscribe(res => {
					let cordsArr: any[] = [];
					res.forEach((ele: any) => {
						let lat = Number(ele.latitude);
						let long = Number(ele.longitude);
						let cords = [lat, long];
						cordsArr.push(cords);
					});

					this.polygon = [{ "type": "Polygon", "coordinates": [cordsArr] }];
					this.InItMap(this.type);
				});
			}
			else
				this.InItMap(this.type);
		}
		else if (this.type == "map") {
			var _data = [1, 2, 3];
			this.adminFacade.getZoneCoordinatesByZoneIds(_data).subscribe(res => {
				if (res != null) {
					if (res.length > 0) {
						let cordsArr: any[] = [];
						var currentZone = 0;
						res.forEach((ele: any) => {
							if (currentZone != 0 && ele.zoneId != currentZone) {
								let _arr = { "type": "Polygon", "coordinates": [cordsArr] };
								//cordsArr.push(_arr);
								this.polygon.push(_arr);
								cordsArr = [];
							}
							currentZone = ele.zoneId;
							let lat = Number(ele.latitude);
							let long = Number(ele.longitude);
							let cords = [lat, long];
							cordsArr.push(cords);
							if (ele.id == res.find((x: any) => x.id == 22).id) {
								let _arr = { "type": "Polygon", "coordinates": [cordsArr] };
								this.polygon.push(_arr);
							}
						});
						//this.polygon = cordsArr;
						//this.getVMSStatusData();
						this.InItMap(this.type);
					}
				}
			})
		}
		else if (this.type == "vms") {
			if (this.zoneId != 0) {
				this.adminFacade.getZoneCoordinates(this.zoneId).subscribe(res => {
					let cordsArr: any[] = [];
					res.forEach((ele: any) => {
						let lat = Number(ele.latitude);
						let long = Number(ele.longitude);
						let cords = [lat, long];
						cordsArr.push(cords);
					});

					this.polygon = [{ "type": "Polygon", "coordinates": [cordsArr] }];
					this.InItMap(this.type);
				});
			}
			else
				this.InItMap(this.type);
		}
	}

	getClickCoords(e: any) {

	}

	getVMSStatusData(filters?: any) {
		if (this.markers != undefined && this.markers.length > 0) {
			for (let i = 0; i < this.markers.length; i++) {
				this.map.removeLayer(this.markers[i]);
			}
		}
		if (filters != undefined) {
			this.selectedStatus = filters[0].status;
			this.selectedZone = filters[0].zone;
		}
		var dashStatus = this.selectedStatus;
		var dashZone = this.selectedZone;
		if (dashStatus == undefined) dashStatus = "0";
		if (dashZone == undefined) dashZone = "0";
		this.dashboardFacade.getVmsStatusData(dashStatus, dashZone).subscribe(
			(res) => {
				this.vmsData = res;
				this.markers = [];
				this.vmsData.forEach((e: any) => {
					var iconFeatures = [];
					if (e.active == 1) {
						let icon = L.icon({
							iconUrl: 'assets/images/icon-green.png',
							iconSize: [38, 45], // size of the icon
							iconAnchor: [16, 37],
							popupAnchor: [0, -28],
						})
						let customPopup = `<p><img src="data:image/png;base64,` + this.ss_image + `" height=150 width=200 /></p>
											 <p><i class="icon-circle-check"></i> VMS ID : ` + e.vmsId + `<br></p>
											 <p><i class="icon-circle-check"></i> Description : `+ e.description + `<br></p>
											 <p><i class="icon-circle-check"></i> IP Address : `+ e.ipAddress + `<br></p>
											 <p><i class="icon-circle-check"></i> Height : `+ e.height + `<br></p>
											 <p><i class="icon-circle-check"></i> Width : `+ e.width + `<br></p>
											 <p><i class="icon-circle-check"></i> Latitude : `+ e.latitude + `<br></p>
											 <p><i class="icon-circle-check"></i> Longitude : `+ e.longitude + `<br></p>`
						const customOptions = { 'className': 'custom-popup' }

						var marker = L.marker([e.latitude, e.longitude], { icon: icon }).addTo(this.map);

						marker.bindPopup(customPopup, customOptions).on('click', () => {
							this.dashboardFacade.GetSnapShotData(e.id).subscribe((res: any) => {
								if (res != null) {
									const updatedPopup = `<p><img src="data:image/png;base64,` + res.snapshot + `" height="150" width="200" /></p>
                                  <p><i class="icon-circle-check"></i> VMS ID : ` + e.vmsId + `<br></p>
                                  <p><i class="icon-circle-check"></i> Description : `+ e.description + `<br></p>
                                  <p><i class="icon-circle-check"></i> IP Address : `+ e.ipAddress + `<br></p>
                                  <p><i class="icon-circle-check"></i> Height : `+ e.height + `<br></p>
                                  <p><i class="icon-circle-check"></i> Width : `+ e.width + `<br></p>
                                  <p><i class="icon-circle-check"></i> Latitude : `+ e.latitude + `<br></p>
                                  <p><i class="icon-circle-check"></i> Longitude : `+ e.longitude + `<br></p>`;

									// Update the marker's popup content with the new image
									marker.setPopupContent(updatedPopup);

									// Open the popup after updating
									marker.openPopup();
								}
							})
						});
						this.markers.push(marker);


					} else {
						let icon = L.icon({
							iconUrl: 'assets/images/icon-red.png',
							iconSize: [38, 45], // size of the icon
							iconAnchor: [16, 37],
							popupAnchor: [0, -28],
						})
						const customPopup = `<p><img src="data:image/png;base64,` + res.snapshot + `" height=150 width=200 /></p>
											 <p><i class="icon-circle-check"></i> VMS ID : ` + e.vmsId + `<br></p>
											 <p><i class="icon-circle-check"></i> Description : `+ e.description + `<br></p>
											 <p><i class="icon-circle-check"></i> IP Address : `+ e.ipAddress + `<br></p>
											 <p><i class="icon-circle-check"></i> Height : `+ e.height + `<br></p>
											 <p><i class="icon-circle-check"></i> Width : `+ e.width + `<br></p>
											 <p><i class="icon-circle-check"></i> Latitude : `+ e.latitude + `<br></p>
											 <p><i class="icon-circle-check"></i> Longitude : `+ e.longitude + `<br></p>`
						const customOptions = { 'className': 'custom-popup' }

						var marker = L.marker([e.latitude, e.longitude], { icon: icon }).addTo(this.map);
						marker.bindPopup(customPopup, customOptions).on('click', () => {
							this.dashboardFacade.GetSnapShotData(e.id).subscribe((res: any) => {
								if (res != null) {
									const updatedPopup = `<p><img src="data:image/png;base64,` + res.snapshot + `" height="150" width="200" /></p>
                                  <p><i class="icon-circle-check"></i> VMS ID : ` + e.vmsId + `<br></p>
                                  <p><i class="icon-circle-check"></i> Description : `+ e.description + `<br></p>
                                  <p><i class="icon-circle-check"></i> IP Address : `+ e.ipAddress + `<br></p>
                                  <p><i class="icon-circle-check"></i> Height : `+ e.height + `<br></p>
                                  <p><i class="icon-circle-check"></i> Width : `+ e.width + `<br></p>
                                  <p><i class="icon-circle-check"></i> Latitude : `+ e.latitude + `<br></p>
                                  <p><i class="icon-circle-check"></i> Longitude : `+ e.longitude + `<br></p>`;

									// Update the marker's popup content with the new image
									marker.setPopupContent(updatedPopup);

									// Open the popup after updating
									marker.openPopup();
								}
							})
						});
						this.markers.push(marker);
					}
				});
			},
			(err) => {
				console.log(err);
			}
		);
	}

	InItMap(type: string) {
		this.map = L.map('map',).setView([this.lat, this.lon], this.zoom);
		this.selectLocation();
		this.map.on("singleclick", (event: any) => {
			console.log(event);
			// var lonLat = ol.proj.toLonLat(event.coordinate);
			// this.addMarker(lonLat[0], lonLat[1]);
		});
		if (type == "map")
			this.startApiCall();
		//this.getVMSStatusData();
		//L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

		const baselayers = {
			"openstreetmap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
			//"VMap": L.tileLayer('https://maps.vnpost.vn/api/tm/{z}/{x}/{y}@2x.png?apikey=8fb3246c12d442525034be04bcd038f22e34571be4adbd4c'),

		};

		var overlays = {};

		L.control.layers(baselayers, overlays).addTo(this.map);

		baselayers["openstreetmap"].addTo(this.map);

		this.drawnItems = new L.FeatureGroup();
		console.log(this.drawnItems)
		this.map.addLayer(this.drawnItems);

		if (this.type == "vms") {
			this.options = {
				position: 'topright',
				draw: {
					polyline: false,
					rectangle: false,
					circle: false,
					circlemarker: false,
					marker: false,
				},
				edit: {
					featureGroup: this.drawnItems, //REQUIRED!!
					edit: false,
					remove: false,
				}
			};
		} else {
			this.options = {
				position: 'topright',
				draw: {
					polyline: false,
					rectangle: false,
					circle: false,
					circlemarker: false,
					marker: false,

				},
				edit: {
					featureGroup: this.drawnItems, //REQUIRED!!
					edit: false,
					remove: false,

				}
			};
		}


		var drawControl = new L.Control.Draw(this.options);
		this.map.addControl(drawControl);

		var app = this;
		if (this.mapType == "vms") {

			this.map.on('click', (e: any) => {
				console.log(e);
				var popLocation = e.latlng;
				let val = this.isMarkerInsidePolygon(popLocation.lat, popLocation.lng, this.polygon);

				console.log(val);
				if (val == true)
					this.ProvideMarker(popLocation);
				else {
					this.toast.error("Selected location is outside of zone area.", "Error", {
						positionClass: 'toast-bottom-right'
					})
				}
			})
		}
		this.map.on(L.Draw.Event.CREATED, (e: any) => {
			var type = e.layerType,
				layer = e.layer;
			if (type === 'marker') {
				if (this.type == "vms") {
					var popLocation = layer._latlang;
					this.latLng.next(popLocation);
					let lat = layer._latlng.lat;
					let lang = layer._latlng.lng;
					let val = this.isMarkerInsidePolygon(lat, lang, this.polygon);
					console.log(val);
					if (val == true) {

					}
					else {
						this.toast.error("Selected location is outside of zone area.", "Error", {
							positionClass: 'toast-bottom-right'
						})
					}
					console.log(layer.getLatLng());
				}
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
			if (this.type.toLowerCase() != "zone") {
				var lonLat = L.proj.toLonLat(event.coordinate);
				console.log(lonLat);
			}
			//this.addMarker(lonLat[0], lonLat[1]);
		});
	}

	SubmitCoordinates() {
		if (this.layers == undefined || this.layers.length == 0) {
			this.toast.error("Zone Area not selected", "Error", {
				positionClass: 'toast-bottom-right'
			});
		}
		else {
			this.latLng.emit(this.layers);
		}
	}


	isMarkerInsidePolygon(lat: any, lng: any, poly: any) {
		var x = lat, y = lng;
		if (poly.length == 0) {
			return true;
		}
		var polyPoints = poly[0].coordinates[0];
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

	ProvideMarker(loc: any) {
		this.markerCoords.emit(loc);
	}

	addMarker(code: any, lat: any, lng: any) {

	}

	private selectLocation() {
		this.map.on('click', (e: any) => {
			var coord = e.latlng;
			var lattitude = coord.lat;
			var longitude = coord.lng;
			let val = this.isMarkerInsidePolygon(lattitude, longitude, this.polygon);
			this.latLng
			if (val == true) {
				let returnVal = {
					lat: lattitude,
					lng: longitude
				}
				this.latLng.next(returnVal);
				this.markerCoords.next(returnVal);

			}
			else
				console.log('Invalid Value');

			if (this.type.toLowerCase() != "zone")
				var mp = new L.Marker([lattitude, longitude]).addTo(this.map);
		});
	}
}

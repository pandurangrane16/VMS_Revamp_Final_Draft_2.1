import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import TileArcGISRest from 'ol/source/TileArcGISRest';
import { fromLonLat } from 'ol/proj';

@Component({
  selector: 'app-cm-gmap',
  templateUrl: './cm-gmap.component.html',
  styleUrls: ['./cm-gmap.component.css']
})
export class CmGmapComponent implements AfterViewInit {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

  ngAfterViewInit(): void {
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

    new Map({
      target: this.mapContainer.nativeElement,
      layers: [baseLayer, droneLayer1, droneLayer2, droneLayer3, droneLayer4],
      view: new View({
        projection: 'EPSG:3857',
        center: fromLonLat([86.988802, 25.238854]),
        zoom: 14
      })
    });
  }
}
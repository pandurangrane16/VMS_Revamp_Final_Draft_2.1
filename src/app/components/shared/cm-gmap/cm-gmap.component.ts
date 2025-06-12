import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-cm-gmap',
  templateUrl: './cm-gmap.component.html',
  styleUrls: ['./cm-gmap.component.css']
})
export class CmGmapComponent implements AfterViewInit {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  map!: Map;
  constructor(private _adminService: AdminFacadeService) {

  }
  ngAfterViewInit(): void {
    

    // const baseLayer = new TileLayer({
    //   source: new OSM()
    // });

    // const droneLayer1 = new TileLayer({
    //   source: new TileArcGISRest({
    //     url: "https://map.bhagalpursmartcity.co.in/server/rest/services/bscl_drone_image_service_1/MapServer/"
    //   })
    // });

    // const droneLayer2 = new TileLayer({
    //   source: new TileArcGISRest({
    //     url: "https://map.bhagalpursmartcity.co.in/server/rest/services/bscl_drone_image_service_2/MapServer/"
    //   })
    // });

    // const droneLayer3 = new TileLayer({
    //   source: new TileArcGISRest({
    //     url: "https://map.bhagalpursmartcity.co.in/server/rest/services/bscl_drone_image_service_3/MapServer/"
    //   })
    // });

    // const droneLayer4 = new TileLayer({
    //   source: new TileArcGISRest({
    //     url: "https://map.bhagalpursmartcity.co.in/server/rest/services/bscl_drone_image_service_4/MapServer/"
    //   })
    // });

    // this.map = new Map({
    //   target: this.mapContainer.nativeElement,
    //   layers: [new TileLayer({
    //     source: new OSM()
    //   }),
    //     baseLayer, droneLayer1, droneLayer2, droneLayer3, droneLayer4],
    //   view: new View({
    //     projection: 'EPSG:3857',
    //     center: fromLonLat([86.988802, 25.238854]),
    //     zoom: 14
    //   })
    // });

    this.plotIcons();
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

  plotMarkes(res :any){
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

    // Vector source to hold markers
    const vectorSource = new VectorSource();

    // Marker coordinates (lon, lat)
    // const coords = [
    //   [87.0072, 25.2621],
    //   [86.9768, 25.2476],
    //   [86.9403, 25.2455]
    // ];

    // Marker style
    const iconStyle = new Style({
      image: new Icon({
        src: 'assets/images/icon-green.png',
        anchor: [0.5, 1],
        scale: 0.13

      }),
    });

    // Add markers to source
    let coords :any[]=[];
    res.forEach((r:any) => {
      let co = [r.longitude,r.latitude]
      coords.push(co);
    });

    coords.forEach(element => {
      const feature = new Feature({
        geometry: new Point(fromLonLat(element))
      });
      feature.setStyle(iconStyle);
      vectorSource.addFeature(feature);
    });
    // Vector layer to display markers
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

     this.map = new Map({
      target: this.mapContainer.nativeElement,
      layers: [new TileLayer({
        source: new OSM()
      }),
        baseLayer, droneLayer1, droneLayer2, droneLayer3, droneLayer4, vectorLayer],
      view: new View({
        projection: 'EPSG:3857',
        center: fromLonLat([86.988802, 25.238854]),
        zoom: 14
      })
    });
  }
}

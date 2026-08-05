import {Component, effect, input, output} from '@angular/core';
import {LatLng, Map, marker, tileLayer} from "leaflet";
import {MapCoords} from "@utils/interfaces";

@Component({
    selector: 'app-map-leaflet',
    templateUrl: './map-leaflet.component.html',
    styleUrls:['./map-leaflet.component.scss']
})
export class MapLeafletComponent {
    map = input.required<string>();
    centerCoords = input<MapCoords | null>()
    onChange = output<MapCoords>()

    constructor() {
        effect(() => {
            const map = this.map();

            console.log(map);
            if (!map) return;
            // if (this.mapElement) return;
            console.log('1');
            this.createMap();
        });
    }

    createMap() {
        if (this.centerCoords()?.latitude && this.centerCoords()?.longitude) {
            console.log(this.centerCoords());

            const myMap = new Map(this.map()).setView([this.centerCoords()?.latitude!, this.centerCoords()?.longitude!], 14);

            // tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {}).addTo(myMap);
            //
            //http://ows.mundialis.de/services/service?
            tileLayer.wms('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                format: 'image/png',
                transparent: true,
                attribution: ''
            }).addTo(myMap);

            let markerItem = marker([this.centerCoords()?.latitude!, this.centerCoords()?.longitude!]).addTo(myMap).bindPopup('Mi Ubicación');

            myMap.on('click', (e: {
                latlng: LatLng
            }) => {
                myMap.removeLayer(markerItem);
                if (e?.latlng && e?.latlng) {
                    markerItem = marker([e.latlng.lat, e.latlng.lng]).addTo(myMap).bindPopup('Mi Ubicación');
                    this.onChange.emit({
                        latitude: e.latlng.lat,
                        longitude: e.latlng.lng
                    })
                }
            });
        }
    }
}

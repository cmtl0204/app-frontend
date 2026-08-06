import {Component, effect, input, output, afterNextRender} from '@angular/core';
import {LatLng, Map, marker, tileLayer, Marker, icon} from "leaflet";
import {MapCoords} from "@utils/interfaces";

@Component({
    selector: 'app-map-leaflet',
    templateUrl: './map-leaflet.component.html',
    styleUrls: ['./map-leaflet.component.scss']
})
export class MapLeafletComponent {
    map = input.required<string>({alias: 'map'});
    centerCoords = input<MapCoords | null>();
    onChange = output<MapCoords>();

    private leafletMap!: Map;
    private markerItem!: Marker;

    private myIcon = icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41]
    });

    constructor() {
        // Inicializamos el mapa solo una vez cuando el DOM ya esté listo
        afterNextRender(() => {
            this.initMap();
        });

        // Este effect solo se encarga de mover el mapa/marcador cuando cambian las coordenadas (Ej: al seleccionar Parroquia)
        effect(() => {
            const coords = this.centerCoords();

            if (coords?.latitude && coords?.longitude && this.leafletMap) {
                const newLatLng = new LatLng(coords.latitude, coords.longitude);

                // Mueve la vista del mapa
                this.leafletMap.setView(newLatLng, 14);

                this.onChange.emit({
                    latitude: coords?.latitude,
                    longitude: coords?.longitude
                });
                console.log('lat', coords?.latitude, 'lng', coords?.longitude);
                // Actualiza o crea el marcador
                if (this.markerItem) {
                    this.markerItem.setLatLng(newLatLng);
                } else {
                    this.markerItem = marker(newLatLng, {icon: this.myIcon}).addTo(this.leafletMap).bindPopup('Mi Ubicación');
                }
            }
        });
    }

    initMap() {
        // Coordenadas por defecto (Ecuador) si aún no han seleccionado parroquia
        const lat = this.centerCoords()?.latitude || -1.8312;
        const lng = this.centerCoords()?.longitude || -78.1834;

        // Creamos el mapa
        this.leafletMap = new Map(this.map()).setView([lat, lng], this.centerCoords() ? 14 : 6);

        // OSM usa tileLayer normal, no .wms
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(this.leafletMap);

        if (this.centerCoords()) {
            this.markerItem = marker([lat, lng], {
                icon: this.myIcon
            }).addTo(this.leafletMap).bindPopup('Mi Ubicación');
        }

        // Evento click en el mapa
        this.leafletMap.on('click', (e: { latlng: LatLng }) => {
            if (this.markerItem) {
                this.markerItem.setLatLng(e.latlng);
            } else {
                this.markerItem = marker(e.latlng).addTo(this.leafletMap).bindPopup('Mi Ubicación');
            }

            this.onChange.emit({
                latitude: e.latlng.lat,
                longitude: e.latlng.lng
            });
        });

        setTimeout(() => {
            this.leafletMap.invalidateSize();
        }, 200);
    }
}

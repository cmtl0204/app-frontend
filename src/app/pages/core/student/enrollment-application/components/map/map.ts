import { Component, Output, EventEmitter, OnDestroy, AfterViewInit, ElementRef, ViewChild, output, signal, input, effect } from '@angular/core';
import * as L from 'leaflet';

export interface MapCoords {
    latitude: string;
    longitude: string;
}

@Component({
    selector: 'app-map',
    imports: [],
    templateUrl: './map.html',
    styleUrl: './map.scss'
})
export class MapComponent implements AfterViewInit, OnDestroy {
    public coordsChange = output<MapCoords>();

    // NUEVO: coordenadas de centrado que vienen del padre (province/canton/parish)
    public centerCoords = input<MapCoords | null>(null);

    @ViewChild('mapContainer') mapContainer!: ElementRef;
    private map!: L.Map;
    private marker?: L.Marker;
    private mapReady = signal(false);

    constructor() {
        // Reacciona cada vez que cambie centerCoords, PERO solo si el mapa ya existe
        effect(() => {
            const coords = this.centerCoords();
            const ready = this.mapReady();
            if (!coords || !ready) return;

            const lat = parseFloat(coords.latitude);
            const lng = parseFloat(coords.longitude);
            if (isNaN(lat) || isNaN(lng)) return;

            this.map.flyTo([lat, lng], 14); // flyTo = animado, setView = instantáneo

            if (this.marker) {
                this.marker.setLatLng([lat, lng]);
            } else {
                this.marker = L.marker([lat, lng]).addTo(this.map);
            }
        });
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.initMap();
            this.map?.invalidateSize();
            this.mapReady.set(true); // ← habilita el effect de arriba
        }, 200);
    }

    ngOnDestroy(): void {
        this.map?.remove();
    }

    private initMap(): void {
        const iconDefault = L.icon({
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41]
        });
        L.Marker.prototype.options.icon = iconDefault;

        this.map = L.map(this.mapContainer.nativeElement).setView([-0.1807, -78.4678], 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        this.map.on('click', (e: L.LeafletMouseEvent) => {
            const { lat, lng } = e.latlng;
            if (this.marker) {
                this.marker.setLatLng([lat, lng]);
            } else {
                this.marker = L.marker([lat, lng]).addTo(this.map);
            }
            this.coordsChange.emit({
                latitude: lat.toString(),
                longitude: lng.toString()
            });
        });
    }
}

import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [
    `
      .mapa-container {
        width: 100%;
        height: 100%;
      }

      .row {
        background-color: white;
        border-radius: 5px;
        bottom: 50px;
        left: 50px;
        padding: 10px;
        position: fixed;
        z-index: 999;
        width: 400px;
      }
    `
  ]
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {

  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel: number = 10;
  center: [number, number] = [-75.58829514419219, 6.269709951940982];

  constructor() { }

  ngOnDestroy(): void {
    this.mapa.off('zoom', () => {});
    this.mapa.off('zoomend', () => {});
    this.mapa.off('move', () => {});
  }

  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
    });

    this.mapa.on('zoom', () => {
      // const zoomActual = this.mapa.getZoom();
      this.zoomLevel = this.mapa.getZoom();
    });

    this.mapa.on('zoom', () => {
      if (this.mapa.getZoom() > 18) {
        this.mapa.zoomTo(18);
      } 
    });

    this.mapa.on('move', (event) => {
      const { lng, lat } = event.target.getCenter();
      this.center = [lng, lat];
    });

  }

  zoomOut() {
    console.log('zoom out');
    this.mapa.zoomOut();
    this.zoomLevel = this.mapa.getZoom();
  }

  zoomIn() {
    console.log('zoom in');
    this.mapa.zoomIn();
    this.zoomLevel = this.mapa.getZoom();
  }

  zoomCambio(valor: string) {
    this.mapa.zoomTo(Number(valor));
  }

}

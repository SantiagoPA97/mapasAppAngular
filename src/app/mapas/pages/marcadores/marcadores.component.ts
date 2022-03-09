import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface MarcadorColor {
  color: string;
  marcador?: mapboxgl.Marker;
  centro?: [number, number];
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [
    `
      .mapa-container {
        width: 100%;
        height: 100%;
      }

      .list-group {
        position: fixed; 
        top: 20px;
        right: 20px;
        z-index: 99;
      }

      li {
        cursor: pointer;
      }

    `
  ]
})
export class MarcadoresComponent implements AfterViewInit {

  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel: number = 10;
  center: [number, number] = [-75.58829514419219, 6.269709951940982];
  marcadores: MarcadorColor[] = [];

  constructor() { }

  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
    });

    this.leerLocalStorage();

  }

  agregarMarcador() {

    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));

    const nuevoMarcador = new mapboxgl.Marker({
      draggable: true,
      color
    })
    .setLngLat(this.center)
    .addTo(this.mapa);

    this.marcadores.push({
      color,
      marcador: nuevoMarcador
    });

    this.guardarMarcadoresLocalStorage();

  }

  irMarcador(marcador: mapboxgl.Marker | undefined) {
    this.mapa.flyTo({
      center: marcador?.getLngLat()
    })
  }

  guardarMarcadoresLocalStorage() {

    const lngLatArr: MarcadorColor[] = [];

    this.marcadores.forEach( m => {
      const color = m.color;
      const {lng, lat} = m.marcador!.getLngLat();

      lngLatArr.push({
        color,
        centro: [lng, lat]
      });
    });

    localStorage.setItem('marcadores', JSON.stringify(lngLatArr));

  }

  leerLocalStorage() {
    if (!localStorage.getItem('marcadores')) {
      return;
    }

    const lngLatArr: MarcadorColor[] = JSON.parse(localStorage.getItem('marcadores')!);

    lngLatArr.forEach(m => {
      const nuevoMarcador = new mapboxgl.Marker({
        color: m.color,
        draggable:true
      })
      .setLngLat(m.centro!)
      .addTo(this.mapa)
      
      this.marcadores.push({
        marcador: nuevoMarcador,
        color: m.color
      });

      nuevoMarcador.on('dragend', () => {
        this.guardarMarcadoresLocalStorage();
      });


    });

    
  }
  
  borrarMarcador(indice: number) {
    this.marcadores[indice].marcador?.remove();
    this.marcadores.splice(indice, 1);
    this.guardarMarcadoresLocalStorage();
  }

}

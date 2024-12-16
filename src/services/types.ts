export interface ComunaInfo {
  comuna: string;
  poblacion: number;
  viviendas: number;
  estratoModa: number;
  establecimientos: string;
  centrosSalud: number;
  puestosSalud: number;
  establecimientosSecundaria: number;
  establecimientosPrimaria: number;
  establecimientosPreescolar: number;
  bibliotecas: number;
  hoteles: number;
  seguridad: string;
  homicidios: number;
  hurtos: number;
  suicidios: number;
}

export interface MarkerData {
  nombre: string;
  tipo: string;
  lat: number;
  lng: number;
}

export interface MarketDataBack{
    nombre: string;
    tipo: string;
    latitud: string;
    longitud: string;
  }

export interface ResponseListaMarcadores {
  data: MarkerData[];
}

export interface CommuneMarkerCounts {
  [communeName: string]: {
    [markerType: string]: number;
  };
}

export interface ComunaProperties {
  comuna: string;
  poblacion: number;
  viviendas: number;
  estratoModa: number;
  establecimientos: string;
  centrosSalud: number;
  puestosSalud: number;
  establecimientosSecundaria: number;
  establecimientosPrimaria: number;
  establecimientosPreescolar: number;
  bibliotecas: number;
  hoteles: number;
  seguridad: string;
  homicidios: number;
  hurtos: number;
  suicidios: number;
}

import React, { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./bienvenidos.css";
import { Link } from "react-router-dom";
import { LatLngExpression } from 'leaflet';

export const BaseMap: React.FC = () => {
  const MapRefresher = () => {
    const map = useMap();
    useEffect(() => {
      map.invalidateSize();
    }, [map]);
    return null;
  };

  const position: LatLngExpression = [3.4516, -76.5325];

  return (
    <MapContainer center={position} zoom={12} style={{ height: "100vh", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapRefresher />
    </MapContainer>
  );
};

const SideMenu: React.FC = () => {
  return (
    <div className="side-menu">
      <h2>Introducción del Proyecto</h2>
      <p>
        Este proyecto está enfocado en mostrar un mapa interactivo de la ciudad de Santiago de Cali,
        incluyendo puntos de interés y categorías como colegios, hospitales, monumentos, etc.
        También cuenta con delimitadores de comunas y herramientas visuales que ayudan a comprender mejor
        la distribución de la ciudad y sus zonas de interés.
      </p>
      <img src="Icons/cali.jpg" alt="Santiago de Cali" className="city-image" />
      
      <h3>Propósito del Proyecto</h3>
      <p>
        El propósito es visualizar información clave sobre la ciudad, como la ubicación
        de infraestructuras importantes y zonas de interés, con funcionalidades interactivas.
      </p>

      <h4>Integrantes</h4>
      <p>
        - Jhonny Cataño Rodriguez <br />
        - Jhon Esteban Hernandez
      </p>

      {/* Botones de navegación */}
      <div className="button-container">
        <Link to="/map" className="map-button">Mapa Principal</Link>
        <Link to="/api-google" className="map-button">API Google</Link>
        <Link to="/proyecciones" className="map-button">Proyecciones Datos en Cali</Link>
        <Link to="/cluster" className="map-button">Cluster</Link>
      </div>
    </div>
  );
};

export const Bienvenidos: React.FC = () => {
  return (
    <div className="main-container">
      <SideMenu />
      <div className="map-container">
        <BaseMap />
      </div>
    </div>
  );
};

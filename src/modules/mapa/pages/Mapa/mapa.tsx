/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  LayerGroup,
} from "react-leaflet";
import L, { PathOptions } from "leaflet";
import "leaflet/dist/leaflet.css";
import * as turf from "@turf/turf";
import { Button } from "antd";
import ModalComunaInfo from "../modals/ModalComunaInfo";
import CreateMarkerModal from "../modals/CreateMarkerModal";
import InfoBox from "../modals/Infobox";
import FilterMenu from "../../../FilterMenu/pages/FilterMenu";
import {
  CommuneMarkerCounts,
  ComunaProperties,
  MarkerData,
} from "../../../../services/types";
import { getListaMarcadores } from "../../../../services/mapita/mapitaAPI";
import ReactDOMServer from "react-dom/server";
import './styles.css';

import { FaHospital, FaSchool, FaClinicMedical, FaUniversity, FaShoppingCart, FaCamera, FaHotel, FaBuilding, FaBus  } from "react-icons/fa";
import { PiIslandFill,PiParkBold} from "react-icons/pi";
import { BsBank2, BsEvStationFill} from "react-icons/bs";
import { MdElectricCar } from "react-icons/md";
import { CgGym } from "react-icons/cg";
import { GiColombia } from "react-icons/gi";
import { IoLibrary } from "react-icons/io5";


export const Mapa: React.FC = () => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [filteredMarkers, setFilteredMarkers] = useState<MarkerData[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [geoJsonDataColor, setGeoJsonDataColor] = useState<any>(null);

  const [showBoundaries, setShowBoundaries] = useState<boolean>(false);
  const [showColors, setShowColors] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleCrearM, setIsModalVisibleCrearM] = useState(false);

  const [selectedComuna, setSelectedComuna] = useState<
    ComunaProperties | undefined
  >(undefined);
  const [showCicloRuta, setShowCicloRuta] = useState<boolean>(false);
  const [showRios, setShowRios] = useState<boolean>(false);

  const [cicloRutaGeoJson, setCiclorutaGeoJson] = useState<any>(null);
  const [RiosGeoJson, setRiosGeoJson] = useState<any>(null);

  const [counts, setCounts] = useState<CommuneMarkerCounts>({});

  const handleAddMarker = (newMarker: MarkerData) => {
    setMarkers([...markers, newMarker]);
  };

  useEffect(() => {
    const fetchGeoJson = async () => {
      try {
        getListaMarcadores();
        
        const comunasResponse = await fetch("/public/Data/comunasCoo.geojson");
        const comunasData = await comunasResponse.json();
        setGeoJsonData(comunasData);
        setGeoJsonDataColor(comunasData);

        const riosResponse = await fetch("/public/Data/rios.geojson");
        const riosData = await riosResponse.json();
        setRiosGeoJson(riosData);

     
        const ciclorutaResponse = await fetch("public/Data/cicloRuta.geojson");
        const ciclorutaData = await ciclorutaResponse.json();
        setCiclorutaGeoJson(ciclorutaData); 
      } catch (error) {
        console.error("Error al cargar los archivos GeoJSON:", error);
      }
    };

    const fetchData = async () => {
      try {
        const responseAPI = await getListaMarcadores();
        const allMarkers: MarkerData[] = [];

        if (Array.isArray(responseAPI.data)) {
          responseAPI.data.forEach((row: any) => {
            const lat = parseFloat(row.latitud);
            const lng = parseFloat(row.longitud);
            if (!isNaN(lat) && !isNaN(lng)) {
              allMarkers.push({
                nombre: row.nombre || "Nombre desconocido",
                tipo: row.tipo || "Sin categoría",
                lat: lat,
                lng: lng,
              });
            }
          });
        } else {
          console.warn("La respuesta de la API no es un array");
        }

        setMarkers(allMarkers);
        console.log(markers);
      } catch (error) {
        console.error("Error al cargar los marcadores desde la API:", error);
      }
    };

    fetchGeoJson();
    fetchData();
  }, );

  const onOpenModal = (comuna: ComunaProperties) => {
    setSelectedComuna(comuna);
    setIsModalVisible(true);
  };

  const boundaryStyle: (
    feature?: GeoJSON.Feature<GeoJSON.Geometry, ComunaProperties>
  ) => PathOptions = (feature) => {
    if (!feature || !feature.properties) {
      return { color: "red", weight: 10, opacity: 2.0 }; // Default style
    }

    const isSelected =
      selectedComuna && selectedComuna.comuna === feature.properties.comuna;

    return {
      color: isSelected ? "black" : "black", // Line color
      weight: 3,
      opacity: 1.8,
      fillColor: isSelected ? "rgba(0, 0, 139, 0.6)" : undefined, // Fill color for the selected comuna
      fillOpacity: isSelected ? 0.9 : 0, // Make it opaque if selected
    };
  };

  const getIconByCategory = (category: string) => {
    let iconComponent = <FaBuilding size={15} color="brown" />; // Ícono por defecto
  
    switch (category.toLowerCase()) {
      case "hospitales":
        iconComponent = <FaHospital size={30} color="yellow" />;
        break;
      case "colegios":
        iconComponent = <FaSchool size={30} color="blue" />;
        break;
      case "estaciones mio":
        iconComponent = <FaBus size={30} color="black" />;
        break;
      case "clinicas":
        iconComponent = <FaClinicMedical size={30} color="white" />;
        break;
      case "bancos":
        iconComponent = <BsBank2 size={30} color="#B8860B" />;
        break;
      case "universidades":
        iconComponent = <FaUniversity size={30} color="#FF007F" />;
        break;
      case "centros comerciales":
        iconComponent = <FaShoppingCart size={30} color="orange" />;
        break;
      case "estaciones electricas":
        iconComponent = <MdElectricCar size={30} color="orange" />;
        break; 
      case "monumentos":
        iconComponent = <GiColombia  size={30} color="purple" />;
        break;
        case "unidades deportivas":
        iconComponent = <CgGym  size={30} color="red" />;
        break;
      case "fotomultas":
        iconComponent = <FaCamera size={30} color="green" />;
        break;
        case "humedales":
        iconComponent = <PiIslandFill  size={30} color="green" />;
        break; 
        case "parques":
        iconComponent = <PiParkBold size={30} color="green" />;
        break;
      case "comunas":
        iconComponent = <FaBuilding size={30} color="black" />;
        break;
      case "hoteles":
        iconComponent = <FaHotel size={30} color="red" />;
        break;
        case "biblioteca":
          iconComponent = <IoLibrary  size={30} color="red" />;
          break;
        case "gasolinerias":
        iconComponent = <BsEvStationFill  size={30} color="red" />;
        break;
      default:
        iconComponent = <FaBuilding size={30} color="brown" />;
        break;
    }
  
    const iconHtml = ReactDOMServer.renderToString(iconComponent);
  
    return new L.DivIcon({
      html: `<div class="custom-icon">${iconHtml}</div>`,
      className: "custom-icon-container", 
      iconSize: [40, 40], 
      iconAnchor: [20, 40], 
    });
  };



  useEffect(() => {
    setFilteredMarkers(
      markers.filter((marker) => selectedTypes.has(marker.tipo))
    );
    // }
  }, [selectedTypes, markers]);

  const handleTypeChange = (selectedKeys: string[]) => {
    console.log(
      "%chandleTypeChange",
      "color:green;font-size:18px",
      selectedKeys
    );
    setSelectedTypes(new Set(selectedKeys));
  };

  const handleToggleBoundaries = (checked: boolean) => {
    setShowBoundaries(checked);
  };

  const handleToggleCicloRuta = (checked: boolean) => {
    setShowCicloRuta(checked);
  };

  const handleToggleRios = (Checked: boolean) => {
    setShowRios(Checked);
  };

  const handleToggleColor = (checked: boolean) => {
    setShowColors(checked);
  };

  //metodo hacer clic cada comuna
  const onEachFeatureInfo = (feature: any, layer: any) => {
    layer.on({
      click: () => {
        const comuna = feature.properties.comuna;
        const poblacion = feature.properties.poblacion;
        const viviendas = feature.properties.viviendas;
        const estratoModa = feature.properties.estratoModa;
        const establecimientos = feature.properties.establecimientos;
        const centrosSalud = feature.properties.centrosSalud;
        const puestosSalud = feature.properties.puestosSalud;
        const establecimientosSecundaria =
          feature.properties.establecimientosSecundaria;
        const establecimientosPrimaria =
          feature.properties.establecimientosPrimaria;
        const establecimientosPreescolar =
          feature.properties.establecimientosPreescolar;
        const bibliotecas = feature.properties.bibliotecas;
        const hoteles = feature.properties.hoteles;
        const seguridad = feature.properties.seguridad;
        const homicidios = feature.properties.homicidios;
        const hurtos = feature.properties.hurtos;
        const suicidios = feature.properties.suicidios;

        if (comuna) {
          // Llama a comunaClick con los datos de la comuna
          onOpenModal({
            comuna,
            poblacion,
            viviendas,
            estratoModa,
            establecimientos,
            centrosSalud,
            puestosSalud,
            establecimientosSecundaria,
            establecimientosPreescolar,
            establecimientosPrimaria,
            bibliotecas,
            hoteles,
            seguridad,
            homicidios,
            hurtos,
            suicidios,
          });
        }
      },
    });
  };

  const getMostCommonType = (counts: { [markerType: string]: number }) => {
    let maxCount = 0;
    let mostCommonType = "";

    // Itera sobre cada tipo de marcador y encuentra el que tiene el mayor conteo
    Object.entries(counts).forEach(([type, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommonType = type;
      }
    });

    const totalMarkers = Object.values(counts).reduce(
      (acc, count) => acc + count,
      0
    );
    return totalMarkers <= 3 ? "default" : mostCommonType;
  };

  const assignMarkersToCommunes = useCallback(
    (markers: MarkerData[], geoJsonData: any): CommuneMarkerCounts => {
      const counts: CommuneMarkerCounts = {};

      geoJsonData.features.forEach((feature: any) => {
        const communeName: string = feature.properties.comuna;
        const polygon = turf.polygon(feature.geometry.coordinates);

        counts[communeName] = counts[communeName] || {};

        markers.forEach((marker) => {
          const point = turf.point([marker.lng, marker.lat]);

          // Verificar si el marcador está dentro del polígono de la comuna
          if (turf.booleanPointInPolygon(point, polygon)) {
            const type = marker.tipo;

            // Inicializar el contador para este tipo de marcador si no existe
            counts[communeName][type] = (counts[communeName][type] || 0) + 1;
          }
        });
      });

      return counts;
    },
    []
  );

  useEffect(() => {
    if (geoJsonData && markers.length > 0) {
      const calculatedCounts = assignMarkersToCommunes(markers, geoJsonData);
      setCounts(calculatedCounts); // Actualiza el estado con el conteo de marcadores por comuna
    }
  }, [geoJsonData, markers, assignMarkersToCommunes]);

  // Función para obtener el color según el tipo de marcador
  const getColorByType = (type: string) => {
    switch (type.toLowerCase()) {
      case "hospitales":
        return "yellow";
      case "universidades":
        return "pink";
      case "centros comerciales":
        return "orange";
      case "fotomultas":
        return "green";
      case "monumentos":
        return "purple";
      case "colegios":
        return "blue";
      case "bancos":
        return "#b8860b";
      case "hoteles":
        return "red";
      default:
        return "gray"; // Color por defecto
    }
  };

  const geoJsonStyle = (feature: any) => {
    const communeName = feature.properties.comuna;
    const mostCommonType = getMostCommonType(counts[communeName] || {}); // Asegúrate de manejar si no hay datos
    const color = getColorByType(mostCommonType);

    return {
      fillColor: color,
      weight: 2,
      opacity: 1,
      color: "black",
      fillOpacity: 0.3,
    };
  };

  return (
    <div>
      <div style={{ position: "relative" }}>
        {/* Botón flotante para abrir el modal */}
        <Button
          type="primary"
          onClick={() => setIsModalVisibleCrearM(true)}
          style={{
            position: "absolute",
            top: "20px", // distancia desde la parte superior
            right: "20px", // distancia desde la parte derecha
            zIndex: 1000, // asegura que esté por encima de otros elementos
          }}
        >
          Crear Marcador
        </Button>
      </div>

      <CreateMarkerModal
        isVisible={isModalVisibleCrearM}
        onCreate={handleAddMarker}
        onClose={() => setIsModalVisibleCrearM(false)}
      />

      <FilterMenu
        onFilterChange={handleTypeChange}
        onToggleBoundaries={handleToggleBoundaries}
        onToggleColors={handleToggleColor}
        showBoundaries={showBoundaries}
        showColors={showColors}
        showCicloRuta={showCicloRuta}
        onOpenModal={onOpenModal}
        onToggleCicloRutas={handleToggleCicloRuta}
        showRios={showRios}
        onToggleRios={handleToggleRios}
      />
      <MapContainer
        center={[3.4516, -76.532]}
        id="map"
        zoom={12}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        {showCicloRuta && cicloRutaGeoJson && (
          <GeoJSON
            data={cicloRutaGeoJson}
            style={{ color: "red", weight: 3 }}
          />
        )}
        {showRios && RiosGeoJson && (
          <GeoJSON
            data={RiosGeoJson}
            style={{ color: "blue", weight: 3 }}
            onEachFeature={(feature, layer) => {
              // Comprueba si la propiedad 'name' existe y muestra el popup
              if (feature.properties && feature.properties.name) {
                layer.bindPopup(`${feature.properties.name}`);
              }
            }}
          />
        )}

        colores marcadores populares
        {geoJsonData && showBoundaries && (
          <GeoJSON
            data={geoJsonData}
            style={geoJsonStyle}
            // onEachFeature={onEachFeature}
            onEachFeature={(feature, layer) => {
              const communeName = feature.properties.comuna;
              const communeCounts = counts[communeName] || {};

              // Añadir Tooltip para cada comuna con el conteo de marcadores por tipo
              layer.bindTooltip(
                `<div style="font-size: 12px; padding: 5px;">
                  <span style="font-weight: bold;">${communeName}</span>
                  <ul style="padding-left: 0; margin: 5px 0 0 0; list-style-type: none;">
                    ${Object.entries(communeCounts)
                      .map(
                        ([type, count]) =>
                          `<li style="margin: 2px 0;">${type}: ${count}</li>`
                      )
                      .join("")}
                  </ul>
                </div>`,
                { sticky: true, direction: "auto", opacity: 0.6 }
              );

              layer.on({
                mouseover: () => layer.openTooltip(),
                mouseout: () => layer.closeTooltip(),
              });
            }}
          />
        )}
        ;
        <InfoBox visible={showBoundaries} /> limites de las comunas y modal
        {geoJsonDataColor && showColors && (
          <GeoJSON
            data={geoJsonDataColor}
            style={boundaryStyle} 
            onEachFeature={onEachFeatureInfo}
          />
        )}
        <ModalComunaInfo
          selectedComuna={selectedComuna || undefined} // Si selectedComuna es null, se pasa undefined
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
        />
        {/* Renderizar los marcadores filtrados */}
        <LayerGroup>
          {filteredMarkers.map((marker, index) => (
            <Marker
              key={index}
              position={[marker.lat, marker.lng]}
              icon={getIconByCategory(marker.tipo)}
            >
              <Popup>{marker.nombre}</Popup>
            </Marker>
          ))}
        </LayerGroup>
      </MapContainer>
    </div>
  );
};

export default Mapa;

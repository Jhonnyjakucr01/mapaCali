import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet.heat";
import { useMap } from "react-leaflet";

type HeatmapData = Array<[number, number, number?]>;

interface HeatmapLayerProps {
  data: HeatmapData;
}

const HeatmapLayer: React.FC<HeatmapLayerProps> = ({ data }) => {
  const map = useMap();

  useEffect(() => {
   const heatLayer = L.heatLayer(
    data.map(([lat, lng, radius]) => [lat, lng, radius]), // Radio incluido
    {
      blur: 15, // Suavidad de las manchas
      max: 1,   // Fija el máximo de intensidad
      radius: undefined, // Este valor lo manejamos dinámicamente en los datos
    }
  );

  heatLayer.addTo(map);

  return () => {
    map.removeLayer(heatLayer);
  };
}, [data, map]);

  return null;
};

export default HeatmapLayer;

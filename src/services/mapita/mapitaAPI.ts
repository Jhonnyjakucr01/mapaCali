/* eslint-disable @typescript-eslint/no-explicit-any */
import { clientMapa } from "../client";
import { MarkerData, ResponseListaMarcadores } from "../types";

export const getListaMarcadores = async (
): Promise<ResponseListaMarcadores> => {
  const response = await clientMapa.get<{
    data: MarkerData[];
  }>(`marcadores`, {
  });

  return {
    data: response.data.data,
  };
};


export const getIconPorCategory = async (category: string): Promise<string> => {
    const response = await clientMapa.get<{ iconUrl: string }>(`icono-por-categoria/${category}`);
  
    return response.data.iconUrl;
  };
  

  export const crearMarcadorMapa = async (
    marker: MarkerData,
  ): Promise<any> => {
    return await clientMapa.post<any>("marcadores", marker, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };
  

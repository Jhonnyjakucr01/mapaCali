/* eslint-disable @typescript-eslint/no-explicit-any */
import { clientMapa } from "../client";
import { MarkerData, ResponseListaMarcadores } from "../types";

export const getListaMarcadores =
  async (): Promise<ResponseListaMarcadores> => {
    const response = await clientMapa.get<{
      data: MarkerData[];
    }>(`marcadores`, {});

    return {
      data: response.data.data,
    };
  };

  
export const getIconPorCategory = async (category: string): Promise<string> => {
  const response = await clientMapa.get<{ iconUrl: string }>(
    `icono-por-categoria/${category}`
  );

  return response.data.iconUrl;
};


export const crearMarcadorMapa = async (marker: MarkerData): Promise<any> => {
  return await clientMapa.post<any>("marcadores", marker, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};



export const obtenerDatos = async (tipo: string): Promise<any> => {
  try {
    const response = await clientMapa.get<any>(`obtener-datos-google/${tipo}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    console.error(`Error al obtener los datos de ${tipo}:`, error);
    throw error;
  }
};


export const proyeccionesCali = async (file: File): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append("archivo", file);

    const response = await clientMapa.post<any>("proyecciones-cali", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error al obtener las proyecciones de Cali:", error);
    throw error;
  }
};


export const clusterCali = async (formData: FormData): Promise<any> => {
  try {
    const response = await clientMapa.post<any>("cluster-cali", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error al obtener las proyecciones de Cali:", error);
    throw error;
  }
};









import axios from "axios";
import { BASE_URL, BASE_URL_MAPA } from "../config/api";


export const client = axios.create({
  baseURL: BASE_URL,
});


export const clientMapa = axios.create({
    baseURL: BASE_URL_MAPA,
  });
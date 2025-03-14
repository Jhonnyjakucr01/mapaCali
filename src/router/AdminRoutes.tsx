import { Route } from "react-router-dom";
import { RoutesWithNotFound } from "../modules/common/components/RoutesWithNotFound/RoutesWithNotFound";
import { Bienvenidos } from "../modules/bienvenidos/pages";
import Mapa from "../modules/mapa/pages/Mapa/mapa";
import ApiGoogle from "../modules/mapa/pages/google/googleMaps";

export const AdminRoutes = () => {
  return (
    <>
      <RoutesWithNotFound>
        <Route path="/" element={<Bienvenidos />}></Route>
        <Route path="/map" element={<Mapa />}></Route>
        <Route path="/api-google" element={<ApiGoogle />}></Route>




      </RoutesWithNotFound>
    </>
  );
};

import { Route } from "react-router-dom";
import { RoutesWithNotFound } from "../modules/common/components/RoutesWithNotFound/RoutesWithNotFound";
import { Bienvenidos } from "../modules/bienvenidos/pages";
import Mapa from "../modules/mapa/pages/Mapa/mapa";

export const AdminRoutes = () => {
  return (
    <>
      <RoutesWithNotFound>
        <Route path="/" element={<Bienvenidos />}></Route>
        <Route path="/map" element={<Mapa />}></Route>


      </RoutesWithNotFound>
    </>
  );
};

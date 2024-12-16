import { Route } from "react-router-dom";
import { AdminRoutes } from "./AdminRoutes";
import { RoutesWithNotFound } from "../modules/common/components/RoutesWithNotFound/RoutesWithNotFound";

export const AppRouter = () => {
  return (
    <>
      <RoutesWithNotFound>
          
          <Route path="/*" element={<AdminRoutes />} />
      </RoutesWithNotFound>
    </>
  );
};

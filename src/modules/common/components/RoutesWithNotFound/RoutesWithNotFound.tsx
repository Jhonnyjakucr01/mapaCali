import { Route, Routes } from "react-router-dom";
import { RoutesWithNotFoundProps } from "./types";
import { NotFound } from "../NotFound";

export const RoutesWithNotFound = ({ children }: RoutesWithNotFoundProps) => {
  return (
    <Routes>
      {children}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

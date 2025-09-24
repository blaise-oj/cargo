import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import CargoList from "./List/CargoList";
import CargoCreate from "./Create/CargoCreate";
import CargoEdit from "./Edit/CargoEdit";

const CargoCharters = () => {
  return (
    <div className="cargo-charters-container">
      <h1></h1>
      <Routes>
        {/* Default route redirects to list */}
        <Route index element={<Navigate to="list" replace />} />

        <Route path="list" element={<CargoList />} />
        <Route path="create" element={<CargoCreate />} />
        <Route path="edit/:airwaybill" element={<CargoEdit />} />
      </Routes>
    </div>
  );
};

export default CargoCharters;


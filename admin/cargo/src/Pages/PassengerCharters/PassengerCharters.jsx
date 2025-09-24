import { Routes, Route } from "react-router-dom";
import PassengerList from "./List/PassengerList";
import PassengerCreate from "./Create/PassengerCreate";
import PassengerEdit from "./Edit/PassengerEdit";

const PassengerCharters = () => {
  return (
    <Routes>
      <Route index element={<PassengerList />} />
      <Route path="list" element={<PassengerList />} />
      <Route path="create" element={<PassengerCreate />} />
      <Route path="edit/:airwaybill" element={<PassengerEdit />} />
    </Routes>
  );
};

export default PassengerCharters;

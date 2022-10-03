import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Complaint from "./pages/Complaint";

const Pages = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/complaint/:complaintId" element={<Complaint />} />
  </Routes>
);

export default Pages;

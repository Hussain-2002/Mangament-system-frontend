import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Purchase from "./pages/Purchase";
import Sale from "./pages/Sale";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/purchases" element={<Purchase />} />
        <Route path="/sales" element={<Sale />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

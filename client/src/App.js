import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MenuPage from './pages/MenuPage';
import DrinkOrders from './pages/DrinkOrders';
import InventoryPage from './pages/InventoryPage';
import CreateInventoryPage from './pages/CreateInventoryPage';
import './App.css';
import KenoBoard from "./pages/KenoBoard";
import KenoJoin from "./pages/KenoJoin";

function App() {
  return (
    <Router>
      <div className="container">


        <Routes>
        <Route path="/" element={<MenuPage />} />
        <Route path="/drink-orders" element={<DrinkOrders />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/create-inventory" element={<CreateInventoryPage />} />
        <Route path="/casino/keno237/board" element={<KenoBoard />} />
        <Route path="/casino/keno237/join" element={<KenoJoin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

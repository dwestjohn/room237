// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MenuPage from './pages/MenuPage';
import DrinkOrders from './pages/DrinkOrders';
import InventoryPage from './pages/InventoryPage';
import CreateInventoryPage from './pages/CreateInventoryPage';
import './App.css';
import KenoBoard from "./pages/KenoBoard";
import KenoJoin from "./pages/KenoJoin";
import RequirePin from "./components/RequirePin"; // ⬅️ using hardcoded PIN wrapper

function App() {
  return (
    <Router>
      <div className="container">
        <Routes>
          {/* 🔒 PIN-protected routes */}
          <Route
            path="/"
            element={
              <RequirePin>
                <MenuPage />
              </RequirePin>
            }
          />
          <Route
            path="/drink-orders"
            element={
              <RequirePin>
                <DrinkOrders />
              </RequirePin>
            }
          />
          <Route
            path="/inventory"
            element={
              <RequirePin>
                <InventoryPage />
              </RequirePin>
            }
          />
          <Route
            path="/create-inventory"
            element={
              <RequirePin>
                <CreateInventoryPage />
              </RequirePin>
            }
          />

          {/* ✅ Public routes (no PIN required) */}
          <Route path="/casino/keno237/board" element={<KenoBoard />} />

          <Route
            path="/casino/keno237/join"
            element={
              <RequirePin>
                <KenoJoin />
              </RequirePin>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;




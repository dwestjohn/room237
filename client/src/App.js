import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MenuPage from './pages/MenuPage';
import DrinkOrders from './pages/DrinkOrders';
import InventoryPage from './pages/InventoryPage';
import CreateInventoryPage from './pages/CreateInventoryPage';
import './App.css';
import KenoBoard from "./pages/KenoBoard";
import KenoJoin from "./pages/KenoJoin";
import RequireToken from "./components/RequireToken"; // ⬅️ import wrapper

function App() {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route
            path="/"
            element={
              <RequireToken>
                <MenuPage />
              </RequireToken>
            }
          />
          <Route
            path="/drink-orders"
            element={
              <RequireToken>
                <DrinkOrders />
              </RequireToken>
            }
          />
          <Route
            path="/inventory"
            element={
              <RequireToken>
                <InventoryPage />
              </RequireToken>
            }
          />
          <Route
            path="/create-inventory"
            element={
              <RequireToken>
                <CreateInventoryPage />
              </RequireToken>
            }
          />

          {/* ✅ Public page (no QR token required) */}
          <Route path="/casino/keno237/board" element={<KenoBoard />} />

          <Route
            path="/casino/keno237/join"
            element={
              <RequireToken>
                <KenoJoin />
              </RequireToken>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;



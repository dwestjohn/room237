import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';


function InventoryPage() {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await axios.get('/api/inventory');
      setInventory(res.data);
    } catch (err) {
      console.error('Error loading inventory:', err);
    }
  };

  const toggleActive = async (id) => {
    try {
      await axios.put(`/api/inventory/${id}/toggle`);
      fetchInventory(); // refresh list
    } catch (err) {
      console.error('Error toggling active state:', err);
    }
  };

  const deleteItem = async (id) => {
    if (window.confirm('Permanently delete this item?')) {
      try {
        await axios.delete(`/api/inventory/${id}`);
        fetchInventory();
      } catch (err) {
        console.error('Error deleting item:', err);
      }
    }
  };

  return (
    <div className="container">

    <button
    onClick={() => navigate('/')}
    className="bartender-button"
    aria-label="Back to Menu"
    >
    <img src="/skull.svg" alt="Back to Menu" />
    </button>


      <h1 className="gold-title">Inventory</h1>
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Active</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map(item => (
            <tr key={item.inventory_id}>
              <td>{item.inventory_name}</td>
              <td>
                <input
                  type="checkbox"
                  checked={item.is_active}
                  onChange={() => toggleActive(item.inventory_id)}
                />
              </td>
              <td>
                <button className="remove-button" onClick={() => deleteItem(item.inventory_id)}>✖</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

        <button
    onClick={() => navigate('/create-inventory')}
    className="bartender-button"
    aria-label="Create Inventory"
    >
    <img src="/skull.svg" alt="Create Inventory" />
    </button>


    </div>
  );
}

export default InventoryPage;

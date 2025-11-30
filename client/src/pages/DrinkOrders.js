import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function DrinkOrders() {
  const [orders, setOrders] = useState([]);
  const previousCount = useRef(0);
  const audioRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders(); // initial fetch

    const interval = setInterval(() => {
      fetchOrders(); // fetch every 5 seconds
    }, 5000);

    return () => clearInterval(interval); // cleanup
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/drink-orders');
      const newOrders = res.data;

      // Play chime if new orders were added
      if (newOrders.length > previousCount.current) {
        console.log('🔔 New order detected!');
        audioRef.current?.play();
      }

      previousCount.current = newOrders.length;
      setOrders(newOrders);
    } catch (err) {
      console.error('❌ Error fetching orders:', err);
    }
  };

  const handleDone = async (orderId) => {
    try {
      await axios.delete(`/api/drink-orders/${orderId}`);
      fetchOrders(); // refresh after deleting
    } catch (err) {
      console.error('Error marking order as done:', err);
    }
  };

  return (
    <div className="container">
      {/* Audio element for chime */}
      <audio ref={audioRef} src="/order_riff.mp3" preload="auto" />

      {/* Back to Menu button */}
      <button
      onClick={() => navigate('/')}
      className="bartender-button"
      aria-label="Back to Menu">
      <img src="/skull.svg" alt="Back to Menu" />
      </button>


      <h1 className="gold-title">Drink Orders</h1>

      {orders.length === 0 ? (
        <p style={{ color: 'gray', textAlign: 'center' }}>No active drink orders.</p>
      ) : (
        orders.map((order, index) => (
          <div key={index} className="card">
            <h2 className="recipe-name">{order.recipe_name}</h2>
            <p><strong style={{ color: 'white' }}>For:</strong> {order.person_name}</p>
            <p><strong style={{ color: 'white' }}>Ingredients:</strong> {order.ingredients}</p>
            <p><strong style={{ color: 'white' }}>Method:</strong> {order.method}</p>
            <p><strong style={{ color: 'white' }}>Glassware:</strong> {order.glassware}</p>
            <p><strong style={{ color: 'white' }}>Ordered at:</strong> {new Date(order.order_time).toLocaleTimeString()}</p>

            <button className="order-button" onClick={() => handleDone(order.order_id)}>
              Done
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default DrinkOrders;


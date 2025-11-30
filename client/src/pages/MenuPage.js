import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function MenuPage() {
  const [showPinPrompt, setShowPinPrompt] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [pinContext, setPinContext] = useState(null);

  const [cocktails, setCocktails] = useState([]);
  const [mocktails, setMocktails] = useState([]);
  const [shots, setShots] = useState([]);

  const [topShelf, setTopShelf] = useState([]);
  const [beers, setBeers] = useState([]);
  const [seltzers, setSeltzers] = useState([]);
  const [nonAlcoholic, setNonAlcoholic] = useState([]);
  const [wineList, setWineList] = useState([]);

  const [personName, setPersonName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const orderSectionRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Recipes by type
    axios.get('/api/recipes/type/Cocktail')
      .then(res => setCocktails(res.data))
      .catch(err => console.error('Error loading cocktails:', err));

    axios.get('/api/recipes/type/Mocktail')
      .then(res => setMocktails(res.data))
      .catch(err => console.error('Error loading mocktails:', err));

    axios.get('/api/recipes/type/Shot')
      .then(res => setShots(res.data))
      .catch(err => console.error('Error loading shots:', err));

    // Inventory-based sections
    axios.get('/api/recipes/topshelf')
      .then(res => setTopShelf(res.data))
      .catch(err => console.error('Error loading top shelf items:', err));

    axios.get('/api/recipes/beers')
      .then(res => setBeers(res.data))
      .catch(err => console.error('Error loading beers:', err));

    axios.get('/api/recipes/wines')
      .then(res => setWineList(res.data))
      .catch(err => console.error('Error loading wines:', err));

    axios.get('/api/recipes/seltzers')
      .then(res => setSeltzers(res.data))
      .catch(err => console.error('Error loading seltzers:', err));

    axios.get('/api/recipes/nonalcoholic')
      .then(res => setNonAlcoholic(res.data))
      .catch(err => console.error('Error loading non-alcoholic items:', err));
  }, []);

  const handleOrderClick = (recipe) => {
    setSelectedRecipe(recipe);
    setPersonName('');
    setQuantity(1);
    setTimeout(() => {
      orderSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const resetForm = () => {
    setSelectedRecipe(null);
    setPersonName('');
    setQuantity(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/order', {
        person_name: personName,
        recipe_id: selectedRecipe.recipe_id,
        quantity: quantity
      });
      alert('Order placed successfully!');
      resetForm();
    } catch (err) {
      console.error(err);
      alert('Failed to place order.');
    }
  };

  return (
    <div className="container">
      <div className="logo-container">
        <img src="/assets/room237-logo.svg" alt="Room 237" className="logo" />
      </div>

      {/* Cocktails */}
      <h2 className="section-title">Cocktails</h2>
      {cocktails.length === 0 && (
        <p style={{ color: 'gray', textAlign: 'center' }}>Loading or no cocktails available.</p>
      )}
      {cocktails.map((recipe) => (
        <div className="card" key={recipe.recipe_id}>
          <p className="motto">{recipe?.motto ?? ''}</p>
          <h2 className="recipe-name">{recipe?.recipe_name ?? 'Unnamed Cocktail'}</h2>
          <p className="description">{recipe?.description ?? 'No description available.'}</p>
          <button className="order-button" onClick={() => handleOrderClick(recipe)}>
            Order This
          </button>
        </div>
      ))}

      {/* Mocktails */}
      <h2 className="section-title section-spacer">Mocktails</h2>
      {mocktails.length === 0 && (
        <p style={{ color: 'gray', textAlign: 'center' }}>Loading or no mocktails available.</p>
      )}
      {mocktails.map((recipe) => (
        <div className="card" key={recipe.recipe_id}>
          <p className="motto">{recipe?.motto ?? ''}</p>
          <h2 className="recipe-name">{recipe?.recipe_name ?? 'Unnamed Mocktail'}</h2>
          <p className="description">{recipe?.description ?? 'No description available.'}</p>
          <button className="order-button" onClick={() => handleOrderClick(recipe)}>
            Order This
          </button>
        </div>
      ))}

      {/* Shots */}
      <h2 className="section-title section-spacer">Shots</h2>
      {shots.length === 0 && (
        <p style={{ color: 'gray', textAlign: 'center' }}>Loading or no shots available.</p>
      )}
      {shots.map((recipe) => (
        <div className="card" key={recipe.recipe_id}>
          <p className="motto">{recipe?.motto ?? ''}</p>
          <h2 className="recipe-name">{recipe?.recipe_name ?? 'Unnamed Shot'}</h2>
          <p className="description">{recipe?.description ?? 'No description available.'}</p>
          <button className="order-button" onClick={() => handleOrderClick(recipe)}>
            Order This
          </button>
        </div>
      ))}

      {/* Top Shelf */}
      <h2 className="section-title section-spacer">Top Shelf</h2>
      <div className="beer-row">
        {topShelf.map((item, index) => (
          <React.Fragment key={index}>
            <span className="beer-name inline-drink">{item.inventory_name}</span>
            {index !== topShelf.length - 1 && <span className="dot">•</span>}
          </React.Fragment>
        ))}
      </div>

      {/* Beer */}
      <h2 className="section-title section-spacer">Beer</h2>
      <div className="beer-row">
        {beers.map((beer, index) => (
          <React.Fragment key={index}>
            <span className="beer-name recipe-name inline-drink">{beer.inventory_name}</span>
            {index !== beers.length - 1 && <span className="dot">•</span>}
          </React.Fragment>
        ))}
      </div>

      {/* Wine */}
      <h2 className="section-title section-spacer">Wine</h2>
      <div className="beer-row">
        {wineList.map((item, index) => (
          <React.Fragment key={index}>
            <span className="beer-name inline-drink">{item.inventory_name}</span>
            {index !== wineList.length - 1 && <span className="dot">•</span>}
          </React.Fragment>
        ))}
      </div>

      {/* Seltzer */}
      <h2 className="section-title section-spacer">Seltzers & Other</h2>
      <div className="beer-row">
        {seltzers.map((seltzer, index) => (
          <React.Fragment key={index}>
            <span className="beer-name recipe-name inline-drink">{seltzer.inventory_name}</span>
            {index !== seltzers.length - 1 && <span className="dot">•</span>}
          </React.Fragment>
        ))}
      </div>

      {/* Non-alcoholic */}
      <h2 className="section-title section-spacer">Non-Alcoholic</h2>
      <div className="beer-row">
        {nonAlcoholic.map((item, index) => (
          <React.Fragment key={index}>
            <span className="beer-name inline-drink">{item.inventory_name}</span>
            {index !== nonAlcoholic.length - 1 && <span className="dot">•</span>}
          </React.Fragment>
        ))}
      </div>

      {/* Order Section */}
      <h2 className="section-title section-spacer" ref={orderSectionRef}>Place An Order</h2>
      {selectedRecipe ? (
        <form className="order-form" onSubmit={handleSubmit}>
          <div className="order-header">
            <strong>Ordering:</strong> <span>{selectedRecipe.recipe_name}</span>
            <button type="button" className="cancel-button" onClick={resetForm}>✖</button>
          </div>

          <input
            type="text"
            placeholder="Your name"
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
            required
          />

          <select value={quantity} onChange={(e) => setQuantity(e.target.value)} required>
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>

          <button type="submit">Submit Order</button>
        </form>
      ) : (
        <p style={{ textAlign: 'center', color: 'gray' }}>
          Select a drink and enter your name!
        </p>
      )}


      {/* Venmo Tip Button */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <a
          href="https://venmo.com/u/dwestjohn?txn=pay&note=Thanks+for+the+tip!"
          target="_blank"
          rel="noopener noreferrer"
          className="tip-button"
          style={{
            display: 'inline-block',
            backgroundColor: '#cba44d',
            color: 'white',
            padding: '0.6rem 1.2rem',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}
        >
          💲 Feel like tipping? 💲
        </a>

        <p style={{ textAlign: 'center', color: 'gray' }}>
          Room 237 is always free to friends and family. But, if you want to leave a donation -- it will go towards the restock fund (booze, merchandise, prizes, snacks, etc.)
        </p>
      </div>



            {/* Navigation Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '2rem' }}>
        <button
          onClick={() => {
            setPinContext('orders');
            setShowPinPrompt(true);
          }}
          className="bartender-button"
          aria-label="Enter PIN for Drink Orders"
        >
          <img src="/skull.svg" alt="Drink Orders" />
        </button>

        <button
          onClick={() => {
            setPinContext('inventory');
            setShowPinPrompt(true);
          }}
          className="bartender-button"
          aria-label="Enter PIN for Inventory"
        >
          <img src="/skull.svg" alt="Inventory" />
        </button>

        <button
          onClick={() => {
            setPinContext('board');
            setShowPinPrompt(true);
          }}
          className="bartender-button"
          aria-label="Enter PIN for Keno Board"
        >
          <img src="/skull.svg" alt="Keno Board" />
        </button>

        <button
          onClick={() => {
            setPinContext('join');
            setShowPinPrompt(true);
          }}
          className="bartender-button"
          aria-label="Enter PIN for Player Join"
        >
          <img src="/skull.svg" alt="Player Join" />
        </button>
      </div>

      {/* PIN overlay */}
      {showPinPrompt && (
        <div className="pin-overlay">
          <div className="pin-box">
            <h3>Enter PIN</h3>
            <input
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              maxLength={4}
              className="pin-input"
            />
            {pinError && <p className="pin-error">Incorrect PIN</p>}
            <div className="pin-actions">
              <button onClick={() => {
                setShowPinPrompt(false);
                setPinInput('');
                setPinError(false);
              }}>
                Cancel
              </button>
              <button onClick={() => {
                if (pinInput === '7477') {
                  if (pinContext === 'orders') navigate('/drink-orders');
                  if (pinContext === 'inventory') navigate('/inventory');
                } else if (pinInput === '1111') {
                  if (pinContext === 'board') navigate('/casino/keno237/board');
                  if (pinContext === 'join') navigate('/casino/keno237/join');
                } else {
                  setPinError(true);
                  setTimeout(() => setPinError(false), 1500);
                }
              }}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MenuPage;


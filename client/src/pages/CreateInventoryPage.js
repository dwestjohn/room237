import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';
import { useNavigate } from 'react-router-dom';

function CreateInventoryPage() {
  // Inventory Types
  const [typeName, setTypeName] = useState('');
  const [typeActive, setTypeActive] = useState(true);
  const [types, setTypes] = useState([]);

  // Inventory
  const [inventoryName, setInventoryName] = useState('');
  const [inventoryActive, setInventoryActive] = useState(true);
  const [selectedTypeId, setSelectedTypeId] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [locations, setLocations] = useState([]);

  // Recipes
  const [vessels, setVessels] = useState([]);
  const [method, setMethod] = useState('');
  const [glassware, setGlassware] = useState('');
  const [recipeName, setRecipeName] = useState('');
  const [motto, setMotto] = useState('');
  const [selectedVesselId, setSelectedVesselId] = useState('');
  const [description, setDescription] = useState('');
  const [recipeTypes, setRecipeTypes] = useState([]);
  const [selectedRecipeTypeId, setSelectedRecipeTypeId] = useState('');

  // Recipe Ingredients
  const [selectedRecipeId, setSelectedRecipeId] = useState('');
  const [selectedIngredientTypeId, setSelectedIngredientTypeId] = useState('');
  const [ingredientQuantity, setIngredientQuantity] = useState('');
  const [allRecipes, setAllRecipes] = useState([]);

  // Delete
  const [recipeToDelete, setRecipeToDelete] = useState('');
  const [typeToDelete, setTypeToDelete] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchTypes();
    fetchLocations();
    fetchVessels();
    fetchRecipes();
    fetchRecipeTypes();
  }, []);

  const fetchRecipes = async () => {
    const res = await axios.get('/api/recipes/all');
    setAllRecipes(res.data);
  };

  const fetchTypes = async () => {
    const res = await axios.get('/api/inventory/types');
    setTypes(res.data);
  };

  const fetchLocations = async () => {
    const res = await axios.get('/api/inventory/locations');
    setLocations(res.data);
  };

  const fetchVessels = async () => {
    const res = await axios.get('/api/recipes/vessels');
    setVessels(res.data);
  };

  const fetchRecipeTypes = async () => {
    const res = await axios.get('/api/recipes/types');
    setRecipeTypes(res.data);
  };

  const handleCreateType = async () => {
    try {
      await axios.post('/api/inventory/types', {
        type_name: typeName,
        is_active: typeActive,
      });
      setTypeName('');
      setTypeActive(true);
      fetchTypes();
      alert('Type created!');
    } catch (err) {
      console.error('Error creating type:', err);
      alert('Failed to create type.');
    }
  };

  const handleCreateInventory = async () => {
    try {
      await axios.post('/api/inventory', {
        inventory_name: inventoryName,
        is_active: inventoryActive,
        type_id: selectedTypeId,
        location_id: selectedLocationId,
      });
      setInventoryName('');
      setInventoryActive(true);
      setSelectedTypeId('');
      setSelectedLocationId('');
      alert('Inventory item created!');
    } catch (err) {
      console.error('Error creating inventory item:', err);
      alert('Failed to create inventory item.');
    }
  };

  const handleCreateRecipe = async () => {
    try {
      await axios.post('/api/recipes', {
        recipe_name: recipeName,
        motto,
        vessel_id: selectedVesselId,
        description,
        recipe_type_id: selectedRecipeTypeId,
      });
      setRecipeName('');
      setMotto('');
      setSelectedVesselId('');
      setDescription('');
      setSelectedRecipeTypeId('');
      alert('Recipe created!');
      fetchRecipes();
    } catch (err) {
      console.error('Error creating recipe:', err);
      alert('Failed to create recipe');
    }
  };

  return (
    <div className="container">
      <button
        onClick={() => navigate('/inventory')}
        className="bartender-button"
        aria-label="Back to Inventory"
      >
        <img src="/skull.svg" alt="Back to Inventory" />
      </button>

      {/* Create Type */}
      <h2 className="section-title">Create New Type</h2>
      <div className="card">
        <input
          type="text"
          placeholder="Type name"
          value={typeName}
          onChange={(e) => setTypeName(e.target.value)}
        />
        <select
          value={typeActive}
          onChange={(e) => setTypeActive(e.target.value === 'true')}
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        <button className="order-button" onClick={handleCreateType}>Create Type</button>
      </div>

      {/* Create Inventory Item */}
      <h2 className="section-title section-spacer">Create Inventory Item</h2>
      <div className="card">
        <input
          type="text"
          placeholder="Inventory name"
          value={inventoryName}
          onChange={(e) => setInventoryName(e.target.value)}
        />
        <select
          value={inventoryActive}
          onChange={(e) => setInventoryActive(e.target.value === 'true')}
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        <select
          value={selectedTypeId}
          onChange={(e) => setSelectedTypeId(e.target.value)}
        >
          <option value="">-- Select Type --</option>
          {types.map((type) => (
            <option key={type.type_id} value={type.type_id}>
              {type.type_name}
            </option>
          ))}
        </select>

        <select
          value={selectedLocationId}
          onChange={(e) => setSelectedLocationId(e.target.value)}
        >
          <option value="">-- Select Location --</option>
          {locations.map((loc) => (
            <option key={loc.location_id} value={loc.location_id}>
              {loc.location_name}
            </option>
          ))}
        </select>

        <button className="order-button" onClick={handleCreateInventory}>
          Create Inventory Item
        </button>
      </div>

      {/* Create Recipe */}
      <h2 className="section-title section-spacer">Create Recipe</h2>
      <div className="card">
        <input
          type="text"
          placeholder="Recipe name"
          value={recipeName}
          onChange={(e) => setRecipeName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Motto"
          value={motto}
          onChange={(e) => setMotto(e.target.value)}
        />

        <select
          value={selectedVesselId}
          onChange={(e) => setSelectedVesselId(e.target.value)}
        >
          <option value="">-- Select Method + Glassware --</option>
          {vessels.map((v) => (
            <option key={v.vessel_id} value={v.vessel_id}>
              {v.method} – {v.glassware}
            </option>
          ))}
        </select>

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />

        <select
          value={selectedRecipeTypeId}
          onChange={(e) => setSelectedRecipeTypeId(e.target.value)}
        >
          <option value="">-- Select Recipe Type --</option>
          {recipeTypes.map((t) => (
            <option key={t.recipe_type_id} value={t.recipe_type_id}>
              {t.type_name}
            </option>
          ))}
        </select>

        <button className="order-button" onClick={handleCreateRecipe}>
          Create Recipe
        </button>
      </div>

      {/* Create Vessel Pairing */}
      <h2 className="section-title section-spacer">Create Vessel Pairing</h2>
      <div className="card">
        <input
          type="text"
          placeholder="Method"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        />
        <input
          type="text"
          placeholder="Glassware"
          value={glassware}
          onChange={(e) => setGlassware(e.target.value)}
        />
        <button className="order-button" onClick={async () => {
          try {
            await axios.post('/api/recipes/vessels', { method, glassware });
            setMethod('');
            setGlassware('');
            fetchVessels();
            alert('Vessel pairing created!');
          } catch (err) {
            console.error('Error creating vessel:', err);
            alert('Failed to create vessel pairing');
          }
        }}>
          Create Vessel Pairing
        </button>
      </div>

      {/* Create Recipe Ingredient */}
      <h2 className="section-title section-spacer">Create Recipe Ingredient</h2>
      <div className="card">
        <select
          value={selectedRecipeId}
          onChange={(e) => setSelectedRecipeId(e.target.value)}
        >
          <option value="">-- Select Recipe --</option>
          {allRecipes.map((recipe) => (
            <option key={recipe.recipe_id} value={recipe.recipe_id}>
              {recipe.recipe_name}
            </option>
          ))}
        </select>

        <select
          value={selectedIngredientTypeId}
          onChange={(e) => setSelectedIngredientTypeId(e.target.value)}
        >
          <option value="">-- Select Type --</option>
          {types.map((type) => (
            <option key={type.type_id} value={type.type_id}>
              {type.type_name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Quantity (e.g., 2 oz)"
          value={ingredientQuantity}
          onChange={(e) => setIngredientQuantity(e.target.value)}
        />

        <button className="order-button" onClick={async () => {
          try {
            if (!selectedRecipeId || !selectedIngredientTypeId || !ingredientQuantity) {
              alert('Please fill out all fields');
              return;
            }
            await axios.post('/api/recipes/ingredients', {
              recipe_id: selectedRecipeId,
              quantity: ingredientQuantity,
              type_id: selectedIngredientTypeId
            });
            setSelectedRecipeId('');
            setSelectedIngredientTypeId('');
            setIngredientQuantity('');
            alert('Recipe Ingredient created!');
          } catch (err) {
            console.error('Error creating recipe ingredient:', err);
            alert('Failed to create recipe ingredient.');
          }
        }}>
          Create Recipe Ingredient
        </button>
      </div>

      {/* Delete Recipe */}
      <h2 className="section-title section-spacer">Delete Recipe</h2>
      <div className="card">
        <select
          value={recipeToDelete}
          onChange={(e) => setRecipeToDelete(e.target.value)}
        >
          <option value="">-- Select Recipe to Delete --</option>
          {allRecipes.map((recipe) => (
            <option key={recipe.recipe_id} value={recipe.recipe_id}>
              {recipe.recipe_name}
            </option>
          ))}
        </select>

        <button className="order-button" onClick={async () => {
          if (!recipeToDelete) {
            alert('Please select a recipe to delete');
            return;
          }
          if (!window.confirm('Are you sure you want to delete this recipe and all its ingredients?')) {
            return;
          }
          try {
            await axios.delete(`/api/recipes/${recipeToDelete}`);
            alert('Recipe deleted!');
            setRecipeToDelete('');
            fetchRecipes();
          } catch (err) {
            console.error('Error deleting recipe:', err);
            alert('Failed to delete recipe.');
          }
        }}>
          Delete Recipe
        </button>
      </div>

      {/* Delete Type */}
      <h2 className="section-title section-spacer">Delete Type</h2>
      <div className="card">
        <select
          value={typeToDelete}
          onChange={(e) => setTypeToDelete(e.target.value)}
        >
          <option value="">-- Select Type to Delete --</option>
          {types.map((type) => (
            <option key={type.type_id} value={type.type_id}>
              {type.type_name}
            </option>
          ))}
        </select>

        <button className="order-button" onClick={async () => {
          if (!typeToDelete) {
            alert('Please select a type to delete');
            return;
          }
          if (!window.confirm('Are you sure you want to delete this type? This could affect inventory or recipes!')) {
            return;
          }
          try {
            await axios.delete(`/api/inventory/types/${typeToDelete}`);
            alert('Type deleted!');
            setTypeToDelete('');
            fetchTypes();
          } catch (err) {
            console.error('Error deleting type:', err);
            alert('Failed to delete type. Check inventory to make sure no items are linked to the type.');
          }
        }}>
          Delete Type
        </button>
      </div>
    </div>
  );
}

export default CreateInventoryPage;

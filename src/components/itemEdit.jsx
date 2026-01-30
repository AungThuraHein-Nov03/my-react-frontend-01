import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./item.css";

export function ItemEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const itemNameRef = useRef();
  const itemCategoryRef = useRef();
  const itemPriceRef = useRef();
  const itemStatusRef = useRef();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadItem() {
      try {
        const response = await fetch(`http://localhost:3000/api/item/${id}`);
        if (!response.ok) throw new Error("Item not found");
        const data = await response.json();
        
        // Use refs or state to populate. Since we use refs for input:
        if (itemNameRef.current) itemNameRef.current.value = data.itemName;
        if (itemCategoryRef.current) itemCategoryRef.current.value = data.itemCategory;
        if (itemPriceRef.current) itemPriceRef.current.value = data.itemPrice;
        if (itemStatusRef.current) itemStatusRef.current.value = data.status || "ACTIVE";
        
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Failed to load item");
        navigate("/items");
      }
    }
    loadItem();
  }, [id, navigate]);

  async function onSave() {
    const uri = `http://localhost:3000/api/item/${id}`;
    const body = {
      itemName: itemNameRef.current.value,
      itemCategory: itemCategoryRef.current.value,
      itemPrice: itemPriceRef.current.value,
      status: itemStatusRef.current.value
    };

    try {
      const result = await fetch(uri, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });
      
      if (result.ok) {
        alert("Item updated successfully");
        navigate("/items");
      } else {
        alert("Failed to update item");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating item");
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="edit-container">
        <h3>Edit Item</h3>
      <div className="edit-form">
        <div>
          <label>Name:</label>
          <input 
            type="text" 
            ref={itemNameRef} 
            className="edit-input"
          />
        </div>
        <div>
          <label>Category:</label>
          <input 
            type="text"
            ref={itemCategoryRef}
            className="edit-input"
          />
        </div>
        <div>
          <label>Price:</label>
          <input 
            type="number" 
            ref={itemPriceRef} 
            className="edit-input"
          />
        </div>
        <div>
          <label>Status:</label>
          <select 
            ref={itemStatusRef}
            className="edit-input"
          >
             <option value="ACTIVE">ACTIVE</option>
             <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>
        <div className="edit-actions">
            <button 
                onClick={onSave}
                className="save-btn"
            >
                Save
            </button>
            <Link 
                to="/items"
                className="cancel-btn"
            >
                Cancel
            </Link>
        </div>
      </div>
    </div>
  );
}

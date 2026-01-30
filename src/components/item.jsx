import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./item.css";

export function Items() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const PAGE_SIZE = 5;
  
  const itemNameRef = useRef();
  const itemCategoryRef = useRef();
  const itemPriceRef = useRef();
  const itemStatusRef = useRef();

  useEffect(() => {
    async function loadItems() {
      try {
        const response = await fetch(`http://localhost:3000/api/item?page=${page}&limit=${PAGE_SIZE}`);
        const data = await response.json();
        if (data.items) {
          setItems(data.items);
          setTotalPages(data.totalPages || 1);
        } else {
          setItems(Array.isArray(data) ? data : []);
          setTotalPages(1);
        }
      } catch (err) {
        console.error("Failed to load items", err);
      }
    }
    loadItems();
  }, [page, refreshTrigger]);

  async function deleteItem(id) {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    
    try {
      const response = await fetch(`http://localhost:3000/api/item/${id}`, {
        method: "DELETE"
      });
      
      if (response.ok) {
        setRefreshTrigger(t => t + 1);
      } else {
        alert("Failed to delete item");
      }
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  }

  async function onItemSave() {
    const uri = "http://localhost:3000/api/item";
    const body = {
      itemName: itemNameRef.current.value,
      itemCategory: itemCategoryRef.current.value,
      itemPrice: itemPriceRef.current.value,
      status: itemStatusRef.current.value
    };

    try {
      const result = await fetch(uri, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });
      
      const data = await result.json();
      console.log("Item saved:", data);
      
      // Clear inputs
      itemNameRef.current.value = "";
      itemPriceRef.current.value = "";
      // Category is now input text, clear it too? The ref was reused or maybe just inputs.
      if (itemCategoryRef.current) itemCategoryRef.current.value = "";
      
      // Refresh list
      setRefreshTrigger(t => t + 1);
    } catch (err) {
      console.error("Error saving item:", err);
      alert("Failed to save item");
    }
  }

  return (
    <div className="item-container">
      <h3>Items Management</h3>
      <table className="item-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item._id}>
              <td>{(page - 1) * PAGE_SIZE + index + 1}</td>
              <td>{item.itemName}</td>
              <td>{item.itemCategory}</td>
              <td>{item.itemPrice}</td>
              <td>{item.status}</td>
              <td>
                <Link to={`/items/${item._id}`} className="edit-link">Edit</Link>
                <button 
                  onClick={() => deleteItem(item._id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          <tr className="new-item-row">
            <td>New</td>
            <td>
              <input 
                type="text" 
                ref={itemNameRef} 
                placeholder="Item Name"
                className="item-input"
              />
            </td>
            <td>
              <input 
                type="text" 
                ref={itemCategoryRef} 
                placeholder="Category"
                className="item-input"
              />
            </td>
            <td>
              <input 
                type="number" 
                ref={itemPriceRef} 
                placeholder="Price"
                className="item-input"
              />
            </td>
            <td>
              <select ref={itemStatusRef} className="item-input">
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </td>
            <td>
              <button 
                onClick={onItemSave}
                className="add-btn"
              >
                Add Item
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div className="pagination-container">
        <button 
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="pagination-btn"
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button 
          onClick={() => setPage(p => p + 1)}
          disabled={page >= totalPages} 
          className="pagination-btn"
        >
          Next
        </button>
      </div>
    </div>
  );
} 

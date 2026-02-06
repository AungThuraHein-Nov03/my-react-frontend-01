import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./item.css";

export function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const usernameRef = useRef();
  const emailRef = useRef();
  const firstnameRef = useRef();
  const lastnameRef = useRef();
  const statusRef = useRef();
  const passwordRef = useRef(); // Optional password update
  const confirmPasswordRef = useRef();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch(`http://localhost:3000/api/user/${id}`);
        if (!response.ok) throw new Error("User not found");
        const data = await response.json();

        if (usernameRef.current) usernameRef.current.value = data.username || "";
        if (emailRef.current) emailRef.current.value = data.email || "";
        if (firstnameRef.current) firstnameRef.current.value = data.firstname || "";
        if (lastnameRef.current) lastnameRef.current.value = data.lastname || "";
        if (statusRef.current) statusRef.current.value = data.status || "ACTIVE";
        
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Failed to load user");
        navigate("/users");
      }
    }
    loadUser();
  }, [id, navigate]);

  async function onSave() {
    const uri = `http://localhost:3000/api/user/${id}`;
    const body = {
      username: usernameRef.current.value,
      email: emailRef.current.value,
      firstname: firstnameRef.current.value,
      lastname: lastnameRef.current.value,
      status: statusRef.current.value
    };
    
    // Only include password if user typed something
    if (passwordRef.current && passwordRef.current.value) {
        if (passwordRef.current.value !== confirmPasswordRef.current.value) {
            alert("Passwords do not match!");
            return;
        }
        body.password = passwordRef.current.value;
    }

    try {
      const result = await fetch(uri, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });
      
      const data = await result.json();

      if (result.ok) {
        alert("User updated successfully");
        navigate("/users");
      } else {
        alert(data.message || "Failed to update user");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating user");
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="edit-container">
      <h3>Edit User</h3>
      <div className="edit-form">
        <div>
          <label>Username:</label>
          <input type="text" ref={usernameRef} className="edit-input" />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" ref={emailRef} className="edit-input" />
        </div>
        <div>
          <label>First Name:</label>
          <input type="text" ref={firstnameRef} className="edit-input" />
        </div>
        <div>
          <label>Last Name:</label>
          <input type="text" ref={lastnameRef} className="edit-input" />
        </div>
        <div>
          <label>Status:</label>
          <select ref={statusRef} className="edit-input">
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>
        <div>
          <label>New Password (Leave blank to keep current):</label>
          <input type="password" ref={passwordRef} className="edit-input" placeholder="New Password" />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input type="password" ref={confirmPasswordRef} className="edit-input" placeholder="Confirm Password" />
        </div>
        <div className="edit-actions">
          <button onClick={onSave} className="save-btn">Save</button>
          <Link to="/users" className="cancel-btn">Cancel</Link>
        </div>
      </div>
    </div>
  );
}

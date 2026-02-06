import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./item.css"; // Reusing item css for table styles

export function UserList() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const PAGE_SIZE = 10;

  // Refs for new user creation
  const usernameRef = useRef();
  const passwordRef = useRef(); // Only for creation
  const emailRef = useRef();
  const firstnameRef = useRef();
  const lastnameRef = useRef();
  const statusRef = useRef();

  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await fetch(`http://localhost:3000/api/user?page=${page}&limit=${PAGE_SIZE}`);
        const data = await response.json();
        if (data.users) {
          setUsers(data.users);
          setTotalPages(data.totalPages || 1);
        } else {
          setUsers([]);
          setTotalPages(1);
        }
      } catch (err) {
        console.error("Failed to load users", err);
      }
    }
    loadUsers();
  }, [page, refreshTrigger]);

  async function deleteUser(id) {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`http://localhost:3000/api/user/${id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        setRefreshTrigger(t => t + 1);
      } else {
        alert("Failed to delete user");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  }

  async function onUserSave() {
    const uri = "http://localhost:3000/api/user";
    const body = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
      email: emailRef.current.value,
      firstname: firstnameRef.current.value,
      lastname: lastnameRef.current.value,
      status: statusRef.current.value || "ACTIVE"
    };

    if (!body.username || !body.password || !body.email) {
        alert("Username, Email and Password are required");
        return;
    }

    try {
      const result = await fetch(uri, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      const data = await result.json();
      
      if (!result.ok) {
          alert(data.message || "Failed to create user");
          return;
      }
      
      alert("User created successfully");

      // Clear inputs
      if (usernameRef.current) usernameRef.current.value = "";
      if (passwordRef.current) passwordRef.current.value = "";
      if (emailRef.current) emailRef.current.value = "";
      if (firstnameRef.current) firstnameRef.current.value = "";
      if (lastnameRef.current) lastnameRef.current.value = "";
      if (statusRef.current) statusRef.current.value = "ACTIVE";

      // Refresh list
      setRefreshTrigger(t => t + 1);
    } catch (err) {
      console.error("Error creating user:", err);
      alert("Failed to create user");
    }
  }

  return (
    <div className="item-container">
      <h3>User Management</h3>
      <table className="item-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Username</th>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id}>
              <td>{(page - 1) * PAGE_SIZE + index + 1}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.firstname}</td>
              <td>{user.lastname}</td>
              <td>{user.status}</td>
              <td>
                <Link to={`/users/${user._id}`} className="edit-link">Edit</Link>
                <button
                  onClick={() => deleteUser(user._id)}
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
              <input ref={usernameRef} type="text" placeholder="Username" className="item-input" />
            </td>
            <td>
              <input ref={emailRef} type="email" placeholder="Email" className="item-input" />
            </td>
            <td>
              <input ref={firstnameRef} type="text" placeholder="First Name" className="item-input" />
            </td>
            <td>
              <input ref={lastnameRef} type="text" placeholder="Last Name" className="item-input" />
            </td>
            <td>
              <select ref={statusRef} className="item-input">
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </td>
            <td>
               {/* Password field is tricky in a row like this, maybe add it as a separate or implicitly handled. 
                   I'll add it here for simplicity as it is just an assignment. */}
               <input ref={passwordRef} type="password" placeholder="Password" className="item-input" style={{width: '80px', marginRight: '5px'}}/>
               <button onClick={onUserSave} className="add-btn">Add</button>
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

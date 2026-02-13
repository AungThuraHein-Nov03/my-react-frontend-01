import { useUser } from "../context/UserProvider";
import { useEffect, useState } from "react";
import "./Profile.css";

export default function Profile() {
  const { user, logout } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});
  const [file, setFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ firstname: "", lastname: "" });
  const API_URL = import.meta.env.VITE_API_URL;

  async function fetchProfile() {
    try {
      const result = await fetch(`${API_URL}/api/user/profile`, {
        credentials: "include",
      });
      if (result.status === 401) {
        logout();
      } else {
        const data = await result.json();
        console.log("data: ", data);
        setIsLoading(false);
        setData(data);
        setFormData({ firstname: data.firstname || "", lastname: data.lastname || "" });
      }
    } catch (error) {
      console.error("Failed to fetch profile", error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    if (!formData.firstname && !formData.lastname) {
      alert("At least one field must be filled");
      return;
    }

    try {
      const result = await fetch(`${API_URL}/api/user/profile`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (result.ok) {
        alert("Profile updated successfully!");
        setIsEditing(false);
        fetchProfile();
      } else {
        const errorData = await result.json();
        alert(`Failed to update profile: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Update profile error:", error);
      alert("An error occurred during profile update.");
    }
  };

  const handleCancelEdit = () => {
    setFormData({ firstname: data.firstname || "", lastname: data.lastname || "" });
    setIsEditing(false);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await fetch(`${API_URL}/api/user/profile/image`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (result.ok) {
        alert("Image uploaded successfully!");
        setFile(null);
        // Clear the file input visually
        const fileInput = document.getElementById("fileInput");
        if (fileInput) fileInput.value = "";
        fetchProfile();
      } else {
        const errorData = await result.json();
        alert(`Failed to upload image: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred during upload.");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete your profile image?")) return;

    try {
      const result = await fetch(`${API_URL}/api/user/profile/image`, {
        method: "DELETE",
        credentials: "include",
      });

      if (result.ok) {
        alert("Image deleted successfully!");
        fetchProfile();
      } else {
        alert("Failed to delete image");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("An error occurred during deletion.");
    }
  };

  return (
    <div className="profile-page-wrapper">
      <div className="profile-container">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
        <div>
          <div className="profile-image-container">
            {data.profileImage ? (
              <img
                src={`${API_URL}${data.profileImage}`}
                alt="Profile"
                className="profile-image"
              />
            ) : (
              <div className="profile-placeholder">
                {data.firstname ? data.firstname[0].toUpperCase() : "?"}
              </div>
            )}
          </div>

          {!isEditing ? (
            <div className="profile-details">
              <h2 className="profile-name">
                {data.firstname || "No Name"} {data.lastname}
              </h2>
              <div className="profile-email">{data.email}</div>
              <div className="profile-id">ID: {data._id}</div>
              
              <div className="profile-actions">
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="btn btn-primary"
                >
                  Edit Profile
                </button>
                {data.profileImage && (
                  <button 
                    onClick={handleDelete} 
                    className="btn btn-danger"
                  >
                    Delete Image
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="edit-form">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="profile-actions" style={{ justifyContent: 'flex-start' }}>
                <button 
                  onClick={handleSaveProfile} 
                  className="btn btn-success"
                >
                  Save
                </button>
                <button 
                  onClick={handleCancelEdit} 
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="file-upload-wrapper">
            <span className="file-upload-label">Update Profile Picture</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <button
                onClick={handleUpload}
                disabled={!file}
                className="btn btn-success"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

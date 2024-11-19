import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../App';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [newProfileUrl, setNewProfileUrl] = useState('');
  const [editProfilePicture, setEditProfilePicture] = useState(false);

  // Check localStorage for user data on component mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    } else {
      navigate('/login');
    }
  }, [setUser, navigate]);

  // Handle changing the profile picture
  const handleProfileChange = () => {
    if (!newProfileUrl) {
      alert('Please provide a new profile URL.');
      return;
    }

    const updatedUser = { ...user, profileUrl: newProfileUrl };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setNewProfileUrl('');
    setEditProfilePicture(false);  // Close the input field after saving
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      {user && (
        <div className="user-info">
          <img src={user.profileUrl || 'default-profile-pic.png'} alt="Profile" className="profile-pic" />
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>

          {/* Change profile picture button or input */}
          {!editProfilePicture ? (
            <button onClick={() => setEditProfilePicture(true)}>Change Profile Picture</button>
          ) : (
            <div className="edit-profile-modal">
              <input
                type="text"
                placeholder="Enter new profile URL"
                value={newProfileUrl}
                onChange={(e) => setNewProfileUrl(e.target.value)}
              />
              <button onClick={handleProfileChange}>Save</button>
              <button onClick={() => setEditProfilePicture(false)}>Cancel</button>
            </div>
          )}
        </div>
      )}

      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </div>
  );
}

export default Profile;

import React, { useState, useEffect } from 'react';
import Modal from './Modal'; // Import the modal component
import { api } from '../utils/Api';

function Home() {
  const [users, setUsers] = useState([]); // List of users
  const [places, setPlaces] = useState([]); // List of all places
  const [selectedUser, setSelectedUser] = useState(null); // Track the selected user
  const [showModal, setShowModal] = useState(false); // Track if modal is visible
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track any error

  // Fetch users and places from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await api.getUsers(); // Get users from the API
        setUsers(data); // Update users state
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load users.');
        setLoading(false);
      }
    };

    const fetchPlaces = async () => {
      try {
        const data = await api.getPlaces(); // Get places from the API
        setPlaces(data); // Update places state
      } catch (error) {
        console.error('Error fetching places:', error);
      }
    };

    fetchUsers(); // Fetch users
    fetchPlaces(); // Fetch places
  }, []);

  // Function to handle user selection
  const handleUserSelect = (user) => {
    setSelectedUser(user); // Set the selected user
    setShowModal(true); // Open the modal
  };

  // Close the modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null); // Clear selected user
  };

  // Filter places based on selected user
  const filteredPlaces = selectedUser
    ? places.filter(place => place.userId === selectedUser.id) // Filter by user ID
    : [];

  if (loading) return <p>Loading users...</p>; // Show loading state while fetching users
  if (error) return <p>{error}</p>; // Show error if the API request fails

  return (
    <div>
      <h1>Welcome!</h1>
      <p>Discover and share amazing places with friends!</p>

      {/* List of Users */}
      <h2>List of Users</h2>
      {users.length > 0 ? (
        <div className="user-cards-container">
          {users.map((user) => (
            <div
              key={user.id}
              className="user-card"
              onClick={() => handleUserSelect(user)}
              style={{ cursor: 'pointer' }}
            >
              <div className="user-profile">
                <img
                  src={user.profileUrl || 'default-profile-pic.png'} // Use a default image if no profile picture exists
                  alt={user.name}
                  className="profile-pic"
                />
                <h3>{user.name}</h3>
                <p><strong>Email:</strong> {user.email}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No users found.</p>
      )}

      {/* Modal to Show Shared Places for Selected User */}
      {selectedUser && (
        <Modal 
          show={showModal} 
          handleClose={handleCloseModal} 
          user={selectedUser} 
          places={filteredPlaces} 
        />
      )}
    </div>
  );
}

export default Home;

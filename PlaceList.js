import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { UserContext } from '../App';
import { api } from '../utils/Api'; // Import the api methods

function PlaceList() {
  const [places, setPlaces] = useState([]);
  const { user } = useContext(UserContext); // Access user context
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      navigate('/login');
    } else {
      fetchPlaces();
    }
  }, [user, navigate]);

  // Fetch places for the logged-in user from the API
  const fetchPlaces = async () => {
    try {
      const data = await api.getPlaces(); // Fetch places from API
      setPlaces(data); // Set the places data to the state
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };

  const handleDelete = async (placeId) => {
    try {
      // Send DELETE request to the API
      await api.deletePlace(placeId);
      // Remove the deleted place from state
      setPlaces(places.filter(place => place.id !== placeId));
    } catch (error) {
      console.error("Error deleting place:", error);
    }
  };

  const handleAddPlace = () => {
     navigate('/share'); 
     fetchPlaces();  // Pass onPlaceShared to refresh the list after sharing
  };

  const handleUpdatePlace = (place) => {
    navigate('/share', { state: { place, isUpdate: true } });
  };

  // Retrieve user information for each place
  const getUserNameById = (userId) => {
    if (user && user.id === userId) {
      return user.username; // Return current user's username
    }
    return "Unknown User"; // Fallback if user is not found
  };

  return (
    <div className="place-list-container">
      <h2>Your Places</h2>
      <button onClick={handleAddPlace} className="add-place-btn">Add Place</button> 
      {places.length > 0 ? (
        <ul className="place-list">
          {places.map((place) => (
            <li key={place.id} className="place-item">
              <div className="place-info">
                <h3>{place.place}</h3>
                <p>Shared by: {getUserNameById(place.userId)}</p> {/* Display the username */}
                {place.lat !== undefined && place.lng !== undefined ? (
                  <p>Coordinates: {place.lat.toFixed(4)}, {place.lng.toFixed(4)}</p>
                ) : (
                  <p>Coordinates: Not available</p>
                )}
              </div>
              <div className="place-image">
                {place.imageUrl && <img src={place.imageUrl} alt={place.place} />}
              </div>
              <div class='buttons'>
                <button onClick={() => handleUpdatePlace(place)} className="update-btn">Update</button> {/* Update Button */}
                <button onClick={() => handleDelete(place.id)} className="delete-btn">Delete</button>
              </div>
              
            </li>
          ))}
        </ul>
      ) : (
        <p>You have not shared any places yet.</p>
      )}
    </div>
  );
}

export default PlaceList;

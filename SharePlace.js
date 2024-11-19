import React, { useState, useEffect, useContext, useRef } from 'react';
import { UserContext } from '../App';
import { useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { api } from '../utils/Api'; // Import the api methods

// Fixing the Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function SharePlace() {
  const { user } = useContext(UserContext);
  const [place, setPlace] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [coordinates, setCoordinates] = useState([0, 0]);
  const [zoom, setZoom] = useState(2);
  const mapRef = useRef();
  
  const location = useLocation();
  const isUpdate = location.state?.isUpdate;
  const existingPlace = location.state?.place;
  const onPlaceShared = location.state?.onPlaceShared;

  // Preload the existing place data for update
  useEffect(() => {
    if (isUpdate && existingPlace) {
      setPlace(existingPlace.place);
      setImageUrl(existingPlace.imageUrl);
      setCoordinates([existingPlace.lat, existingPlace.lng]);
      setZoom(13); // Zoom in on the place for editing
    }
  }, [isUpdate, existingPlace]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setCoordinates([parseFloat(lat), parseFloat(lon)]);
        setZoom(13); // Zoom into the found location
      } else {
        alert('Location not found. Please try a different name.');
      }
    } catch (error) {
      console.error('Error searching for location:', error);
      alert('An error occurred while searching for the location.');
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please log in to share a place.');
      return;
    }

    const updatedPlace = {
      place: place || existingPlace?.place,  // If the place is empty, retain the old one
      imageUrl: imageUrl || existingPlace?.imageUrl,  // Same with the imageUrl
      lat: coordinates[0] !== 0 ? coordinates[0] : existingPlace?.lat, // Only update if changed
      lng: coordinates[1] !== 0 ? coordinates[1] : existingPlace?.lng, // Only update if changed
      userId: user.id
    };

    try {
      if (isUpdate && existingPlace) {
        // Update place via API
        await api.updatePlace(existingPlace.id, updatedPlace);
      } else {
        // Add new place via API
        await api.addPlace(updatedPlace);
      }

      // Clear the form after saving
      setPlace('');
      setImageUrl('');
      setCoordinates([0, 0]);
      setZoom(2);
      alert('Place shared successfully!');

      // Refresh the places list in the parent component (PlaceList)
      if (onPlaceShared) {
        onPlaceShared();  // Assuming onPlaceShared is passed as a prop to refresh the list
      }

    } catch (error) {
      console.error('Error sharing place:', error);
      alert('An error occurred while sharing the place.');
    }
  };

  // Map click handler to update coordinates
  function MapClickHandler() {
    const map = useMapEvents({
      async click(e) {
        const { lat, lng } = e.latlng;
        setCoordinates([lat, lng]); // Set the clicked coordinates
        setZoom(13); // Zoom into the clicked area

        // Reverse geocoding to get place name from coordinates
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          const data = await response.json();
          if (data && data.display_name) {
            setPlace(data.display_name); // Set place name from reverse geocoding
          } else {
            setPlace('Unnamed Location'); // Fallback in case of no name
          }
        } catch (error) {
          console.error('Error fetching place name:', error);
          setPlace('Unnamed Location'); // Fallback
        }
      },
    });
    return null;
  }

  return (
    <div className="share-place-container">
      <h2>{isUpdate ? 'Update Place' : 'Share a Place'}</h2>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Enter place name"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          required
        />
        <button type="submit">Search</button>
      </form>

      <p>Selected Place: {place}</p>
      <p>Coordinates: {coordinates[0].toFixed(6)}, {coordinates[1].toFixed(6)}</p>

      <MapContainer
        center={coordinates}
        zoom={zoom}
        style={{ height: '400px', width: '100%' }}
        whenCreated={(map) => { mapRef.current = map; }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler />
        <Marker position={coordinates} />
      </MapContainer>

      <form onSubmit={handleShare} className="share-form">
        <input
          type="url"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <button type="submit">{isUpdate ? 'Update Place' : 'Share Place'}</button>
      </form>
    </div>
  );
}

export default SharePlace;

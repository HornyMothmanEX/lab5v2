import React from 'react';

function Modal({ show, handleClose, user, places }) {
  if (!show) {
    return null; // If the modal is not active, don't render anything
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{user.name}'s Shared Places</h3>
        {places.length > 0 ? (
          <ul className="place-list">
            {places.map((place, index) => (
              <li key={index} className="place-item">
                <div className="place-info">
                  <h4>{place.place}</h4>
                  {place.lat !== undefined && place.lng !== undefined ? (
                    <p>Coordinates: {place.lat.toFixed(4)}, {place.lng.toFixed(4)}</p>
                  ) : (
                    <p>Coordinates: Not available</p>
                  )}
                </div>
                <div className="place-image">
                  {place.imageUrl && <img src={place.imageUrl} alt={place.place} />}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>{user.name} has not shared any places yet.</p>
        )}
        <button onClick={handleClose} className="close-btn">Close</button>
      </div>
    </div>
  );
}

export default Modal;

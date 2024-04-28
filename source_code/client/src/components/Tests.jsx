import React, { useState, useEffect } from 'react';
import { Map, Marker, InfoWindow, GoogleApiWrapper } from 'google-maps-react';
import axios from 'axios';

const Tests = ({ productId, google, handlePlaceName }) => {
  const [placename, setPlacename] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationResults, setLocationResults] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    setPlacename(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

      const response = await axios.patch(
        `http://localhost:8000/admin-seller/myproduct/${productId}`,
        { placename }
      );
      console.log(response.data);
      if (typeof handlePlaceName === 'function') {
        handlePlaceName(placename); // Pass the updated placename to parent component
      }
      setSuccessMessage('Location updated successfully'); // Set success message
    } catch (error) {
      console.error('Error updating placename:', error.message);
      setError('Failed to update placename');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery.trim() !== '') {
      const placesService = new google.maps.places.AutocompleteService();
      placesService.getQueryPredictions({ input: searchQuery }, (results, status) => {
        if (status === 'OK' && results) {
          setLocationResults(results);
        }
      });
    } else {
      setLocationResults([]);
    }
  }, [searchQuery, google]);

  const handleMarkerClick = (props, marker, e) => {
    setSelectedPlace(props);
    fetchLocationName(e.latLng.lat(), e.latLng.lng());
  };

  const fetchLocationName = (lat, lng) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        setSearchQuery(results[0].formatted_address);
        if (typeof handlePlaceName === 'function') {
          handlePlaceName(results[0].formatted_address);
        }
      } else {
        console.log('Location Name not found.');
      }
    });
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSelect = (place) => {
    setPlacename(place.description); // Update the input field value with the selected place
    setLocationResults([]);
    const placesService = new google.maps.places.PlacesService(document.createElement('div'));
    placesService.textSearch({ query: place.description }, (results, status) => {
      if (status === 'OK' && results && results.length > 0) {
        const firstResult = results[0];
        setSelectedPlace({ name: firstResult.name, position: firstResult.geometry.location }); // Update selected place with coordinates
        fetchLocationName(firstResult.geometry.location.lat(), firstResult.geometry.location.lng());
      } else {
        console.log('Location not found.');
      }
    });
  };

  const handleInfoWindowClose = () => {
    setSelectedPlace(null);
  };

  return (
    <div className="form-group">
      <div style={{ marginBottom: '10px' }}>
        {successMessage && <div style={{ height: "2rem", width: "100%", borderRadius: "10px", textAlign: "center", marginLeft: '.2rem', color: "white", background: "#cbe9bf", border: "white", marginBottom: "1rem", paddingB: "10px", paddingTop: "10px" }}>{successMessage}</div>}
        <span class="label label-default ml-1 mt-5">Enter Place Name</span>
        <input type="text" name="placename" value={placename} onChange={handleInputChange} placeholder="Search location" style={{ height: "2rem", width: "100%", borderRadius: "10px", border: "gray", padding: "5px" }} />
        <button type="button" className="mt-3" onClick={handleSubmit} style={{ height: "2rem", width: "100%", borderRadius: "10px", textAlign: "center", marginLeft: '.2rem', color: "white", background: "#7e5888", border: "white", marginBottom: "1rem" }}>Update Location</button>
        <ul style={{ cursor: "pointer", listStyle: "none" }}>
          {locationResults.map((result) => (
            <li key={result.id} onClick={() => handleSearchSelect(result)} style={{ cursor: "pointer" }}>
              {result.description}
            </li>
          ))}
        </ul>
      </div>
      {/* Display success message */}
      <div>
        <Map google={google} zoom={14} initialCenter={{ lat: 37.7749, lng: -122.4194 }} onClick={handleMarkerClick} style={{ width: '100%', height: '400px' }}>
          {selectedPlace && <Marker position={selectedPlace.position} name={selectedPlace.name || 'Selected location'} />}
          <InfoWindow onClose={handleInfoWindowClose} visible={!!selectedPlace} position={selectedPlace && selectedPlace.position}>
            <div>
              <h1>{selectedPlace && selectedPlace.name}</h1>
            </div>
          </InfoWindow>
        </Map>
      </div>
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCJuXjrVG16GdwXjHaktlXhO_A_UsR-HMk',
})(Tests);

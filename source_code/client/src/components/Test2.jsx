import React, { useState, useEffect } from 'react';
import { Map, Marker, InfoWindow, GoogleApiWrapper } from 'google-maps-react';

const Test2 = ({ google, handlePlaceName, handleDataSend, handleCloseModal   }) => {
  const [placename, setPlacename] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationResults, setLocationResults] = useState([]);
  const [nearestPlaces, setNearestPlaces] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);

  const handleInputChange = (e) => {
    setPlacename(e.target.value);
  };
  const handleSendData = () => {
    // Call the parent component's function to send data
    handleDataSend({ placename, nearestPlaces });
    handleCloseModal();
  };
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          setSelectedPlace({ name: 'Live location', position: { lat: latitude, lng: longitude } });
          fetchNearbyPlaces({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Error fetching current location:', error.message);
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }, []);
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
    setSelectedPlace({ name: props.name, position: props.position });
    setPlacename(props.name);
    fetchLocationName(props.position);
    fetchNearbyPlaces(props.position);
  };

  const fetchLocationName = (location) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location }, (results, status) => {
      if (status === 'OK' && results && results.length > 0) {
        setPlacename(results[0].formatted_address);
      } else {
        console.log('Location name not found.');
      }
    });
  };

  const fetchNearbyPlaces = (location) => {
    const placesService = new google.maps.places.PlacesService(document.createElement('div'));
    placesService.nearbySearch(
      {
        location,
        radius: 500,
        type: ['establishment'],
      },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          setNearestPlaces(results);
        } else {
          console.error('Error fetching nearby places:', status);
        }
      }
    );
  };

  const handleInfoWindowClose = () => {
    setSelectedPlace(null);
  };

  const handleMapClick = (mapProps, map, clickEvent) => {
    const { latLng } = clickEvent;
    setSelectedPlace({ name: 'Selected location', position: latLng });
    setPlacename('Selected location');
    fetchLocationName({ lat: latLng.lat(), lng: latLng.lng() });
    fetchNearbyPlaces({ lat: latLng.lat(), lng: latLng.lng() });
  };

  return (
    <div className="form-group">
      <div style={{ marginBottom: '10px' }}>
        <span className="label label-default ml-1 mt-5">Enter Place Name</span>
        <input type="text" name="placename" value={placename} onChange={handleInputChange} placeholder="Search location" style={{ height: "2rem", width: "100%", borderRadius: "10px", border: "gray", padding: "5px" }} required />
        <button type="button" onClick={handleSendData}>Send Data to Parent</button>
        <ul style={{ cursor: "pointer", listStyle: "none" }}>
          {locationResults.map((result) => (
            <li key={result.id} onClick={() => handleSearchSelect(result)} style={{ cursor: "pointer" }}>
              {result.description}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <Map google={google} zoom={14} initialCenter={currentLocation || { lat: 37.7749, lng: -122.4194 }} onClick={handleMapClick} style={{ width: '100%', height: '200px', marginLeft: "-1rem" }}>
          {currentLocation && <Marker position={currentLocation} name="Current location" />}
          {selectedPlace && <Marker position={selectedPlace.position} name={selectedPlace.name || 'Selected location'} />}
          <InfoWindow onClose={handleInfoWindowClose} visible={!!selectedPlace} position={selectedPlace && selectedPlace.position}>
            <div>
              {/* <h1>{selectedPlace && selectedPlace.name}</h1> */}
            </div>
          </InfoWindow>
        </Map>
      </div>
      <div>
        <ul style={{ cursor: "pointer", listStyle: "none", marginTop:"220px" }}>
          <li>Nearest Places</li>
          {nearestPlaces.map((place) => (
            <li key={place.id}>
              {place.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCJuXjrVG16GdwXjHaktlXhO_A_UsR-HMk', // Replace with your Google Maps API key
})(Test2);

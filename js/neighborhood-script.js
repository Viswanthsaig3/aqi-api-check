// Neighborhood Insights Map Script

// Global variables
let map;
let currentMarker = null;
let placesList = [];
let placesService;
let geocoder;
let infoWindow;
let selectedLocation = null;

// Initialize the map
function initMap() {
  // Default location (United States center)
  const defaultLocation = { lat: 37.0902, lng: -95.7129 };
  
  // Create the map
  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultLocation,
    zoom: 4,
    mapTypeControl: true,
    streetViewControl: true,
    fullscreenControl: true,
  });
  
  // Create geocoder and places service
  geocoder = new google.maps.Geocoder();
  placesService = new google.maps.places.PlacesService(map);
  infoWindow = new google.maps.InfoWindow();
  
  // Add click event listener to the map
  map.addListener("click", (event) => {
    placeMarkerAndGetInfo(event.latLng);
  });
  
  // Set up event listeners for UI elements
  setupEventListeners();
  
  // Try HTML5 geolocation to center the map on user's location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        map.setCenter(pos);
        map.setZoom(12);
      },
      () => {
        // User denied geolocation or error occurred
        console.log("Error: The Geolocation service failed or was denied.");
      }
    );
  }
}

// Event listeners setup
function setupEventListeners() {
  // Search button
  document.getElementById("search-btn").addEventListener("click", () => {
    const locationInput = document.getElementById("location-search").value;
    searchLocation(locationInput);
  });
  
  // Enter key in search box
  document.getElementById("location-search").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const locationInput = document.getElementById("location-search").value;
      searchLocation(locationInput);
    }
  });
  
  // Amenity option clicks
  const amenityOptions = document.querySelectorAll(".amenity-option");
  amenityOptions.forEach((option) => {
    option.addEventListener("click", () => {
      // Toggle active state
      amenityOptions.forEach(opt => opt.classList.remove("active"));
      option.classList.add("active");
      
      // Search for the selected amenity type near the current marker
      if (currentMarker) {
        const amenityType = option.getAttribute("data-type");
        searchNearbyPlaces(currentMarker.getPosition(), amenityType);
      } else {
        alert("Please select a location on the map first.");
      }
    });
  });
  
  // Check AQI button
  document.getElementById("check-aqi-btn").addEventListener("click", () => {
    if (selectedLocation) {
      openAQIModal(selectedLocation);
    } else {
      alert("Please select a location on the map first.");
    }
  });
  
  // Modal close button
  document.querySelector(".close-btn").addEventListener("click", () => {
    document.getElementById("aqi-modal").style.display = "none";
  });
  
  // Click outside modal to close
  window.addEventListener("click", (event) => {
    const modal = document.getElementById("aqi-modal");
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
}

// Place marker on map and get location info
function placeMarkerAndGetInfo(latLng) {
  // Clear existing marker
  if (currentMarker) {
    currentMarker.setMap(null);
  }
  
  // Create new marker
  currentMarker = new google.maps.Marker({
    position: latLng,
    map: map,
    animation: google.maps.Animation.DROP
  });
  
  // Update selected location
  selectedLocation = {
    lat: latLng.lat(),
    lng: latLng.lng()
  };
  
  // Clear any existing place results
  clearResults();
  
  // Get address information for the clicked location
  geocoder.geocode({ location: latLng }, (results, status) => {
    if (status === "OK" && results[0]) {
      const address = results[0].formatted_address;
      
      // Extract city, state, country for AQI lookup
      let city = "";
      let state = "";
      let country = "";
      
      results[0].address_components.forEach((component) => {
        if (component.types.includes("locality")) {
          city = component.long_name;
        } else if (component.types.includes("administrative_area_level_1")) {
          state = component.long_name;
        } else if (component.types.includes("country")) {
          country = component.long_name;
        }
      });
      
      selectedLocation = {
        lat: latLng.lat(),
        lng: latLng.lng(),
        address,
        city,
        state,
        country
      };
      
      // Show info window with address
      infoWindow.setContent(`<div><strong>Location:</strong><br>${address}</div>`);
      infoWindow.open(map, currentMarker);
      
      // Center map on the marker
      map.setCenter(latLng);
      
      // If any amenity type is already selected, search for it at the new location
      const activeAmenity = document.querySelector(".amenity-option.active");
      if (activeAmenity) {
        const amenityType = activeAmenity.getAttribute("data-type");
        searchNearbyPlaces(latLng, amenityType);
      }
    } else {
      console.error("Geocoder failed due to: " + status);
    }
  });
}

// Search for a location by address or name
function searchLocation(query) {
  if (!query.trim()) return;
  
  geocoder.geocode({ address: query }, (results, status) => {
    if (status === "OK" && results[0]) {
      const location = results[0].geometry.location;
      
      // Zoom in to the location
      map.setZoom(14);
      map.setCenter(location);
      
      // Place marker at the found location
      placeMarkerAndGetInfo(location);
    } else {
      alert("Location not found. Please try a different search term.");
    }
  });
}

// Search for nearby places of a specific type
function searchNearbyPlaces(location, type) {
  // Clear previous results
  clearResults();
  
  const request = {
    location: location,
    radius: 5000, // 5km radius
    type: type
  };
  
  placesService.nearbySearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
      placesList = [];
      
      // Show the places on the map and list them
      for (let i = 0; i < Math.min(results.length, 10); i++) {
        createPlaceMarker(results[i]);
        placesList.push(results[i]);
      }
      
      // Display results in the sidebar
      displayPlacesList();
    } else {
      document.getElementById("results-list").innerHTML = 
        `<p class="no-results">No ${formatPlaceType(type)} found nearby.</p>`;
    }
  });
}

// Format place type for display
function formatPlaceType(type) {
  // Convert snake_case to Title Case with spaces
  return type.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Create markers for places
function createPlaceMarker(place) {
  if (!place.geometry || !place.geometry.location) return;
  
  const marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    icon: {
      url: getIconForPlaceType(place.types[0]),
      scaledSize: new google.maps.Size(25, 25)
    }
  });
  
  // Add click listener to open info window
  google.maps.event.addListener(marker, "click", () => {
    const content = `
      <div>
        <strong>${place.name}</strong><br>
        ${place.vicinity}<br>
        <strong>Rating:</strong> ${place.rating ? `${place.rating}/5` : 'N/A'}
      </div>
    `;
    infoWindow.setContent(content);
    infoWindow.open(map, marker);
  });
}

// Get appropriate icon for place type
function getIconForPlaceType(type) {
  const iconMap = {
    hospital: 'https://maps.google.com/mapfiles/ms/icons/hospital.png',
    school: 'https://maps.google.com/mapfiles/ms/icons/homegardenbusiness.png',
    grocery_or_supermarket: 'https://maps.google.com/mapfiles/ms/icons/grocerystore.png',
    airport: 'https://maps.google.com/mapfiles/ms/icons/plane.png',
    police: 'https://maps.google.com/mapfiles/ms/icons/police.png',
    fire_station: 'https://maps.google.com/mapfiles/ms/icons/firedept.png',
    transit_station: 'https://maps.google.com/mapfiles/ms/icons/bus.png'
  };
  
  // Default icon if type not found in map
  return iconMap[type] || 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';
}

// Display list of places in the sidebar
function displayPlacesList() {
  const resultsDiv = document.getElementById("results-list");
  resultsDiv.innerHTML = "";
  
  if (placesList.length === 0) {
    resultsDiv.innerHTML = '<p class="no-results">No places found nearby</p>';
    return;
  }
  
  placesList.forEach((place, i) => {
    const placeDiv = document.createElement("div");
    placeDiv.className = "place-item";
    
    // Calculate distance if we have the selected location
    let distanceText = '';
    if (selectedLocation && selectedLocation.lat && place.geometry && place.geometry.location) {
      const distance = getDistance(
        selectedLocation.lat, 
        selectedLocation.lng,
        place.geometry.location.lat(), 
        place.geometry.location.lng()
      );
      distanceText = `<span class="distance">${distance.toFixed(1)} km</span>`;
    }
    
    placeDiv.innerHTML = `
      <div class="place-number">${i + 1}</div>
      <div class="place-details">
        <h4>${place.name}</h4>
        <p>${place.vicinity}</p>
        <div class="place-meta">
          ${place.rating ? 
            `<span class="rating">
              <i class="fas fa-star"></i> ${place.rating}
            </span>` : 
            ''
          }
          ${distanceText}
        </div>
      </div>
    `;
    
    placeDiv.addEventListener("click", () => {
      // Center map on this place and open info window
      map.setCenter(place.geometry.location);
      map.setZoom(15);
      
      const content = `
        <div>
          <strong>${place.name}</strong><br>
          ${place.vicinity}<br>
          <strong>Rating:</strong> ${place.rating ? `${place.rating}/5` : 'N/A'}
        </div>
      `;
      infoWindow.setContent(content);
      infoWindow.setPosition(place.geometry.location);
      infoWindow.open(map);
    });
    
    resultsDiv.appendChild(placeDiv);
  });
}

// Calculate distance between two points using Haversine formula (in km)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}

// Clear results and remove markers
function clearResults() {
  // Clear list in the sidebar
  document.getElementById("results-list").innerHTML = "";
  
  // Remove all place markers (not the main location marker)
  placesList = [];
  
  // Close any open info windows
  infoWindow.close();
}

// Open AQI modal and fetch AQI data
function openAQIModal(location) {
  // Show modal
  document.getElementById("aqi-modal").style.display = "flex";
  document.getElementById("aqi-results").innerHTML = "<p>Loading air quality data...</p>";
  
  // Use location.city, location.state, location.country to get AQI
  if (location.city && location.state && location.country) {
    // Check if city, state, and country are not empty
    if (location.city.trim() === '' || location.state.trim() === '' || location.country.trim() === '') {
      document.getElementById("aqi-results").innerHTML = 
        `<p class="error">Unable to determine complete location information. Make sure you've selected a specific city.</p>`;
      return;
    }
    
    try {
      // Call the getAQIFromLocation function from location-to-aqi-js.js
      getAQIFromLocation(location.city, location.state, location.country)
        .then(result => {
          // Check if we got a valid result
          if (result) {
            document.getElementById("aqi-results").innerHTML = result;
          } else {
            // If the function doesn't return anything, display a custom error
            document.getElementById("aqi-results").innerHTML = 
              `<div class="error">
                <p>❌ No AQI data available for ${location.city}, ${location.state}, ${location.country}.</p>
                <p>Try selecting a location in or near a major city.</p>
              </div>`;
          }
        })
        .catch(error => {
          // Handle any errors that occur during the API call
          document.getElementById("aqi-results").innerHTML = 
            `<div class="error">
              <p>❌ Error loading air quality data: ${error.message}</p>
              <p>Please try again later or select a different location.</p>
            </div>`;
        });
    } catch (error) {
      // Handle the case where the function isn't available
      document.getElementById("aqi-results").innerHTML = 
        `<div class="error">
          <p>❌ Error: The AQI function is not available.</p>
          <p>Please make sure location-to-aqi-js.js is loaded properly.</p>
        </div>`;
    }
  } else {
    document.getElementById("aqi-results").innerHTML = 
      `<div class="error">
        <p>❌ Unable to identify city, state, and country from the selected location.</p>
        <p>Please try selecting a more specific location or search for a city name.</p>
      </div>`;
  }
}

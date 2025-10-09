// Location to AQI Converter in JavaScript
// This script converts a location to coordinates and fetches AQI data

// Your IQAir API key
// Note: For production, this API key should be stored securely on the server-side
const IQAIR_API_KEY = "3cfdf115-2b39-4e60-8917-53862d13e108";

/**
 * Convert a location (city, state, country) to coordinates using Nominatim
 * @param {string} city - City name
 * @param {string} state - State/province name
 * @param {string} country - Country name
 * @returns {Promise} - Promise resolving to coordinates object
 */
async function geocodeLocation(city, state, country) {
  const query = `${city}, ${state}, ${country}`;
  const baseUrl = "https://nominatim.openstreetmap.org/search";
  const url = `${baseUrl}?q=${encodeURIComponent(query)}&format=json&limit=1`;
  
  console.log(`🔍 Geocoding: ${query}`);
  
  try {
    // Make request to Nominatim service
    const response = await fetch(url, {
      headers: {
        "User-Agent": "JavaScript_AQI_Lookup_Tool"
      }
    });
    
    if (!response.ok) {
      throw new Error(`Geocoding failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);
      const displayName = data[0].display_name;
      
      console.log(`✅ Location found: ${displayName}`);
      console.log(`   Coordinates: ${lat}, ${lon}`);
      
      return {
        lat,
        lon,
        displayName
      };
    } else {
      console.log(`❌ Location not found: ${query}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Error during geocoding: ${error.message}`);
    return null;
  }
}

/**
 * Get AQI data from the nearest station to given coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise} - Promise resolving to AQI data
 */
async function getNearestStationAQI(lat, lon) {
  const baseUrl = "https://api.airvisual.com/v2/nearest_city";
  const url = `${baseUrl}?lat=${lat}&lon=${lon}&key=${IQAIR_API_KEY}`;
  
  console.log(`🌬️ Fetching AQI for nearest station to coordinates: ${lat}, ${lon}`);
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 429) {
        console.log("⚠️ Rate limit hit. Please try again in a few minutes.");
      }
      throw new Error(`Request failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status === "success") {
      return data;
    } else {
      const errorMsg = data.data?.message || "Unknown error";
      console.log(`❌ API request processed but returned an error: ${errorMsg}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Error fetching AQI data: ${error.message}`);
    return null;
  }
}

/**
 * Format and display AQI data
 * @param {Object} data - AQI data from IQAir API
 * @param {string} originalLocation - Original location queried
 * @returns {string} - Formatted HTML output
 */
function formatAQIData(data, originalLocation) {
  if (!data || !data.data) {
    return "<p>No data available to display</p>";
  }
  
  try {
    const cityData = data.data;
    
    // Location info
    const city = cityData.city || "Unknown";
    const state = cityData.state || "Unknown";
    const country = cityData.country || "Unknown";
    
    // Current conditions
    const current = cityData.current || {};
    
    // Air quality data
    const pollution = current.pollution || {};
    const aqius = pollution.aqius ?? "N/A";  // US AQI
    const aqicn = pollution.aqicn ?? "N/A";  // China AQI
    const mainPollutant = pollution.mainus || "N/A";
    
    // Weather data
    const weather = current.weather || {};
    const temp = weather.tp ?? "N/A";
    const humidity = weather.hu ?? "N/A";
    const windSpeed = weather.ws ?? "N/A";
    
    // Timestamps
    const timestamp = pollution.ts || "Unknown";
    
    // Determine AQI category
    let category = "";
    let healthImplications = "";
    let colorClass = "";
    
    if (typeof aqius === "number") {
      if (aqius <= 50) {
        category = "Good";
        healthImplications = "Air quality is satisfactory, and air pollution poses little or no risk.";
        colorClass = "good";
      } else if (aqius <= 100) {
        category = "Moderate";
        healthImplications = "Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.";
        colorClass = "moderate";
      } else if (aqius <= 150) {
        category = "Unhealthy for Sensitive Groups";
        healthImplications = "Members of sensitive groups may experience health effects. The general public is less likely to be affected.";
        colorClass = "sensitive";
      } else if (aqius <= 200) {
        category = "Unhealthy";
        healthImplications = "Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.";
        colorClass = "unhealthy";
      } else if (aqius <= 300) {
        category = "Very Unhealthy";
        healthImplications = "Health alert: The risk of health effects is increased for everyone.";
        colorClass = "very-unhealthy";
      } else {
        category = "Hazardous";
        healthImplications = "Health warning of emergency conditions: everyone is more likely to be affected.";
        colorClass = "hazardous";
      }
    }
    
    // Build HTML output
    let html = `
      <div class="aqi-results">
        <div class="location-header">
          <h2>📍 NEAREST MONITORING STATION:</h2>
          <p>${city}, ${state}, ${country}</p>
          <p class="small">(Requested for: ${originalLocation})</p>
        </div>
        
        <div class="aqi-card ${colorClass}">
          <div class="aqi-number">
            <span class="value">${aqius}</span>
            <span class="label">US AQI</span>
          </div>
          <div class="aqi-info">
            <h3>${category}</h3>
            <p>${healthImplications}</p>
          </div>
        </div>
        
        <div class="details-section">
          <h3>🌬️ AIR QUALITY DETAILS:</h3>
          <ul>
            <li>US AQI: ${aqius}</li>
            <li>China AQI: ${aqicn}</li>
            <li>Main Pollutant: ${mainPollutant}</li>
          </ul>
          
          <h3>🌤️ WEATHER INFORMATION:</h3>
          <ul>
            <li>Temperature: ${temp}°C</li>
            <li>Humidity: ${humidity}%</li>
            <li>Wind Speed: ${windSpeed} m/s</li>
          </ul>
          
          <p class="timestamp">Last Updated: ${timestamp}</p>
        </div>
    `;
    
    // Add note if the station is different from the requested location
    if (!originalLocation.toLowerCase().includes(city.toLowerCase())) {
      html += `
        <div class="note">
          <p>📝 NOTE: The original location may not be directly supported by IQAir,
          so this data is from the closest monitoring station to the coordinates.
          The accuracy for your specific location may vary.</p>
        </div>
      `;
    }
    
    html += `</div>`;
    
    return html;
  } catch (error) {
    console.error(`Error formatting data: ${error.message}`);
    return `<p>Error formatting data: ${error.message}</p>`;
  }
}

/**
 * Main function to get AQI from location
 * @param {string} city - City name
 * @param {string} state - State/province name
 * @param {string} country - Country name
 * @returns {Promise} - Promise resolving to HTML result
 */
async function getAQIFromLocation(city, state, country) {
  // Check if we're being called from the neighborhood tool or the main page
  const resultElement = document.getElementById('result');
  
  // If we're on the main page, update the UI directly
  if (resultElement) {
    resultElement.innerHTML = "<p>Loading...</p>";
  }
  
  const originalLocation = `${city}, ${state}, ${country}`;
  
  try {
    // Step 1: Convert location to coordinates
    const geoData = await geocodeLocation(city, state, country);
    
    if (!geoData) {
      const errorHTML = `
        <div class="error">
          <p>❌ Could not find coordinates for the specified location.</p>
          <p>Please check the spelling and try again.</p>
        </div>
      `;
      
      // If we're on the main page, update the UI directly
      if (resultElement) {
        resultElement.innerHTML = errorHTML;
      }
      
      // Return the HTML for the neighborhood tool
      return errorHTML;
    }
    
    // Step 2: Get AQI data for those coordinates
    const aqi = await getNearestStationAQI(geoData.lat, geoData.lon);
    
    if (aqi) {
      // Step 3: Format and display the data
      const formattedResult = formatAQIData(aqi, geoData.displayName || originalLocation);
      
      // If we're on the main page, update the UI directly
      if (resultElement) {
        resultElement.innerHTML = formattedResult;
      }
      
      // Return the HTML for the neighborhood tool
      return formattedResult;
    } else {
      const errorHTML = `
        <div class="error">
          <p>❌ Unable to retrieve air quality data.</p>
          <p>This could be due to:</p>
          <ul>
            <li>Temporary API rate limiting</li>
            <li>No monitoring stations near the coordinates</li>
            <li>API key limitations</li>
          </ul>
          <p>Please try again in a few minutes or check a major city to verify if the API key works.</p>
        </div>
      `;
      
      // If we're on the main page, update the UI directly
      if (resultElement) {
        resultElement.innerHTML = errorHTML;
      }
      
      // Return the HTML for the neighborhood tool
      return errorHTML;
    }
  } catch (error) {
    const errorHTML = `<p>Error: ${error.message}</p>`;
    
    // If we're on the main page, update the UI directly
    if (resultElement) {
      resultElement.innerHTML = errorHTML;
    }
    
    // Return the HTML for the neighborhood tool
    return errorHTML;
  }
}

// Event handler for form submission
function handleSubmit(event) {
  event.preventDefault();
  
  const city = document.getElementById('city').value.trim();
  const state = document.getElementById('state').value.trim();
  const country = document.getElementById('country').value.trim();
  
  if (!city || !state || !country) {
    alert('Please fill in all location fields');
    return;
  }
  
  getAQIFromLocation(city, state, country);
}

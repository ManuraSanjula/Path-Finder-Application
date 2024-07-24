// src/Geocoder.js

class Geocoder {
    async getCoordinates(location) {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;
  
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'YourAppName/1.0 (your-email@example.com)'
          }
        });
        const data = await response.json();
  
        if (data.length > 0) {
          return data[0];
        } else {
          throw new Error('Location not found.');
        }
      } catch (error) {
        console.error('Error fetching the coordinates:', error);
        throw error;
      }
    }
  }
  
  export default Geocoder;
  
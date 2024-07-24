class Location {
    constructor(latitude, longitude) {
      this.latitude = latitude;
      this.longitude = longitude;
    }
  
    equals(other) {
      return this.latitude === other.latitude && this.longitude === other.longitude;
    }
  }
  
  module.exports = Location;
  
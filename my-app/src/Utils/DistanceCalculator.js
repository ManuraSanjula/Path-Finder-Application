class DistanceCalculator {
    static EARTH_RADIUS = 6371; // Approx Earth radius in KM
  
    static toRadians(degrees) {
      return degrees * (Math.PI / 180);
    }
  
    static calculateDistance(start, end) {
      const dLat = this.toRadians(end.latitude - start.latitude);
      const dLon = this.toRadians(end.longitude - start.longitude);
      const lat1 = this.toRadians(start.latitude);
      const lat2 = this.toRadians(end.latitude);
  
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
      return this.EARTH_RADIUS * c;
    }
}
  
module.exports = DistanceCalculator;
  
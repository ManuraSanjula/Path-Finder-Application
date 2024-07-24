class BearingCalculator {
    static toRadians(degrees) {
      return degrees * (Math.PI / 180);
    }
  
    static toDegrees(radians) {
      return radians * (180 / Math.PI);
    }
  
    static getDirection(current, next) {
      const bearing = this.calculateBearing(current, next);
      if (bearing >= -45 && bearing <= 45) {
        return "forward";
      } else if (bearing > 45 && bearing <= 135) {
        return "right";
      } else if (bearing < -45 && bearing >= -135) {
        return "left";
      } else {
        return "backward";
      }
    }
  
    static calculateBearing(start, end) {
      const startLat = this.toRadians(start.latitude);
      const startLng = this.toRadians(start.longitude);
      const endLat = this.toRadians(end.latitude);
      const endLng = this.toRadians(end.longitude);
  
      const dLng = endLng - startLng;
      const y = Math.sin(dLng) * Math.cos(endLat);
      const x = Math.cos(startLat) * Math.sin(endLat) -
                Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);
      return this.toDegrees(Math.atan2(y, x));
    }
  }
  
  module.exports = BearingCalculator;
  
class BearingCalculator {
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
        const startLat = this.deg2rad(start.latitude);
        const startLng = this.deg2rad(start.longitude);
        const endLat = this.deg2rad(end.latitude);
        const endLng = this.deg2rad(end.longitude);
        const dLng = endLng - startLng;

        const y = Math.sin(dLng) * Math.cos(endLat);
        const x = Math.cos(startLat) * Math.sin(endLat) -
            Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);
        return this.rad2deg(Math.atan2(y, x));
    }

    static deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    static rad2deg(rad) {
        return rad * (180 / Math.PI);
    }
}

module.exports = BearingCalculator;

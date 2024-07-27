class DistanceCalculator {
    static calculateDistance(start, end) {
        const EARTH_RADIUS = 6371; // Earth radius in km
        const dLat = this.deg2rad(end.latitude - start.latitude);
        const dLon = this.deg2rad(end.longitude - start.longitude);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(start.latitude)) * Math.cos(this.deg2rad(end.latitude)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS * c;
    }

    static deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
}


module.exports = DistanceCalculator;

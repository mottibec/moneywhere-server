interface ILocation {
    longitude: number;
    latitude: number;
}

class Location implements ILocation {
    longitude: number;
    latitude: number;

    constructor(latitude: number, longitude: number) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    distanceFrom(location: Location): number {
        const earthRadius = 6376500.0;
        const d1 = this.latitude * (Math.PI / 180.0);
        const num1 = this.longitude * (Math.PI / 180.0);
        const d2 = location.latitude * (Math.PI / 180.0);
        const num2 = location.longitude * (Math.PI / 180.0) - num1;
        const d3 = Math.pow(Math.sin((d1 - d2) / 2.0), 2.0) + Math.cos(d1) * Math.cos(d2) * Math.pow(Math.sin(num2 / 2.0), 2.0);
        const distance = earthRadius * (2.0 * Math.atan2(Math.sqrt(d3), Math.sqrt(1.0 - d3)));
        return distance;

    }
}

export { ILocation, Location }
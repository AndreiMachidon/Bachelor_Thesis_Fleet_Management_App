export class Route{
    id: number;
    startLocation: string;
    endLocation: string;
    distance: number;
    startTime: Date;
    arrivalTime: Date;
    routeStatus: string;
    cost: number;
    driverNotes: string;
    adminId: number;
    vehicleId: number;
    driverId: number;

    encodedPolyline: string;
}
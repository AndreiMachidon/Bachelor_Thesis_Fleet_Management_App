import { WaypointDto } from "./waypoint-dto.model";

export class RouteDto {
    id: number;
    distance: number;
    startTime: Date;
    arrivalTime: Date;
    fuelCost: number;
    driverCost: number;
    encodedPolyline: string;
    routeStatus: string;
    adminId: number;
    vehicleId: number;
    driverId: number;
    waypoints: WaypointDto[];
}
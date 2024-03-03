import { WaypointDto } from "./waypoint-dto.model";

export class RouteDto {
    id: number;
    distance: number; //d
    startTime: Date; //d
    arrivalTime: Date; //d
    fuelCost: number; //d 
    driverCost: number; //d
    encodedPolyline: string; //d
    routeStatus: string; //d
    driverNotes: string; //d
    adminId: number;
    vehicleId: number;
    driverId: number;
    waypoints: WaypointDto[];
}
export class WaypointDto{
    id: number;
    address: string;
    latitude: number;
    longitude: number; 
    type: string;
    gasolinePrice: number;
    dieselPrice: number;
    electricityPrice: number;
    connectors: Record<string, number>;
    duration: number;
    electricStationName: string;
    fuelStationName: string;
    restBreakLocationName: string;
    placeId: string;

}
export class WaypointDto{
    id: number;
    address: string;
    latitude: number;
    longitude: number; 
    type: string;
    gasolinePrice: number;
    diselPrice: number;
    electricityPrice: number;
    connectors: Record<string, number>;
    duration: number;
}
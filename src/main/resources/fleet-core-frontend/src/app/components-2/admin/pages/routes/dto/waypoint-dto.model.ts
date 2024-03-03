export class WaypointDto{
    id: number;
    address: string; //d
    latitude: number; //d
    longitude: number; //d
    type: string; //d
    gasolinePrice: number; //d
    diselPrice: number; //d
    electricityPrice: number; //d
    connectors: Record<string, number>; //d
    duration: number; //d
}
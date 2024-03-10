export interface CustomWaypoint {
    location: google.maps.LatLng;
    stopover: boolean;
    type: string;
    gasStationInfo?: any; //only if the waypoint is a gas station
    evChargeInfo?: any; //only if the waypoint is a charging station
    fuelType ?: string;
    gasolinePrice ?: number;
    diselPrice ?: number;
    electricityPrice ?: number;
    restBreakDuration ?: number;
    placeId: string;
  }
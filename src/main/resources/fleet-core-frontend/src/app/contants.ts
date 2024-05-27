// API URL
//export const API_URL = "https://192.168.100.7:8443";
export const API_URL = "https://fleet-core-backend.azurewebsites.net";

// WEBSOCKET FOR LIVE DRIVER UPDATES
//export const SOCKET_LIVE_LOCATION_URL = "https://192.168.100.7:8443/navigation";
export const SOCKET_LIVE_LOCATION_URL = "https://fleet-core-backend.azurewebsites.net/navigation";
export const SOCKET_LIVE_LOCATION_UPDATE_URL = "/app/updateLocation";
export const SOCKET_LIVE_LOCATION_SUSBSCRIBE_URL = "/topic/driverLocation";

export const SOCKET_ALERTS_UPDATE_URL = "/app/sendAlert";
export const SOCKET_ALERTS_SUBSCRIBE_URL = "/topic/routeAlerts";

export const SOCKET_ROUTE_STATUS_UPDATE_URL = "/app/updateRouteStatus"
export const SOCKET_ROUTE_STATUS_SUBSCRIBE_URL = "/topic/routeStatuses"

export const TOKEN_ENCRYPTION_SECRET = "MDWEObP3ozFYkQFxw2Fjh4oNqJEQz_Cj2AWa2GDB8DWBWQcH1IIVgshle1ltlmHLUovFrTDcGCJTE1gU_AqOlg";

export const GOOGLE_MAPS_API_KEY = "<api-key>";

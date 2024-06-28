export const environment = {
    production: true,
    API_URL: "https://fleet-core-backend.azurewebsites.net",
    SOCKET_LIVE_LOCATION_URL: "https://fleet-core-backend.azurewebsites.net/navigation",
    SOCKET_LIVE_LOCATION_UPDATE_URL: "/app/updateLocation",
    SOCKET_LIVE_LOCATION_SUBSCRIBE_URL: "/topic/driverLocation",
    SOCKET_ALERTS_UPDATE_URL: "/app/sendAlert",
    SOCKET_ALERTS_SUBSCRIBE_URL: "/topic/routeAlerts",
    SOCKET_ROUTE_STATUS_UPDATE_URL: "/app/updateRouteStatus",
    SOCKET_ROUTE_STATUS_SUBSCRIBE_URL: "/topic/routeStatuses",
    TOKEN_ENCRYPTION_SECRET: "TOKEN_ENCRYPTION_SECRET_placeholder",
    GOOGLE_MAPS_API_KEY: "GOOGLE_MAPS_API_KEY_placeholder"
  };
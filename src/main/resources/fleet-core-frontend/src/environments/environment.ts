export const environment = {
    production: false,
    API_URL: "https://172.23.128.1:8443",
    SOCKET_LIVE_LOCATION_URL: "https://172.23.128.1/navigation",
    SOCKET_LIVE_LOCATION_UPDATE_URL: "/app/updateLocation",
    SOCKET_LIVE_LOCATION_SUBSCRIBE_URL: "/topic/driverLocation",
    SOCKET_ALERTS_UPDATE_URL: "/app/sendAlert",
    SOCKET_ALERTS_SUBSCRIBE_URL: "/topic/routeAlerts",
    SOCKET_ROUTE_STATUS_UPDATE_URL: "/app/updateRouteStatus",
    SOCKET_ROUTE_STATUS_SUBSCRIBE_URL: "/topic/routeStatuses",
    TOKEN_ENCRYPTION_SECRET: "KEY",
    GOOGLE_MAPS_API_KEY: "KEY"
};


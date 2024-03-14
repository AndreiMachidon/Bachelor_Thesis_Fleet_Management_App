export class RouteAlertDto{
    id: number;
    alertType: string;
    alertDescription: string;
    alertIssuedDate: Date;
    alertResolvedDate: Date;
    longitude: number;
    latitude: number;
    alertStatus: string;
    routeId: number;
}
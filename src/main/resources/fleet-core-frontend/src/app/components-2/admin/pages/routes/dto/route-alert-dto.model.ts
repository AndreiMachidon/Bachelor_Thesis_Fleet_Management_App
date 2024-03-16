export class RouteAlertDto{
    id: number;
    alertType: string;
    alertDescription: string;
    alertIssuedDate: Date;
    alertResolvedDate: Date;
    longitude: number;
    latitude: number;
    alertStatus: string;
    costs: number;
    routeId: number;
}
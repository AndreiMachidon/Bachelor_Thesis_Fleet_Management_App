import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { SOCKET_ALERTS_SUBSCRIBE_URL, SOCKET_ALERTS_UPDATE_URL, SOCKET_LIVE_LOCATION_SUSBSCRIBE_URL, SOCKET_LIVE_LOCATION_UPDATE_URL, SOCKET_LIVE_LOCATION_URL } from 'src/app/contants';
import { DriverLocationDto } from '../admin/pages/routes/dto/driver-location-dto.model';
import { RouteAlertDto } from '../admin/pages/routes/dto/route-alert-dto.model';

@Injectable({
  providedIn: 'root'
})
export class WebSocketsService {

  private stompClient: any = null;
  private locationSubscription: any = null;
  private alertsSubscription: any = null;

  constructor() { }

  initializeWebSocketConnection(jwtToken: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.stompClient && this.stompClient.connected) {
        console.log('WebSocket is already connected.');
        resolve();
        return;
      }
  
      const ws = new SockJS(SOCKET_LIVE_LOCATION_URL);
      this.stompClient = Stomp.over(ws);
      this.stompClient.connect({ Authorization: `Bearer ${jwtToken}` },
        (frame) => {
          console.log('Connected to live location socket: ' + frame);
          resolve();
        },
        (error) => {
          console.error(error);
          reject(error);
        });
    });
  }
  

  sendLocation(routeId: number, driverId: number, latitude: number, longitude: number) {
    const driverLocationDto: DriverLocationDto = { routeId, driverId, latitude, longitude };
    this.stompClient.send(`${SOCKET_LIVE_LOCATION_UPDATE_URL}/${routeId}`, {}, JSON.stringify(driverLocationDto));
  }

  subscribeToRouteLocation(routeId: number, callback: (driverLocationDto: DriverLocationDto) => void) {
    const topic = `${SOCKET_LIVE_LOCATION_SUSBSCRIBE_URL}/${routeId}`;
    this.locationSubscription = this.stompClient.subscribe(topic, message => {
      const locationUpdate: DriverLocationDto = JSON.parse(message.body);
      callback(locationUpdate);
    });
  }

  unsubscribeFromRouteLocation() {
    if (this.locationSubscription) {
      this.locationSubscription.unsubscribe();
      this.locationSubscription = null;
      console.log('Unsubscribed from route location updates.');
    }
  }

  sendAlert(routeId: number, routeAlertDto: RouteAlertDto){
    this.stompClient.send(`${SOCKET_ALERTS_UPDATE_URL}/${routeId}`, {}, JSON.stringify(routeAlertDto));
  }

  subscribeToRouteAlerts(routeId: number, callback: (routeAlertDto: RouteAlertDto) => void){
    const topic = `${SOCKET_ALERTS_SUBSCRIBE_URL}/${routeId}`;
    console.log("Subscribed to topic: " + topic);
    this.alertsSubscription = this.stompClient.subscribe(topic, message => {
      const routeAlert: RouteAlertDto = JSON.parse(message.body);
      callback(routeAlert);
    });
  }

  unsubscribeFromRouteAlerts() {
    if (this.alertsSubscription) {
      this.alertsSubscription.unsubscribe();
      this.alertsSubscription = null;
      console.log('Unsubscribed from route alerts updates.');
    }
  }

  disconnectWebSocketConnection() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect(() => {
        console.log('Disconnected from live location socket');
      });
    }
  }

}

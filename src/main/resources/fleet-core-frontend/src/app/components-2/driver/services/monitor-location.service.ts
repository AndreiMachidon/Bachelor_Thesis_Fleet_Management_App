import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MonitorLocationService {

  private watchLocationId: number = null;
  private sendLocationIntervalId: number = null;
  private mockLocationId: number = null;
  private userPosition: google.maps.LatLng = null;
  private startedRouteId: number = null;

  constructor() { }

  public setWatchLocationId(id: number, routeId: number) {
    this.watchLocationId = id;
    this.startedRouteId = routeId;
  }

  public getWatchLocationId(): number {
    return this.watchLocationId;
  }

  public resetWatchLocationId(){
    navigator.geolocation.clearWatch(this.watchLocationId);
    this.watchLocationId = null;
    this.startedRouteId = null;
  }

  public setWatchLocationIntervalId(id: number) {
    this.sendLocationIntervalId = id;
  }

  public getWatchLocationIntervalId(): number {
    return this.sendLocationIntervalId;
  }

  public resetWatchLocationIntervalId(){
    clearInterval(this.sendLocationIntervalId);
    this.sendLocationIntervalId = null;
  }

  public setMockLocationId(id: number, routeId: number) {
    this.mockLocationId = id;
    this.startedRouteId = routeId;
  }

  public getMockLocationId(): number {
    return this.mockLocationId;
  }

  public resetMockLocationId(){
    clearInterval(this.mockLocationId);
    this.mockLocationId = null;
    this.startedRouteId = null;
  }

  public setUserPosition(position: google.maps.LatLng) {
    this.userPosition = position;
  }

  public getUserPosition(): google.maps.LatLng {
    return this.userPosition;
  }

  public resetUserPosition() {
    this.userPosition = null;
  }

  public getStartedRouteId(): number {
    return this.startedRouteId;
  }


}

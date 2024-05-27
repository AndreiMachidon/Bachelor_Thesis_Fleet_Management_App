import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { } from 'googlemaps';
import { MatDialog } from '@angular/material/dialog';
import { AssignVehicleDialogComponent } from './dialogs/assign-vehicle-dialog/assign-vehicle-dialog.component';
import { Vehicle } from '../../admin-dashboard/models/vehicle.model';
import { AssignDriverDialogComponent } from './dialogs/assign-driver-dialog/assign-driver-dialog.component';
import { Driver } from 'src/app/components-2/auth/dto/Driver';
import { AuthService } from 'src/app/components-2/auth/services/auth.service';
import { GoogleMapsService } from './services/google-maps.service';
import { CustomWaypoint } from './util/custom-waypoint.interface';
import { FuelPricesService } from './services/fuel-prices.service';
import { calculateDistanceAndDurationBetweenWaypoints, calculateDurationInHoursAndMinutes, createCustomMarker, createInfoWindowForElectricStationsMarkerWaypoint, createInfoWindowForGasStationsMarkerWaypoint, createInfoWindowForRestBreaksMarkerWaypoint, formatConnectorType, formatMaxChargeRate, getPointsAlongRoute } from './util/google.maps.util';
import { SaveFinalRouteDialogComponent } from './dialogs/save-final-route-dialog/save-final-route-dialog.component';
import { RoutesService } from './services/routes.service';
import { RouteDto } from './dto/route-dto.model';
import { WebSocketsService } from 'src/app/components-2/global-services/web-sockets.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { RouteSavedDialogComponent } from './dialogs/route-saved-dialog/route-saved-dialog.component';


@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css']
})
export class RoutesComponent {

  map: google.maps.Map;
  userPosition: google.maps.LatLng;
  directionRenderer: google.maps.DirectionsRenderer = null;
  directionService: google.maps.DirectionsService = null;

  startingLocationControl = new FormControl();
  destinationLocationControl = new FormControl();
  startingLocation: string = '';
  destinationLocation: string = '';

  isRouteConfigured: boolean = false;
  distance: number;
  duration: number;
  directionResult: google.maps.DirectionsResult = null;

  showSelectOptions: boolean = true;
  showAddRoute: boolean = false;
  showViewRoutes: boolean = true;

  dateControl = new FormControl();
  minDate: Date = new Date();
  startTime: Date = null;
  arrivalTime: Date = null;

  selectedVehicle: Vehicle = null;
  selectedDriver: Driver = null;

  showFuelStationsFlag: boolean = false;
  fuelStationsMarkers: google.maps.Marker[] = [];

  waypoints: CustomWaypoint[] = [];
  waypointsMarkers: google.maps.Marker[] = [];

  showTrafficLayer: boolean = false;
  trafficLayer: google.maps.TrafficLayer;


  @ViewChild('startingLocationAuto') startingLocationAuto: MatAutocomplete;
  @ViewChild('destinationLocationAuto') destinationLocationAuto: MatAutocomplete;


  routesList: RouteDto[] = [];

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private googleMapsService: GoogleMapsService,
    private fuelPriceService: FuelPricesService,
    private routesService: RoutesService,
    private webSocketService: WebSocketsService,
    private cdRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.getUserLocation();
    this.webSocketService.initializeWebSocketConnection(this.authService.getAuthToken()).then(() => {
      this.webSocketService.subscribeToRouteStatuses((routeStatus) => {
        this.updateRoutesList();
      });
    });
  }

  initMap() {
    const mapOptions: any = {
      center: this.userPosition,
      zoom: 15,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.HYBRID,
      mapId: '1d3279d2082b9187',
      restriction: {
        latLngBounds: {
          north: 71,
          south: 34,
          east: 40,
          west: -25,
        },
        strictBounds: true,
      },
    };
    this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, mapOptions);
    this.trafficLayer = new google.maps.TrafficLayer();
  }

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          this.initMap();
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  startingLocationAutocomplete(inputElement: HTMLInputElement) {
    const options = {
      fields: ["formatted_address", "geometry", "name"],
      strictBounds: true,
      types: [],
      bounds: {
        north: 71,
        south: 34,
        east: 40,
        west: -25,
      }

    };
    const autocomplete = new google.maps.places.Autocomplete(inputElement, options);

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      this.startingLocation = place.formatted_address;
    });
  }

  destinationLocationAutocomplete(inputElement: HTMLInputElement) {
    const options = {
      fields: ["formatted_address", "geometry", "name"],
      strictBounds: true,
      types: [],
      bounds: {
        north: 71,
        south: 34,
        east: 40,
        west: -25,
      }
    };
    const autocomplete = new google.maps.places.Autocomplete(inputElement, options);
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      this.destinationLocation = place.formatted_address;
    });
  }

  toggleTrafficLayer(show: boolean) {
    this.showTrafficLayer = show;
    if (this.showTrafficLayer) {
      this.trafficLayer.setMap(this.map);
    } else {
      this.trafficLayer.setMap(null);
    }
  }

  onDateSelected() {
    this.startTime = this.dateControl.value;
    this.arrivalTime = new Date(this.startTime.getTime() + this.duration * 1000);
  }

  openChoseVehicleDialog() {
    this.fuelStationsMarkers.forEach(marker => marker.setMap(null));
    this.fuelStationsMarkers = [];
    this.findOptimalRoute();
    const dialogRef = this.dialog.open(AssignVehicleDialogComponent, {
      width: '1200px',
      height: '700px',
      data: { adminId: this.authService.getUserDetails().id, startTime: this.startTime, arrivalTime: this.arrivalTime }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedVehicle = result;
      }
    });
  }

  openChoseDriverDialog() {
    const dialogRef = this.dialog.open(AssignDriverDialogComponent, {
      width: '1200px',
      height: '700px',
      data: { adminId: this.authService.getUserDetails().id, startTime: this.startTime, arrivalTime: this.arrivalTime }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedDriver = result;
      }
    });
  }

  findOptimalRoute(isFuelWaypointAdded: boolean = false, areBreaksWaypointsAdded: boolean = false) {

    if (this.directionRenderer != null) {
      this.directionRenderer.setMap(null);
      if (!isFuelWaypointAdded && !areBreaksWaypointsAdded) {
        this.fuelStationsMarkers.forEach(marker => marker.setMap(null));
        this.fuelStationsMarkers = [];
        this.waypointsMarkers.forEach(marker => marker.setMap(null));
        this.waypointsMarkers = [];
        this.waypoints = [];
      }
    }

    this.directionService = new google.maps.DirectionsService();
    this.directionRenderer = new google.maps.DirectionsRenderer();
    this.directionRenderer.setOptions({
      suppressMarkers: true,
      polylineOptions: {
        strokeOpacity: 0,
        icons: [{
          icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            strokeColor: '#0000FF',
            strokeOpacity: 1,
            scale: 1
          },
          offset: '100%',
          repeat: '8px'
        }]
      }
    });



    let googleMapWaypoints = this.waypoints.map(wp => ({
      location: wp.location,
      stopover: wp.stopover
    }));

    const request: google.maps.DirectionsRequest = {
      origin: this.startingLocation,
      destination: this.destinationLocation,
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC,
      waypoints: googleMapWaypoints,
      optimizeWaypoints: true
    }

    this.directionService.route(request, (response: google.maps.DirectionsResult, status: google.maps.DirectionsStatus) => {

      if (status === google.maps.DirectionsStatus.OK) {
        console.log(this.directionResult);

        this.directionRenderer.setMap(this.map);
        this.directionRenderer.setDirections(response);
        this.distance = response.routes[0].legs.reduce((acc, leg) => acc + leg.distance.value, 0);
        this.duration = response.routes[0].legs.reduce((acc, leg) => acc + leg.duration.value, 0);
        this.map.fitBounds(response.routes[0].bounds);
        this.directionResult = response;
        this.isRouteConfigured = true;

        const startMarker = createCustomMarker(this.map, response.routes[0].legs[0].start_location, '../../../assets/markers/start_point.png');
        this.waypointsMarkers.push(startMarker);

        const endMarker = createCustomMarker(this.map, response.routes[0].legs[response.routes[0].legs.length - 1].end_location, '../../../assets/markers/end_point.png');
        this.waypointsMarkers.push(endMarker);

        if (!isFuelWaypointAdded && !areBreaksWaypointsAdded) {
          this.addRestBreakWaipoints(response);
        }

        this.placeWaypointMarkers();

      } else {
        alert("Cold not find a route between the two locations.")
        this.isRouteConfigured = false;
        this.arrivalTime = null;
        this.startTime = null;
        this.selectedVehicle = null;
        this.selectedDriver = null;
      }
    });
  }

  async addRestBreakWaipoints(directionResult: google.maps.DirectionsResult) {
    const maxDrivingTime = 4.5 * 3600;
    let totalDrivenTime = 0;
    let promises: Promise<any>[] = [];

    directionResult.routes[0].legs.forEach((leg) => {
      leg.steps.forEach((step) => {
        totalDrivenTime += step.duration.value;
        if (totalDrivenTime >= maxDrivingTime) {
          totalDrivenTime = 0;
          const breakpoint = step.end_location;
          promises.push(this.findRestBreakLocation(breakpoint));
        }
      });
    });

    const locations = await Promise.all(promises);

    locations.forEach((location) => {
      if(location !== undefined) {
        let waypoint: CustomWaypoint = {
          location: new google.maps.LatLng(location.location.latitude, location.location.longitude),
          stopover: true,
          type: "restBreak",
          restBreakDuration: 45,
          placeId: location.id || undefined,
          restBreakLocationName: location.displayName.text,
          address: location.formattedAddress
        };
        this.waypoints.push(waypoint);
      }

    });

    this.findOptimalRoute(false, true);

  }

  async findRestBreakLocation(location: google.maps.LatLng): Promise<any> {
    const request = {
      includedTypes: ["cafe", "restaurant", "coffee_shop", "truck_stop"],
      locationRestriction: {
        circle: {
          center: {
            latitude: location.lat(),
            longitude: location.lng()
          },
          radius: 50000.0
        }
      },
      maxResultCount: 2,
      languageCode: "en"
    }

    try{
        const response: any = await this.googleMapsService.getNearbyLocationsForRestBreaks(request).toPromise();
        if(response && response.places && response.places.length > 0) {
          const place = response.places[0];
          return place;
        }
      } catch (error) {
        console.error('Error getting rest break location:', error);
      }
      return undefined;
  }

  placeWaypointMarkers() {
    this.waypoints.forEach((waypoint, index) => {
      if (waypoint.type === "fuelStation") {
        const marker = createCustomMarker(this.map, waypoint.location, '../../../assets/markers/gas_station_waypoint.png');
        this.waypointsMarkers.push(marker);
        createInfoWindowForGasStationsMarkerWaypoint(this.map, waypoint, marker, this.fuelPriceService);

      } else if (waypoint.type === "electricStation") {
        const marker = createCustomMarker(this.map, waypoint.location, '../../../assets/markers/electric_station_waypoint.png');
        this.waypointsMarkers.push(marker);
        createInfoWindowForElectricStationsMarkerWaypoint(this.map, waypoint, marker, this.fuelPriceService);

      } else if (waypoint.type === "restBreak") {
        const marker = createCustomMarker(this.map, waypoint.location, '../../../assets/markers/rest_break_point.png');
        this.waypointsMarkers.push(marker);
        createInfoWindowForRestBreaksMarkerWaypoint(this.map, waypoint, marker, index);
      }
    });
  }

  showFuelStations() {
    this.showFuelStationsFlag = !this.showFuelStationsFlag;
    if (this.showFuelStationsFlag && this.fuelStationsMarkers.length === 0) {
      this.findStationsAlongRoute(this.directionResult);
    } else if (this.showFuelStationsFlag && this.fuelStationsMarkers.length > 0) {
      this.fuelStationsMarkers.forEach(marker => marker.setMap(this.map));
    } else if (!this.showFuelStationsFlag) {
      this.fuelStationsMarkers.forEach(marker => marker.setMap(null));
    }
  }

  findStationsAlongRoute(directionResult: google.maps.DirectionsResult) {
    const points = getPointsAlongRoute(directionResult);
    points.forEach((point) => {
      this.findStations(point);
    });
  }

  findStations(location: google.maps.LatLng) {

    let stationType = "";
    if (this.selectedVehicle.fuelType === "ELECTRIC") {
      stationType = "electric_vehicle_charging_station";
    } else {
      stationType = "gas_station";
    }

    const request = {
      includedTypes: [stationType],
      locationRestriction: {
        circle: {
          center: {
            latitude: location.lat(),
            longitude: location.lng()
          },
          radius: 2000.0
        }
      },
      maxResultCount: 1,
      languageCode: "en"
    }

    if (this.selectedVehicle.fuelType === "ELECTRIC") {
      this.googleMapsService.getNearbyChargingStations(request).subscribe((response: any) => {
        if (response.places !== undefined) {
          response.places.forEach((place) => {
            this.createMarkerForElectricStation(place);
          })
        }
      });
    } else {
      this.googleMapsService.getNearbyGasStations(request).subscribe((response: any) => {
        if (response.places !== undefined) {
          response.places.forEach((place) => {
            this.createMarkerForFuelStation(place);
          });
        }
      });
    }
  }

  createMarkerForFuelStation(place) {
    const marker = new google.maps.Marker({
      map: this.map,
      position: new google.maps.LatLng(place.location.latitude, place.location.longitude),
      animation: google.maps.Animation.DROP,
      icon: {
        url: '../../../assets/markers/gas_station_point.png',
        scaledSize: new google.maps.Size(40, 40)
      },
    });

    this.fuelStationsMarkers.push(marker);

    google.maps.event.addListener(marker, 'click', () => {
      const infoWindowContent = document.createElement('div');
      infoWindowContent.className = 'info-window-content';
      infoWindowContent.style.width = '500px';
      infoWindowContent.style.height = 'auto';

      const stationName = document.createElement('div');
      stationName.style.fontSize = '25px';
      stationName.style.fontWeight = 'bold';
      stationName.style.color = '#0E3F89';
      stationName.textContent = place.displayName.text;

      const stationImage = document.createElement('img');
      stationImage.src = '../../../assets/images/gas-station-info-window-icon.svg';
      stationImage.alt = 'Station Icon';
      stationImage.style.width = '25px';
      stationImage.style.height = '25px';
      stationImage.style.marginRight = '10px';

      const titleContainer = document.createElement('div');
      titleContainer.style.display = 'flex';
      titleContainer.style.alignItems = 'center';
      titleContainer.style.justifyContent = 'flex-start';

      titleContainer.appendChild(stationImage);
      titleContainer.appendChild(stationName);

      infoWindowContent.appendChild(titleContainer);

      const stationAddress = document.createElement('div');
      stationAddress.style.fontSize = '15px';
      stationAddress.style.color = '#5CABEC';
      stationAddress.textContent = place.formattedAddress;
      infoWindowContent.appendChild(stationAddress);

      const country = this.fuelPriceService.getCountryFromPlace(place);
      const averageGasolinePrice = this.fuelPriceService.getGasolinePrice(country);
      const averageDieselPrice = this.fuelPriceService.getDieselPrice(country);

      let fuelOptionsHtml = '';

      if (averageGasolinePrice && averageDieselPrice) {
        fuelOptionsHtml = `<div style="margin-top: 25px; color:black; font-size:15px; font-weight:bold;">
        <strong>Average Gasoline Price in ${country}:</strong> ${averageGasolinePrice} €/L<br>
        <strong>Average Diesel Price in ${country}:</strong> ${averageDieselPrice} €/L
        </div>`;
      } else {
        fuelOptionsHtml = `<div style="font-size:15px; margin-top: 25px; color:black;">No additional fuel information available.</div>`;
      }
      const fuelOptionsDiv = document.createElement('div');
      fuelOptionsDiv.innerHTML = fuelOptionsHtml;
      infoWindowContent.appendChild(fuelOptionsDiv);


      const addToRouteButton = document.createElement('button');
      addToRouteButton.textContent = 'Add to route';
      Object.assign(addToRouteButton.style, {
        marginTop: '17px',
        marginLeft: '375px',
        backgroundColor: '#0E3F89',
        color: 'white',
        padding: '8px 16px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        with: '100px',
        height: '40px',
        marginBottom: '10px'
      });
      addToRouteButton.style.transition = 'background-color 0.3s ease';

      addToRouteButton.onmouseover = () => {
        addToRouteButton.style.backgroundColor = '#5CABEC';
      };
      addToRouteButton.onmouseout = () => {
        addToRouteButton.style.backgroundColor = '#0E3F89';
      };
      if (this.selectedVehicle.fuelType === "GASOLINE") {
        addToRouteButton.onclick = () => {
          this.addStationWaypointToRoute(place, 'gasoline', averageGasolinePrice, averageDieselPrice, null);
        };
      } else {
        addToRouteButton.onclick = () => {
          this.addStationWaypointToRoute(place, 'diesel', averageGasolinePrice, averageDieselPrice, null);
        };
      }

      infoWindowContent.appendChild(addToRouteButton);

      const infoWindow = new google.maps.InfoWindow({
        content: infoWindowContent,
      });

      infoWindow.open(this.map, marker);
    });
  }

  createMarkerForElectricStation(place) {
    const marker = new google.maps.Marker({
      map: this.map,
      position: new google.maps.LatLng(place.location.latitude, place.location.longitude),
      animation: google.maps.Animation.DROP,
      icon: {
        url: '../../../assets/markers/electric_station_point.png',
        scaledSize: new google.maps.Size(40, 40)
      },
    });

    this.fuelStationsMarkers.push(marker);

    google.maps.event.addListener(marker, 'click', () => {
      const infoWindowContent = document.createElement('div');
      infoWindowContent.className = 'info-window-content';
      infoWindowContent.style.width = '500px';
      infoWindowContent.style.height = 'auto';

      const stationName = document.createElement('div');
      stationName.style.fontSize = '25px';
      stationName.style.fontWeight = 'bold';
      stationName.style.color = '#0E3F89';
      stationName.textContent = place.displayName.text;

      const stationImage = document.createElement('img');
      stationImage.src = '../../../assets/images/electric-station-info-window-icon.svg';
      stationImage.alt = 'Station Icon';
      stationImage.style.width = '25px';
      stationImage.style.height = '25px';
      stationImage.style.marginRight = '10px';

      const titleContainer = document.createElement('div');
      titleContainer.style.display = 'flex';
      titleContainer.style.alignItems = 'center';
      titleContainer.style.justifyContent = 'flex-start';

      titleContainer.appendChild(stationImage);
      titleContainer.appendChild(stationName);

      infoWindowContent.appendChild(titleContainer);

      const stationAddress = document.createElement('div');
      stationAddress.style.fontSize = '15px';
      stationAddress.style.color = '#5CABEC';
      stationAddress.textContent = place.formattedAddress;
      infoWindowContent.appendChild(stationAddress);


      const country = this.fuelPriceService.getCountryFromPlace(place);
      const averagePrice = this.fuelPriceService.getElectricityPrice(country);

      let chargeOptionsHtml = '';

      if (place.evChargeOptions && place.evChargeOptions.connectorAggregation) {
        console.log(place.evChargeOptions);

        chargeOptionsHtml += '<div style="font-weight: bold; margin-bottom: 10px; margin-top: 12px; font-size:18px; color: #0E3F89;">Charge Options:</div>';
        chargeOptionsHtml += place.evChargeOptions.connectorAggregation.map((connector, index, array) => {
          return `<div style="padding: 10px; border-bottom: ${index === array.length - 1 ? 'none' : '1px solid #ddd'};">
          <div style="font-weight: bold; font-size:14px; color:#5CABEC;">Connector type: ${formatConnectorType(connector.type)}</div>
          <div style="font-weight: bold; font-size:13px;">Max charge rate: ${formatMaxChargeRate(connector.maxChargeRateKw)}</div>
          <div style="font-weight: bold; font-size:13px;">Connectors count: ${connector.count}</div>
        </div>`;
        }).join('');
      } else {
        chargeOptionsHtml = '<div style="font-size:15px; margin-top: 10px; color:black; font-weight: bold; color: #0E3F89;">No information about the charging options available.</div>';
      }


      const chargeOptionsDiv = document.createElement('div');
      chargeOptionsDiv.innerHTML = chargeOptionsHtml;
      infoWindowContent.appendChild(chargeOptionsDiv);


      if (averagePrice) {
        const averagePriceHtml = document.createElement('div');
        averagePriceHtml.innerHTML = `<div style="margin-top: 25px; color:black; font-size:15px; font-weight:bold;">
                                          Average ev charging price in ${country}: ${averagePrice} €/kWh
                                      </div>`;
        infoWindowContent.appendChild(averagePriceHtml);
      }


      const addToRouteButton = document.createElement('button');
      addToRouteButton.textContent = 'Add to route';
      Object.assign(addToRouteButton.style, {
        marginTop: '10px',
        marginBottom: '10px',
        marginLeft: '375px',
        backgroundColor: '#0E3F89',
        color: 'white',
        padding: '8px 16px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        with: '100px',
        height: '40px'
      });
      addToRouteButton.style.transition = 'background-color 0.3s ease';

      addToRouteButton.onmouseover = () => {
        addToRouteButton.style.backgroundColor = '#5CABEC';
      };
      addToRouteButton.onmouseout = () => {
        addToRouteButton.style.backgroundColor = '#0E3F89';
      };
      addToRouteButton.onclick = () => {
        this.addStationWaypointToRoute(place, 'electric', null, null, averagePrice);
      };
      infoWindowContent.appendChild(addToRouteButton);

      const infoWindow = new google.maps.InfoWindow({
        content: infoWindowContent,
      });

      infoWindow.open(this.map, marker);
    });
  }

  addStationWaypointToRoute(place, type: string, gasolinePrice: number, dieselPrice: number, electricPrice: number) {
    const lat = place.location.latitude;
    const long = place.location.longitude;

    let waypoint: CustomWaypoint = null;
    if (type === 'electric') {
      waypoint = {
        location: new google.maps.LatLng(lat, long),
        stopover: true,
        type: "electricStation",
        evChargeInfo: place,
        fuelType: "electric",
        gasolinePrice: gasolinePrice,
        diselPrice: dieselPrice,
        electricityPrice: electricPrice,
        placeId: place.id,
        restBreakLocationName: null,
        address: place.formattedAddress
      };
    } else if (type === 'gasoline') {
      waypoint = {
        location: new google.maps.LatLng(lat, long),
        stopover: true,
        type: "fuelStation",
        gasStationInfo: place,
        fuelType: "gasoline",
        gasolinePrice: gasolinePrice,
        diselPrice: dieselPrice,
        electricityPrice: electricPrice,
        placeId: place.id,
        restBreakLocationName: null,
        address: place.formattedAddress
      };
    } else {
      waypoint = {
        location: new google.maps.LatLng(lat, long),
        stopover: true,
        type: "fuelStation",
        gasStationInfo: place,
        fuelType: "diesel",
        gasolinePrice: gasolinePrice,
        diselPrice: dieselPrice,
        electricityPrice: electricPrice,
        placeId: place.id,
        restBreakLocationName: null,
        address: place.formattedAddress
      };
    }

    this.waypoints.push(waypoint);

    const index = this.fuelStationsMarkers.findIndex(marker =>
      marker.getPosition().lat() === lat && marker.getPosition().lng() === long
    );

    if (index !== -1) {
      this.fuelStationsMarkers[index].setMap(null);
      this.fuelStationsMarkers.splice(index, 1);
    }

    this.findOptimalRoute(true);
  }

  showFinalDetails() {
    const routeDuration = this.duration;
    const restBreaksDuration = this.waypoints.filter(wp => wp.type === "restBreak").length * 2700;
    const totalRouteDuration = routeDuration + restBreaksDuration;

    const routeDurationFormatted = calculateDurationInHoursAndMinutes(routeDuration);
    const restBreaksDurationFormatted = calculateDurationInHoursAndMinutes(restBreaksDuration);
    const totalRouteDurationFormatted = calculateDurationInHoursAndMinutes(totalRouteDuration);

    this.arrivalTime = new Date(this.startTime.getTime() + (routeDuration + restBreaksDuration) * 1000);

    const totalDistance = this.distance / 1000;

    const waypointsInfo = calculateDistanceAndDurationBetweenWaypoints(this.directionResult, this.waypoints);

    let averageFuelPrice = 0;
    let numberOfFuelStations = 0;

    this.waypoints.forEach((waypoint) => {
      if (waypoint.type !== "restBreak") {
        if (this.selectedVehicle.fuelType === "GASOLINE" && waypoint.fuelType === 'gasoline') {
          averageFuelPrice += waypoint.gasolinePrice;
          numberOfFuelStations++;
        } else if (this.selectedVehicle.fuelType === "DIESEL" && waypoint.fuelType === 'diesel') {
          averageFuelPrice += waypoint.diselPrice;
          numberOfFuelStations++;
        } else if (this.selectedVehicle.fuelType === "ELECTRIC" && waypoint.fuelType === 'electric') {
          averageFuelPrice += waypoint.electricityPrice;
          numberOfFuelStations++;
        }
      }
    });
    if (numberOfFuelStations > 0 && averageFuelPrice > 0) {
      averageFuelPrice = averageFuelPrice / numberOfFuelStations;
    } else {
      switch (this.selectedVehicle.fuelType) {
        case "GASOLINE":
          averageFuelPrice = this.fuelPriceService.getGasolinePrice("Europe");
          break;
        case "DIESEL":
          averageFuelPrice = this.fuelPriceService.getDieselPrice("Europe");
          break;
        case "ELECTRIC":
          averageFuelPrice = this.fuelPriceService.getElectricityPrice("Europe");
          break;
      }
    }


    const totalDistanceInKm = totalDistance;
    const fuelConsumptionPer100Km = this.selectedVehicle.fuelConsumption;
    const totalFuelCost = (totalDistanceInKm / 100) * fuelConsumptionPer100Km * averageFuelPrice;

    const driverRatePerKilometer = this.selectedDriver.ratePerKilometer;

    const totalDriverCost = totalDistanceInKm * driverRatePerKilometer;

    const routeFinalDetails = {
      adminId: this.authService.getUserDetails().id,
      vehicle: this.selectedVehicle,
      driver: this.selectedDriver,
      routeStartDate: this.startTime,
      routeEndDate: this.arrivalTime,
      routeDuration: routeDuration,
      restBreaksDuration: restBreaksDuration,
      totalRouteDuration: totalRouteDuration,
      totalDistance: totalDistance,
      waypointsInfo: waypointsInfo,
      averageFuelPrice: averageFuelPrice,
      totalFuelCost: totalFuelCost,
      totalDriverCost: totalDriverCost,
      totalCosts: totalFuelCost + totalDriverCost,
      googleMapsDirectionResult: this.directionResult,
    }

    const dialogRef = this.dialog.open(SaveFinalRouteDialogComponent, {
      width: '90vw',
      height: '90vh',
      data: { routeFinalDetails: routeFinalDetails }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Saved') {
        const dialogRef = this.dialog.open(RouteSavedDialogComponent);
        dialogRef.afterClosed().subscribe(result => {
          this.updateRoutesList();
        });
        this.resetMapConfiguration();
      } else if (result === 'NotSaved') {
        alert("There was an error while saving the route!");
      }
    });

  }

  resetMapConfiguration() {
    this.directionRenderer.setMap(null);
    this.fuelStationsMarkers.forEach(marker => marker.setMap(null));
    this.fuelStationsMarkers = [];
    this.waypointsMarkers.forEach(marker => marker.setMap(null));
    this.waypointsMarkers = [];
    this.waypoints = [];
    this.isRouteConfigured = false;
    this.showFuelStationsFlag = false;
    this.arrivalTime = null;
    this.startTime = null;
    this.selectedVehicle = null;
    this.selectedDriver = null;
    this.startingLocation = '';
    this.destinationLocation = '';
    this.dateControl.reset();
    this.showFuelStationsFlag = false;
  }

  onTabChanged(event: MatTabChangeEvent) {
    this.ngOnInit();
    if (event.index === 1) {

      this.getSavedRoutes();
    }
  }

  getSavedRoutes() {
    this.routesService.getAll(this.authService.getUserDetails().id).subscribe(
      (routes) => {
        this.routesList = routes;

      },
      (error) => {
        alert("There was an error while fetching the routes from the server!");
      }
    );
  }

  updateRoutesList() {
    this.routesService.getAll(this.authService.getUserDetails().id).subscribe(
      (routes) => {
        this.routesList = routes;
        this.cdRef.detectChanges();
      },
      (error) => {
        console.error("Error fetching routes", error);
      }
    );
  }

  ngOnDestroy() {
    this.webSocketService.unsubscribeFromRouteStatuses();
    this.webSocketService.disconnectWebSocketConnection();
  }
}


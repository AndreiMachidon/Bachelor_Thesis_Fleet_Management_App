import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { } from 'googlemaps';
import { MatDialog } from '@angular/material/dialog';
import { VehicleService } from '../my-fleet/services/vehicle-service.service';
import { MyDriversService } from '../my-drivers/services/my-drivers-service.service';
import { AssignVehicleDialogComponent } from './dialogs/assign-vehicle-dialog/assign-vehicle-dialog.component';
import { Vehicle } from '../../admin-dashboard/models/vehicle.model';
import { AssignDriverDialogComponent } from './dialogs/assign-driver-dialog/assign-driver-dialog.component';
import { Driver } from 'src/app/components-2/auth/dto/Driver';
import { AuthService } from 'src/app/components-2/auth/services/auth.service';
import { GoogleMapsService } from './services/google-maps.service';
import { CustomWaypoint } from './util/custom-waypoint.interface';
import {FuelPricesService } from './services/fuel-prices.service';
import { calculateDistanceAndDurationBetweenWaypoints, calculateDurationInHoursAndMinutes, createCustomMarker, createInfoWindowForElectricStationsMarkerWaypoint, createInfoWindowForGasStationsMarkerWaypoint, createInfoWindowForRestBreaksMarkerWaypoint, getPointsAlongRoute } from './util/google.maps.util';
import { SaveFinalRouteDialogComponent } from './dialogs/save-final-route-dialog/save-final-route-dialog.component';
import { RoutesService } from './services/routes.service';
import { RouteDto } from './dto/route-dto.model';
import * as e from 'express';
import { WebSocketsService } from 'src/app/components-2/global-services/web-sockets.service';


@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css']
})
export class RoutesComponent {


  //I. ADD ROUTE WINDOW

  //1. Map, User, DirectionRenderer and DirectionService
  map: google.maps.Map;
  userPosition: google.maps.LatLng;
  directionRenderer: google.maps.DirectionsRenderer = null;
  directionService: google.maps.DirectionsService = null;

  //2. For starting and destination location
  startingLocationControl = new FormControl();
  destinationLocationControl = new FormControl();
  startingLocation: string = '';
  destinationLocation: string = '';


  //3. Details of the optimal route
  isRouteConfigured: boolean = false;
  distance: number;
  duration: number;
  directionResult: google.maps.DirectionsResult = null;

  //4. Flags for showing the current window
  showSelectOptions: boolean = true;
  showAddRoute: boolean = false;
  showViewRoutes: boolean = true;

  //5. For selecting the route date
  dateControl = new FormControl();
  minDate: Date = new Date();
  startTime: Date = null;
  arrivalTime: Date = null;

  //6.Selected Vehicle and driver
  selectedVehicle: Vehicle = null;
  selectedDriver: Driver = null;

  //7. For fuel stations
  showFuelStationsFlag: boolean = false;
  fuelStationsMarkers: google.maps.Marker[] = [];

  //8. For custom waypoints
  waypoints: CustomWaypoint[] = [];
  waypointsMarkers: google.maps.Marker[] = [];

  @ViewChild('startingLocationAuto') startingLocationAuto: MatAutocomplete;
  @ViewChild('destinationLocationAuto') destinationLocationAuto: MatAutocomplete;

  //II. VIEW ROUTES WINDOW
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
        console.log("New route status received:", routeStatus);
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
        latLngBounds: { //europe limits
          north: 71,
          south: 34,
          east: 40,
          west: -25,
        },
        strictBounds: true,
      },
    };
    this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, mapOptions);
    const trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(this.map);
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
        this.directionRenderer.setMap(this.map);
        this.directionRenderer.setDirections(response);
        this.distance = response.routes[0].legs.reduce((acc, leg) => acc + leg.distance.value, 0);
        this.duration = response.routes[0].legs.reduce((acc, leg) => acc + leg.duration.value, 0);
        this.map.fitBounds(response.routes[0].bounds);
        this.directionResult = response;
        this.isRouteConfigured = true;

        //marker for start
        const startMarker = createCustomMarker(this.map, response.routes[0].legs[0].start_location, '../../../assets/markers/start_point.png');
        this.waypointsMarkers.push(startMarker);

        // Marker for destination
        const endMarker = createCustomMarker(this.map, response.routes[0].legs[response.routes[0].legs.length - 1].end_location, '../../../assets/markers/end_point.png');
        this.waypointsMarkers.push(endMarker);

        //adding waypoints for rest breaks
        if (!isFuelWaypointAdded && !areBreaksWaypointsAdded) {
          this.addRestBreakWaipoints(response);
        }

        //placing markers for waypoints
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

  addRestBreakWaipoints(directionResult: google.maps.DirectionsResult) {
    const maxDrivingTime = 4.5 * 3600; // 4.5 hours in seconds
    let totalDrivenTime = 0;
    let breakpoints = [];

    directionResult.routes[0].legs.forEach((leg) => {
      leg.steps.forEach((step) => {
        totalDrivenTime += step.duration.value;
        if (totalDrivenTime >= maxDrivingTime) {
          totalDrivenTime = 0;
          breakpoints.push(step.end_location);
        }
      });
    });

    breakpoints.forEach((breakpoint, index) => {
      let waypoint: CustomWaypoint = {
        location: breakpoint,
        stopover: true,
        type: "restBreak",
        restBreakDuration: 45 ,
        placeId: null
      };
      this.waypoints.push(waypoint);
    });

    this.findOptimalRoute(false, true);

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
        if(response.places !== undefined){
          response.places.forEach((place) => {
            this.createMarkerForElectricStation(place);
          })
        }
      });
    } else {
      this.googleMapsService.getNearbyGasStations(request).subscribe((response: any) => {
        if(response.places !== undefined){
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
      infoWindowContent.style.width = '500px';
  
      // Adăugarea titlului stației
      const stationName = document.createElement('div');
      stationName.style.fontSize = '25px';
      stationName.style.fontWeight = 'bold';
      stationName.style.color = '#333';
      stationName.textContent = place.displayName.text;
      infoWindowContent.appendChild(stationName);
  
      //getting the country for the place
      const country = this.fuelPriceService.getCountryFromPlace(place);
      const averageGasolinePrice = this.fuelPriceService.getGasolinePrice(country);
      const averageDieselPrice = this.fuelPriceService.getDieselPrice(country);
  
      // Adăugăm opțiunile de combustibil la infowindow
      let fuelOptionsHtml = '';

      if (averageGasolinePrice && averageDieselPrice) {
        fuelOptionsHtml = `<div style="margin-top: 10px; color:black;">
        <strong>Gasoline:</strong> ${averageGasolinePrice} €/L<br>
        <strong>Diesel:</strong> ${averageDieselPrice} €/L
        </div>`;
      }else{
        fuelOptionsHtml = `<div style="font-size:15px; margin-top: 10px; color:black;">No additional fuel information available.</div>`;
      }
      const fuelOptionsDiv = document.createElement('div');
      fuelOptionsDiv.innerHTML = fuelOptionsHtml;
      infoWindowContent.appendChild(fuelOptionsDiv);
  
      // Crearea și adăugarea butonului de adăugare la rută
      const addToRouteButton = document.createElement('button');
      addToRouteButton.textContent = 'Add to route';
      Object.assign(addToRouteButton.style, {
        marginTop: '12px',
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '8px 16px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
      });
      if(this.selectedVehicle.fuelType === "GASOLINE"){
        addToRouteButton.onclick = () => {
          this.addStationWaypointToRoute(place, 'gasoline', averageGasolinePrice, averageDieselPrice, null);
        };
      }else{
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
      infoWindowContent.style.width = '500px';

      // Adăugarea titlului stației
      const stationName = document.createElement('div');
      stationName.style.fontSize = '25px';
      stationName.style.fontWeight = 'bold';
      stationName.style.color = '#333';
      stationName.textContent = place.displayName.text;
      infoWindowContent.appendChild(stationName);

      //getting the country for the place
      const country = this.fuelPriceService.getCountryFromPlace(place);
      const averagePrice = this.fuelPriceService.getElectricityPrice(country);

      // Verificăm dacă există opțiuni de încărcare electrică
      let chargeOptionsHtml = '';
      if (place.evChargeOptions && place.evChargeOptions.connectorAggregation) {
        chargeOptionsHtml = place.evChargeOptions.connectorAggregation.map(connector => {
          return `<div style="color:black; display:flex; flex-direction:column; margin-bottom: 9px;">
                  <span style="font-weight: bold; font-size:14px;">${connector.type}: Max charge rate ${connector.maxChargeRateKw} kW</span>
                  <span style="font-size:13px;">Connectors available: ${connector.count}</span>
                </div>`;
        }).join('');
      } else {
        chargeOptionsHtml = `<div style="font-size:15px; margin-top: 10px; color:black;">No additional charging information available.</div>`;
      }

      // Adăugăm opțiunile de încărcare la infowindow
      const chargeOptionsDiv = document.createElement('div');
      chargeOptionsDiv.innerHTML = chargeOptionsHtml;
      infoWindowContent.appendChild(chargeOptionsDiv);

      //Daugam pretul mediu la electricitate
      if (averagePrice) {
        const averagePriceHtml = document.createElement('div');
        averagePriceHtml.innerHTML = `<div style="margin-top: 10px; font-size:14px; color:black;">
                                          Average electricity price: ${averagePrice} €/kWh
                                      </div>`;
        infoWindowContent.appendChild(averagePriceHtml);
      }

      // Crearea și adăugarea butonului de adăugare la rută
      const addToRouteButton = document.createElement('button');
      addToRouteButton.textContent = 'Add to route';
      Object.assign(addToRouteButton.style, {
        marginTop: '12px',
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '8px 16px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
      });
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

  addStationWaypointToRoute(place, type: string, gasolinePrice : number, dieselPrice: number, electricPrice: number) {
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
        placeId: place.id
      };
    } else if(type === 'gasoline'){
      waypoint = {
        location: new google.maps.LatLng(lat, long),
        stopover: true,
        type: "fuelStation",
        gasStationInfo: place,
        fuelType: "gasoline",
        gasolinePrice: gasolinePrice,
        diselPrice: dieselPrice,
        electricityPrice: electricPrice,
        placeId: place.id
      };
    } else{
      waypoint = {
        location: new google.maps.LatLng(lat, long),
        stopover: true,
        type: "fuelStation",
        gasStationInfo: place,
        fuelType: "diesel",
        gasolinePrice: gasolinePrice,
        diselPrice: dieselPrice,
        electricityPrice: electricPrice,
        placeId: place.id
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

    //1. Durata calatoriei
    const routeDuration = this.duration;

    // Calculăm durata totală a pauzelor în secunde
    const restBreaksDuration = this.waypoints.filter(wp => wp.type === "restBreak").length * 2700;

    // Calculăm durata totală a călătoriei
    const totalRouteDuration = routeDuration + restBreaksDuration;

    // Calculam durata în format ore și minute
    const routeDurationFormatted = calculateDurationInHoursAndMinutes(routeDuration);
    const restBreaksDurationFormatted = calculateDurationInHoursAndMinutes(restBreaksDuration);
    const totalRouteDurationFormatted = calculateDurationInHoursAndMinutes(totalRouteDuration);

    //Calculam arrivel time
    this.arrivalTime = new Date(this.startTime.getTime() + (routeDuration + restBreaksDuration) * 1000);

    //2. Distanta totala parcursa
    const totalDistance = this.distance / 1000;

    //3. Distanta si durata pentru fiecare etapa a calatoriei
    const waypointsInfo = calculateDistanceAndDurationBetweenWaypoints(this.directionResult, this.waypoints);

    //calculam pretul mediu la carburant pentru toate statiile de alimentare/incarcare de pe toata ruta
    let averageFuelPrice = 0;
    let numberOfFuelStations = 0;
 
    //4. Costurile de carburant
    this.waypoints.forEach((waypoint) => {
      if(waypoint.type !== "restBreak"){
        if(this.selectedVehicle.fuelType === "GASOLINE" && waypoint.fuelType === 'gasoline'){
          averageFuelPrice += waypoint.gasolinePrice;
          numberOfFuelStations++;
        }else if (this.selectedVehicle.fuelType === "DIESEL" && waypoint.fuelType === 'diesel'){
          averageFuelPrice += waypoint.diselPrice;
          numberOfFuelStations++;
        }else if(this.selectedVehicle.fuelType === "ELECTRIC" && waypoint.fuelType === 'electric'){
          averageFuelPrice += waypoint.electricityPrice;
          numberOfFuelStations++;
        }
    }
    });
    if(numberOfFuelStations > 0){
      averageFuelPrice = averageFuelPrice / numberOfFuelStations;
    }else{
      switch(this.selectedVehicle.fuelType){
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

    // Costul total al carburantului pentru ruta este: Cost = (Distanta totala / 100) * (Consumul mediu / 100) * (Pretul mediu la carburant)
    const totalDistanceInKm = totalDistance;
    const fuelConsumptionPer100Km = this.selectedVehicle.fuelConsumption;
    const totalFuelCost = (totalDistanceInKm / 100) * fuelConsumptionPer100Km * averageFuelPrice;

    //5. Costurile pentru sofer
    const driverRatePerKilometer = this.selectedDriver.ratePerKilometer; // tariful pe kilometru pentru șoferul selectat
    
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
      data: { routeFinalDetails: routeFinalDetails}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Saved') {
        console.log("Route saved successfully!");
        alert("Route saved successfully!");
        this.resetMapConfiguration();
      }else if(result === 'NotSaved'){
        console.log("There was an error while saving the route!");
        alert("There was an error while saving the route!");
      }
    });
 
  }

  resetMapConfiguration(){
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

  //View Routes Window
  getSavedRoutes(){
    this.routesService.getAll(this.authService.getUserDetails().id).subscribe(
      (routes) => {
      this.routesList = routes;
    },
    (error) => {
      console.log(error)
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

  ngOnDestroy(){
    this.webSocketService.unsubscribeFromRouteStatuses();
    this.webSocketService.disconnectWebSocketConnection();
  }
}


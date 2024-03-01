import { Component, ElementRef, ViewChild } from '@angular/core';
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
import { ElectricityPricesService } from './services/electricity-prices.service';
import { calculateDistanceAndDurationBetweenWaypoints, calculateDurationInHoursAndMinutes, createCustomMarker, createInfoWindowForElectricStationsMarkerWaypoint, createInfoWindowForGasStationsMarkerWaypoint, createInfoWindowForRestBreaksMarkerWaypoint, getPointsAlongRoute } from './util/google.maps.util';


@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css']
})
export class RoutesComponent {

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

  constructor(private vehicleService: VehicleService,
    private driversService: MyDriversService,
    public dialog: MatDialog,
    private authService: AuthService,
    private googleMapsService: GoogleMapsService,
    private electricityPricesService: ElectricityPricesService) {
  }

  ngOnInit(): void {
    this.getUserLocation();
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

  findOptimalRoute(isFuelWaypointAdded: boolean = false) {

    if (this.directionRenderer != null) {
      this.directionRenderer.setMap(null);
      if (!isFuelWaypointAdded) {
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
        if (!isFuelWaypointAdded) {
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
      };
      this.waypoints.push(waypoint);
    });

  }

  placeWaypointMarkers() {
    this.waypoints.forEach((waypoint, index) => {
      if (waypoint.type === "fuelStation") {
        const marker = createCustomMarker(this.map, waypoint.location, '../../../assets/markers/gas_station_waypoint.png');
        this.waypointsMarkers.push(marker);
        createInfoWindowForGasStationsMarkerWaypoint(this.map, waypoint, marker);

      } else if (waypoint.type === "electricStation") {
        const marker = createCustomMarker(this.map, waypoint.location, '../../../assets/markers/electric_station_waypoint.png');
        this.waypointsMarkers.push(marker);
        createInfoWindowForElectricStationsMarkerWaypoint(this.map, waypoint, marker);

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
          radius: 2000.0 //cautam in raza a 2 kilometrii
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
            if (place.fuelOptions) {
              this.createMarkerForFuelStation(place);
            }
          });
        }
      });
    }
  }

  createMarkerForFuelStation(place) {

    const marker = createCustomMarker(this.map, new google.maps.LatLng(place.location.latitude, place.location.longitude), '../../../assets/markers/gas_station_point.png');
    this.fuelStationsMarkers.push(marker);

    let fuelOptionsHtml = place.fuelOptions.fuelPrices.map(fuelOption => {
      let date = new Date(fuelOption.updateTime);
      let formattedDate = date.toLocaleDateString('ro-RO');
      return `<div style="color:black; display:flex; flex-direction:column; margin-bottom: 9px;">
                <span style="font-weight: bold; font-size:15px;">${fuelOption.type}: ${fuelOption.price.units}.${(fuelOption.price.nanos?.toString().padStart(9, '0').substring(0, 2) ?? '00')} ${fuelOption.price.currencyCode}</span>
                <span  font-size:12px;">Last updated: ${formattedDate}</span>
              </div>`;
    }).join('');

    google.maps.event.addListener(marker, 'click', () => {
      const infoWindowContent = document.createElement('div');
      infoWindowContent.style.width = '400px';
      infoWindowContent.innerHTML = `
        <div style="font-size: 25px; font-weight: bold; color: #333;">${place.displayName.text}</div>
        <div style="margin-top: 10px; font-size: 16px; color: black; font-weight: bold;">Available Fuel types:</div>
        <div style="margin-top: 20px;">${fuelOptionsHtml}</div>
      `;

      // Crearea și configurarea butonului
      const addToRouteButton = document.createElement('button');
      addToRouteButton.title = 'Add to route';
      addToRouteButton.textContent = 'Add to route';
      addToRouteButton.style.marginTop = '12px';
      addToRouteButton.style.backgroundColor = '#4CAF50';
      addToRouteButton.style.color = 'white';
      addToRouteButton.style.padding = '8px 16px';
      addToRouteButton.style.border = 'none';
      addToRouteButton.style.borderRadius = '4px';
      addToRouteButton.style.cursor = 'pointer';
      addToRouteButton.style.fontWeight = 'bold';
      addToRouteButton.onclick = () => {
        this.addStationWaypointToRoute(place);
      };

      // Adăugarea butonului la contentul InfoWindow
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
      const country = this.electricityPricesService.getCountryFromPlace(place);
      const averagePrice = this.electricityPricesService.getAveragePriceByCountry(country);

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
        this.addStationWaypointToRoute(place, 'electric', averagePrice);
      };
      infoWindowContent.appendChild(addToRouteButton);

      const infoWindow = new google.maps.InfoWindow({
        content: infoWindowContent,
      });

      infoWindow.open(this.map, marker);
    });
  }

  addStationWaypointToRoute(place, type: string = 'fuel', price: number = 0) {
    const lat = place.location.latitude;
    const long = place.location.longitude;

    let waypoint: CustomWaypoint = null;
    if (type === 'electric') {
      waypoint = {
        location: new google.maps.LatLng(lat, long),
        stopover: true,
        type: "electricStation",
        evChargeInfo: place,
        electricityPrice: price
      };
    } else {
      waypoint = {
        location: new google.maps.LatLng(lat, long),
        stopover: true,
        type: "fuelStation",
        gasStationInfo: place
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

    //2. Distanta totala parcursa
    const totalDistance = this.distance / 1000;

    //3. Distanta si durata pentru fiecare etapa a calatoriei
    const waypointsInfo = calculateDistanceAndDurationBetweenWaypoints(this.directionResult, this.waypoints);

    //4. Costurile de carburant

  }
}


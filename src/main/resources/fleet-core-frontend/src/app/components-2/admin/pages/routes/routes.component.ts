import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { } from 'googlemaps';

import { CustomMarker } from './util/google.maps.util';
import { MatDialog } from '@angular/material/dialog';
import { VehicleService } from '../my-fleet/services/vehicle-service.service';
import { MyDriversService } from '../my-drivers/services/my-drivers-service.service';
import { AssignVehicleDialogComponent } from './dialogs/assign-vehicle-dialog/assign-vehicle-dialog.component';
import { Vehicle } from '../../admin-dashboard/models/vehicle.model';
import { AssignDriverDialogComponent } from './dialogs/assign-driver-dialog/assign-driver-dialog.component';
import { Driver } from 'src/app/components-2/auth/dto/Driver';
import { AuthService } from 'src/app/components-2/auth/services/auth.service';


@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css']
})
export class RoutesComponent {



  map: google.maps.Map;
  userPosition: google.maps.LatLng;
  directionRenderer: google.maps.DirectionsRenderer = null;

  startingLocation: string = '';
  destinationLocation: string = '';

  startingLocationControl = new FormControl();
  destinationLocationControl = new FormControl();

  isRouteConfigured: boolean = false;

  distance: string;
  duration: string;
  durationInSeconds: number;
  directionResult: google.maps.DirectionsResult = null;

  //flags for showing the actions
  showSelectOptions: boolean = true;
  showAddRoute: boolean = false;
  showViewRoutes: boolean = true;

  //pentru selectarea datei rutei
  dateControl = new FormControl();
  minDate: Date = new Date();


  //selected date, vehicle and driver
  startTime: Date = null;
  arrivalTime: Date = null;
  selectedVehicle: Vehicle = null;
  selectedDriver: Driver = null;

  //fuel stations
  showFuelStationsFlag: boolean = false;
  fuelStationsMarkers: google.maps.Marker[] = [];

  //waypoints
  waypoints: google.maps.DirectionsWaypoint[] = [];


  @ViewChild('startingLocationAuto') startingLocationAuto: MatAutocomplete;
  @ViewChild('destinationLocationAuto') destinationLocationAuto: MatAutocomplete;

  constructor(private vehicleService: VehicleService,
    private driversService: MyDriversService,
    public dialog: MatDialog,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getUserLocation();
  }

  initMap() {
    const mapOptions: any = {
      center: this.userPosition,
      zoom: 15,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapId: '1d3279d2082b9187'
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
      strictBounds: false,
      types: [],
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
      strictBounds: false,
      types: [],
    };
    const autocomplete = new google.maps.places.Autocomplete(inputElement);
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      this.destinationLocation = place.formatted_address;
    });
  }

  openChoseVehicleDialog() {
    
    
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


  onDateSelected() {
    this.startTime = this.dateControl.value;
    this.arrivalTime = new Date(this.startTime.getTime() + this.durationInSeconds * 1000);
  }


  findOptimalRoute(isWaypointAdded: boolean = false) {

    if (this.directionRenderer != null) {
      this.directionRenderer.setMap(null);
      if(!isWaypointAdded){
        this.fuelStationsMarkers.forEach(marker => marker.setMap(null));
        this.fuelStationsMarkers = [];  
        this.waypoints = [];
      }
      
    }


    const directionService = new google.maps.DirectionsService();
    this.directionRenderer = new google.maps.DirectionsRenderer();
    this.directionRenderer.setOptions({
      draggable: true,
      markerOptions: {
        draggable: true,
        animation: google.maps.Animation.DROP,
        icon: {
          url: '../../../assets/markers/start_point.png',
          scaledSize: new google.maps.Size(40, 40)
        },
      },
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
          repeat: '10px'
        }]
      }
    });



    const request: google.maps.DirectionsRequest = {
      origin: this.startingLocation,
      destination: this.destinationLocation,
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC,
      waypoints: this.waypoints,
    }

    directionService.route(request, (response: google.maps.DirectionsResult, status: google.maps.DirectionsStatus) => {

      if (status === google.maps.DirectionsStatus.OK) {
        this.directionRenderer.setMap(this.map);
        this.directionRenderer.setDirections(response);
        this.distance = response.routes[0].legs[0].distance.text;
        this.duration = response.routes[0].legs[0].duration.text;
        this.durationInSeconds = response.routes[0].legs[0].duration.value;
        this.map.fitBounds(response.routes[0].bounds);
        this.isRouteConfigured = true;
        this.directionResult = response;

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

  showFuelStations(){
    this.showFuelStationsFlag = !this.showFuelStationsFlag;
    if(this.showFuelStationsFlag){
      this.findStationsAlongRoute(this.map, this.directionResult);
    }else{
      this.fuelStationsMarkers.forEach(marker => marker.setMap(null));
      this.fuelStationsMarkers = [];
    }
  }
 

  findStationsAlongRoute(map, directionResult) {
    const points = this.getPointsAlongRoute(directionResult);
    points.forEach((point) => {
      this.findStations(map, point);
    });
  }


  findStations(map, location) {
    const service = new google.maps.places.PlacesService(map);
    let stationType = "";
    if(this.selectedVehicle.fuelType === "ELECTRIC"){
      stationType = "electric vehicle charging station";
    }else{
      stationType = "fuel station";
    }

    const request: google.maps.places.PlaceSearchRequest = {
      location: location,
      keyword: stationType,
      radius: 2000,
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        const filteredFuelStations = results.slice(0, 5);
        console.log(filteredFuelStations);
        
        filteredFuelStations.forEach(place => {
          this.createMarkerForFuelStation(map, place, stationType);
        });
      }
    });
  }

  /**
   * Here we will select the points along the route where we will search for fuel stations
   * In order to limit the number of requests to the Google Places API, we will select just some points along the route in order to search for fuel stations alongise it
   */
  getPointsAlongRoute(directionResult) {
    let points = [];
    const legs = directionResult.routes[0].legs;

    //total route distance in meters
    const totalDistance = directionResult.routes[0].legs.reduce((total, leg) => total + leg.distance.value, 0);

    //the interval in kilometers in which we will select the points along the route to search for fuel stations
    let interval = 300 * 1000; //we will search for fuel stations every 300 km

    //accumulated distance between 2 points along the route in which we will search for fuel stations
    let accumulatedDistance = 0;

    //1. Case 1: If the total distance is shorter then the interval, we will search for fuel stations at the midpoint of the route
    if (totalDistance < interval) {
      const midpoint = this.calculateMidpoint(directionResult);
      points.push(midpoint);
    } else {
      //2. Case 2: If the total distance is greater then the interval, we will search for fuel stations at the start and end of the route and at the points along the route
      legs.forEach((leg) => {
        leg.steps.forEach((step) => {
          accumulatedDistance += step.distance.value;
          if (accumulatedDistance >= interval) { //if the accumulated distance is greater then the interval, it shows that we need to search for fuel stations at that point
            points.push(step.start_location); //we push it into the array the points we are going to search fuel stations for
            accumulatedDistance -= interval; // we substract the interval from the acummulated distance, in order to keep an accurate distance between the current point and the next one
          }
        });
      });
    }

    return points;
  }

  calculateMidpoint(directionResult) {
    const startLocation = directionResult.routes[0].legs[0].start_location;
    const endLocation = directionResult.routes[0].legs.slice(-1)[0].end_location;

    return new google.maps.LatLng(
      (startLocation.lat() + endLocation.lat()) / 2,
      (startLocation.lng() + endLocation.lng()) / 2
    );
  }

  createMarkerForFuelStation(map, place, stationType) {
    const iconUrl = stationType === "fuel station"
        ? '../../../assets/markers/gas_station_point.png'
        : '../../../assets/markers/electric_station_point.png';

    const marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        animation: google.maps.Animation.DROP,
        icon: {
            url: iconUrl,
            scaledSize: new google.maps.Size(40, 40)
        },
    });

    this.fuelStationsMarkers.push(marker);

    google.maps.event.addListener(marker, 'click', () => {
        const infoWindowContent = document.createElement('div');
        infoWindowContent.innerHTML = `<div style="font-size: 16px; font-weight: bold; color:black;">${place.name}</div>`;
        const addButton = document.createElement('button');
        addButton.textContent = 'Add to route';
        addButton.classList.add('mat-raised-button');
        infoWindowContent.appendChild(addButton);

        const infoWindow = new google.maps.InfoWindow({
            content: infoWindowContent,
        });

        google.maps.event.addListener(infoWindow, 'domready', () => {
            addButton.addEventListener('click', () => {
                this.addStationToRoute(place.geometry.location.lat(), place.geometry.location.lng());
            });
        });

        infoWindow.open(map, marker);
    });
}

   addStationToRoute(lat, lng) {
      const waypoint: google.maps.DirectionsWaypoint = { location: new google.maps.LatLng(lat, lng), stopover: true };
      waypoint.stopover = true;
      this.waypoints.push(waypoint);
      this.findOptimalRoute(true);
   }

  calculateCosts() {

  }





}


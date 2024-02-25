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
import { GoogleMapsService } from './services/google-maps.service';
import { CustomWaypoint } from './util/custom-waypoint.interface';


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
  waypoints: CustomWaypoint[] = [];
  waypointsMarkers: google.maps.Marker[] = [];


  @ViewChild('startingLocationAuto') startingLocationAuto: MatAutocomplete;
  @ViewChild('destinationLocationAuto') destinationLocationAuto: MatAutocomplete;

  constructor(private vehicleService: VehicleService,
    private driversService: MyDriversService,
    public dialog: MatDialog,
    private authService: AuthService,
    private googleMapsService: GoogleMapsService
  ) { }

  ngOnInit(): void {
    this.getUserLocation();
  }

  initMap() {
    console.log('Google maps version:', google.maps.version);
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


  onDateSelected() {
    this.startTime = this.dateControl.value;
    this.arrivalTime = new Date(this.startTime.getTime() + this.durationInSeconds * 1000);
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



    const directionService = new google.maps.DirectionsService();
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

    directionService.route(request, (response: google.maps.DirectionsResult, status: google.maps.DirectionsStatus) => {

      if (status === google.maps.DirectionsStatus.OK) {
        this.directionRenderer.setMap(this.map);
        this.directionRenderer.setDirections(response);
        this.distance = response.routes[0].legs[0].distance.text;
        this.duration = response.routes[0].legs[0].duration.text;
        this.durationInSeconds = response.routes[0].legs[0].duration.value;
        this.map.fitBounds(response.routes[0].bounds);
        this.directionResult = response;
        this.isRouteConfigured = true;


        //marker for start
        const startMarker = new google.maps.Marker({
          map: this.map,
          position: response.routes[0].legs[0].start_location,
          icon: {
            url: '../../../assets/markers/start_point.png',
            scaledSize: new google.maps.Size(40, 40)
          }
        });
        this.waypointsMarkers.push(startMarker);

        // Marker for destination
        const endMarker = new google.maps.Marker({
          map: this.map,
          position: response.routes[0].legs[response.routes[0].legs.length - 1].end_location,
          icon: {
            url: '../../../assets/markers/end_point.png',
            scaledSize: new google.maps.Size(40, 40)
          }
        });

        this.waypointsMarkers.push(endMarker);

        //adding waypoints for rest breaks
        if(!isFuelWaypointAdded){
          this.addBreaksWaipoints(response);
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

  placeWaypointMarkers() {

    this.waypoints.forEach((waypoint, index) => {
      if (waypoint.type === "fuelStation") {
        const marker = new google.maps.Marker({
          map: this.map,
          position: waypoint.location,
          icon: {
            url: '../../../assets/markers/gas_station_waypoint.png',
            scaledSize: new google.maps.Size(40, 40)
          }
        });
        this.waypointsMarkers.push(marker);

        let fuelOptionsHtml = waypoint.gasStationInfo.fuelOptions.fuelPrices.map(fuelOption => {
          let date = new Date(fuelOption.updateTime);
          let formattedDate = date.toLocaleDateString('ro-RO');
          return `<div style="color:black; display:flex; flex-direction:column; margin-bottom: 9px;">
          <span style="font-weight: bold; font-size:15px;">${fuelOption.type}: ${fuelOption.price?.units ?? '00'}.${(fuelOption.price?.nanos?.toString().padStart(9, '0').substring(0, 2) ?? '00')} ${fuelOption.price?.currencyCode ?? 'N/A'}\L</span>
          <span  font-size:12px;">Last updated: ${formattedDate}</span>
                  </div>`;
        }).join('');

        google.maps.event.addListener(marker, 'click', () => {
          const infoWindowContent = document.createElement('div');
          infoWindowContent.style.width = '400px';
          infoWindowContent.innerHTML = `
            <div style="font-size: 25px; font-weight: bold; color: #333;">${waypoint.gasStationInfo.displayName.text}</div>
            <div style="margin-top: 10px; font-size: 16px; color: black; font-weight: bold;">Available Fuel types:</div>
            <div style="margin-top: 20px;">${fuelOptionsHtml}</div>
          `;

          const infoWindow = new google.maps.InfoWindow({
            content: infoWindowContent,
          });

          infoWindow.open(this.map, marker);
        });



      } else if (waypoint.type === "electricStation") {
        const marker = new google.maps.Marker({
          map: this.map,
          position: waypoint.location,
          icon: {
            url: '../../../assets/markers/gas_station_waypoint.png',
            scaledSize: new google.maps.Size(40, 40)
          }
        });
        this.waypointsMarkers.push(marker);

        google.maps.event.addListener(marker, 'click', () => {
          const infoWindowContent = document.createElement('div');
          infoWindowContent.style.width = '500px';

          // Adăugarea titlului stației
          const stationName = document.createElement('div');
          stationName.style.fontSize = '25px';
          stationName.style.fontWeight = 'bold';
          stationName.style.color = '#333';
          stationName.textContent = waypoint.evChargeInfo.displayName.text;
          infoWindowContent.appendChild(stationName);


          // Verificăm dacă există opțiuni de încărcare electrică
          let chargeOptionsHtml = '';
          if (waypoint.evChargeInfo.evChargeOptions && waypoint.evChargeInfo.evChargeOptions.connectorAggregation) {
            chargeOptionsHtml = waypoint.evChargeInfo.evChargeOptions.connectorAggregation.map(connector => {
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

          const infoWindow = new google.maps.InfoWindow({
            content: infoWindowContent,
          });

          infoWindow.open(this.map, marker);
        });
      } else if (waypoint.type === "restBreak") {
        const marker = new google.maps.Marker({
          map: this.map,
          position: waypoint.location,
          icon: {
            url: '../../../assets/markers/end_point.png', //todo: de schimbat iconita NEAPARAT
            scaledSize: new google.maps.Size(40, 40)
          },
          title: `Pauza ${index + 1}`
        });
        this.waypointsMarkers.push(marker);

        // Crearea conținutului pentru InfoWindow
        const infoWindowContent = document.createElement('div');
        infoWindowContent.style.width = '300px';
        infoWindowContent.style.padding = '10px';
        infoWindowContent.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';

        // Adăugarea titlului
        const title = document.createElement('div');
        title.style.fontSize = '18px';
        title.style.color = '#333';
        title.style.marginBottom = '5px';
        title.style.fontWeight = 'bold';
        title.textContent = `Rest Break number ${index + 1}`;
        infoWindowContent.appendChild(title);

        // Adăugarea descrierii
        const description = document.createElement('div');
        description.style.fontSize = '14px';
        description.style.color = '#555';
        description.textContent = 'Rest break for 45 minutes.';
        infoWindowContent.appendChild(description);

        // Crearea InfoWindow-ului și adăugarea conținutului personalizat
        const infoWindow = new google.maps.InfoWindow({
          content: infoWindowContent
        });

        marker.addListener('click', () => {
          infoWindow.open(this.map, marker);
        });

      }
    });
  }

  addBreaksWaipoints(directionResult) {
    const maxDrivingTime = 4.5 * 3600; // 4.5 hours in seconds

    let totalDrivenTime = 0;
    let breakpoints = [];

    directionResult.routes[0].legs.forEach((leg) => {
      leg.steps.forEach((step) => {
        totalDrivenTime += step.duration.value;
        if (totalDrivenTime >= maxDrivingTime) {
          // Resetăm contorul de timp și marcăm locația pentru pauză
          totalDrivenTime = 0;
          breakpoints.push(step.end_location);
        }
      });
    });

    breakpoints.forEach((breakpoint, index) => {
      let waypoint: CustomWaypoint = {
        location: breakpoint,
        stopover: true,
        type: "restBreak"
      };


      this.waypoints.push(waypoint);
    });


  }

  showFuelStations() {
    this.showFuelStationsFlag = !this.showFuelStationsFlag;
    if (this.showFuelStationsFlag && this.fuelStationsMarkers.length === 0) {
      this.findStationsAlongRoute(this.map, this.directionResult);
    } else if (this.showFuelStationsFlag && this.fuelStationsMarkers.length > 0) {
      this.fuelStationsMarkers.forEach(marker => marker.setMap(this.map));
    } else {
      this.fuelStationsMarkers.forEach(marker => marker.setMap(null));
    }
  }


  findStationsAlongRoute(map, directionResult) {
    const points = this.getPointsAlongRoute(directionResult);
    points.forEach((point) => {
      this.findStations(map, point);
    });
  }


  findStations(map, location) {

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
          radius: 20000.0 //cautam in raza a 2 kilometrii
        }
      },
      maxResultCount: 1
    }


    if (this.selectedVehicle.fuelType === "ELECTRIC") {
      this.googleMapsService.getNearbyChargingStations(request).subscribe((response: any) => {
        response.places.forEach((place) => {
          this.createMarkerForElectricStation(place);
        })
      });

    } else {
      this.googleMapsService.getNearbyGasStations(request).subscribe((response: any) => {
        response.places.forEach((place) => {
          if (place.fuelOptions) {
            this.createMarkerForFuelStation(place);
          }
        });
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
        this.addStationToRoute(place);
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
        this.addStationToRoute(place, 'electric');
      };
      infoWindowContent.appendChild(addToRouteButton);

      const infoWindow = new google.maps.InfoWindow({
        content: infoWindowContent,
      });

      infoWindow.open(this.map, marker);
    });
  }

  addStationToRoute(place, type: string = 'fuel') {
    const lat = place.location.latitude;
    const long = place.location.longitude;

    let waypoint: CustomWaypoint = null;
    if (type === 'electric') {
      waypoint = {
        location: new google.maps.LatLng(lat, long),
        stopover: true,
        type: "electricStation",
        evChargeInfo: place
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
    let interval = 150 * 1000; //we will search for fuel stations every 300 km

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
    const totalDistance = directionResult.routes[0].legs.reduce((acc, leg) => acc + leg.distance.value, 0);

    // Jumătatea distanței totale
    let halfDistance = totalDistance / 2;

    // Variabile pentru stocarea informațiilor despre mijlocul rutei
    let midPoint = null;
    let accumulatedDistance = 0;

    // Iterăm prin fiecare leg al rutei
    for (let leg of directionResult.routes[0].legs) {
      // Iterăm prin fiecare step al leg-ului
      for (let step of leg.steps) {
        accumulatedDistance += step.distance.value;

        // Verificăm dacă am depășit jumătatea distanței
        if (accumulatedDistance >= halfDistance) {
          // Salvăm locația de start a step-ului curent ca fiind mijlocul rutei
          midPoint = step.start_location;
          break;
        }
      }

      if (midPoint) break; // Dacă am găsit mijlocul, ieșim din buclă
    }

    // Returnăm mijlocul rutei ca obiect LatLng
    return midPoint ? new google.maps.LatLng(midPoint.lat(), midPoint.lng()) : null;

  }

  calculateCosts() {

  }

}


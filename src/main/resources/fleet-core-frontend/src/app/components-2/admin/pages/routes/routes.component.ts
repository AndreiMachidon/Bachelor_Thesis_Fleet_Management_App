import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import {} from 'googlemaps';

import { CustomMarker } from './util/google.maps.util';
import { MatDialog } from '@angular/material/dialog';
import { VehicleService } from '../my-fleet/services/vehicle-service.service';
import { MyDriversService } from '../my-drivers/services/my-drivers-service.service';
import { AssignVehicleDialogComponent } from './dialogs/assign-vehicle-dialog/assign-vehicle-dialog.component';
import { Vehicle } from '../../admin-dashboard/models/vehicle.model';
import { AssignDriverDialogComponent } from './dialogs/assign-driver-dialog/assign-driver-dialog.component';


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

  //flags for showing the actions
  showSelectOptions: boolean = true;
  showAddRoute: boolean = false;
  showViewRoutes: boolean = true;


  //selected vehicle and driver
  selectedVehicle: Vehicle = null;


  @ViewChild('startingLocationAuto') startingLocationAuto: MatAutocomplete;
  @ViewChild('destinationLocationAuto') destinationLocationAuto: MatAutocomplete;

  constructor(private vehicleService: VehicleService,
              private driversService: MyDriversService,
              public dialog: MatDialog,
            ) {}

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



  findOptimalRoute() {

      if(this.directionRenderer != null){
        this.directionRenderer.setMap(null);
      }
     

      const directionService = new google.maps.DirectionsService();
      this.directionRenderer = new google.maps.DirectionsRenderer();
      this.directionRenderer.setOptions({
          draggable: true,
          markerOptions: {
            draggable: true,
            animation: google.maps.Animation.DROP,
            icon: {
              url: '../../../assets/markers/map-pin.png',
              scaledSize: new google.maps.Size(40, 40)
            },
          },
          polylineOptions: {
            strokeOpacity: 0,
            icons: [{
                icon: {
                    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                    strokeColor: '#FF0000',
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
         unitSystem: google.maps.UnitSystem.METRIC
         //putem specifica si waypoints[] : DirectionsWaypoint[] -> altereaza ruta punand noi waypoint-uri in ruta 
         // nu mai mult de 10 waypoints ca suntem taxati suplimentar
         // fiecare waypoint are un location si un stopover -> location = locatia, stepover = daca vrem sa facem un stop la locatia respectiva (true) sau e doar o preferinta (false)
      }
      
      directionService.route(request, (response : google.maps.DirectionsResult, status: google.maps.DirectionsStatus) => {

         if (status === google.maps.DirectionsStatus.OK) {
            this.directionRenderer.setMap(this.map);
            this.directionRenderer.setDirections(response);
            this.distance = response.routes[0].legs[0].distance.text;
            this.duration = response.routes[0].legs[0].duration.text;
            this.isRouteConfigured = true;
         
         } else {
            alert("Cold not find a route between the two locations.")
         }
      });
  }

  openChoseVehicleDialog(){
      const dialogRef = this.dialog.open(AssignVehicleDialogComponent, {
        width: '1200px',
        height: '700px'
      })

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          console.log(result);
          
          this.selectedVehicle = result;
        }
      });
  }

   openChoseDriverDialog(){
    const dialogRef = this.dialog.open(AssignDriverDialogComponent, {
      width: '1200px',
      height: '700px'
    })
  }

  calculateCosts(){

  }
   

}


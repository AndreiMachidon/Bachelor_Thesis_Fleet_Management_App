import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';


import {} from 'googlemaps';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css']
})
export class RoutesComponent {
  map: google.maps.Map;
  userPosition: google.maps.LatLng;

  directionsDisplay: google.maps.DirectionsRenderer;

  startingLocation: string = '';
  destinationLocation: string = '';

  startingLocationControl = new FormControl();
  destinationLocationControl = new FormControl();


  @ViewChild('startingLocationAuto') startingLocationAuto: MatAutocomplete;
  @ViewChild('destinationLocationAuto') destinationLocationAuto: MatAutocomplete;

  constructor() {}


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

    distance: string;
    duration: string;

    calculateRoute() {
      const directionService = new google.maps.DirectionsService();
      this.directionsDisplay = new google.maps.DirectionsRenderer();
      
      this.directionsDisplay.setDirections(null);
      
   
      const request = {
         origin: this.startingLocation,
         destination: this.destinationLocation,
         travelMode: google.maps.TravelMode.DRIVING,
         unitSystem: google.maps.UnitSystem.METRIC
      }
   
      directionService.route(request, (response, status) => {
         if (status === google.maps.DirectionsStatus.OK) {
            
            this.directionsDisplay.setMap(this.map);
            this.directionsDisplay.setDirections(response);
            this.distance = response.routes[0].legs[0].distance.text;
            this.duration = response.routes[0].legs[0].duration.text;
         
         } else {
            console.error('Directions request failed:', status);
         }
      });
   }
   

}


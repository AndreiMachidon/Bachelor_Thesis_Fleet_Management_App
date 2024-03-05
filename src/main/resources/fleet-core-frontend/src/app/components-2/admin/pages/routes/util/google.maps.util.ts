import { } from 'googlemaps';
import { CustomWaypoint } from './custom-waypoint.interface';
import { FuelPricesService } from '../services/fuel-prices.service';
import { RouteDto } from '../dto/route-dto.model';
import { WaypointDto } from '../dto/waypoint-dto.model';

function createCustomMarker(map: google.maps.Map, location: google.maps.LatLng, iconUrl: string) {
  return new google.maps.Marker({
    map: map,
    position: location,
    icon: {
      url: iconUrl,
      scaledSize: new google.maps.Size(40, 40)
    }
  });
}

function createInfoWindowForGasStationsMarkerWaypoint(map: google.maps.Map, waypoint: CustomWaypoint, marker: google.maps.Marker, fuelPriceService: FuelPricesService, isForDisplayRoute: boolean = false) {
  google.maps.event.addListener(marker, 'click', () => {
    const infoWindowContent = document.createElement('div');
    infoWindowContent.style.width = '500px';

    // Adăugarea titlului stației
    const stationName = document.createElement('div');
    stationName.style.fontSize = '25px';
    stationName.style.fontWeight = 'bold';
    stationName.style.color = '#333';
    stationName.textContent = waypoint.gasStationInfo.displayName.text;
    infoWindowContent.appendChild(stationName);

    // Adăugăm opțiunile de combustibil la infowindow
    let fuelOptionsHtml = '';

    if (waypoint.gasolinePrice && waypoint.diselPrice) {
      fuelOptionsHtml = `<div style="margin-top: 10px; color:black;">
      <strong>Gasoline:</strong> ${waypoint.gasolinePrice} €/L<br>
      <strong>Diesel:</strong> ${waypoint.diselPrice} €/L
      </div>`;
    }else{
      fuelOptionsHtml = `<div style="font-size:15px; margin-top: 10px; color:black;">No additional fuel information available.</div>`;
    }

    const fuelOptionsDiv = document.createElement('div');
    fuelOptionsDiv.innerHTML = fuelOptionsHtml;
    infoWindowContent.appendChild(fuelOptionsDiv);




    const infoWindow = new google.maps.InfoWindow({
      content: infoWindowContent,
    });

    infoWindow.open(map, marker);
  });
}

function createInfoWindowForElectricStationsMarkerWaypoint(map: google.maps.Map, waypoint: CustomWaypoint, marker: google.maps.Marker, fuelPriceService: FuelPricesService) {

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
    const averagePriceHtml = document.createElement('div');
    averagePriceHtml.innerHTML = `<div style="margin-top: 10px; font-size:14px; color:black;">
                                        Average electricity price: ${waypoint.electricityPrice} €/kWh
                                    </div>`;
    infoWindowContent.appendChild(averagePriceHtml);

    const infoWindow = new google.maps.InfoWindow({
      content: infoWindowContent,
    });

    infoWindow.open(map, marker);
  });
}

function createInfoWindowForRestBreaksMarkerWaypoint(map: google.maps.Map, waypoint: CustomWaypoint, marker: google.maps.Marker, index: number) {
  // Adding content for the infoWindow
  const infoWindowContent = document.createElement('div');
  infoWindowContent.style.width = '300px';
  infoWindowContent.style.padding = '10px';
  infoWindowContent.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';

  // Adding the title
  const title = document.createElement('div');
  title.style.fontSize = '18px';
  title.style.color = '#333';
  title.style.marginBottom = '5px';
  title.style.fontWeight = 'bold';
  title.textContent = `Rest Break number ${index + 1}`;
  infoWindowContent.appendChild(title);

  // Adding description
  const description = document.createElement('div');
  description.style.fontSize = '14px';
  description.style.color = '#555';
  description.textContent = 'Rest break for 45 minutes.';
  infoWindowContent.appendChild(description);

  // Creating the infowindow
  const infoWindow = new google.maps.InfoWindow({
    content: infoWindowContent
  });

  marker.addListener('click', () => {
    infoWindow.open(map, marker);
  });

}

/**
* Here we will select the points along the route where we will search for fuel stations
* In order to limit the number of requests to the Google Places API, we will select just some points along the route in order to search for fuel stations alongise it
*/
function getPointsAlongRoute(directionResult: google.maps.DirectionsResult) {
  let points = [];
  const legs = directionResult.routes[0].legs;

  //total route distance in meters
  const totalDistance = directionResult.routes[0].legs.reduce((total, leg) => total + leg.distance.value, 0);

  //the interval in kilometers in which we will select the points along the route to search for fuel stations
  let interval = 250 * 1000; //we will search for fuel stations every 300 km

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

function calculateMidpoint(directionResult: google.maps.DirectionsResult) {
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

function calculateDurationInHoursAndMinutes(durationInSeconds: number) {
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

//functions for calculating final information about the route
function calculateDistanceAndDurationBetweenWaypoints(directionResult: google.maps.DirectionsResult, customWaypoints: CustomWaypoint[]) {
  let result = [];
  const legs = directionResult.routes[0].legs;
  legs.forEach((leg, index) => {
    const duration = leg.duration.text;
    const distance = leg.distance.text;
    const startAddress = leg.start_address;
    const endAddress = leg.end_address;
    const customWaypoint = customWaypoints.find(waypoint =>
      Math.abs(waypoint.location.lat() - leg.end_location.lat()) < 0.01 &&
      Math.abs(waypoint.location.lng() - leg.end_location.lng()) < 0.01
    );;

    const type = customWaypoint?.type ?? "destination";

    const startLocation = leg.start_location;
    const endLocation = leg.end_location;

    result.push(
      {
        'duration': duration,
        'distance': distance,
        'type': type,
        'startAddress': startAddress,
        'endAddress': endAddress,
        'startLocation': startLocation,
        'endLocation': endLocation,
        'gasolinePrice': customWaypoint?.gasolinePrice,
        'diselPrice': customWaypoint?.diselPrice,
        'electricityPrice': customWaypoint?.electricityPrice,
        'restBreakDuration': customWaypoint?.restBreakDuration,
        'evChargeInfo': customWaypoint?.evChargeInfo,
        'gasStationInfo': customWaypoint?.gasStationInfo
      });
  });
  return result;
}

function convertWaypointDtoToCustomWaypoint(waypoint): CustomWaypoint {
  const location = new google.maps.LatLng(waypoint.latitude, waypoint.longitude);

  let connectorAggregation = waypoint.connectors ? Object.entries(waypoint.connectors).map(([type, maxChargeRateKw]) => {
    return { type, maxChargeRateKw };
  }) : undefined;

  let evChargeInfo = undefined;
  if (connectorAggregation) {
    evChargeInfo = {
      displayName: { text: waypoint.electricStationName },
      evChargeOptions: {
        connectorAggregation
      }
    };
  }

  let gasStationInfo = {
    displayName: { text: waypoint.fuelStationName }
  };


  return {
    location,
    stopover: true,
    type: waypoint.waypointType,
    gasStationInfo: gasStationInfo,
    evChargeInfo,
    gasolinePrice: waypoint.gasolinePrice,
    diselPrice: waypoint.dieselPrice,
    electricityPrice: waypoint.electricityPrice,
    restBreakDuration: waypoint.duration
  };
}


export {
  createCustomMarker,
  createInfoWindowForGasStationsMarkerWaypoint,
  createInfoWindowForElectricStationsMarkerWaypoint,
  createInfoWindowForRestBreaksMarkerWaypoint,
  getPointsAlongRoute,
  calculateMidpoint,
  calculateDurationInHoursAndMinutes,
  calculateDistanceAndDurationBetweenWaypoints,
  convertWaypointDtoToCustomWaypoint
};


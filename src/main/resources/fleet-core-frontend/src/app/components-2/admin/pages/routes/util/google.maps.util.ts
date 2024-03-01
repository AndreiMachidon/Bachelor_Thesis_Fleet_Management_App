import { } from 'googlemaps';
import { CustomWaypoint } from './custom-waypoint.interface';

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

function createInfoWindowForGasStationsMarkerWaypoint(map: google.maps.Map, waypoint: CustomWaypoint, marker: google.maps.Marker) {
  let fuelOptionsHtml = waypoint.gasStationInfo.fuelOptions.fuelPrices.map(fuelOption => {
    let date = new Date(fuelOption.updateTime);
    let formattedDate = date.toLocaleDateString('ro-RO');
    return `<div style="color:black; display:flex; flex-direction:column; margin-bottom: 9px;">
    <span style="font-weight: bold; font-size:15px;">${fuelOption.type}: ${fuelOption.price?.units ?? '00'}.${(fuelOption.price?.nanos?.toString().padStart(9, '0').substring(0, 2) ?? '00')} ${fuelOption.price?.currencyCode ?? 'N/A'}\L</span>
    <span style="font-size: 12px;">Last updated: ${formattedDate}</span>
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

    infoWindow.open(map, marker);
  });
}

function createInfoWindowForElectricStationsMarkerWaypoint(map: google.maps.Map, waypoint: CustomWaypoint, marker: google.maps.Marker) {

  google.maps.event.addListener(marker, 'click', () => {
    const infoWindowContent = document.createElement('div');
    infoWindowContent.style.width = '500px';

    // Adding the title of the electric station
    const stationName = document.createElement('div');
    stationName.style.fontSize = '25px';
    stationName.style.fontWeight = 'bold';
    stationName.style.color = '#333';
    stationName.textContent = waypoint.evChargeInfo.displayName.text;
    infoWindowContent.appendChild(stationName);


    // We verify if there is are available options for charging stations
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

    // We add the charging options to the info window
    const chargeOptionsDiv = document.createElement('div');
    chargeOptionsDiv.innerHTML = chargeOptionsHtml;
    infoWindowContent.appendChild(chargeOptionsDiv);

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
  let interval = 100 * 1000; //we will search for fuel stations every 300 km

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
  customWaypoints.forEach(waypoint => console.log(waypoint.location.lat() + " " + waypoint.location.lng()));
  console.log("Legs: ");

  legs.forEach(leg => console.log(leg.end_location.lat() + " " + leg.end_location.lng()));
  legs.forEach((leg, index) => {
    const duration = leg.duration.text;
    const distance = leg.distance.text;
    const startAddress = leg.start_address;
    const endAddress = leg.end_address;
    const type = customWaypoints.find(waypoint =>
      Math.abs(waypoint.location.lat() - leg.end_location.lat()) < 0.01 &&
      Math.abs(waypoint.location.lng() - leg.end_location.lng()) < 0.01
    )?.type ?? "destination";

    result.push(
      { 'duration': duration,
        'distance': distance,
        'type': type,
        'startAddress': startAddress,
        'endAddress': endAddress });
  });
  return result;
}

export {
  createCustomMarker,
  createInfoWindowForGasStationsMarkerWaypoint,
  createInfoWindowForElectricStationsMarkerWaypoint,
  createInfoWindowForRestBreaksMarkerWaypoint,
  getPointsAlongRoute,
  calculateMidpoint,
  calculateDurationInHoursAndMinutes,
  calculateDistanceAndDurationBetweenWaypoints
};


import { } from 'googlemaps';
import { CustomWaypoint } from './custom-waypoint.interface';
import { FuelPricesService } from '../services/fuel-prices.service';
import { RouteDto } from '../dto/route-dto.model';
import { WaypointDto } from '../dto/waypoint-dto.model';
import { RouteAlertDto } from '../dto/route-alert-dto.model';
import { GoogleMapsService } from '../services/google-maps.service';

function createCustomMarker(map: google.maps.Map, location: google.maps.LatLng, iconUrl: string, isDriverMarker: boolean = false) {
  return new google.maps.Marker({
    map: map,
    position: location,
    icon: {
      url: iconUrl,
      scaledSize: new google.maps.Size(40, 40)
    },
    animation: isDriverMarker ? google.maps.Animation.BOUNCE : null
  });
}

function createInfoWindowForGasStationsMarkerWaypoint(map: google.maps.Map, waypoint: CustomWaypoint, marker: google.maps.Marker, fuelPriceService: FuelPricesService, isForDisplayRoute: boolean = false) {

  google.maps.event.addListener(marker, 'click', () => {
    const infoWindowContent = document.createElement('div');
    infoWindowContent.className = 'info-window-content';
    infoWindowContent.style.width = '500px';
    infoWindowContent.style.height = 'auto';

    
    const stationName = document.createElement('div');
    stationName.style.fontSize = '25px';
    stationName.style.fontWeight = 'bold';
    stationName.style.color = '#0E3F89';
    stationName.textContent = waypoint.gasStationInfo.displayName.text;

    
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
    stationAddress.textContent = waypoint.address;
    infoWindowContent.appendChild(stationAddress);


    
    let fuelOptionsHtml = '';

    if (waypoint.gasolinePrice && waypoint.diselPrice) {
      fuelOptionsHtml = `<div style="margin-top: 20px; color:black; font-size:15px; font-weight:bold; margin-bottom:10px">
      <strong>Average Gasoline Price: </strong> ${waypoint.gasolinePrice} €/L<br>
      <strong>Average Diesel Price: </strong> ${waypoint.diselPrice} €/L
      </div>`;
    } else {
      fuelOptionsHtml = `<div style="font-size:15px; margin-top: 25px; color:black;">No additional fuel information available.</div>`;
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
      infoWindowContent.className = 'info-window-content';
      infoWindowContent.style.width = '500px';
      infoWindowContent.style.height = 'auto';

      
      const stationName = document.createElement('div');
      stationName.style.fontSize = '25px';
      stationName.style.fontWeight = 'bold';
      stationName.style.color = '#0E3F89';
      stationName.textContent = waypoint.evChargeInfo.displayName.text;

      
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
      stationAddress.textContent = waypoint.address;
      infoWindowContent.appendChild(stationAddress);



    
    let chargeOptionsHtml = '';

    if (waypoint.evChargeInfo.evChargeOptions && waypoint.evChargeInfo.evChargeOptions.connectorAggregation) {
      chargeOptionsHtml += '<div style="font-weight: bold; margin-bottom: 10px; margin-top: 12px; font-size:18px; color: #0E3F89;">Charge Options:</div>';
      chargeOptionsHtml += waypoint.evChargeInfo.evChargeOptions.connectorAggregation.map((connector, index, array) => {
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

    
    if (waypoint.electricityPrice) {
      const averagePriceHtml = document.createElement('div');
      averagePriceHtml.innerHTML = `<div style="margin-top: 20px; color:black; font-size:15px; font-weight:bold; margin-bottom:10px">
                                        Average ev charging price : ${waypoint.electricityPrice} €/kWh
                                    </div>`;
      infoWindowContent.appendChild(averagePriceHtml);
    }

    const infoWindow = new google.maps.InfoWindow({
      content: infoWindowContent,
    });

    infoWindow.open(map, marker);
  });
}

function createInfoWindowForRestBreaksMarkerWaypoint(map: google.maps.Map, waypoint: CustomWaypoint, marker: google.maps.Marker, index: number) {
  const infoWindowContent = document.createElement('div');
  infoWindowContent.className = 'info-window-content';
  infoWindowContent.style.width = '500px';
  infoWindowContent.style.height = '200px';
  infoWindowContent.style.paddingRight = '10px';

  
  const stationName = document.createElement('div');
  stationName.style.fontSize = '25px';
  stationName.style.fontWeight = 'bold';
  stationName.style.color = '#0E3F89';
  stationName.textContent = "Rest Break " + (index + 1) + " -45 minutes";

  
  const stationImage = document.createElement('img');
  stationImage.src = '../../../assets/images/rest-break-info-window-icon.svg';
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

  const restBreakName = document.createElement('div');
  restBreakName.style.fontSize = '16px';
  restBreakName.style.color = '#5CABEC';
  restBreakName.style.marginTop = '10px';
  restBreakName.style.fontWeight = 'bold';
  restBreakName.textContent = waypoint.restBreakLocationName;
  infoWindowContent.appendChild(restBreakName);

  const restBreakInfoParagraph = document.createElement('div');
  restBreakInfoParagraph.style.fontSize = '15px';
  restBreakInfoParagraph.style.color = 'black';
  restBreakInfoParagraph.style.marginTop = '10px';
  restBreakInfoParagraph.innerHTML = `
    <div style="font-size:15px; color:black; margin-top:10px; text-align:justify; font-weight:bold;">
      <p>According to European regulations, drivers are required to take a rest break after every 4.5 hours of driving. </p>
      <p>The duration of this break should be 45 minutes. </p>
      <p>This location is indicative as the algorithm seeks leisure locations near the required rest break area.</p>
    </div>`;
    
  infoWindowContent.appendChild(restBreakInfoParagraph);


  
  const infoWindow = new google.maps.InfoWindow({
    content: infoWindowContent
  });

  marker.addListener('click', () => {
    infoWindow.open(map, marker);
  });

}

function formatAlertType(alertType: string): string {
  switch (alertType) {
    case 'VEHICLE_BREAKDOWN':
      return 'Vehicle Breakdown';
    case 'TRAFFIC_JAM':
      return 'Traffic Jam';
    case 'ACCIDENT_REPORT':
      return 'Accident Report';
    default:
      return "Road alert";
  }
}

function formatAlertStatus(alertStatus: string): string {
  switch (alertStatus) {
    case 'RESOLVED':
      return 'Resolved';
    case 'UNRESOLVED':
      return 'Unresolved';
    default:
      return 'Unresolved';
  }
}

function createInfoWindowForAlertsMarker(map: google.maps.Map, alert: RouteAlertDto, marker: google.maps.Marker) {

  const statusColor = alert.alertStatus === 'RESOLVED' ? 'green' : 'red';
  let infoWindowContent = `
  <div style="font-size: 14px; color: #333; width:300px;">
    <h2 style="margin: 0; padding-bottom: 5px; border-bottom: 1px solid #ccc; font-weight:bold;">Alert Details</h2>
    <p style="margin: 5px 0; font-weight:bold"><strong>Type:</strong> ${formatAlertType(alert.alertType)}</p>
    <p style="margin: 5px 0;"><strong>Description:</strong> ${alert.alertDescription}</p>
    <p style="margin: 5px 0; font-size: 14px; color: ${statusColor};"><strong>Status:</strong> ${formatAlertStatus(alert.alertStatus)}</p>
    <p style="margin: 5px 0;"><strong>Issued:</strong> ${new Date(alert.alertIssuedDate).toLocaleString()}</p>
    
  </div>`;

  if (alert.alertStatus === "RESOLVED" && alert.alertResolvedDate) {
    infoWindowContent += `<p style="margin: 5px 0; font-size: 14px; color: black;"><strong>Resolved:</strong> ${new Date(alert.alertResolvedDate).toLocaleString()}</p>
                          <p style="margin: 5px 0; font-size: 14px; color: black;"><strong>Costs: </strong> ${alert.costs} €</p>`;
  }

  infoWindowContent += `</div>`;

  const infoWindow = new google.maps.InfoWindow({
    content: infoWindowContent,
  });

  marker.addListener("click", () => {
    infoWindow.open(map, marker);
  });
}

function getPointsAlongRoute(directionResult: google.maps.DirectionsResult) {
  let points = [];
  const legs = directionResult.routes[0].legs;
  const totalDistance = directionResult.routes[0].legs.reduce((total, leg) => total + leg.distance.value, 0);
  let interval = 100 * 1000; 
  let accumulatedDistance = 0;

  if (totalDistance < interval) {
    const midpoint = this.calculateMidpoint(directionResult);
    points.push(midpoint);
  } else {
    legs.forEach((leg) => {
      leg.steps.forEach((step) => {
        accumulatedDistance += step.distance.value;
        if (accumulatedDistance >= interval) { 
          points.push(step.start_location); 
          accumulatedDistance -= interval; 
        }
      });
    });
  }

  return points;
}

function calculateMidpoint(directionResult: google.maps.DirectionsResult) {
  const totalDistance = directionResult.routes[0].legs.reduce((acc, leg) => acc + leg.distance.value, 0);
  let halfDistance = totalDistance / 2;

  let midPoint = null;
  let accumulatedDistance = 0;

  for (let leg of directionResult.routes[0].legs) {
    for (let step of leg.steps) {
      accumulatedDistance += step.distance.value;
      if (accumulatedDistance >= halfDistance) { 
        midPoint = step.start_location;
        break;
      }
    }
    if (midPoint) break; 
  }
  return midPoint ? new google.maps.LatLng(midPoint.lat(), midPoint.lng()) : null;

}

function calculateDurationInHoursAndMinutes(durationInSeconds: number) {
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}


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
        'gasStationInfo': customWaypoint?.gasStationInfo,
        'placeId': customWaypoint?.placeId,
        'restBreakLocationName': customWaypoint?.restBreakLocationName,
      });
  });
  return result;
}

function convertWaypointDtoToCustomWaypoint(waypoint: WaypointDto): CustomWaypoint {
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
    type: waypoint.type,
    gasStationInfo: gasStationInfo,
    evChargeInfo,
    gasolinePrice: waypoint.gasolinePrice,
    diselPrice: waypoint.dieselPrice,
    electricityPrice: waypoint.electricityPrice,
    restBreakDuration: waypoint.duration,
    placeId: waypoint.placeId,
    restBreakLocationName: waypoint.restBreakLocationName,
    address: waypoint.address
  };
}

function formatConnectorType(connectorType) {
  const typeMappings = {
    "EV_CONNECTOR_TYPE_UNSPECIFIED": "Unspecified connector",
    "EV_CONNECTOR_TYPE_OTHER": "Other connector types",
    "EV_CONNECTOR_TYPE_J1772": "J1772 type 1 connector",
    "EV_CONNECTOR_TYPE_TYPE_2": "IEC 62196 type 2 connector",
    "EV_CONNECTOR_TYPE_CHADEMO": "CHAdeMO type connector",
    "EV_CONNECTOR_TYPE_CCS_COMBO_1": "Combined Charging System (CCS) Type-1",
    "EV_CONNECTOR_TYPE_CCS_COMBO_2": "Combined Charging System (CCS) Type-2",
    "EV_CONNECTOR_TYPE_TESLA": "Tesla connector",
    "EV_CONNECTOR_TYPE_UNSPECIFIED_GB_T": "GB/T type connector",
    "EV_CONNECTOR_TYPE_UNSPECIFIED_WALL_OUTLET": "Unspecified wall outlet",
  };

  let formattedType = connectorType.replace("EV_CONNECTOR_TYPE_", "").replace(/_/g, " ");

  return typeMappings[connectorType] || formattedType;
}

function formatMaxChargeRate(chargeRate) {
  return chargeRate ? `${Number(chargeRate).toFixed(2)} kW` : 'Information not Available';
}



export {
  createCustomMarker,
  createInfoWindowForGasStationsMarkerWaypoint,
  createInfoWindowForElectricStationsMarkerWaypoint,
  createInfoWindowForRestBreaksMarkerWaypoint,
  createInfoWindowForAlertsMarker,
  getPointsAlongRoute,
  calculateMidpoint,
  calculateDurationInHoursAndMinutes,
  calculateDistanceAndDurationBetweenWaypoints,
  convertWaypointDtoToCustomWaypoint,
  formatConnectorType,
  formatMaxChargeRate
};


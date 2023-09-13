import { Component } from '@angular/core';

@Component({
  selector: 'app-my-fleet',
  templateUrl: './my-fleet.component.html',
  styleUrls: ['./my-fleet.component.css']
})
export class MyFleetComponent {
  vehicles = [
    {
      make: 'Volvo',
      model: 'FM',
      mileage: 80000,
      imageSrc: 'https://www.volvotrucks.ro/content/dam/volvo-trucks/markets/master/classic/press-releases/2020/feb/pr-2952-fm/1860x1050-08A3740-FM-4x2-tractor-with-trailer.jpg',
      vin: '1HGCM82633A400001',
      licensePlate: 'XYZ 123',
      fuelType: 'Diesel',
      fuelEfficiencyMPG: 6.5,
      vehicleType: 'Truck',
      capacity: '25 tons',
      yearOfManufacture: 2022,
      vehicleStatus: 'Operational',
      engineSize: '12.8L',
      transmissionType: 'Automatic',
      maintenanceHistory: [
        {
          date: '2023-06-15',
          description: 'Oil change and filter replacement',
          cost: 250
        },
        {
          date: '2023-03-20',
          description: 'Brake pad replacement',
          cost: 350
        }
      ],
      insuranceInfo: {
        provider: 'ABC Insurance Company',
        policyNumber: 'POL123456',
        expirationDate: '2024-12-31'
      },
      alertsAndNotifications: [
        {
          type: 'Maintenance Due',
          description: 'Oil change and filter replacement',
          date: '2023-09-15'
        },
        {
          type: 'License Renewal',
          description: 'Renew vehicle registration',
          date: '2023-12-10'
        }
      ]
    }, {
      make: 'Volvo',
      model: 'FM',
      mileage: 80000,
      imageSrc: 'https://www.volvotrucks.ro/content/dam/volvo-trucks/markets/master/classic/press-releases/2020/feb/pr-2952-fm/1860x1050-08A3740-FM-4x2-tractor-with-trailer.jpg',
      vin: '1HGCM82633A400001',
      licensePlate: 'XYZ 123',
      fuelType: 'Diesel',
      fuelEfficiencyMPG: 6.5,
      vehicleType: 'Truck',
      capacity: '25 tons',
      yearOfManufacture: 2022,
      vehicleStatus: 'Operational',
      engineSize: '12.8L',
      transmissionType: 'Automatic',
      maintenanceHistory: [
        {
          date: '2023-06-15',
          description: 'Oil change and filter replacement',
          cost: 250
        },
        {
          date: '2023-03-20',
          description: 'Brake pad replacement',
          cost: 350
        }
      ],
      insuranceInfo: {
        provider: 'ABC Insurance Company',
        policyNumber: 'POL123456',
        expirationDate: '2024-12-31'
      },
      alertsAndNotifications: [
        {
          type: 'Maintenance Due',
          description: 'Oil change and filter replacement',
          date: '2023-09-15'
        },
        {
          type: 'License Renewal',
          description: 'Renew vehicle registration',
          date: '2023-12-10'
        }
      ]
    }, {
      make: 'Volvo',
      model: 'FM',
      mileage: 80000,
      imageSrc: 'https://www.volvotrucks.ro/content/dam/volvo-trucks/markets/master/classic/press-releases/2020/feb/pr-2952-fm/1860x1050-08A3740-FM-4x2-tractor-with-trailer.jpg',
      vin: '1HGCM82633A400001',
      licensePlate: 'XYZ 123',
      fuelType: 'Diesel',
      fuelEfficiencyMPG: 6.5,
      vehicleType: 'Truck',
      capacity: '25 tons',
      yearOfManufacture: 2022,
      vehicleStatus: 'Operational',
      engineSize: '12.8L',
      transmissionType: 'Automatic',
      maintenanceHistory: [
        {
          date: '2023-06-15',
          description: 'Oil change and filter replacement',
          cost: 250
        },
        {
          date: '2023-03-20',
          description: 'Brake pad replacement',
          cost: 350
        }
      ],
      insuranceInfo: {
        provider: 'ABC Insurance Company',
        policyNumber: 'POL123456',
        expirationDate: '2024-12-31'
      },
      alertsAndNotifications: [
        {
          type: 'Maintenance Due',
          description: 'Oil change and filter replacement',
          date: '2023-09-15'
        },
        {
          type: 'License Renewal',
          description: 'Renew vehicle registration',
          date: '2023-12-10'
        }
      ]
    }, {
      make: 'Volvo',
      model: 'FM',
      mileage: 80000,
      imageSrc: 'https://www.volvotrucks.ro/content/dam/volvo-trucks/markets/master/classic/press-releases/2020/feb/pr-2952-fm/1860x1050-08A3740-FM-4x2-tractor-with-trailer.jpg',
      vin: '1HGCM82633A400001',
      licensePlate: 'XYZ 123',
      fuelType: 'Diesel',
      fuelEfficiencyMPG: 6.5,
      vehicleType: 'Truck',
      capacity: '25 tons',
      yearOfManufacture: 2022,
      vehicleStatus: 'Operational',
      engineSize: '12.8L',
      transmissionType: 'Automatic',
      maintenanceHistory: [
        {
          date: '2023-06-15',
          description: 'Oil change and filter replacement',
          cost: 250
        },
        {
          date: '2023-03-20',
          description: 'Brake pad replacement',
          cost: 350
        }
      ],
      insuranceInfo: {
        provider: 'ABC Insurance Company',
        policyNumber: 'POL123456',
        expirationDate: '2024-12-31'
      },
      alertsAndNotifications: [
        {
          type: 'Maintenance Due',
          description: 'Oil change and filter replacement',
          date: '2023-09-15'
        },
        {
          type: 'License Renewal',
          description: 'Renew vehicle registration',
          date: '2023-12-10'
        }
      ]
    }, {
      make: 'Volvo',
      model: 'FM',
      mileage: 80000,
      imageSrc: 'https://www.volvotrucks.ro/content/dam/volvo-trucks/markets/master/classic/press-releases/2020/feb/pr-2952-fm/1860x1050-08A3740-FM-4x2-tractor-with-trailer.jpg',
      vin: '1HGCM82633A400001',
      licensePlate: 'XYZ 123',
      fuelType: 'Diesel',
      fuelEfficiencyMPG: 6.5,
      vehicleType: 'Truck',
      capacity: '25 tons',
      yearOfManufacture: 2022,
      vehicleStatus: 'Operational',
      engineSize: '12.8L',
      transmissionType: 'Automatic',
      maintenanceHistory: [
        {
          date: '2023-06-15',
          description: 'Oil change and filter replacement',
          cost: 250
        },
        {
          date: '2023-03-20',
          description: 'Brake pad replacement',
          cost: 350
        }
      ],
      insuranceInfo: {
        provider: 'ABC Insurance Company',
        policyNumber: 'POL123456',
        expirationDate: '2024-12-31'
      },
      alertsAndNotifications: [
        {
          type: 'Maintenance Due',
          description: 'Oil change and filter replacement',
          date: '2023-09-15'
        },
        {
          type: 'License Renewal',
          description: 'Renew vehicle registration',
          date: '2023-12-10'
        }
      ]
    }, {
      model: 'FM',
      mileage: 80000,
      imageSrc: 'https://www.volvotrucks.ro/content/dam/volvo-trucks/markets/master/classic/press-releases/2020/feb/pr-2952-fm/1860x1050-08A3740-FM-4x2-tractor-with-trailer.jpg',
      vin: '1HGCM82633A400001',
      licensePlate: 'XYZ 123',
      fuelType: 'Diesel',
      fuelEfficiencyMPG: 6.5,
      vehicleType: 'Truck',
      capacity: '25 tons',
      yearOfManufacture: 2022,
      vehicleStatus: 'Operational',
      engineSize: '12.8L',
      transmissionType: 'Automatic',
      maintenanceHistory: [
        {
          date: '2023-06-15',
          description: 'Oil change and filter replacement',
          cost: 250
        },
        {
          date: '2023-03-20',
          description: 'Brake pad replacement',
          cost: 350
        }
      ],
      insuranceInfo: {
        provider: 'ABC Insurance Company',
        policyNumber: 'POL123456',
        expirationDate: '2024-12-31'
      },
      alertsAndNotifications: [
        {
          type: 'Maintenance Due',
          description: 'Oil change and filter replacement',
          date: '2023-09-15'
        },
        {
          type: 'License Renewal',
          description: 'Renew vehicle registration',
          date: '2023-12-10'
        }
      ]
    }, {
      make: 'Volvo',
      model: 'FM',
      mileage: 80000,
      imageSrc: 'https://www.volvotrucks.ro/content/dam/volvo-trucks/markets/master/classic/press-releases/2020/feb/pr-2952-fm/1860x1050-08A3740-FM-4x2-tractor-with-trailer.jpg',
      vin: '1HGCM82633A400001',
      licensePlate: 'XYZ 123',
      fuelType: 'Diesel',
      fuelEfficiencyMPG: 6.5,
      vehicleType: 'Truck',
      capacity: '25 tons',
      yearOfManufacture: 2022,
      vehicleStatus: 'Operational',
      engineSize: '12.8L',
      transmissionType: 'Automatic',
      maintenanceHistory: [
        {
          date: '2023-06-15',
          description: 'Oil change and filter replacement',
          cost: 250
        },
        {
          date: '2023-03-20',
          description: 'Brake pad replacement',
          cost: 350
        }
      ],
      insuranceInfo: {
        provider: 'ABC Insurance Company',
        policyNumber: 'POL123456',
        expirationDate: '2024-12-31'
      },
      alertsAndNotifications: [
        {
          type: 'Maintenance Due',
          description: 'Oil change and filter replacement',
          date: '2023-09-15'
        },
        {
          type: 'License Renewal',
          description: 'Renew vehicle registration',
          date: '2023-12-10'
        }
      ]
    }, {
      make: 'Volvo',
      model: 'FM',
      mileage: 80000,
      imageSrc: 'https://www.volvotrucks.ro/content/dam/volvo-trucks/markets/master/classic/press-releases/2020/feb/pr-2952-fm/1860x1050-08A3740-FM-4x2-tractor-with-trailer.jpg',
      vin: '1HGCM82633A400001',
      licensePlate: 'XYZ 123',
      fuelType: 'Diesel',
      fuelEfficiencyMPG: 6.5,
      vehicleType: 'Truck',
      capacity: '25 tons',
      yearOfManufacture: 2022,
      vehicleStatus: 'Operational',
      engineSize: '12.8L',
      transmissionType: 'Automatic',
      maintenanceHistory: [
        {
          date: '2023-06-15',
          description: 'Oil change and filter replacement',
          cost: 250
        },
        {
          date: '2023-03-20',
          description: 'Brake pad replacement',
          cost: 350
        }
      ],
      insuranceInfo: {
        provider: 'ABC Insurance Company',
        policyNumber: 'POL123456',
        expirationDate: '2024-12-31'
      },
      alertsAndNotifications: [
        {
          type: 'Maintenance Due',
          description: 'Oil change and filter replacement',
          date: '2023-09-15'
        },
        {
          type: 'License Renewal',
          description: 'Renew vehicle registration',
          date: '2023-12-10'
        }
      ]
    }
  ] 
}

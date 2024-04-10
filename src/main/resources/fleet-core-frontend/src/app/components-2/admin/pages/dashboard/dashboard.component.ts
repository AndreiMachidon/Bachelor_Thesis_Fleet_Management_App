import { formatNumber } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from 'src/app/components-2/auth/services/auth.service';
import { DashboardCardsInfoDto } from './dto/dashboard-cards-info-dto';
import { DashboardService } from './services/dashboard.service';
import { DashboardFleetExpensesByCategoryDto } from './dto/dashboard-fleex-expenses.dto';
import { DashboardFuelCostsByTypeDto } from './dto/dashboard-fuel-costs.dto';

export var valuesBarChart = [
  {
    "name": "Vehicle Maintenances",
    "value": 4500
  },
  {
    "name": "Fuel",
    "value": 8700
  },
  {
    "name": "Drivers",
    "value": 5200
  },
  {
    "name": "Vehicle Breakdowns",
    "value": 1200
  },

];

export var valuesPieChart = [
  {
    "name": "Diesel",
    "value": 4500
  },
  {
    "name": "Gasoline",
    "value": 5200
  },
  {
    "name": "Electricty",
    "value": 1800
  },
];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  userInfo: any;

  //Data for cards
  dashboardCardsInfo: DashboardCardsInfoDto;

  // Bar chart
  valuesBarChart: any[];

    // options
    xAxisLabel = 'Expenses';
    yAxisLabel = 'Costs in €';


  // Pie chart
  valuesPieChart: any[];

  constructor(private authService: AuthService, private dashboardService: DashboardService) {
  }

  ngOnInit() {
    this.userInfo = this.authService.getUserDetails();
    this.dashboardService.getDashboardCardsInfo(this.userInfo.id).subscribe(data => {
      this.dashboardCardsInfo = data;
    });

    this.dashboardService.getDashboardFleetExpensesByCategory(this.userInfo.id).subscribe(data => {
      this.transformFleetExpensesToBarChartFormat(data);
    });

    this.dashboardService.getDashboardFuelCostsByType(this.userInfo.id).subscribe(data => {
      this.transformFuelExpensesToPieChartFormat(data);
    });
  }

  formatKilometers(value: number) {
    return `${formatNumber(value, 'de', '1.0-0')} km`;
  }

  yAxisTickFormatting(value: number) {
    return `${formatNumber(value, 'de', '1.0-0')} €`;
  }

  tooltipFormatting(dataItem: any) {
    return `${dataItem.data.name}: ${formatNumber(dataItem.data.value, 'de', '1.0-0').toLocaleString()} €`;
  }

  transformFleetExpensesToBarChartFormat(fleetExpenses: DashboardFleetExpensesByCategoryDto) {
    this.valuesBarChart = [
      {
        "name": "Vehicle Maintenances",
        "value": fleetExpenses.vehicleMaintenancesCosts
      },
      {
        "name": "Fuel",
        "value": fleetExpenses.fuelCosts
      },
      {
        "name": "Drivers",
        "value": fleetExpenses.driversCosts
      },
      {
        "name": "Vehicle Breakdowns",
        "value": fleetExpenses.vehiclesBreakdownsCosts
      },
    ]
  }

  transformFuelExpensesToPieChartFormat(fuelExpenses: DashboardFuelCostsByTypeDto) {

    this.valuesPieChart = [
      {
        "name": "Diesel",
        "value": fuelExpenses.dieselCosts
      },
      {
        "name": "Gasoline",
        "value": fuelExpenses.gasolineCosts
      },
      {
        "name": "Electricty",
        "value": fuelExpenses.electricityCosts
      },
    ]
  }


}

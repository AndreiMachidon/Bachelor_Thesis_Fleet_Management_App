import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverRouteWaypointsStepperComponent } from './driver-route-waypoints-stepper.component';

describe('DriverRouteWaypointsStepperComponent', () => {
  let component: DriverRouteWaypointsStepperComponent;
  let fixture: ComponentFixture<DriverRouteWaypointsStepperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DriverRouteWaypointsStepperComponent]
    });
    fixture = TestBed.createComponent(DriverRouteWaypointsStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

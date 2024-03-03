import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteWaypointsStepperComponent } from './route-waypoints-stepper.component';

describe('RouteWaypointsStepperComponent', () => {
  let component: RouteWaypointsStepperComponent;
  let fixture: ComponentFixture<RouteWaypointsStepperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RouteWaypointsStepperComponent]
    });
    fixture = TestBed.createComponent(RouteWaypointsStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

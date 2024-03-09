import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingRouteCardComponent } from './upcoming-route-card.component';

describe('UpcomingRouteCardComponent', () => {
  let component: UpcomingRouteCardComponent;
  let fixture: ComponentFixture<UpcomingRouteCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpcomingRouteCardComponent]
    });
    fixture = TestBed.createComponent(UpcomingRouteCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteDetailsCardComponent } from './route-details-card.component';

describe('RouteDetailsCardComponent', () => {
  let component: RouteDetailsCardComponent;
  let fixture: ComponentFixture<RouteDetailsCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RouteDetailsCardComponent]
    });
    fixture = TestBed.createComponent(RouteDetailsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

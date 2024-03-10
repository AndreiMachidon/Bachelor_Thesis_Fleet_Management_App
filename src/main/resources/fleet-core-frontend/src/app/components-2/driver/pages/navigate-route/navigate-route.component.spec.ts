import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigateRouteComponent } from './navigate-route.component';

describe('NavigateRouteComponent', () => {
  let component: NavigateRouteComponent;
  let fixture: ComponentFixture<NavigateRouteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavigateRouteComponent]
    });
    fixture = TestBed.createComponent(NavigateRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

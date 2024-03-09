import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeDriverRoutesComponent } from './see-driver-routes.component';

describe('SeeDriverRoutesComponent', () => {
  let component: SeeDriverRoutesComponent;
  let fixture: ComponentFixture<SeeDriverRoutesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeeDriverRoutesComponent]
    });
    fixture = TestBed.createComponent(SeeDriverRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

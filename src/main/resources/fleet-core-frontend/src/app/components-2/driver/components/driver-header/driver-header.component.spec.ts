import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverHeaderComponent } from './driver-header.component';

describe('DriverHeaderComponent', () => {
  let component: DriverHeaderComponent;
  let fixture: ComponentFixture<DriverHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DriverHeaderComponent]
    });
    fixture = TestBed.createComponent(DriverHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignVehicleDialogComponent } from './assign-vehicle-dialog.component';

describe('AssignVehicleDialogComponent', () => {
  let component: AssignVehicleDialogComponent;
  let fixture: ComponentFixture<AssignVehicleDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssignVehicleDialogComponent]
    });
    fixture = TestBed.createComponent(AssignVehicleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

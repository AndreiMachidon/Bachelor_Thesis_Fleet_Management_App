import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVehicleDialogComponent } from './add-vehicle-dialog.component';

describe('AddVehicleDialogComponent', () => {
  let component: AddVehicleDialogComponent;
  let fixture: ComponentFixture<AddVehicleDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddVehicleDialogComponent]
    });
    fixture = TestBed.createComponent(AddVehicleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

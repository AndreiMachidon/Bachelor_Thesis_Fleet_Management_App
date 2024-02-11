import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceHistoryComponent } from './maintenance-history.component';

describe('MaintenanceHistoryComponent', () => {
  let component: MaintenanceHistoryComponent;
  let fixture: ComponentFixture<MaintenanceHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaintenanceHistoryComponent]
    });
    fixture = TestBed.createComponent(MaintenanceHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

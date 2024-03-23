import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteSavedDialogComponent } from './route-saved-dialog.component';

describe('RouteSavedDialogComponent', () => {
  let component: RouteSavedDialogComponent;
  let fixture: ComponentFixture<RouteSavedDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RouteSavedDialogComponent]
    });
    fixture = TestBed.createComponent(RouteSavedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

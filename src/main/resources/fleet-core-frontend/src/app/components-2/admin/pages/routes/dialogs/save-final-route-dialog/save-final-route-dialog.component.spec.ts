import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveFinalRouteDialogComponent } from './save-final-route-dialog.component';

describe('SaveFinalRouteDialogComponent', () => {
  let component: SaveFinalRouteDialogComponent;
  let fixture: ComponentFixture<SaveFinalRouteDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaveFinalRouteDialogComponent]
    });
    fixture = TestBed.createComponent(SaveFinalRouteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

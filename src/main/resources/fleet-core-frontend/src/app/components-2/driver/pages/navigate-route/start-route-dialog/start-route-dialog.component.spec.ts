import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartRouteDialogComponent } from './start-route-dialog.component';

describe('StartRouteDialogComponent', () => {
  let component: StartRouteDialogComponent;
  let fixture: ComponentFixture<StartRouteDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StartRouteDialogComponent]
    });
    fixture = TestBed.createComponent(StartRouteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

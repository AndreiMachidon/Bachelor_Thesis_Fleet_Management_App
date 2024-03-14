import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndRouteDialogComponent } from './end-route-dialog.component';

describe('EndRouteDialogComponent', () => {
  let component: EndRouteDialogComponent;
  let fixture: ComponentFixture<EndRouteDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EndRouteDialogComponent]
    });
    fixture = TestBed.createComponent(EndRouteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

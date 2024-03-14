import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendAlertDialogComponent } from './send-alert-dialog.component';

describe('SendAlertDialogComponent', () => {
  let component: SendAlertDialogComponent;
  let fixture: ComponentFixture<SendAlertDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SendAlertDialogComponent]
    });
    fixture = TestBed.createComponent(SendAlertDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

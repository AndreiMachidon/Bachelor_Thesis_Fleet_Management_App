import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkAlertResolvedDialogComponent } from './mark-alert-resolved-dialog.component';

describe('MarkAlertResolvedDialogComponent', () => {
  let component: MarkAlertResolvedDialogComponent;
  let fixture: ComponentFixture<MarkAlertResolvedDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MarkAlertResolvedDialogComponent]
    });
    fixture = TestBed.createComponent(MarkAlertResolvedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

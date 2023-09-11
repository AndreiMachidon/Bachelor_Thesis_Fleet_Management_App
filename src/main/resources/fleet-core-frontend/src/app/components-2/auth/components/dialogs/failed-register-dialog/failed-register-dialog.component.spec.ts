import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FailedRegisterDialogComponent } from './failed-register-dialog.component';

describe('FailedRegisterDialogComponent', () => {
  let component: FailedRegisterDialogComponent;
  let fixture: ComponentFixture<FailedRegisterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FailedRegisterDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FailedRegisterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

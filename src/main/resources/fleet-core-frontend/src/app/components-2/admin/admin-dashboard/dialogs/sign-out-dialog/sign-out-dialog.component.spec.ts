import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignOutDialogComponent } from './sign-out-dialog.component';

describe('SignOutDialogComponent', () => {
  let component: SignOutDialogComponent;
  let fixture: ComponentFixture<SignOutDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignOutDialogComponent]
    });
    fixture = TestBed.createComponent(SignOutDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

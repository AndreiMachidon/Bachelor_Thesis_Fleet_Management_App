import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAccountDetailsComponent } from './edit-account-details.component';

describe('EditAccountDetailsComponent', () => {
  let component: EditAccountDetailsComponent;
  let fixture: ComponentFixture<EditAccountDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditAccountDetailsComponent]
    });
    fixture = TestBed.createComponent(EditAccountDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

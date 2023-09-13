import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UerDetailsComponent } from './uer-details.component';

describe('UerDetailsComponent', () => {
  let component: UerDetailsComponent;
  let fixture: ComponentFixture<UerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UerDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

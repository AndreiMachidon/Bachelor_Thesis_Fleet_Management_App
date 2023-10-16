import { TestBed } from '@angular/core/testing';

import { MyDriversServiceService } from './my-drivers-service.service';

describe('MyDriversServiceService', () => {
  let service: MyDriversServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyDriversServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

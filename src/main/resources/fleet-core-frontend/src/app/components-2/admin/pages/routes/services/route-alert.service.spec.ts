import { TestBed } from '@angular/core/testing';

import { RouteAlertService } from './route-alert.service';

describe('RouteAlertService', () => {
  let service: RouteAlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouteAlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

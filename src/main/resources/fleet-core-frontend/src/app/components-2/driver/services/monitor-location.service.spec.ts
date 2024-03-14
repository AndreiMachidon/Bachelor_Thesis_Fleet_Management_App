import { TestBed } from '@angular/core/testing';

import { MonitorLocationService } from './monitor-location.service';

describe('MonitorLocationService', () => {
  let service: MonitorLocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonitorLocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { ElectricityPricesService } from './fuel-prices.service';

describe('ElectricityPricesService', () => {
  let service: ElectricityPricesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElectricityPricesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

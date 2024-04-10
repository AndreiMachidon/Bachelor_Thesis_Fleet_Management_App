import { TestBed } from '@angular/core/testing';

import { TokenEncryptionService } from './token-encryption-service.service';

describe('TokenEncryptionServiceService', () => {
  let service: TokenEncryptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenEncryptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

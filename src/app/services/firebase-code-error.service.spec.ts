import { TestBed } from '@angular/core/testing';

import { FirebaseCodeErrorService } from './firebase-code-error.service';

describe('FiresbaseCodeErrorService', () => {
  let service: FirebaseCodeErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseCodeErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

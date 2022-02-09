import {TestBed} from '@angular/core/testing';

import {Auth0DataService} from './auth0-data.service';

describe('Auth0Service', () => {
  let service: Auth0DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Auth0DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

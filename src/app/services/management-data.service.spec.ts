import {TestBed} from '@angular/core/testing';

import {ManagementDataService} from './management-data.service';

describe('ManagementDataService', () => {
  let service: ManagementDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagementDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

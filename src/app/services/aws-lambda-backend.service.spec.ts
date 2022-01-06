import {TestBed} from '@angular/core/testing';

import {AwsLambdaBackendService} from './aws-lambda-backend.service';

describe('AwsLambdaBackendService', () => {
  let service: AwsLambdaBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AwsLambdaBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

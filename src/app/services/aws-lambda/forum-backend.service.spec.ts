import {TestBed} from '@angular/core/testing';

import {ForumBackendService} from './forum-backend.service';

describe('AwsLambdaBackendService', () => {
  let service: ForumBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ForumBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

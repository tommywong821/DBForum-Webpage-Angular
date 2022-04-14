import {Injectable} from '@angular/core';
import {SwUpdate} from '@angular/service-worker';

@Injectable()
export class PwaService {
  constructor(private swUpdate: SwUpdate) {
    swUpdate.versionUpdates.subscribe(event => {
      if (confirm('need update?')) {
        window.location.reload();
      }
    });
  }
}

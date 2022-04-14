import {ErrorHandler, Injectable} from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  handleError(error: any): void {
    console.log(`GlobalErrorHandler is handling error`)
    const chunkFailedMessage = /Loading chunk [\d]+ failed/;

    if (chunkFailedMessage.test(error.message)) {
      console.log(`GlobalErrorHandler match error and reload`)
      window.location.reload();
    }
  }
}

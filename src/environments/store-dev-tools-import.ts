import {environment} from 'src/environments/environment';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';

export const storeDevToolsImport = [
  !environment.production ? StoreDevtoolsModule.instrument({maxAge: 10}) : []
];

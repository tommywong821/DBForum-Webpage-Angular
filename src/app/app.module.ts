import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AwsLambdaApiInterceptor} from "./interceptor/aws-lambda-api-interceptor";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {MatDialogModule} from "@angular/material/dialog";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {ApiErrorInterceptor} from "./interceptor/api-error-interceptor";
import {AuthModule} from "@auth0/auth0-angular";
import {environment} from "../environments/environment";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatToolbarModule} from "@angular/material/toolbar";
import {HeaderComponent} from './layout/shared/header/header.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {ProfileDialogComponent} from './layout/shared/header/profile-dialog/profile-dialog.component';
import {MatRadioModule} from "@angular/material/radio";
import {NavigationComponent} from './layout/shared/navigation/navigation.component';
import {SidenavComponent} from './layout/shared/navigation/sidenav/sidenav.component';
import {MatMomentDateModule} from "@angular/material-moment-adapter";
import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import {Auth0Effect} from "./ngrx/auth0/auth0.effect";
import {storeDevToolsImport} from "../environments/store-dev-tools-import";
import {AppReducer} from "./ngrx/app.state";
import {TrainingDataEffect} from "./ngrx/training-data/training-data.effect";
import {MatFormFieldModule} from "@angular/material/form-field";
import {TestComponent} from './layout/route-page/test/test.component';
import {DragDropModule} from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ProfileDialogComponent,
    NavigationComponent,
    SidenavComponent,
    TestComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatListModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatRadioModule,
    MatFormFieldModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatMomentDateModule,
    //auth0
    AuthModule.forRoot({
      domain: environment.auth0Domain,
      clientId: environment.auth0ClientId
    }),
    //ngrx
    StoreModule.forRoot(AppReducer),
    EffectsModule.forRoot([Auth0Effect, TrainingDataEffect]),
    ...storeDevToolsImport,
    MatInputModule,
    DragDropModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AwsLambdaApiInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

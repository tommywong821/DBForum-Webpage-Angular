import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {ApiInterceptor} from "./interceptor/api-interceptor";
import {AwsLambdaBackendService} from "./services/aws-lambda-backend.service";
import {MainPageComponent} from './layout/main-page/main-page.component';
import {DashboardComponent} from './layout/dashboard/dashboard.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TrainingListComponent} from "./layout/main-page/training-list/training-list.component";
import {TrainingSummaryComponent} from './layout/main-page/training-summary/training-summary.component';
import {TrainingFormDialogComponent} from './layout/main-page/training-form-dialog/training-form-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {NgxMatDatetimePickerModule, NgxMatNativeDateModule} from "@angular-material-components/datetime-picker";
import {MatTableModule} from "@angular/material/table";
import {ApiErrorInterceptor} from "./interceptor/api-error-interceptor";
import {AuthModule} from "@auth0/auth0-angular";
import {environment} from "../environments/environment";
import {
  TrainingDetailDialogComponent
} from './layout/main-page/training-detail-dialog/training-detail-dialog.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {
  TrainingContentComponent
} from "./layout/main-page/training-list/training-list-content/training-content.component";
import {LoadingComponent} from "./layout/shared/loading/loading.component";

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    DashboardComponent,
    TrainingListComponent,
    TrainingSummaryComponent,
    TrainingFormDialogComponent,
    TrainingDetailDialogComponent,
    TrainingContentComponent,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    FlexLayoutModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatDatepickerModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    FormsModule,
    MatTableModule,
    AuthModule.forRoot({
      domain: environment.auth0Domain,
      clientId: environment.auth0ClientId
    }),
    MatProgressSpinnerModule
  ],
  providers: [
    AwsLambdaBackendService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
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

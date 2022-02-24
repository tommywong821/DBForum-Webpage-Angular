import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AwsLambdaApiInterceptor} from "./interceptor/aws-lambda-api-interceptor";
import {MainPageComponent} from './layout/main-page/main-page.component';
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
import {TrainingContentComponent} from "./layout/main-page/training-content/training-content.component";
import {LoadingComponent} from "./layout/shared/loading/loading.component";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {HeaderComponent} from './layout/header/header.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {ProfileDialogComponent} from './layout/header/profile-dialog/profile-dialog.component';
import {MatRadioModule} from "@angular/material/radio";
import {NavigationComponent} from './layout/navigation/navigation.component';
import {LayoutModule} from '@angular/cdk/layout';
import {SidenavComponent} from './layout/navigation/sidenav/sidenav.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from "@angular/material/select";
import {GeneralReminderComponent} from './layout/main-page/general-reminder/general-reminder.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MatMomentDateModule} from "@angular/material-moment-adapter";
import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import {Auth0Effect} from "./ngrx/auth0/auth0.effect";
import {auth0Reducer} from "./ngrx/auth0/auth0.reducer";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {DragDropModule} from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    TrainingListComponent,
    TrainingSummaryComponent,
    TrainingFormDialogComponent,
    TrainingDetailDialogComponent,
    TrainingContentComponent,
    LoadingComponent,
    HeaderComponent,
    ProfileDialogComponent,
    NavigationComponent,
    SidenavComponent,
    GeneralReminderComponent,
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
        MatProgressSpinnerModule,
        MatToolbarModule,
        MatIconModule,
        MatSidenavModule,
        MatListModule,
        MatRadioModule,
      LayoutModule,
      MatPaginatorModule,
      MatSortModule,
      MatGridListModule,
      MatMenuModule,
      MatSelectModule,
      NgbModule,
      MatMomentDateModule,
      StoreModule.forRoot({auth0: auth0Reducer}),
      EffectsModule.forRoot([Auth0Effect]),
      StoreDevtoolsModule.instrument({maxAge: 10}),
      DragDropModule
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

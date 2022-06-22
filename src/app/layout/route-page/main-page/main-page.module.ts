import {NgModule} from "@angular/core";
import {MainPageComponent} from "./main-page.component";
import {CommonModule} from "@angular/common";
import {MainPageRoutingModule} from "./main-page-routing.module";
import {TrainingListComponent} from "./training/list/training-list.component";
import {TrainingSummaryComponent} from "./training/summary/training-summary.component";
import {GeneralReminderComponent} from "./general-reminder/general-reminder.component";
import {MatPaginatorModule} from "@angular/material/paginator";
import {TrainingFormDialogComponent} from "./training/form-dialog/training-form-dialog.component";
import {TrainingDetailDialogComponent} from "./training/detail-dialog/training-detail-dialog.component";
import {TrainingContentComponent} from "./training/content/training-content.component";
import {MatCardModule} from "@angular/material/card";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatFormFieldModule} from "@angular/material/form-field";
import {ReactiveFormsModule} from "@angular/forms";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatTableModule} from "@angular/material/table";
import {MatDialogModule} from "@angular/material/dialog";
import {NgxMatDatetimePickerModule, NgxMatNativeDateModule} from "@angular-material-components/datetime-picker";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {LoadingComponent} from "../../shared/loading/loading.component";
import {MatInputModule} from "@angular/material/input";
import {MatMomentDateModule} from "@angular/material-moment-adapter";
import {MatButtonModule} from "@angular/material/button";
import {FlexLayoutModule} from "@angular/flex-layout";
import {TrainingSeatArrangementComponent} from './training/seat-arrangement/training-seat-arrangement.component';
import {DragDropModule} from "@angular/cdk/drag-drop";
import {MatSelectModule} from "@angular/material/select";
import {MatAutocompleteModule} from "@angular/material/autocomplete";

@NgModule({
  declarations: [
    MainPageComponent,
    TrainingListComponent,
    TrainingSummaryComponent,
    TrainingFormDialogComponent,
    TrainingDetailDialogComponent,
    TrainingContentComponent,
    GeneralReminderComponent,
    LoadingComponent,
    TrainingSeatArrangementComponent
  ],
  exports: [
    LoadingComponent
  ],
  imports: [
    CommonModule,
    MainPageRoutingModule,
    MatPaginatorModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatTableModule,
    MatDialogModule,
    NgxMatDatetimePickerModule,
    MatCheckboxModule,
    MatMomentDateModule,
    MatButtonModule,
    FlexLayoutModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    DragDropModule,
    MatSelectModule,
    MatAutocompleteModule,
  ]
})
export class MainPageModule {
}

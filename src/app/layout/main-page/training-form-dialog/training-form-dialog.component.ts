import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {AwsLambdaBackendService} from "../../../services/aws-lambda-backend.service";
import {DateUtil} from "../../../services/date-util.service";
import {ITraining} from "../../../model/interface/ITraining";

@Component({
  selector: 'app-training-form-dialog',
  templateUrl: './training-form-dialog.component.html',
  styleUrls: ['./training-form-dialog.component.scss']
})
export class TrainingFormDialogComponent implements OnInit {
  trainingForm: FormGroup;
  trainings: FormArray;
  isEditTraining: boolean;

  @Output() updatedTrainingList = new EventEmitter<any>();

  constructor(private dialogRef: MatDialogRef<TrainingFormDialogComponent>,
              private formBuilder: FormBuilder,
              private restful: AwsLambdaBackendService,
              private dateUtil: DateUtil,
              @Inject(MAT_DIALOG_DATA) private importData: { training: ITraining, isEditTraining: boolean }) {
    console.log(`[${this.constructor.name}] constructor`);
    dialogRef.disableClose = true;
    this.trainings = this.formBuilder.array([this.createEmptyTraining()]);
    this.trainingForm = this.formBuilder.group({
      trainings: this.trainings
    });
    this.isEditTraining = false;
  }

  get trainingFormGroup() {
    return this.trainingForm.get('trainings') as FormArray
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
    console.log(`importData: `, this.importData);
    this.initDataFromImportData();
  }

  initDataFromImportData() {
    if (this.importData) {
      this.isEditTraining = this.importData.isEditTraining;
      this.initTrainingInfo(this.importData.training);
    }
  }

  initTrainingInfo(training: ITraining) {
    let arrayControl = this.trainingFormGroup;
    arrayControl.clear();
    arrayControl.push(this.formBuilder.group({
      place: training.place,
      type: training.type,
      date: new Date(training.date)
    }));
  }

  createEmptyTraining(): FormGroup {
    return this.formBuilder.group({
      place: '',
      type: '',
      date: ''
    });
  }

  appendTraining(): void {
    this.trainings = this.trainingForm.get('trainings') as FormArray;
    this.trainings.push(this.createEmptyTraining());
  }

  removeTraining(index: number): void{
    this.trainings = this.trainingForm.get('trainings') as FormArray;
    this.trainings.removeAt(index);
  }

  insertNewTrainingToDB(): void {
    this.trainingForm.value.trainings.forEach((training: any) => {
      training.date = this.dateUtil.formatToHKTime(training.date);
      training.updated_at = this.dateUtil.formatToHKTime(new Date().toISOString());
    });
    console.log(`formGroup`, this.trainingForm.value.trainings);
    if (this.isEditTraining) {
      //update existing training info
      console.log(`update training: `, this.trainingForm.value.trainings);
      console.log(`update training id: `, this.importData.training._id);
      this.restful.updateTrainingInfo(this.importData.training._id, this.trainingForm.value.trainings[0]).subscribe({
        next: (result) => {
          console.log('update success');
          this.updatedTrainingList.emit(this.trainingForm.value.trainings);
          this.dialogRef.close();
        },
        complete: () => {

        }
      })
    } else {
      //create new training to db
      this.restful.createTrainingList(this.trainingForm.value.trainings).subscribe({
        next: result => {
          console.log(`create successfully: `, result);
          this.updatedTrainingList.emit(result);
          this.dialogRef.close();
        }
      });
    }
  }

  //fetch the latest list from db
  getUpdatedTrainingList() {
    // this.updatedTrainingList.emit(this.restful.getTrainingList());
    this.restful.getTrainingList().subscribe({
      next: (result) => this.updatedTrainingList.emit(result)
    });
  }
}

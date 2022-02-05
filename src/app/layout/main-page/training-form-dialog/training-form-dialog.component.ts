import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {AwsLambdaBackendService} from "../../../services/aws-lambda-backend.service";
import {DateUtil} from "../../../services/date-util.service";
import {ITraining} from "../../../model/interface/ITraining";
import {TrainingDataService} from "../../../services/training-data.service";
import {take} from "rxjs";

@Component({
  selector: 'app-training-form-dialog',
  templateUrl: './training-form-dialog.component.html',
  styleUrls: ['./training-form-dialog.component.scss']
})
export class TrainingFormDialogComponent implements OnInit {
  trainingForm: FormGroup;
  trainings: FormArray;
  isEditTraining: boolean;

  trainingList: Array<ITraining>;

  constructor(private dialogRef: MatDialogRef<TrainingFormDialogComponent>,
              private formBuilder: FormBuilder,
              private restful: AwsLambdaBackendService,
              private dateUtil: DateUtil,
              @Inject(MAT_DIALOG_DATA) private importData: { training: ITraining, isEditTraining: boolean, isInputFromTrainingDetail: boolean },
              private trainingDataService: TrainingDataService) {
    console.log(`[${this.constructor.name}] constructor`);
    dialogRef.disableClose = true;
    this.trainings = this.formBuilder.array([this.createEmptyTraining()]);
    this.trainingForm = this.formBuilder.group({
      trainings: this.trainings
    });
    this.isEditTraining = false;
    this.trainingList = new Array<ITraining>();
    this.trainingDataService.trainingDataList.subscribe((result) => {
      this.trainingList = this.trainingList.concat(result);
    });
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
      console.log(`initDataFromImportData`);
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
      date: new Date(training.date),
      deadline: new Date(training.deadline)
    }));
  }

  createEmptyTraining(): FormGroup {
    return this.formBuilder.group({
      place: '',
      type: '',
      date: '',
      deadline: ''
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
      training.deadline = this.dateUtil.formatToHKTime(training.deadline);
      training.updated_at = this.dateUtil.formatToHKTime(new Date().toISOString());
    });
    console.log(`formGroup`, this.trainingForm.value.trainings);
    if (this.isEditTraining) {
      //update existing training info
      this.restful.updateTrainingInfo(this.importData.training._id, this.trainingForm.value.trainings[0]).subscribe({
        next: (result) => {
          console.log(`update success: `, result);
          if (this.importData.isInputFromTrainingDetail) {
            //update training detail page
            this.trainingForm.value.trainings[0]._id = this.importData.training._id;
            this.dialogRef.close({data: this.trainingForm.value.trainings[0]});
          } else {
            //update training list in main page
            this.trainingDataService.trainingDataList.pipe(take(1)).subscribe((trainingList) => {
              trainingList = trainingList.map((training) => {
                this.trainingForm.value.trainings[0]._id = this.importData.training._id;
                return (training._id === this.importData.training._id) ? this.trainingForm.value.trainings[0] : training;
              });
              this.trainingDataService.updateTrainingDataList(trainingList);
            });
            this.dialogRef.close();
          }
        },
        complete: () => {
        }
      });
    } else {
      //create new training to db
      this.restful.createTrainingList(this.trainingForm.value.trainings).subscribe({
        next: (result) => {
          console.log(`create successfully: `, result);
          this.trainingList = this.trainingList.concat(result);
          this.trainingDataService.updateTrainingDataList(this.trainingList);
          this.dialogRef.close();
        }
      });
    }
  }

  autoFillDeadline(event: any, index: number) {
    console.log(`autoFillDeadline event: `, event);
    this.trainings = this.trainingForm.get('trainings') as FormArray;
    let trainingDateTime = new Date(event.value);
    let deadlineDateTime = new Date(trainingDateTime.getFullYear(), trainingDateTime.getMonth(), trainingDateTime.getDate() - 1, 17, 0, 0);
    this.trainings.at(index).get('deadline')?.setValue(deadlineDateTime);
  }
}

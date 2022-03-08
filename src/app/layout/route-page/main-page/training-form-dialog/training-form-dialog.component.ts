import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {ForumMainPageBackendService} from "../../../../services/aws-lambda/forum-main-page-backend.service";
import {DateUtil} from "../../../../services/date-util.service";
import {ITraining} from "../../../../model/forum/ITraining";
import {select, Store} from "@ngrx/store";
import {selectTrainingDataList} from "../../../../ngrx/training-data/training-data.selector";
import {updateTrainingDataList} from "../../../../ngrx/training-data/training-data.action";
import {TrainingSummaryDataService} from "../../../../services/data-services/training-summary-data.service";
import * as moment from 'moment';

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
              private restful: ForumMainPageBackendService,
              private dateUtil: DateUtil,
              @Inject(MAT_DIALOG_DATA) private importData: { training: ITraining, isEditTraining: boolean, isInputFromTrainingDetail: boolean },
              private store: Store<any>,
              private trainingDataService: TrainingSummaryDataService) {
    console.log(`[${this.constructor.name}] constructor`);
    dialogRef.disableClose = true;
    this.trainings = this.formBuilder.array([this.createEmptyTraining()]);
    this.trainingForm = this.formBuilder.group({
      trainings: this.trainings
    });
    this.isEditTraining = false;
    this.trainingList = [];
  }

  get trainingFormGroup() {
    return this.trainingForm.get('trainings') as FormArray
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
    this.initDataFromImportData();
    this.initDataFromStore();
  }

  initDataFromStore() {
    this.store.pipe(select(selectTrainingDataList)).subscribe({
      next: trainingList => {
        this.trainingList = trainingList;
      }
    })
  }

  initDataFromImportData() {
    console.log(`importData: `, this.importData);
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
      date: new Date(this.dateUtil.displayFormat(training.date)),
      deadline: new Date(this.dateUtil.displayFormat(training.deadline))
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
      this.restful.updateTrainingInfo(this.importData.training.uuid, this.trainingForm.value.trainings[0]).subscribe({
        next: (result) => {
          console.log(`update success: `, result);
          if (this.importData.isInputFromTrainingDetail) {
            //update training detail page
            this.trainingForm.value.trainings[0]._id = this.importData.training.uuid;
            this.dialogRef.close({data: this.trainingForm.value.trainings[0]});
          } else {
            //update training list in main page
            this.trainingList = this.trainingList.map((training) => {
              this.trainingForm.value.trainings[0]._id = this.importData.training.uuid;
              return (training.uuid === this.importData.training.uuid) ? this.convertStringDateToDate(this.trainingForm.value.trainings[0]) : training;
            });
          }
        },
        complete: () => {
          this.trainingDataService.needRefresh();
          this.store.dispatch(updateTrainingDataList({trainingList: this.trainingList}));
          this.dialogRef.close();
        }
      });
    } else {
      //create new training to db
      this.restful.createTrainingList(this.trainingForm.value.trainings).subscribe({
        next: (createdTrainingList) => {
          console.log(`create successfully: `, createdTrainingList);
          //todo check format not match with api response
          createdTrainingList.forEach((training) => {
            this.trainingList = this.trainingList.concat([this.convertStringDateToDate(training)]);
          });
          console.log(`trainingList: `, this.trainingList)
        },
        complete: () => {
          this.store.dispatch(updateTrainingDataList({trainingList: this.trainingList}));
          this.dialogRef.close();
        }
      });
    }
  }

  autoFillDeadline(event: any, index: number) {
    console.log(`autoFillDeadline event: `, event);
    this.trainings = this.trainingForm.get('trainings') as FormArray;
    let deadlineDateTime = new Date(event.value);
    deadlineDateTime.setDate(deadlineDateTime.getDate() - 1);
    deadlineDateTime.setHours(17, 0, 0);
    this.trainings.at(index).get('deadline')?.setValue(deadlineDateTime);
  }

  convertStringDateToDate(training: any): any {
    console.log(`stringDate: `, training)
    let newTrainingList = JSON.parse(JSON.stringify(training));
    console.log(`before: `, newTrainingList);
    newTrainingList.date = moment(newTrainingList.date).tz('Asia/Hong_Kong').format('YYYY-MM-DDTHH:mm:ss') + 'Z'
    newTrainingList.deadline = moment(newTrainingList.deadline).tz('Asia/Hong_Kong').format('YYYY-MM-DDTHH:mm:ss') + 'Z'
    console.log(`after: `, newTrainingList);
    return newTrainingList;
  }
}
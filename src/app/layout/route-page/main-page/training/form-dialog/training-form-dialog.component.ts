import { Component, Inject, OnInit } from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { ITraining } from '../../../../../model/forum/ITraining';
import { updateTrainingDataList } from '../../../../../ngrx/training-data/training-data.action';
import { selectTrainingDataList } from '../../../../../ngrx/training-data/training-data.selector';
import { ForumBackendMainpageService } from '../../../../../services/aws-lambda/forum-backend-mainpage.service';
import { TrainingSummaryDataService } from '../../../../../services/data-services/training-summary-data.service';
import { DateUtil } from '../../../../../services/date-util.service';

interface TrainingPlace {
  value: string;
  viewValue: string;
}

interface TrainingType {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-form-dialog',
  templateUrl: './training-form-dialog.component.html',
  styleUrls: ['./training-form-dialog.component.scss'],
})
export class TrainingFormDialogComponent implements OnInit {
  formValidator = new UntypedFormControl('', [Validators.required]);
  trainingForm: UntypedFormGroup;
  trainingFormArray: UntypedFormArray;
  isEditTraining: boolean;

  trainingPlace: TrainingPlace[];
  selectedTrainingPlace: string;
  trainingType: TrainingType[];

  trainingList: Array<ITraining>;

  constructor(
    private dialogRef: MatDialogRef<TrainingFormDialogComponent>,
    private formBuilder: UntypedFormBuilder,
    private restful: ForumBackendMainpageService,
    private dateUtil: DateUtil,
    @Inject(MAT_DIALOG_DATA)
    private importData: {
      training: ITraining;
      isEditTraining: boolean;
      isInputFromTrainingDetail: boolean;
    },
    private store: Store<any>,
    private trainingDataService: TrainingSummaryDataService
  ) {
    console.log(`[${this.constructor.name}] constructor`);
    dialogRef.disableClose = true;
    this.trainingFormArray = this.formBuilder.array([
      this.createEmptyTraining(),
    ]);
    this.trainingForm = this.formBuilder.group({
      trainings: this.trainingFormArray,
    });
    this.isEditTraining = false;
    this.trainingList = [];
    this.trainingPlace = [
      { value: 'TKO Waterfront', viewValue: 'TKO Waterfront' },
      { value: 'UST Sport ground', viewValue: 'UST Sport ground' },
    ];
    this.selectedTrainingPlace = '';
    this.trainingType = [
      { value: 'Water Training', viewValue: 'Water Training' },
      { value: 'Land Training', viewValue: 'Land Training' },
      { value: 'Competition', viewValue: 'Competition' },
    ];
  }

  get trainingFormGroup() {
    return this.trainingForm.get('trainings') as UntypedFormArray;
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
    this.initDataFromImportData();
    this.initDataFromStore();
  }

  initDataFromStore() {
    this.store.pipe(select(selectTrainingDataList)).subscribe({
      next: (trainingList) => {
        this.trainingList = trainingList;
      },
    });
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
    arrayControl.push(
      this.formBuilder.group({
        place: training.place,
        type: training.type,
        date: new Date(this.dateUtil.displayFormat(training.date)),
        deadline: new Date(this.dateUtil.displayFormat(training.deadline)),
      })
    );
  }

  createEmptyTraining(): UntypedFormGroup {
    return this.formBuilder.group({
      place: '',
      type: '',
      date: '',
      deadline: '',
    });
  }

  appendTraining(): void {
    this.trainingFormArray = this.trainingForm.get(
      'trainings'
    ) as UntypedFormArray;
    this.trainingFormArray.push(this.createEmptyTraining());
  }

  removeTraining(index: number): void {
    this.trainingFormArray = this.trainingForm.get(
      'trainings'
    ) as UntypedFormArray;
    this.trainingFormArray.removeAt(index);
  }

  insertNewTrainingToDB(): void {
    this.trainingForm.value.trainings.forEach((training: any) => {
      training.date = this.dateUtil.formatToMongoDBHKTime(training.date);
      training.deadline = this.dateUtil.formatToMongoDBHKTime(
        training.deadline
      );
      training.updated_at = this.dateUtil.formatToMongoDBHKTime(
        new Date().toISOString()
      );
    });
    console.log(`formGroup`, this.trainingForm.value.trainings);
    if (this.isEditTraining) {
      //update existing training info
      this.restful
        .updateTrainingInfo(
          this.importData.training._id,
          this.trainingForm.value.trainings[0]
        )
        .subscribe({
          next: (result) => {
            console.log(`update success: `, result);
            if (this.importData.isInputFromTrainingDetail) {
              //update training detail page
              console.log(`update training detail page`);
              this.trainingForm.value.trainings[0]._id =
                this.importData.training._id;
              console.log(this.trainingForm.value.trainings[0]);
              this.dialogRef.close({
                data: this.convertStringDateToDate(
                  this.trainingForm.value.trainings[0]
                ),
              });
            } else {
              //update training list in main page
              console.log(`update training list in main page`);
              this.trainingList = this.trainingList.map((training) => {
                this.trainingForm.value.trainings[0]._id =
                  this.importData.training._id;
                return training._id === this.importData.training._id
                  ? this.convertStringDateToDate(
                      this.trainingForm.value.trainings[0]
                    )
                  : training;
              });
              this.dialogRef.close();
            }
          },
          complete: () => {
            this.trainingDataService.needRefresh();
            this.store.dispatch(
              updateTrainingDataList({ trainingList: this.trainingList })
            );
          },
        });
    } else {
      //create new training to db
      this.restful
        .createTrainingList(this.trainingForm.value.trainings)
        .subscribe({
          next: (createdTrainingList) => {
            console.log(`create successfully: `, createdTrainingList);
            //todo check format not match with api response
            createdTrainingList.forEach((training) => {
              this.trainingList = this.trainingList.concat([
                this.convertStringDateToDate(training),
              ]);
            });
            console.log(`trainingList: `, this.trainingList);
          },
          complete: () => {
            this.store.dispatch(
              updateTrainingDataList({ trainingList: this.trainingList })
            );
            this.dialogRef.close();
          },
        });
    }
  }

  autoFillDateTime(event: any, index: number) {
    console.log(`autoFillDeadline event: `, event);
    this.trainingFormArray = this.trainingForm.get(
      'trainings'
    ) as UntypedFormArray;
    let dateTime = new Date(event.value);
    //remove seconds in date&time
    dateTime.setHours(dateTime.getHours(), dateTime.getMinutes(), 0);
    this.trainingFormArray.at(index).get('date')?.setValue(dateTime);
    //auto set deadline time
    let deadlineDateTime = new Date(event.value);
    deadlineDateTime.setDate(deadlineDateTime.getDate() - 1);
    deadlineDateTime.setHours(17, 0, 0);
    this.trainingFormArray
      .at(index)
      .get('deadline')
      ?.setValue(deadlineDateTime);
  }

  convertStringDateToDate(training: any): any {
    console.log(`stringDate: `, training);
    let newTraining = JSON.parse(JSON.stringify(training));
    console.log(`before: `, newTraining);
    newTraining.date =
      moment(newTraining.date)
        .tz('Asia/Hong_Kong')
        .format('YYYY-MM-DDTHH:mm:ss') + 'Z';
    newTraining.deadline =
      moment(newTraining.deadline)
        .tz('Asia/Hong_Kong')
        .format('YYYY-MM-DDTHH:mm:ss') + 'Z';
    console.log(`after: `, newTraining);
    return newTraining;
  }
}

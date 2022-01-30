import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {AwsLambdaBackendService} from "../../../services/aws-lambda-backend.service";
import {DateUtil} from "../../../services/date-util.service";

@Component({
  selector: 'app-training-form-dialog',
  templateUrl: './training-form-dialog.component.html',
  styleUrls: ['./training-form-dialog.component.scss']
})
export class TrainingFormDialogComponent implements OnInit {
  orderForm: FormGroup;
  trainings: FormArray;

  @Output() updatedTrainingList = new EventEmitter<any>();

  constructor(private dialogRef: MatDialogRef<TrainingFormDialogComponent>,
              private formBuilder: FormBuilder,
              private restful: AwsLambdaBackendService,
              private dateUtil: DateUtil) {
    console.log(`[${this.constructor.name}] constructor`);
    dialogRef.disableClose = true;
    this.trainings = this.formBuilder.array([this.createTraining()]);
    this.orderForm = this.formBuilder.group({
      trainings: this.trainings
    })
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
  }

  get trainingFormGroup(){
    return this.orderForm.get('trainings') as FormArray
  }

  createTraining(): FormGroup{
    return this.formBuilder.group({
      place: '',
      type: '',
      date: '',
      created_at: this.dateUtil.formatToHKTime(new Date().toISOString())
    });
  }

  appendTraining(): void{
    this.trainings = this.orderForm.get('trainings') as FormArray;
    this.trainings.push(this.createTraining());
  }

  removeTraining(index: number): void{
    this.trainings = this.orderForm.get('trainings') as FormArray;
    this.trainings.removeAt(index);
  }

  insertNewTrainingToDB(): void {
    this.orderForm.value.trainings.forEach((training: any) => {
      training.date = this.dateUtil.formatToHKTime(training.date)
    });
    console.log(`formGroup`, this.orderForm.value.trainings);
    this.restful.createTrainingList(this.orderForm.value.trainings).subscribe({
      next: result => {
        console.log(`create successfully: `, result);
        this.updatedTrainingList.emit(result);
        this.dialogRef.close();
      }
    });
  }

  //fetch the latest list from db
  getUpdatedTrainingList() {
    // this.updatedTrainingList.emit(this.restful.getTrainingList());
    this.restful.getTrainingList().subscribe({
      next: (result) => this.updatedTrainingList.emit(result)
    });
  }
}

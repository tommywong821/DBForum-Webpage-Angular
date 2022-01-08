import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {AwsLambdaBackendService} from "../../../services/aws-lambda-backend.service";
import {AlertDialogComponent} from "../../../shared/alert-dialog/alert-dialog.component";

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
              public alertDialog: MatDialog) {
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
      date: ''
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
    console.log('create btn clicked');
    console.log(`formGroup`, this.orderForm.value.trainings);
    this.restful.createTrainingList(this.orderForm.value.trainings).subscribe((result) => {
      console.log(`create successfully: `, result);
      this.updatedTrainingList.emit(result);
      this.dialogRef.close();
    })
  }

  //fetch the latest list from db
  getUpdatedTrainingList() {
    this.restful.getTrainingList().subscribe({
      next: (result) => this.updatedTrainingList.emit(result),
      error: (err) => {
        console.log(`[${this.constructor.name}] getUpdatedTrainingList error `, err)
        this.alertDialog.open(AlertDialogComponent, {
          data: {
            alertMsg: err
          },
        });
      },
      complete: () => console.log(`[${this.constructor.name}] getUpdatedTrainingList completed`)
    });
  }
}

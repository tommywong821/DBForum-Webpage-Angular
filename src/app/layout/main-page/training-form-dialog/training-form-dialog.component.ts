import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {AwsLambdaBackendService} from "../../../services/aws-lambda-backend.service";

@Component({
  selector: 'app-training-form-dialog',
  templateUrl: './training-form-dialog.component.html',
  styleUrls: ['./training-form-dialog.component.scss']
})
export class TrainingFormDialogComponent implements OnInit {
  orderForm: FormGroup;
  trainings: FormArray;

  constructor(private dialogRef: MatDialogRef<TrainingFormDialogComponent>,
              private formBuilder: FormBuilder,
              private restful: AwsLambdaBackendService){
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

  insertNewTrainingToDB(): void{
    console.log('create btn clicked');
    console.log(`formGroup`, this.orderForm.value.trainings);
    this.restful.createTrainingList(this.orderForm.value.trainings).subscribe((result) => {
      console.log(`create successfully`);
    })
  }
}

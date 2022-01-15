import {Component, Input, OnInit} from '@angular/core';
import {ITraining} from "../../../../model/interface/ITraining";
import {AwsLambdaBackendService} from "../../../../services/aws-lambda-backend.service";

@Component({
  selector: 'app-training-list-content',
  templateUrl: './training-list-content.component.html',
  styleUrls: ['./training-list-content.component.scss']
})
export class TrainingListContentComponent implements OnInit {

  @Input() trainingList: Array<ITraining> = [];
  @Input() isEditAble: boolean = false;

  constructor(private restful: AwsLambdaBackendService) {
    console.log(`[${this.constructor.name}] constructor`);
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
  }

  removeTrainingFromDB(training: ITraining) {
    this.restful.removeTraining(training._id).subscribe({
      next: result => {
        console.log(`removeTrainingFromDB result: `, result)
        this.removeWebViewTraining(training._id);
      }
    })
  }

  absentBtnOnclick(event: any, training: ITraining, absentReason: any) {
    this.removeWebViewTraining(training._id);
  }

  removeWebViewTraining(trainingId: string) {
    this.trainingList = this.trainingList.filter(function (obj) {
      return obj._id !== trainingId;
    })
  }
}

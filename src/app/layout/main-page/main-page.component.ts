import {Component, OnInit} from '@angular/core';
import {AwsLambdaBackendService} from "../../services/aws-lambda-backend.service";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  trainingList: Array<any> = [{
    "_id": "61d1583aaa03cc7c2869ece4",
    "date": "2022-01-01T16:00:00.000Z",
    "place": "TKO",
    "type": "Water"
  }, {
    "_id": "61d1aef828040d9c2fcccd95",
    "date": "2022-01-01T16:00:00.000Z",
    "place": "UST",
    "type": "land"
  }, {
    "_id": "61d556cf939552505240d457",
    "date": "1234",
    "place": "aaa",
    "type": "etst"
  }, {
    "_id": "61d5575d915c6a313f63943b",
    "date": "1234",
    "place": "aaa",
    "type": "etst2"
  }, {"_id": "61d557ec9898d51e0ab07a2b", "date": "1234", "place": "aaa", "type": "etst3"}];

  constructor(private restful: AwsLambdaBackendService) {
    console.log(`[${this.constructor.name}] constructor`);
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
    // this.restful.getTrainingList().subscribe(
    //   (result) => {
    //     this.trainingList = result;
    //   }
    // )
  }

  absentBtnOnclick(event: any, training: any, absentReason: any) {
    console.log(`absentBtnOnclick clicked: `, event);
    console.log(`absentBtnOnclick training: `, training);
    console.log(`absentBtnOnclick absentReason: `, absentReason);
    this.removeResponseTraining(training._id);
  }

  removeResponseTraining(trainingId: string) {
    this.trainingList = this.trainingList.filter(function (obj) {
      return obj._id !== trainingId;
    })
  }
}

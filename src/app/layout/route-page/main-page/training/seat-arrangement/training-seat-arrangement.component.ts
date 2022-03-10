import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AttendedStudentDataService} from "../../../../../services/data-services/attended-student-data.service";

@Component({
  selector: 'app-seat-arrangement',
  templateUrl: './training-seat-arrangement.component.html',
  styleUrls: ['./training-seat-arrangement.component.scss']
})
export class TrainingSeatArrangementComponent implements OnInit {

  private trainingId: string | null;
  private attendedStudentList: any;

  constructor(private route: ActivatedRoute,
              private attendedStudentDataService: AttendedStudentDataService) {
    console.log(`[${this.constructor.name}] constructor`);
    this.trainingId = '';
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
    this.route.paramMap.subscribe((paramMap) => {
      this.trainingId = paramMap.get('trainingId');
      console.log(`this.trainingId: `, this.trainingId);
    });
    this.attendedStudentList = this.attendedStudentDataService.attendedStudent;
    console.log(`this.attendedStudentList: `, this.attendedStudentList);
  }

}

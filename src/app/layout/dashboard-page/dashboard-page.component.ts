import {Component, OnInit} from '@angular/core';
import {ForumDashboardBackendService} from "../../services/aws-lambda/forum-dashboard-backend.service";

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit {

  trainingStatisticList: any;
  totalTraining: any;

  constructor(private restful: ForumDashboardBackendService) {
    console.log(`[${this.constructor.name}] constructor`);
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
    this.restful.getTrainingStatistic().subscribe({
      next: value => {
        this.trainingStatisticList = value.trainingStatistics;
        this.totalTraining = value.totalTraining;
      }
    });
  }

  public calculatePercentage(input: number) {
    return (input / this.totalTraining * 100).toFixed(0);
  }
}

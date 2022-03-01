import {Component, OnInit} from '@angular/core';
import {ForumDashboardBackendService} from "../../services/aws-lambda/forum-dashboard-backend.service";
import {faDownload} from "@fortawesome/free-solid-svg-icons";
import {saveAs} from "file-saver";

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit {
  faDownload = faDownload;

  trainingStatisticList: any;
  totalTraining: number;
  isLoading: boolean;

  constructor(private restful: ForumDashboardBackendService) {
    console.log(`[${this.constructor.name}] constructor`);
    this.isLoading = true;
    this.totalTraining = 0;
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
    this.restful.getTrainingStatistic().subscribe({
      next: result => {
        this.trainingStatisticList = result.trainingStatistics;
        this.totalTraining = result.totalTraining;
      },
      complete: () => this.isLoading = false
    });
  }

  public calculatePercentage(input: number) {
    return (input / this.totalTraining * 100).toFixed(0);
  }

  public downloadStatistics() {
    this.restful.getTrainingStatistic().subscribe({
      next: (result) => {
        this.exportDataToCsv(result.trainingStatistics);
      }
    });
  }

  private exportDataToCsv(data: any) {
    console.log(`data: `, data)
    const replacer = (key: string, value: string) => value === null ? '' : value // specify how you want to handle null values here
    const header = Object.keys((data)[0]);

    const csv = [
      header.join(','), // header row first
      // @ts-ignore
      ...data.map((row) => header.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(','))
    ].join('\r\n');

    const blob = new Blob([csv], {type: 'text/csv'});
    console.log(`blob: `, typeof (blob));
    saveAs(blob, "TrainingStatistic.csv");
  }
}

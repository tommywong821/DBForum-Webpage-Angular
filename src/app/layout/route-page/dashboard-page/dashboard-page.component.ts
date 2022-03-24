import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ForumDashboardBackendService} from "../../../services/aws-lambda/forum-dashboard-backend.service";
import {saveAs} from "file-saver";
import {NgbCalendar, NgbDate, NgbDateParserFormatter} from "@ng-bootstrap/ng-bootstrap";
import {DateUtil} from "../../../services/date-util.service";

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit {
  trainingStatisticList: any;
  totalTraining: number;
  isLoading: boolean;

  //data date range
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  isFromDateSelected: boolean;
  toDate: NgbDate | null;
  isToDateSelected: boolean;
  @ViewChild('datepicker') datePicker: ElementRef | any;

  constructor(private restful: ForumDashboardBackendService,
              private calendar: NgbCalendar,
              public formatter: NgbDateParserFormatter,
              private dateUtil: DateUtil) {
    console.log(`[${this.constructor.name}] constructor`);
    this.isLoading = false;
    this.totalTraining = 0;
    this.fromDate = null;
    this.isFromDateSelected = false;
    this.toDate = null;
    this.isToDateSelected = false;
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
  }

  public calculatePercentage(input: number) {
    return (input / this.totalTraining * 100).toFixed(0);
  }

  public downloadStatistics() {
    let toDate = this.dateUtil.formatToHKTime(new Date(this.toDate!.year, this.toDate!.month - 1, this.toDate!.day));
    let fromDate = this.dateUtil.formatToHKTime(new Date(this.fromDate!.year, this.fromDate!.month - 1, this.fromDate!.day));
    this.restful.getTrainingStatistic(toDate, fromDate).subscribe({
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

  public onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
      this.isFromDateSelected = true;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
      this.isToDateSelected = true;
    } else {
      this.toDate = null;
      this.fromDate = date;
      this.isToDateSelected = false;
      this.isFromDateSelected = true;
    }
    this.handleDateChange()
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) &&
      date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) ||
      this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  public updateTrainingStatistics() {
    if (this.fromDate == null || this.toDate == null) {
      alert(`Please choose from date and to date to quote data`);
    }

    console.log(`toDate: `, this.toDate)
    let toDate = this.dateUtil.formatToHKTime(new Date(this.toDate!.year, this.toDate!.month - 1, this.toDate!.day));
    let fromDate = this.dateUtil.formatToHKTime(new Date(this.fromDate!.year, this.fromDate!.month - 1, this.fromDate!.day));
    this.restful.getTrainingStatistic(toDate, fromDate).subscribe({
      next: result => {
        this.trainingStatisticList = result.trainingStatistics;
        this.totalTraining = result.totalTraining;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  public handleDateChange() {
    if (this.isFromDateSelected && this.isToDateSelected) {
      this.datePicker.close();
      this.isFromDateSelected = false;
      this.isToDateSelected = false;
    }
  }
}

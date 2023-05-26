import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ForumBackendMainpageService } from '../../../../../services/aws-lambda/forum-backend-mainpage.service';
import { MatDialog } from '@angular/material/dialog';
import { TrainingDetailDialogComponent } from '../detail-dialog/training-detail-dialog.component';
import { DateUtil } from '../../../../../services/date-util.service';
import { TrainingSummaryDataService } from '../../../../../services/data-services/training-summary-data.service';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { select, Store } from '@ngrx/store';
import { selectCurrentUserRole } from '../../../../../ngrx/auth0/auth0.selectors';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-training-summary',
  templateUrl: './training-summary.component.html',
  styleUrls: ['./training-summary.component.scss'],
})
export class TrainingSummaryComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  displayDataList: any;
  displayColumns: string[] = ['Date', 'Training Type', 'Training Place', 'L/R'];
  isLoading: boolean = false;
  isAdmin: boolean;
  todayDate: any;
  oneWeekAfterTodayDate: any;

  monitoringTrainingUpdate: Subscription;

  //paginator
  currentPage: number;
  pageSize: number;
  pageSizeOptions: number[];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //history date
  historyDateForm: UntypedFormGroup;

  constructor(
    private restful: ForumBackendMainpageService,
    private trainingDialog: MatDialog,
    public dateUtil: DateUtil,
    private trainingSummaryDataService: TrainingSummaryDataService,
    private store: Store<any>,
    private formBuilder: UntypedFormBuilder
  ) {
    console.log(`[${this.constructor.name}] constructor`);
    this.monitoringTrainingUpdate = new Subscription();
    this.isLoading = true;
    this.isAdmin = false;

    //paginator config
    this.currentPage = 0;
    this.pageSizeOptions = [5, 10, 20];
    this.pageSize = this.pageSizeOptions[0];
    this.dataSource = new MatTableDataSource();

    this.todayDate = new Date();
    this.oneWeekAfterTodayDate = new Date();
    this.oneWeekAfterTodayDate.setDate(
      this.oneWeekAfterTodayDate.getDate() + 7
    );
    this.historyDateForm = this.formBuilder.group({
      fromDate: this.todayDate,
      toDate: this.oneWeekAfterTodayDate,
    });

    this.monitoringTrainingUpdate =
      this.trainingSummaryDataService.trainingNeedRefresh.subscribe(
        (needRefresh) => {
          if (needRefresh) {
            this.refreshTrainingSummary();
          }
        }
      );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
    this.trainingSummaryDataService.initFromToDate(
      this.historyDateForm.value.fromDate,
      this.historyDateForm.value.toDate
    );
    this.refreshTrainingSummary();

    this.store.pipe(select(selectCurrentUserRole)).subscribe({
      next: (userLoginRole) => {
        this.isAdmin = userLoginRole?.includes('Admin');
      },
    });
  }

  ngOnDestroy() {
    this.monitoringTrainingUpdate.unsubscribe();
  }

  public displayPeopleNo(numberOfPeople: any): number {
    return numberOfPeople && numberOfPeople > 0 ? numberOfPeople : 0;
  }

  showTrainingSummary() {
    if (
      this.historyDateForm.value.toDate &&
      this.historyDateForm.value.toDate < this.historyDateForm.value.fromDate
    ) {
      alert(`End Date cannot be before Start Date`);
      return;
    }
    this.trainingSummaryDataService.initFromToDate(
      this.historyDateForm.value.fromDate,
      this.historyDateForm.value.toDate
    );
    this.refreshTrainingSummary(
      this.historyDateForm.value.fromDate,
      this.historyDateForm.value.toDate
    );
  }

  refreshTrainingSummary(fromDate?: any, toDate?: any) {
    this.isLoading = true;
    fromDate = fromDate
      ? this.dateUtil.formatToHKTimeDateOnly(fromDate)
      : this.dateUtil.formatToHKTimeDateOnly(
          this.trainingSummaryDataService.fromDate
        );
    toDate = toDate
      ? this.dateUtil.formatToHKTimeDateOnly(toDate)
      : this.dateUtil.formatToHKTimeDateOnly(
          this.trainingSummaryDataService.toDate
        );
    this.restful
      .getTrainingSummary(this.currentPage, this.pageSize, fromDate, toDate)
      .subscribe({
        next: (result) => {
          console.log(`refreshTrainingSummary: `, result);
          // this.displayDataList = result
          this.dataSource.data = result.trainingSummary;
          //control paginator
          setTimeout(() => {
            this.paginator.length = result.totalTrainingSummary.sum;
            this.paginator.pageIndex = this.currentPage;
          });
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  getTrainingDetail(row: any) {
    console.log(`getTrainingDetail: `, row);
    this.trainingDialog.open(TrainingDetailDialogComponent, {
      data: {
        trainingData: row,
      },
      height: '100%',
      width: '100%',
    });
  }

  handlePageEvent(event: PageEvent) {
    console.log(`event: `, event);
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.refreshTrainingSummary();
  }
}

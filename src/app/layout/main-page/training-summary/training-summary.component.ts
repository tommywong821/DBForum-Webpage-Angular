import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ForumMainPageBackendService} from "../../../services/aws-lambda/forum-main-page-backend.service";
import {MatDialog} from "@angular/material/dialog";
import {TrainingDetailDialogComponent} from "../training-detail-dialog/training-detail-dialog.component";
import {DateUtil} from "../../../services/date-util.service";
import {TrainingDataService} from "../../../services/training-data.service";
import {Subscription} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {select, Store} from "@ngrx/store";
import {selectCurrentUserRole} from "../../../ngrx/auth0/auth0.selectors";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-training-summary',
  templateUrl: './training-summary.component.html',
  styleUrls: ['./training-summary.component.scss']
})
export class TrainingSummaryComponent implements OnInit, OnDestroy, AfterViewInit {

  displayDataList: any
  displayColumns: string[] = ['Date', 'Training Type', 'Training Place', 'L/R'];
  isLoading: boolean = false;
  isAdmin: boolean;

  monitoringTrainingUpdate: Subscription;

  //paginator
  currentPage: number;
  pageSize: number;
  pageSizeOptions: number[];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //history date
  historyDateForm: FormGroup;

  constructor(private restful: ForumMainPageBackendService,
              private trainingDialog: MatDialog,
              public dateUtil: DateUtil,
              private trainingDataService: TrainingDataService,
              private store: Store<any>,
              private formBuilder: FormBuilder) {
    console.log(`[${this.constructor.name}] constructor`);
    this.monitoringTrainingUpdate = new Subscription();
    this.isLoading = true;
    this.isAdmin = false;

    //paginator config
    this.currentPage = 0;
    this.pageSizeOptions = [5, 10, 20];
    this.pageSize = this.pageSizeOptions[0];
    this.dataSource = new MatTableDataSource();

    this.historyDateForm = this.formBuilder.group({
      fromDate: '',
      toDate: ''
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
    this.refreshTrainingSummary();
    this.monitoringTrainingUpdate = this.trainingDataService.trainingNeedRefresh.subscribe((needRefresh) => {
      if (needRefresh) {
        this.refreshTrainingSummary();
      }
    });

    this.store.pipe(select(selectCurrentUserRole)).subscribe({
      next: (userLoginRole) => {
        this.isAdmin = userLoginRole?.includes('Admin');
      }
    })
  }

  ngOnDestroy() {
    this.monitoringTrainingUpdate.unsubscribe();
  }

  public displayPeopleNo(numberOfPeople: any): number {
    return (numberOfPeople && numberOfPeople > 0) ? numberOfPeople : 0;
  }

  showTrainingSummary() {
    if (this.historyDateForm.value.toDate && (this.historyDateForm.value.toDate < this.historyDateForm.value.fromDate)) {
      alert(`End Date cannot be before Start Date`);
      return;
    }
    this.refreshTrainingSummary(this.historyDateForm.value.fromDate, this.historyDateForm.value.toDate);
  }

  refreshTrainingSummary(fromDate?: any, toDate?: any) {
    this.isLoading = true;
    let todayDate = new Date();
    fromDate = (fromDate) ? this.dateUtil.formatToHKTime(fromDate) : this.dateUtil.formatToHKTime(todayDate);
    todayDate.setDate(todayDate.getDate() + 7)
    toDate = (toDate) ? this.dateUtil.formatToHKTime(toDate) : this.dateUtil.formatToHKTime(todayDate);
    this.restful.getTrainingSummary(this.currentPage, this.pageSize, fromDate, toDate).subscribe({
      next: (result) => {
        console.log(`refreshTrainingSummary: `, result);
        // this.displayDataList = result
        this.dataSource.data = result.trainingSummary;
        //control paginator
        setTimeout(() => {
          this.paginator.length = result.totalTrainingSummary.sum;
          this.paginator.pageIndex = this.currentPage;
        })
      },
        complete: () => {
          this.isLoading = false
        }
      }
    );
  }

  getTrainingDetail(row: any) {
    console.log(`getTrainingDetail: `, row);
    this.trainingDialog.open(TrainingDetailDialogComponent, {
      data: {
        trainingData: row
      },
      height: '100%',
      width: '100%'
    });
  }

  handlePageEvent(event: PageEvent){
    console.log(`event: `, event);
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.refreshTrainingSummary();
  }
}

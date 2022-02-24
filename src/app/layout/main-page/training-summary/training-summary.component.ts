import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ForumBackendService} from "../../../services/aws-lambda/forum-backend.service";
import {MatDialog} from "@angular/material/dialog";
import {TrainingDetailDialogComponent} from "../training-detail-dialog/training-detail-dialog.component";
import {DateUtil} from "../../../services/date-util.service";
import {TrainingDataService} from "../../../services/training-data.service";
import {Subscription} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {select, Store} from "@ngrx/store";
import {selectCurrentUserRole} from "../../../ngrx/auth0/auth0.selectors";

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
  showHistory: boolean;

  monitoringTrainingUpdate: Subscription;

  //paginator
  currentPage: number;
  pageSize: number;
  pageSizeOptions: number[];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private restful: ForumBackendService,
              private trainingDialog: MatDialog,
              public dateUtil: DateUtil,
              private trainingDataService: TrainingDataService,
              private store: Store<any>) {
    console.log(`[${this.constructor.name}] constructor`);
    this.monitoringTrainingUpdate = new Subscription();
    this.isLoading = true;
    this.isAdmin = false;
    this.showHistory = false;

    //paginator config
    this.currentPage = 0;
    this.pageSizeOptions = [5, 10, 20];
    this.pageSize = this.pageSizeOptions[0];
    this.dataSource = new MatTableDataSource();
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

  showTrainingSummaryHistory(){
    this.showHistory = true;
    this.refreshTrainingSummary();
  }

  showTrainingSummary(){
    this.showHistory = false;
    this.refreshTrainingSummary();
  }

  refreshTrainingSummary() {
    this.isLoading = true;
    this.restful.getTrainingSummary(this.showHistory, this.currentPage, this.pageSize).subscribe({
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

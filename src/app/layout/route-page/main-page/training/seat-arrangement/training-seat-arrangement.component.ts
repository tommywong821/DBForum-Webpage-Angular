import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AttendedStudentDataService} from "../../../../../services/data-services/attended-student-data.service";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {IDragonBoat} from "../../../../../model/forum/IDragonBoat";
import {DateUtil} from "../../../../../services/date-util.service";
import {ForumBackendMainpageService} from "../../../../../services/aws-lambda/forum-backend-mainpage.service";
import {filter, forkJoin, switchMap, tap} from "rxjs";
import {IStudent} from "../../../../../model/forum/IStudent";
import {select, Store} from "@ngrx/store";
import {selectCurrentUserRole} from "../../../../../ngrx/auth0/auth0.selectors";
import {ForumBackendDashboardService} from "../../../../../services/aws-lambda/forum-backend-dashboard.service";
import {v4 as uuidV4} from 'uuid';
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-seat-arrangement',
  templateUrl: './training-seat-arrangement.component.html',
  styleUrls: ['./training-seat-arrangement.component.scss']
})
export class TrainingSeatArrangementComponent implements OnInit {
  private trainingId: any;
  public attendedLeftStudentList: any;
  public attendedRightStudentList: any;
  public coachList: any;

  public dragonBoats: any;
  dragonBoatForm: FormGroup;
  dragonBoatFormArray: FormArray;
  public dragonBoatsConnected: any;

  public isLoading: boolean;
  public isAdmin: boolean;

  constructor(private route: ActivatedRoute,
              private attendedStudentDataService: AttendedStudentDataService,
              private dateUtil: DateUtil,
              private dashboardRestful: ForumBackendDashboardService,
              private mainpageRestful: ForumBackendMainpageService,
              private formBuilder: FormBuilder,
              private store: Store<any>) {
    console.log(`[${this.constructor.name}] constructor`);
    this.trainingId = '';

    this.dragonBoatsConnected = ['leftStudentList', 'rightStudentList', 'coachList'];
    this.dragonBoats = [];
    this.dragonBoatFormArray = this.formBuilder.array([])
    this.dragonBoatForm = this.formBuilder.group({
      dragonBoatFormArray: this.dragonBoatFormArray
    });

    this.isLoading = true;
    this.isAdmin = false;
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
    this.store.pipe(select(selectCurrentUserRole)).pipe(
      filter((userLoginRole) => userLoginRole),
      switchMap((userLoginRole) => {
        if (userLoginRole) {
          console.log(`updating userLoginRole: `, userLoginRole)
          this.isAdmin = userLoginRole.includes('Admin');
        }
        return this.route.paramMap;
      }),
      switchMap((paramMap) => {
        this.trainingId = paramMap.get('trainingId');
        return forkJoin([this.dashboardRestful.getCoachList(), this.mainpageRestful.getTrainingDetail(this.trainingId)])
      }),
      tap(([coachList, trainingDetail]) => {
        this.coachList = coachList;
        this.attendedLeftStudentList = trainingDetail.attend.leftStudent;
        this.attendedRightStudentList = trainingDetail.attend.rightStudent;
      }),
      switchMap(() => this.mainpageRestful.getTrainingSearArr(this.trainingId))
    ).subscribe({
      next: (seatArrList: any) => {
        seatArrList.forEach((seatArr: IDragonBoat) => {
          //fetch from db and map with attended student
          seatArr.right_seat = seatArr.right_seat.map((studentId: string) => this.mapNFilterPlanStudent(studentId))
          seatArr.left_seat = seatArr.left_seat.map((studentId: string) => this.mapNFilterPlanStudent(studentId))
          seatArr.steersperson = seatArr.steersperson.map((studentId: string) => this.mapNFilterPlanStudent(studentId))
          //push into drag and drop ui
          this.addDragonBoat(seatArr.left_seat, seatArr.right_seat, seatArr.steersperson, seatArr.dragon_boat_name);
        })
        this.isLoading = false
      }
    });
  }

  drop(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  addDragonBoat(leftSeatList?: any, rightSeatList?: any, steersperson?: any, dragonBoatName?: any) {
    const dragonBoatId = uuidV4();
    console.log(`dragonBoatId: `, dragonBoatId);
    //create drag and drop boat
    this.dragonBoats.push(
      {
        id: dragonBoatId,
        leftSeatList: (leftSeatList) ? leftSeatList : [],
        rightSeatList: (rightSeatList) ? rightSeatList : [],
        steersperson: (steersperson) ? steersperson : [],
      }
    );
    this.dragonBoatsConnected.push(`dragonBoat_${dragonBoatId}_left`);
    this.dragonBoatsConnected.push(`dragonBoat_${dragonBoatId}_right`);
    this.dragonBoatsConnected.push(`dragonBoat_${dragonBoatId}_steersperson`);
    console.log(`this.dragonBoats: `, this.dragonBoats);
    console.log(`this.dragonBoatsConnected: `, this.dragonBoatsConnected);
    //create dragon boat form
    this.dragonBoatFormArray = this.dragonBoatForm.get('dragonBoatFormArray') as FormArray;
    this.dragonBoatFormArray.push(this.createDragonBoatWithId(dragonBoatId, dragonBoatName))
  }

  calculateSideWeight(dragonId: any, position: any) {
    let dragonBoat: IDragonBoat = this.dragonBoats.filter((dboat: IDragonBoat) => dboat.id == dragonId)[0];
    let studentList = (position === "left") ? dragonBoat.leftSeatList : dragonBoat.rightSeatList;
    return studentList.map(student => student?.weight).reduce(
      (prev, curr) => this.sumFunction(prev, curr), 0
    );
  }

  calculateSidePeople(dragonId: any, position: any) {
    let dragonBoat: IDragonBoat = this.dragonBoats.filter((dboat: IDragonBoat) => dboat.id == dragonId)[0];
    let studentList = (position === "left") ? dragonBoat.leftSeatList : dragonBoat.rightSeatList;
    return studentList.filter((student) => student).length;
  }

  calculateTotalWeight(dragonId: any) {
    let dragonBoat: IDragonBoat = this.dragonBoats.filter((dboat: IDragonBoat) => dboat.id == dragonId)[0];
    return dragonBoat.leftSeatList.map(student => student?.weight).reduce(
        (prev, curr) => this.sumFunction(prev, curr), 0
      )
      +
      dragonBoat.rightSeatList.map(student => student?.weight).reduce(
        (prev, curr) => this.sumFunction(prev, curr), 0
      );
  }

  calculateTotalPeople(dragonId: any) {
    let dragonBoat: IDragonBoat = this.dragonBoats.filter((dboat: IDragonBoat) => dboat.id == dragonId)[0];
    return dragonBoat.leftSeatList.filter((student) => student).length
      + dragonBoat.rightSeatList.filter((student) => student).length;
  }

  saveSeatArrangement() {
    console.log(`saveSeatArrangement`);
    console.log(`this.dragonBoats: `, this.dragonBoats)
    //format data
    let dbObj: {
      id: number;
      leftStudentList: (string | undefined)[];
      rightStudentList: (string | undefined)[];
      steersperson: (string | undefined)[];
      updated_at: any;
      dragonBoatName: any;
    }[] = [];
    this.dragonBoats.forEach((dragonBoat: IDragonBoat) => {
      dbObj.push({
        id: dragonBoat.id,
        leftStudentList: dragonBoat.leftSeatList.map((studentAttendance) => {
          console.log(`studentAttendance: `, studentAttendance);
          if (studentAttendance?.student_id) {
            //student
            return studentAttendance?.student_id;
          } else if (studentAttendance?.uuid) {
            //coach
            return studentAttendance?.uuid;
          } else {
            //empty seat
            return undefined;
          }
        }),
        rightStudentList: dragonBoat.rightSeatList.map((studentAttendance) => {
          console.log(`studentAttendance: `, studentAttendance);
          if (studentAttendance?.student_id) {
            //student
            return studentAttendance?.student_id;
          } else if (studentAttendance?.uuid) {
            //coach
            return studentAttendance?.uuid;
          } else {
            //empty seat
            return undefined;
          }
        }),
        steersperson: dragonBoat.steersperson.map((studentAttendance: any) => {
          if (studentAttendance?.student_id) {
            return studentAttendance?.student_id;
          } else if (studentAttendance?.uuid) {
            return studentAttendance?.uuid;
          } else {
            return studentAttendance;
          }
        }),
        updated_at: this.dateUtil.formatToHKTime(new Date()),
        dragonBoatName: this.dragonBoatFormArray.value.filter((dragonBoatFormObj: { dragonBoatId: any; id: any; dragonBoatName: any; }) => {
          return dragonBoatFormObj.dragonBoatId === dragonBoat.id;
        })[0].dragonBoatName,
      })
    });
    console.log(`after this.dbObj: `, dbObj)
    this.mainpageRestful.updateTrainingSearArr(this.trainingId, dbObj).subscribe({
      next: value => {
        alert('Seat Arrangement is saved')
      }
    })
  }

  mapNFilterPlanStudent(studentId: string) {
    let student = this.attendedRightStudentList.find((student: any) => student.student_id == studentId)
    if (student) {
      //check in right list
      this.attendedRightStudentList = this.attendedRightStudentList.filter((student: any) => student.student_id !== studentId)
    } else {
      //check in left list
      student = this.attendedLeftStudentList.find((student: any) => student.student_id == studentId);
      this.attendedLeftStudentList = this.attendedLeftStudentList.filter((student: any) => student.student_id !== studentId);
    }

    if (!student && this.coachList) {
      //search in coach list
      student = this.coachList.find((coach: any) => coach.uuid == studentId);
      this.coachList = this.coachList.filter((coach: any) => coach.uuid !== studentId);
    }
    return student;
  }

  appendEmptySeat(dragonBoatId: any, side: string) {
    let dragonBoat: IDragonBoat = this.dragonBoats.find((dragonBoat: any) => {
      return dragonBoat.id === dragonBoatId
    })
    console.log(`dragonBoat: `, dragonBoat);
    const emptyStudent: IStudent = {
      _id: "",
      student_id: "",
      created_at: "",
      date_of_birth: undefined,
      email: "",
      gender: "",
      itsc: "",
      nickname: "",
      paddle_side: "",
      updated_at: "",
      weight: 0
    }
    if (side === 'left') {
      dragonBoat.leftSeatList.push(emptyStudent);
    } else {
      dragonBoat.rightSeatList.push(emptyStudent);
    }
  }

  sumFunction(prev: number, curr: number) {
    curr = (curr) ? curr : 0;
    return prev + curr;
  }

  removeStudentFromBoat(index: any, side: any, dragonBoatId: any) {
    console.log(`removeStudentFromBoat index: `, index)
    console.log(`removeStudentFromBoat side: `, side)
    console.log(`removeStudentFromBoat dragonBoatId: `, dragonBoatId)
    let dragonBoat: IDragonBoat = this.dragonBoats.find((dragonBoat: any) => {
      return dragonBoat.id === dragonBoatId
    })
    console.log(`dragonBoat: `, dragonBoat);
    if (side === 'left') {
      dragonBoat.leftSeatList.splice(index, 1);
    } else {
      dragonBoat.rightSeatList.splice(index, 1);
    }
  }

  createDragonBoatWithId(id: any, dragonBoatName?: any): FormGroup {
    return this.formBuilder.group({
      dragonBoatId: id,
      dragonBoatName: (dragonBoatName) ? dragonBoatName : ''
    });
  }

  get dragonBoatGroup() {
    console.log(this.dragonBoatForm.get('dragonBoatFormArray'))
    return this.dragonBoatForm.get('dragonBoatFormArray') as FormArray
  }

  removeSeatArrangement(index: any) {
    this.dragonBoatFormArray.removeAt(index);
    this.dragonBoats.splice(index, 1)
  }
}

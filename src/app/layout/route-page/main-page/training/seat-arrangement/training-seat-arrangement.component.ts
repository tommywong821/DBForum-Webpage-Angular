import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AttendedStudentDataService} from "../../../../../services/data-services/attended-student-data.service";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {faFemale, faMale, faPlus, faSave} from "@fortawesome/free-solid-svg-icons";
import {IDragonBoat} from "../../../../../model/forum/IDragonBoat";
import {DateUtil} from "../../../../../services/date-util.service";
import {ForumMainPageBackendService} from "../../../../../services/aws-lambda/forum-main-page-backend.service";
import {switchMap} from "rxjs";
import {IStudent} from "../../../../../model/forum/IStudent";

@Component({
  selector: 'app-seat-arrangement',
  templateUrl: './training-seat-arrangement.component.html',
  styleUrls: ['./training-seat-arrangement.component.scss']
})
export class TrainingSeatArrangementComponent implements OnInit {
  faMale = faMale;
  faFemale = faFemale;
  faPlus = faPlus;
  faSave = faSave;

  private trainingId: string | null;
  public attendedLeftStudentList: any;
  public attendedRightStudentList: any;

  public dragonBoats: any;
  public dragonBoatsConnected: any;

  public isLoading: boolean;

  constructor(private route: ActivatedRoute,
              private attendedStudentDataService: AttendedStudentDataService,
              private dateUtil: DateUtil,
              private restful: ForumMainPageBackendService) {
    console.log(`[${this.constructor.name}] constructor`);
    this.trainingId = '';
    this.dragonBoatsConnected = ['leftStudentList', 'rightStudentList'];
    this.dragonBoats = [];
    this.isLoading = true;
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
    this.attendedLeftStudentList = this.attendedStudentDataService.attendedStudent.leftStudent;
    this.attendedRightStudentList = this.attendedStudentDataService.attendedStudent.rightStudent;
    console.log(`this.attendedLeftStudentList: `, this.attendedLeftStudentList);
    console.log(`this.attendedRightStudentList: `, this.attendedRightStudentList);
    this.route.paramMap.pipe(
      switchMap((paramMap) => {
        this.trainingId = paramMap.get('trainingId');
        return this.restful.getTrainingSearArr(paramMap.get('trainingId'))
      })
    ).subscribe({
      next: (seatArrList: any) => {
        seatArrList.forEach((seatArr: IDragonBoat) => {
          //fetch from db and map with attended student
          console.log(`seatArr: `, seatArr);
          seatArr.right_seat = seatArr.right_seat.map((studentId: string) => this.mapNFilterPlanStudent(studentId))
          seatArr.left_seat = seatArr.left_seat.map((studentId: string) => this.mapNFilterPlanStudent(studentId))
          seatArr.steersperson = seatArr.steersperson.map((studentId: string) => this.mapNFilterPlanStudent(studentId))
          //push into drag and drop ui
          this.addDragonBoat(seatArr.left_seat, seatArr.right_seat, seatArr.steersperson);
        })
        this.isLoading = false;
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

  addDragonBoat(leftSeatList?: any, rightSeatList?: any, steersperson?: any) {
    console.log(this.dragonBoats.length);
    const dragonBoatId = this.dragonBoats.length + 1;
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
    }[] = [];
    this.dragonBoats.forEach((dragonBoat: IDragonBoat) => {
      dbObj.push({
        id: dragonBoat.id,
        leftStudentList: dragonBoat.leftSeatList.map((studentAttendance) => {
          return (studentAttendance?.student_id) ? studentAttendance.student_id : undefined;
        }),
        rightStudentList: dragonBoat.rightSeatList.map((studentAttendance) => {
          return (studentAttendance?.student_id) ? studentAttendance.student_id : undefined;
        }),
        steersperson: dragonBoat.steersperson.map((studentAttendance: any) => {
          if (studentAttendance?.student_id) {
            return studentAttendance?.student_id;
          } else {
            return studentAttendance;
          }
        }),
        updated_at: this.dateUtil.formatToHKTime(new Date()),
      })
    });
    console.log(`after this.dbObj: `, dbObj)
    this.restful.updateTrainingSearArr(this.trainingId, dbObj).subscribe({
      next: value => {
        console.log(`next`)
      }
    })
  }

  mapNFilterPlanStudent(studentId: string) {
    let student = this.attendedRightStudentList.find((student: any) => student.student_id == studentId)
    if (student) {
      this.attendedRightStudentList = this.attendedRightStudentList.filter((student: any) => student.student_id !== studentId)
    } else {
      //not in right list
      student = this.attendedLeftStudentList.find((student: any) => student.student_id == studentId);
      this.attendedLeftStudentList = this.attendedLeftStudentList.filter((student: any) => student.student_id !== studentId);
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
}

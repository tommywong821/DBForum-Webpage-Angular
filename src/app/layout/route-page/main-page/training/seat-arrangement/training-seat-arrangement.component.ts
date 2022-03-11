import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AttendedStudentDataService} from "../../../../../services/data-services/attended-student-data.service";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {faFemale, faMale} from "@fortawesome/free-solid-svg-icons";
import {IDragonBoat} from "../../../../../model/forum/IDragonBoat";

@Component({
  selector: 'app-seat-arrangement',
  templateUrl: './training-seat-arrangement.component.html',
  styleUrls: ['./training-seat-arrangement.component.scss']
})
export class TrainingSeatArrangementComponent implements OnInit {
  faMale = faMale;
  faFemale = faFemale

  private trainingId: string | null;
  public attendedLeftStudentList: any;
  public attendedRightStudentList: any;

  public dragonBoats: any = [];
  public dragonBoatsConnected: any;

  constructor(private route: ActivatedRoute,
              private attendedStudentDataService: AttendedStudentDataService) {
    console.log(`[${this.constructor.name}] constructor`);
    this.trainingId = '';
    this.dragonBoatsConnected = ['leftStudentList', 'rightStudentList'];
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
    this.route.paramMap.subscribe((paramMap) => {
      this.trainingId = paramMap.get('trainingId');
      console.log(`this.trainingId: `, this.trainingId);
    });
    this.attendedLeftStudentList = this.attendedStudentDataService.attendedStudent.leftStudent;
    this.attendedRightStudentList = this.attendedStudentDataService.attendedStudent.rightStudent;
    console.log(`this.attendedLeftStudentList: `, this.attendedLeftStudentList);
    console.log(`this.attendedRightStudentList: `, this.attendedRightStudentList);
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
    console.log(`event: `, event);
  }

  addDragonBoat() {
    console.log(this.dragonBoats.length);
    const dragonBoatId = this.dragonBoats.length + 1;
    this.dragonBoats.push(
      {
        id: dragonBoatId,
        leftSeatList: [],
        rightSeatList: [],
      }
    );
    this.dragonBoatsConnected.push(`dragonBoat_${dragonBoatId}_left`);
    this.dragonBoatsConnected.push(`dragonBoat_${dragonBoatId}_right`);
    console.log(`this.dragonBoats: `, this.dragonBoats);
    console.log(`this.dragonBoatsConnected: `, this.dragonBoatsConnected);
  }

  calculateSideWeight(dragonId: any, position: any) {
    let dragonBoat: IDragonBoat = this.dragonBoats.filter((dboat: IDragonBoat) => dboat.id == dragonId)[0];
    let studentList = (position === "left") ? dragonBoat.leftSeatList : dragonBoat.rightSeatList;
    return studentList.map(student => student.weight).reduce((prev, next) => prev + next, 0);
  }

  calculateSidePeople(dragonId: any, position: any) {
    let dragonBoat: IDragonBoat = this.dragonBoats.filter((dboat: IDragonBoat) => dboat.id == dragonId)[0];
    let studentList = (position === "left") ? dragonBoat.leftSeatList : dragonBoat.rightSeatList;
    return studentList.length;
  }

  calculateTotalWeight(dragonId: any) {
    let dragonBoat: IDragonBoat = this.dragonBoats.filter((dboat: IDragonBoat) => dboat.id == dragonId)[0];
    return dragonBoat.leftSeatList.map(student => student.weight).reduce((prev, next) => prev + next, 0) +
      dragonBoat.rightSeatList.map(student => student.weight).reduce((prev, next) => prev + next, 0);
  }

  calculateTotalPeople(dragonId: any) {
    let dragonBoat: IDragonBoat = this.dragonBoats.filter((dboat: IDragonBoat) => dboat.id == dragonId)[0];
    return dragonBoat.leftSeatList.length + dragonBoat.rightSeatList.length;
  }
}

import {Component, OnInit} from '@angular/core';
import {ProfileDialogComponent} from "../../../shared/header/profile-dialog/profile-dialog.component";
import {ForumDashboardBackendService} from "../../../../services/aws-lambda/forum-dashboard-backend.service";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-coach',
  templateUrl: './coach.component.html',
  styleUrls: ['./coach.component.scss']
})
export class CoachComponent implements OnInit {

  coachList: any
  isAWSLoading: boolean;

  constructor(private dashboardRestful: ForumDashboardBackendService,
              private profileDialog: MatDialog) {
    this.isAWSLoading = true;
  }

  ngOnInit(): void {
    this.dashboardRestful.getCoachList().subscribe({
      next: (coachList) => {
        this.coachList = coachList;
      },
      complete: () => this.isAWSLoading = false
    })
  }

  removeCoach(coach: any) {
    console.log(`coach: `, coach);
    this.dashboardRestful.removeCoach(coach.uuid).subscribe({
      next: response => {
        if (response) {
          this.coachList = this.coachList.filter((coachInList: any) => coachInList.uuid !== coach.uuid);
        } else {
          alert(`removeCoach fail`);
        }
      }
    })
  }

  addCoach() {
    const profileDialogRef = this.profileDialog.open(ProfileDialogComponent, {
      data: {
        isUpdateCoach: true
      },
      disableClose: true
    });

    profileDialogRef.afterClosed().subscribe((updatedCoach) => {
      console.log(`updatedCoach: `, updatedCoach.data)
      if (updatedCoach.data) {
        this.coachList.push(updatedCoach.data);
      }
    });
  }

  editCoach(coach: any) {
    console.log(`coach: `, coach)
    const profileDialogRef = this.profileDialog.open(ProfileDialogComponent, {
      data: {
        studentDetail: coach,
        isUpdateCoach: true
      },
      disableClose: true
    });

    profileDialogRef.afterClosed().subscribe((updatedCoach) => {
      console.log(`updatedCoach: `, updatedCoach.data)
      if (updatedCoach.data) {
        this.coachList = this.coachList.filter((coachInList: any) => coachInList.uuid !== coach.uuid);
        this.coachList.push(updatedCoach.data);
      }
    });
  }

}

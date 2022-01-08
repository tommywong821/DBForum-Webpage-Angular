import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

export interface DialogData {
  alertMsg: string;
}

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss']
})
export class AlertDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public incomingAlertMessage: DialogData) {
    console.log(`[${this.constructor.name}] constructor `, incomingAlertMessage.alertMsg);
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
  }

}

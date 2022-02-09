import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import jwt_decode from "jwt-decode";
import {Auth0Service} from "../../services/auth0.service";
import {ManagementDataService} from "../../services/management-data.service";

@Component({
  selector: 'app-student-management-page',
  templateUrl: './student-management-page.component.html',
  styleUrls: ['./student-management-page.component.scss']
})
export class StudentManagementPageComponent implements OnInit {

  @ViewChild('uploadCsvInput') uploadCsvVariable!: ElementRef;

  constructor(private auth0: Auth0Service,
              private managementData: ManagementDataService) {
    console.log(`[${this.constructor.name}] constructor`);
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
    console.log(`access token: ${this.auth0.accessToken}`);
    console.log(`decoded token: ${JSON.stringify(jwt_decode(this.auth0.accessToken))}`);
    const decodedToken: any = jwt_decode(this.auth0.accessToken);
    console.log(`isAdmin: ${decodedToken['http://demozero.net/roles'].includes('Admin2')}`);
  }

  uploadStudentCsv(event: any) {
    let csv: FileList = event.target.files
    if (csv && csv.length > 0 && csv.item(0)) {
      let file: File | any = csv.item(0);
      let reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        let csv: string = reader.result as string;
        console.log(csv);
        this.managementData.studentAccountCsv = csv;
      }
    }
  }

  createUser() {
    console.log(`management data service: ${this.managementData.studentAccountCsv}`);
    if (this.managementData.studentAccountCsv === "") {
      alert('Empty CSV is uploaded. Please try again');
    } else {
      //call auth0 management api
    }
  }

  reset() {
    this.uploadCsvVariable.nativeElement.value = "";
    this.managementData.studentAccountCsv = "";
  }
}

import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ManagementDataService} from "../../services/management-data.service";
import {Auth0ManagementService} from "../../services/aws-lambda/auth0-management.service";

@Component({
  selector: 'app-student-management-page',
  templateUrl: './student-management-page.component.html',
  styleUrls: ['./student-management-page.component.scss']
})
export class StudentManagementPageComponent implements OnInit {

  @ViewChild('uploadCsvInput') uploadCsvVariable!: ElementRef;

  constructor(private managementData: ManagementDataService,
              private auth0RestFul: Auth0ManagementService) {
    console.log(`[${this.constructor.name}] constructor`);
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
  }

  uploadStudentCsv(event: any) {
    let csv: FileList = event.target.files
    if (csv && csv.length > 0 && csv.item(0)) {
      let file: File | any = csv.item(0);
      let reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        let csv: string = reader.result as string;
        console.log(`uploaded csv: ${csv}`);
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
      this.auth0RestFul.createLoginUser(this.managementData.studentAccountCsv).subscribe({
        complete: () => {
          alert('Student Account is created!');
        }
      })
    }
  }

  reset() {
    this.uploadCsvVariable.nativeElement.value = "";
    this.managementData.studentAccountCsv = "";
  }
}

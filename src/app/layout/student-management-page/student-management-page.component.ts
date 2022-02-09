import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ManagementDataService} from "../../services/management-data.service";
import {Auth0ManagementService} from "../../services/aws-lambda/auth0-management.service";
import {saveAs} from "file-saver";
import {forkJoin, Observable} from "rxjs";

@Component({
  selector: 'app-student-management-page',
  templateUrl: './student-management-page.component.html',
  styleUrls: ['./student-management-page.component.scss']
})
export class StudentManagementPageComponent implements OnInit {

  sampleCsv = [{
    "email": 'abcdefg@connect.ust.hk',
    "itsc": "abcdefg",
    "sid": "123456"
  }, {"email": "hijkl@connect.ust.hk", "itsc": "hijkl", "sid": "654321"}];

  @ViewChild('uploadCsvInput') uploadCsvVariable!: ElementRef;

  managementData$: Array<Observable<any>>;

  constructor(private managementData: ManagementDataService,
              private auth0Restful: Auth0ManagementService) {
    console.log(`[${this.constructor.name}] constructor`);
    this.managementData$ = [this.auth0Restful.getStudentAccountList(), this.auth0Restful.getUserRolesList()]
  }

  ngOnInit(): void {
    console.log(`[${this.constructor.name}] ngOnInit`);
    forkJoin(this.managementData$).subscribe({
      next: (result) => {
        console.log(`result: ${JSON.stringify(result)}`);
        this.managementData.studentAccountList = result[0];
        this.managementData.userRoleList = result[1];
      },
      complete: () => {
        console.log(`studentAccountList: ${JSON.stringify(this.managementData.studentAccountList)}`)
        console.log(`userRoleList: ${JSON.stringify(this.managementData.userRoleList)}`)
      }
    })
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
      this.auth0Restful.createLoginUser(this.managementData.studentAccountCsv).subscribe({
        complete: () => {
          alert('Student Account is created!');
          this.reset();
        }
      })
    }
  }

  reset() {
    this.uploadCsvVariable.nativeElement.value = "";
    this.managementData.studentAccountCsv = "";
  }

  downloadSampleFile() {
    const replacer = (key: string, value: string) => value === null ? '' : value // specify how you want to handle null values here
    const header = Object.keys((this.sampleCsv)[0]);

    const csv = [
      header.join(','), // header row first
      // @ts-ignore
      ...this.sampleCsv.map((row) => header.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(','))
    ].join('\r\n');

    const blob = new Blob([csv], {type: 'text/csv'});
    saveAs(blob, "SampleLoginInfo.csv");
  }
}

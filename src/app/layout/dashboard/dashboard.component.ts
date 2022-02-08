import {Component, OnInit} from '@angular/core';
import jwt_decode from "jwt-decode";
import {Auth0Service} from "../../services/auth0.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private auth0: Auth0Service) {
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
    console.log(event);
    let csv: FileList = event.target.files
    if (csv && csv.length > 0 && csv.item(0)) {
      let file: File | any = csv.item(0);
      console.log(file.name);
      console.log(file.size);
      console.log(file.type);
      let reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        let csv: string = reader.result as string;
        console.log(csv);
      }
    }
  }
}

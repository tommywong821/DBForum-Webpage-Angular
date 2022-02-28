import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {select, Store} from "@ngrx/store";
import {selectCurrentUserItsc} from "../../ngrx/auth0/auth0.selectors";

@Injectable({
  providedIn: 'root'
})
export class ForumDashboardBackendService {
  private apiUrl: string = environment.forumApiUrl + '/dashboard';
  private itsc: any;

  constructor(private http: HttpClient,
              private store: Store<any>) {
    this.store.pipe(select(selectCurrentUserItsc)).subscribe({
      next: (userItsc) => {
        this.itsc = userItsc;
      }
    })
  }

  getTrainingStatistic() {
    return this.http.get<any>(this.apiUrl + "/training/statistics");
  }
}

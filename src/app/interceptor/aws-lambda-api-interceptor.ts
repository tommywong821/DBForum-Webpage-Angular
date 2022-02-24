import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {first, mergeMap, Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Store} from "@ngrx/store";
import {selectAccessToken} from "../ngrx/auth0/auth0.selectors";

@Injectable({
  providedIn: "root"
})
export class AwsLambdaApiInterceptor implements HttpInterceptor {
  xApiKey: string = environment.xApiKey;

  constructor(private store: Store<any>) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.store.select(selectAccessToken).pipe(
      first(),
      mergeMap((accessToken) => {
        request = request.clone({
          headers: request.headers.set('Content-Type', 'application/json')
            .set("x-api-key", this.xApiKey)
            .set("Authorization", accessToken)
        })
        return next.handle(request);
      })
    )
  }
}

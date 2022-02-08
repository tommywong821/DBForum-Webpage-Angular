import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Auth0Service} from "../services/auth0.service";

@Injectable()
export class AwsLambdaApiInterceptor implements HttpInterceptor {
  xApiKey: string = environment.xApiKey;

  constructor(private auth0: Auth0Service) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const accessToken = this.auth0.accessToken;
    request = request.clone({
      headers: request.headers.set('Content-Type', 'application/json')
        .set("x-api-key", this.xApiKey)
        .set("Authorization", accessToken)
    })
    return next.handle(request);
  }
}

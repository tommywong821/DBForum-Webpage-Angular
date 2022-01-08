import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  xApiKey: string = "tros2K5xguC2IhRlNALROlJsroBJKr951gIYxSa0";

  constructor() {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      headers: req.headers.set("x-api-key", this.xApiKey)
    })
    return next.handle(req);
  }
}

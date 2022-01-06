import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  xApiKey: string = "o4L8ztjoyT4MhCF40tgN58mnMMZmnFA42xA2Mu9a";

  constructor() {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      headers: req.headers.set("x-api-key", this.xApiKey)
    })
    return next.handle(req);
  }
}

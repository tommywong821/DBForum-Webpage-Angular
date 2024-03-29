import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {catchError, Observable, retry, throwError} from "rxjs";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class ApiErrorInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request)
      .pipe(
        retry(1),
        catchError((error: HttpErrorResponse) => {
          let errorMessage: any = '';

          if (error.error instanceof ErrorEvent) {
            // client-side error
            errorMessage = `Error:'${error.error}'`;
          } else {
            // server-side error
            errorMessage = `${error.error}`;
          }
          window.alert(errorMessage);
          return throwError(errorMessage);
        })
      );
  }
}

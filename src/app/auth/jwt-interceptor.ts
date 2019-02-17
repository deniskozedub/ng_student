import { Injectable } from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {AuthService} from '../shared/services/auth.service';
import {catchError} from 'rxjs/operators';
import {Router} from '@angular/router';


@Injectable()

export class JwtInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService,
              private router: Router) {}

  addToken (request: HttpRequest<any>, token: string) {
    if (this.auth.getToken()) {
      return request.clone({setHeaders: {'Authorization': token}});
    }
      return request;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    const token = localStorage.getItem('token');
      return next.handle(this.addToken(req, token))
            .pipe(catchError( (e) => {
              if (e instanceof HttpErrorResponse) {
                switch ((<HttpErrorResponse>e).status) {
                  case 401 : {
                    this.router.navigateByUrl('/login');
                    return throwError(e);
                  }
                  case 404 : {
                    return throwError(e);
                  }
                }
              }
            }));
  }
}


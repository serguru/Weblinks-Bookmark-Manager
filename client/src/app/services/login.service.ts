import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = `${environment.apiUrl}/account/login`;
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl, { userEmail: email, userPassword: password })
      .pipe(
        tap((response: any) => {
          localStorage.setItem('token', response.token);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
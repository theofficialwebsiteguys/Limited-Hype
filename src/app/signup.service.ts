import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  private signupUrl = 'http://localhost:3000/api/signup';

  constructor(private http: HttpClient) {}

  signup(email: string): Observable<any> {
    return this.http.post<any>(this.signupUrl, { email });
  }
}

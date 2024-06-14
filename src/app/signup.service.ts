import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  //private signupUrl = 'http://localhost:3000/api/signup';
  private signupUrl = 'https://limited-hype-server-fc852c1e4c1b.herokuapp.com/api/signup'

  constructor(private http: HttpClient) {}

  signup(email: string): Observable<any> {
    return this.http.post<any>(this.signupUrl, { email });
  }
}

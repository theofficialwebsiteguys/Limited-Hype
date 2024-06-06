// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private clientId = '66Yi7ku0rsjjhPUIQjkGVNSI169kfjm1';
  private redirectUri = 'http://localhost:3000/callback'; // Update with your actual URL

  constructor(private http: HttpClient, private router: Router) { }

  authorize() {
    const state = 'random_state_string'; // Replace with a real, securely generated random string
    const authorizationUrl = `https://secure.retail.lightspeed.app/connect?response_type=code&client_id=${this.clientId}&redirect_uri=${this.redirectUri}&state=${state}`;
    window.location.href = authorizationUrl;
  }

  handleCallback(code: string, state: string) {
    this.http.get(`http://localhost:3000/callback`, { params: { code, state } })
      .subscribe((response: any) => {
        if (response.accessToken) {
          localStorage.setItem('accessToken', response.accessToken);
          this.router.navigate(['/']);
        } else {
          console.error('Authorization failed');
        }
      }, error => {
        console.error('Error handling callback', error);
      });
  }

  getAccessToken() {
    return localStorage.getItem('accessToken');
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  //private apiUrl = 'http://localhost:3000';
  private apiUrl = 'https://limited-hype-server-fc852c1e4c1b.herokuapp.com/';
  constructor(private http: HttpClient) {}

  createCheckoutSession(products: { lightspeedId: string, name: string, price: number, quantity: number }[]): Observable<{ clientSecret: string }> {
    localStorage.setItem('soldProducts', JSON.stringify(products));
    console.log(products);
    return this.http.post<{ clientSecret: string }>(`${this.apiUrl}/create-checkout-session`, products);
  }

  getCheckoutSession(sessionId: string): Observable<any> {
    const params = new HttpParams().set('session_id', sessionId);
    const soldProducts = JSON.parse(localStorage.getItem('soldProducts') || '[]');
    console.log(soldProducts);
    return this.http.post(`${this.apiUrl}/api/checkout-session`, soldProducts, { params });
  }
}

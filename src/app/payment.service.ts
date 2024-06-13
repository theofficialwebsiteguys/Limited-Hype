import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private apiUrl = 'http://localhost:3000';
  //private apiUrl = 'https://limited-hype-server-fc852c1e4c1b.herokuapp.com';
  constructor(private http: HttpClient) {}

  // createCheckoutSession(products: { lightspeedId: string, name: string, price: number, quantity: number }[], currency: string, promotionCode: string): Observable<{ clientSecret: string }> {
  //   localStorage.setItem('soldProducts', JSON.stringify(products));
  //   console.log(products);
  //   return this.http.post<{ clientSecret: string }>(`${this.apiUrl}/create-checkout-session`, { products, currency, promotionCode });
  // }

  createCheckoutSession(lineItems: any[], currency: string, address: any): Observable<any> {
    const body = {
      lineItems: lineItems,
      currency: currency,
      address: address
    };

    return this.http.post<{ clientSecret: string }>(`${this.apiUrl}/create-checkout-session`, body);
  }

  getCheckoutSession(sessionId: string): Observable<any> {
    const params = new HttpParams().set('session_id', sessionId);
    const soldProducts = JSON.parse(localStorage.getItem('soldProducts') || '[]');
    console.log(soldProducts);
    return this.http.post(`${this.apiUrl}/api/checkout-session`, soldProducts, { params });
  }
}

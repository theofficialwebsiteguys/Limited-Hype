import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  // private apiUrl = 'https://api.shoplightspeed.com/en/external_services.json';

  constructor(private http: HttpClient) {}

  // createExternalService(service: any): Observable<any> {
  //   const headers = new HttpHeaders({ 'Authorization': 'Basic ' + btoa('key:secret') });
  //   return this.http.post<any>(this.apiUrl, service, { headers });
  // }

  // getPaymentMethods(endpoint: string): Observable<any> {
  //   return this.http.post<any>(`${endpoint}/payment_methods`, {/* your payload */});
  // }

  // processPayment(endpoint: string, paymentDetails: any): Observable<any> {
  //   return this.http.post<any>(`${endpoint}/payment`, paymentDetails);
  // }

  // getPaymentStatus(endpoint: string, orderId: string): Observable<any> {
  //   return this.http.get<any>(`${endpoint}/payment/${orderId}`);
  // }


  createCheckoutSession(products: { name: string, price: number, quantity: number }[]): Observable<{ clientSecret: string }> {
    console.log(products)
    return this.http.post<{ clientSecret: string }>('http://localhost:3000/create-checkout-session', products);
  }
  
}

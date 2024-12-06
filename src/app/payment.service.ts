import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  //private apiUrl = 'http://localhost:3000';
  private apiUrl = 'https://limited-hype-server-fc852c1e4c1b.herokuapp.com';
  constructor(private http: HttpClient, private cartService: CartService) {}

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

    localStorage.setItem('soldProducts', JSON.stringify(lineItems));
    console.log(lineItems)
    return this.http.post<{ clientSecret: string }>(`${this.apiUrl}/create-checkout-session`, body);
  }

  getCheckoutSession(sessionId: string): Observable<any> {
    this.cartService.clearCart()
    const params = new HttpParams().set('session_id', sessionId);
    const soldProducts = JSON.parse(localStorage.getItem('soldProducts') ?? '[]');
    const clearCache = () => {
      // Clear local storage
      localStorage.clear();
  
      // Clear session storage
      sessionStorage.clear();
  
      // Clear cookies
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      }
    };
    return this.http.post(`${this.apiUrl}/api/checkout-session`, soldProducts, { params }).pipe(
      tap((session: any) => {  
        console.log(session)
        const emailData = {
          orderNo: session.metadata.order_id,
          products: soldProducts,
          email: session.customer_details.email
        };
  
        // Send email confirmation
        this.http.post(`${this.apiUrl}/send-confirm-email`, emailData).subscribe(
          response => {
            console.log('Email sent successfully', response);
            clearCache(); // Clear cache after email is sent
          },
          error => {
            console.error('Error sending email', error);
            clearCache(); // Optionally clear cache even if email fails to send
          }
        );
      })
    );
  }
}

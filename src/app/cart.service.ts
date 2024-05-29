import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart = new BehaviorSubject<any[]>([]);
  cart$ = this.cart.asObservable();

  constructor() { }

  addToCart(product: any) {
    const currentCart = this.cart.value;
    this.cart.next([...currentCart, product]);
  }

  getCart() {
    return this.cart.value;
  }

  removeFromCart(product: any) {
    const currentCart = this.cart.value;
    const index = currentCart.indexOf(product);
    if (index > -1) {
      currentCart.splice(index, 1);
    }
    this.cart.next([...currentCart]);
  }

  clearCart() {
    this.cart.next([]);
  }
}

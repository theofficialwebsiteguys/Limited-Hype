import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart = new BehaviorSubject<any[]>(this.loadCart());
  cart$ = this.cart.asObservable();

  constructor() { }

  addToCart(product: any) {
    const currentCart = this.cart.value;
    this.cart.next([...currentCart, product]);
    this.saveCart();
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
    this.saveCart();
  }

  clearCart() {
    this.cart.next([]);
    this.saveCart();
  }

  isInCart(product: any): boolean {
    return this.cart.value.some(cartItem => cartItem.id === product.id && cartItem.size === product.size);
  }

  private saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart.value));
  }

  private loadCart() {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  }
}

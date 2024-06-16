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
    const existingProductIndex = currentCart.findIndex(cartItem => cartItem.id === product.id && cartItem.size === product.size);

    if (existingProductIndex > -1) {
      currentCart[existingProductIndex].quantity = +currentCart[existingProductIndex].quantity + +product.quantity;
    } else {
      currentCart.push(product);
    }

    this.cart.next([...currentCart]);
    this.saveCart();
  }

  getCart() {
    return this.cart.value;
  }

  removeFromCart(product: any, quantityToRemove: number) {
    const currentCart = this.cart.value;
    const index = currentCart.findIndex(cartItem => cartItem.id === product.id && cartItem.size === product.size);
    if (index > -1) {
      if (currentCart[index].quantity > quantityToRemove) {
        currentCart[index].quantity -= quantityToRemove;
      } else {
        currentCart.splice(index, 1);
      }
    }
    this.cart.next([...currentCart]);
    this.saveCart();
  }

  clearCart() {
    this.cart.next([]);
    this.saveCart();
  }

  updateCart(updatedCart: any[]) {
    this.cart.next(updatedCart);
    this.saveCart();
  }

  isInCart(product: any): boolean {
    return this.cart.value.some(cartItem => cartItem.id === product.id && cartItem.size === product.size);
  }

  getQuantityInCart(product: any): number {
    const itemInCart = this.cart.value.find(cartItem => cartItem.id === product.id && cartItem.size === product.size);
    return itemInCart ? itemInCart.quantity : 0;
  }

  private saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart.value));
  }

  private loadCart() {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  }
}

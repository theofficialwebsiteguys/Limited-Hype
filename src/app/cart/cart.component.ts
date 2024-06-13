import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit{
  cart: any[] = [];

  constructor(private cartService: CartService, private router: Router) { }

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
    });

    console.log(this.cart);
  }

  removeFromCart(product: any): void {
    this.cartService.removeFromCart(product);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  checkout(): void {
    this.router.navigate(['/checkout'], { state: { cart: this.cart } });
  }

  getSelectedVariantPrice(product: any): string | null {
    if (product && product.variant) {
      const selectedVariant = product.variant.find((variant: { size: any; }) => variant.size === product.size);
      return selectedVariant ? selectedVariant.price : null;
    }
    return null;
  }
}

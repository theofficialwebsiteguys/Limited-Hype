import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit{
  cart: any[] = [];

  constructor(private cartService: CartService, private router: Router, private productService: ProductService) { }

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart.map(item => ({ ...item, selectedQuantity: item.quantity }));
      this.loadInventoryLevels();
    });
  }

  loadInventoryLevels(): void {
    this.cart.forEach(item => {
      const id = item.variant.find((variant:any) => variant.size === item.size)?.originalVariantProductId || item.originalId;
      if (id) {
        this.productService.getProductInventory(id).subscribe(data => {
          item.inventoryLevel = data.data[0].inventory_level;
        });
      }
    });
  }

  updateQuantity(item: any, quantity: string): void {
    item.selectedQuantity = parseInt(quantity, 10);
    item.quantity = item.selectedQuantity;
    this.cartService.updateCart(this.cart);
  }

  getQuantityOptions(item: any): number[] {
    return Array.from({ length: item.inventoryLevel }, (_, i) => i + 1);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  checkout(): void {
    this.router.navigate(['/checkout'], { state: { cart: this.cart } });
  }

  getSelectedVariantPrice(product: any): number | null {
    if (product && product.variant) {
      const selectedVariant = product.variant.find((variant: any) => variant.size === product.size || (variant.size === undefined && variant.price));
      return (selectedVariant ? selectedVariant.price : null) * product.quantity;
    }
    return null;
  }
}
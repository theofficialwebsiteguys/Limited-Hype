import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-item-display',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './item-display.component.html',
  styleUrls: ['./item-display.component.scss']
})
export class ItemDisplayComponent implements OnInit {
  sizes: string[] = [];
  selectedSize: string = '';
  product: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.product = navigation.extras.state['product'];
      this.populateSizes();
    }
  }

  ngOnInit(): void {
    if (!this.product) {
      const productId = this.route.snapshot.paramMap.get('id');
      // Fetch the product using the productId if needed
    }
  }

  populateSizes(): void {
    if (this.product && this.product.variant) {
      this.product.variant.forEach((variant: any) => {
        if (variant.size) {
          this.sizes.push(variant.size);
        }
      });
    }
  }

  selectSize(size: string): void {
    this.selectedSize = size;
  }

  addToCart(): void {
    const productToAdd = { ...this.product, size: this.selectedSize };
    this.cartService.addToCart(productToAdd);
    this.router.navigateByUrl('/cart');
  }
}

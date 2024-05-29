import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-item-display',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './item-display.component.html',
  styleUrl: './item-display.component.scss'
})
export class ItemDisplayComponent {
  sizes = [8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 15];
  selectedSize: number = -1;

  product: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.product = navigation.extras.state['product'];
    }
  }

  selectSize(size: number): void {
    this.selectedSize = size;
  }

  ngOnInit(): void {
    if (!this.product) {
      const productId = this.route.snapshot.paramMap.get('id');
      // Fetch the product using the productId if needed
    }
  }

  addToCart(): void {
    console.log("here")
    const productToAdd = { ...this.product, size: this.selectedSize };
    this.cartService.addToCart(productToAdd);
    this.router.navigateByUrl('/cart');
  }
}

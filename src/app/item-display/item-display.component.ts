import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CartService } from '../cart.service';
import { Observable, of, switchMap } from 'rxjs';
import { Product } from '../models/product';
import { ProductService } from '../product.service';

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
  product: Product | null | undefined = null;
  featured$!: Observable<Product[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private productService: ProductService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.product = navigation.extras.state['product'];
      this.populateSizes();
    }
  }

  ngOnInit(): void {
    this.featured$ = this.productService.getFeaturedProducts();
     // Subscribe to route parameter changes

    // Subscribe to route parameter changes
    this.route.paramMap
      .pipe(
        switchMap(paramMap => {
          const productId = paramMap.get('id');
          if (productId) {
            return this.productService.getProductById(productId);
          } else {
            return of(null);
          }
        })
      )
      .subscribe(product => {
        this.product = product;
        this.populateSizes();
        console.log(product)
        console.log(this.sizes)
      });
  }

  populateSizes(): void {
    this.sizes = [];
    if (this.product && this.product.variant) {
      this.product.variant.forEach((variant: any) => {
        if (variant.size) {
          this.sizes.push(variant.size);
        }
      });
    }
  }

  viewProductDetail(product: any): void {
    console.log("here");
    this.router.navigate(['/item', product.id], { state: { product } });
  }

  selectSize(size: string): void {
    this.selectedSize = size;
  }

  addToCart(): void {
    const productToAdd = { ...this.product, size: this.selectedSize };
    console.log(productToAdd)
    this.cartService.addToCart(productToAdd);
    this.router.navigateByUrl('/cart');
  }
}

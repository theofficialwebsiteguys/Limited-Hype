import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CartService } from '../cart.service';
import { Observable, of, switchMap } from 'rxjs';
import { Product } from '../models/product';
import { ProductService } from '../product.service';
import { ViewportScroller, Location } from '@angular/common';

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
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private productService: ProductService,
    private viewportScroller: ViewportScroller,
    private location: Location
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
      this.sizes.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
    }
  }

  viewProductDetail(product: any): void {
    this.router.navigate(['/item', product.id], { state: { product } }).then(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }

  selectSize(size: string): void {
    if (!this.isInCart({ ...this.product, size: size })) {
      this.selectedSize = size;
      this.errorMessage = null; // Clear error message when size is selected
    }
  }

  addToCart(): void {
    if (this.sizes.length > 0 && !this.selectedSize) {
      this.errorMessage = 'Please select a size before adding to cart.';
      return;
    }

    const productToAdd = { ...this.product, size: this.sizes.length > 0 ? this.selectedSize : null };
    this.cartService.addToCart(productToAdd);
    this.router.navigateByUrl('/cart');
  }

  isInCart(product: any): boolean {
    return this.cartService.isInCart(product);
  }

  getProductWithSize(size: string) {
    return { ...this.product, size: size };
  }

  getSelectedVariantPrice(): string | null {
    if (this.product && this.product.variant) {
      const selectedVariant = this.product.variant.find(variant => variant.size === this.selectedSize);
      return selectedVariant ? selectedVariant.price : null;
    }
    return null;
  }

  goBack(): void {
    this.location.back();
  }
}

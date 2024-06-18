import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/product';
import { ProductService } from '../product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-other',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.scss']
})
export class OtherComponent implements OnInit {
  otherProducts$!: Observable<Product[]>;
  filteredProducts$!: Observable<Product[]>;
  sortOption: string = '';
  minPrice: number = 0;
  maxPrice: number = Infinity;
  filteredProductsCount: number = 0;

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.otherProducts$ = this.productService.getOtherProducts().pipe(
      map(products => {
        const brand = this.route.snapshot.routeConfig?.path?.split('/')[1];
        if (brand === 'used') {
          return products.filter(product => product.brand === 'Used');
        } else if (brand === 'new-balance') {
          return products.filter(product => product.brand === 'New Balance');
        } else if (brand === 'crocs') {
          return products.filter(product => product.brand === 'Crocs');
        } else if (brand === 'asics') {
          return products.filter(product => product.brand === 'Asics');
        } else {
          return products;
        }
      })
    );

    this.updateFilteredProducts();
  }

  onSortChange(event: any): void {
    this.sortOption = event.target.value;
    this.updateFilteredProducts();
  }

  updateFilteredProducts(): void {
    this.filteredProducts$ = this.otherProducts$.pipe(
      map(products => this.filterProducts(products)),
      map(products => this.sortProducts(products))
    );

    this.filteredProducts$.subscribe(products => this.filteredProductsCount = products.length);
  }

  filterProducts(products: Product[]): Product[] {
    return products.filter(product => 
      parseFloat(product.variant[0].price) >= this.minPrice && parseFloat(product.variant[0].price) <= this.maxPrice
    );
  }

  sortProducts(products: Product[]): Product[] {
    switch (this.sortOption) {
      case 'priceAsc':
        return products.sort((a, b) => parseFloat(a.variant[0].price) - parseFloat(b.variant[0].price));
      case 'priceDesc':
        return products.sort((a, b) => parseFloat(b.variant[0].price) - parseFloat(a.variant[0].price));
      case 'nameAsc':
        return products.sort((a, b) => a.name.localeCompare(b.name));
      case 'nameDesc':
        return products.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return products;
    }
  }

  viewProductDetail(product: Product): void {
    this.router.navigate(['/item', product.id], { state: { product } });
  }

  getMinPrice(product: Product) {
    if (product.variant && product.variant.length > 0) {
      return Math.min(...product.variant.map(v => parseFloat(v.price)));
    }
    return null;
  }
}

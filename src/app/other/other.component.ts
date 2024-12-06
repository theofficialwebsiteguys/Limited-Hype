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
  sizeFilter: string = '';
  availableSizes: string[] = [];


  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
     // Subscribe to query parameters to initialize filters and sorting
     this.route.queryParams.subscribe(params => {
      this.sortOption = params['sort'] || '';
      this.sizeFilter = params['size'] || '';
      this.minPrice = params['minPrice'] ? +params['minPrice'] : 0;
      this.maxPrice = params['maxPrice'] ? +params['maxPrice'] : Infinity;

      this.updateProducts();
    });

    
  }

  updateProducts() {
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
        } else if (brand === 'telfar') {
          return products.filter(product => product.brand === 'Telfar');
        } else if (brand === 'sneaker-care') {
          return products.filter(product => product.brand === 'Sneaker Care');
        } else if (brand === 'stanley') {
          return products.filter(product => product.brand === 'Stanley');
        } else {
          return products;
        }
      })
    );

    // Populate available sizes
    this.otherProducts$.subscribe(products => {
      this.availableSizes = Array.from(new Set(products.flatMap(product => product.variant.map(v => v.size))))
        .sort((a, b) => {
          const numA = parseFloat(a);
          const numB = parseFloat(b);
          return numA - numB; // Sort numerically
        });

      this.updateFilteredProducts();
    });
  }

  onSortChange(event: any): void {
    this.sortOption = event.target.value;
    this.updateFilteredProducts();
    this.updateQueryParams();
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
      product.variant.some((v:any) => 
        v.price >= this.minPrice && 
        v.price <= this.maxPrice && 
        (this.sizeFilter ? v.size === this.sizeFilter : true)
      )
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

  viewProductDetail(product: any): void {
    this.router.navigate(['/item', product.originalId], {
      state: { product },
      queryParams: {
        sort: this.sortOption,
        size: this.sizeFilter,
        minPrice: this.minPrice,
        maxPrice: this.maxPrice
      }
    });
  }

  getMinPrice(product: Product) {
    if (product.variant && product.variant.length > 0) {
      return Math.min(...product.variant.map(v => parseFloat(v.price)));
    }
    return null;
  }

  onSizeFilterChange(event: any): void {
    this.sizeFilter = event.target.value;
    this.updateFilteredProducts();
    this.updateQueryParams();
  }

  updateQueryParams() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: this.sortOption,
        size: this.sizeFilter,
        minPrice: this.minPrice,
        maxPrice: this.maxPrice
      },
      queryParamsHandling: 'merge',
    });
  }

  clearFilters(): void {
    this.sortOption = '';
    this.sizeFilter = '';
    this.minPrice = 0;
    this.maxPrice = Infinity;
  
    // Reset the filtered products
    this.updateFilteredProducts();
  
    // Clear query parameters
    this.updateQueryParams();
  }
}

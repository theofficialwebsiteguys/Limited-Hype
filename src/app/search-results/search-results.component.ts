import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../models/product';
import { ProductService } from '../product.service';
import { CommonModule } from '@angular/common';
import { Observable, map, of } from 'rxjs';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss'
})
export class SearchResultsComponent {
  searchResults$: Observable<Product[]> = of([]);
  filteredProducts$: Observable<Product[]> = of([]);
  filteredProductsCount: number = 0;
  query: string = '';
  sortOption: string = '';
  minPrice: number = 0;
  maxPrice: number = Infinity;
  sizeFilter: string = '';
  availableSizes: string[] = [];

  constructor(private route: ActivatedRoute, private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.query = params['query'] || '';
      this.sortOption = params['sort'] || '';
      this.sizeFilter = params['size'] || '';
      this.minPrice = params['minPrice'] ? +params['minPrice'] : 0;
      this.maxPrice = params['maxPrice'] ? +params['maxPrice'] : Infinity;
      if (this.query) {
        this.searchProducts(this.query);
      }
      
    });
  }

  searchProducts(query: string): void {
    this.searchResults$ = this.productService.getAllOrganizedProducts().pipe(
      map(products => products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase())
      ))
    );

    this.filteredProducts$ = this.searchResults$;
      // Populate available sizes
    this.searchResults$.subscribe(products => {
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
    this.filteredProducts$ = this.searchResults$.pipe(
      map(products => this.filterProducts(products)),
      map(products => this.sortProducts(products))
    );

    this.filteredProducts$.subscribe(products => this.filteredProductsCount = products.length);
  }

  sortProducts(products: Product[]): Product[] {
    switch (this.sortOption) {
      case 'priceAsc':
        return products.sort((a:any, b:any) => a.variant[0].price - b.variant[0].price);
      case 'priceDesc':
        return products.sort((a:any, b:any) => b.variant[0].price - a.variant[0].price);
      case 'nameAsc':
        return products.sort((a, b) => a.name.localeCompare(b.name));
      case 'nameDesc':
        return products.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return products;
    }
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

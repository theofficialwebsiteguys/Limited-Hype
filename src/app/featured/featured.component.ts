import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Product } from '../models/product';
import { ProductService } from '../product.service';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-featured',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './featured.component.html',
  styleUrls: ['./featured.component.scss']
})
export class FeaturedComponent implements OnInit {
  featuredProducts: Product[] = [];
  allProducts$!: Observable<Product[]>;
  filteredProducts$!: Observable<Product[]>;
  filteredProducts: Product[] = [];
  displayedFilteredProducts: Product[] = [];
  loadingFeatured = true;
  loadingAll = true;
  productsToShow = 20;
  currentIndex = 0;

  sortOption: string = '';
  minPrice: number = 0;
  maxPrice: number = Infinity;
  filteredProductsCount: number = 0;
  sizeFilter: string = '';
  availableSizes: string[] = [];

  @ViewChild('allProducts') allProductsSection!: ElementRef;

  constructor(private productService: ProductService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.productService.getFeaturedProducts().subscribe(
      (products: Product[]) => {
        this.featuredProducts = products;
        this.loadingFeatured = false;
      },
      (error: any) => {
        console.error('Error fetching all products', error);
        this.loadingFeatured = false;
      }
    );

    this.allProducts$ = this.productService.getAllOrganizedProducts().pipe(
      map(products => products)
    );

    this.allProducts$.subscribe(products => {
      this.availableSizes = Array.from(new Set(products.flatMap(product => product.variant.map(v => v.size))))
        .sort((a, b) => parseFloat(a) - parseFloat(b));

      this.updateFilteredProducts();
      this.loadingAll = false;
    });

    // Subscribe to query params and update sort/filter options
    this.route.queryParams.subscribe(params => {
      this.sortOption = params['sort'] || '';
      this.sizeFilter = params['size'] || '';
      this.minPrice = params['minPrice'] || 0;
      this.maxPrice = params['maxPrice'] || Infinity;

      this.updateFilteredProducts();
    });
  }

  onSortChange(event: any): void {
    this.sortOption = event.target.value;
    this.updateQueryParams();
  }

  onSizeFilterChange(event: any): void {
    this.sizeFilter = event.target.value;
    this.updateQueryParams();
  }

  updateFilteredProducts(): void {
    this.filteredProducts$ = this.allProducts$.pipe(
      map(products => this.filterProducts(products)),
      map(products => this.sortProducts(products))
    );

    this.filteredProducts$.subscribe(products => {
      this.filteredProducts = products;
      this.filteredProductsCount = products.length;
      this.displayedFilteredProducts = [];
      this.currentIndex = 0;
      this.displayMoreFilteredProducts();
      //this.scrollToAllProducts();
    });
  }

  filterProducts(products: Product[]): Product[] {
    return products.filter(product => 
      product.variant.some((v: any) => 
        v.price >= this.minPrice && 
        v.price <= this.maxPrice && 
        (this.sizeFilter ? v.size === this.sizeFilter : true)
      )
    );
  }

  sortProducts(products: Product[]): Product[] {
    switch (this.sortOption) {
      case 'priceAsc':
        return products.sort((a: any, b: any) => a.variant[0].price - b.variant[0].price);
      case 'priceDesc':
        return products.sort((a: any, b: any) => b.variant[0].price - a.variant[0].price);
      case 'nameAsc':
        return products.sort((a, b) => a.name.localeCompare(b.name));
      case 'nameDesc':
        return products.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return products;
    }
  }

  displayMoreFilteredProducts() {
    const nextIndex = this.currentIndex + this.productsToShow;
    this.displayedFilteredProducts = [
      ...this.displayedFilteredProducts,
      ...this.filteredProducts.slice(this.currentIndex, nextIndex)
    ];
    this.currentIndex = nextIndex;
  }

  viewProductDetail(product: Product): void {
    this.router.navigate(['/item', product.originalId], { state: { product } });
  }

  getMinPrice(product: Product): any {
    if (product.variant && product.variant.length > 0) {
      return Math.min(...product.variant.map(v => parseFloat(v.price)));
    }
    return null;
  }

  scrollToAllProducts(): void {
    if (this.allProductsSection) {
      setTimeout(() => {
        this.allProductsSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }, 0);
    }
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
    }).then(() => this.scrollToAllProducts());
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
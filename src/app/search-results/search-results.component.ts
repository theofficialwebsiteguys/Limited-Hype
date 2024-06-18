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

  constructor(private route: ActivatedRoute, private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.query = params['query'] || '';
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
    this.searchResults$.subscribe(products => this.filteredProductsCount = products.length);
  }

  onSortChange(event: any): void {
    const sortValue = event.target.value;
    this.filteredProducts$ = this.searchResults$.pipe(
      map(products => {
        switch (sortValue) {
          case 'priceAsc':
            return products.sort((a: any , b: any) => a.variant[0].price - b.variant[0].price);
          case 'priceDesc':
            return products.sort((a: any, b: any) => b.variant[0].price - a.variant[0].price);
          case 'nameAsc':
            return products.sort((a, b) => a.name.localeCompare(b.name));
          case 'nameDesc':
            return products.sort((a, b) => b.name.localeCompare(a.name));
          default:
            return products;
        }
      })
    );
  }

  viewProductDetail(product: any): void {
    // this.searchBarVisible = false;
    // const searchBarContainer = document.getElementById('searchBarContainer');
    // if (searchBarContainer) {
    //     searchBarContainer.style.display = 'none';
    // }
    this.router.navigate(['/item', product.id], { state: { product } });
}

getMinPrice(product: Product) {
  if (product.variant && product.variant.length > 0) {
    return Math.min(...product.variant.map(v => parseFloat(v.price)));
  }
  return null;
}
}

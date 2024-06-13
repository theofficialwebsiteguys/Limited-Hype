import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../models/product';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nike',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nike.component.html',
  styleUrls: ['./nike.component.scss']
})
export class NikeComponent implements OnInit {
  nikeProducts$!: Observable<Product[]>;
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
    this.nikeProducts$ = this.productService.getNikeProducts().pipe(
      map(products => {
        const brand = this.route.snapshot.routeConfig?.path?.split('/')[1];
        if (brand === 'sb') {
          return products.filter(product => product.brand === 'Nike SB');
        } else if (brand === 'dunk') {
          return products.filter(product => product.brand === 'Nike Dunk');
        } else if (brand === 'air-max') {
          return products.filter(product => product.brand === 'Air Max');
        } else if (brand === 'air-force-1') {
          return products.filter(product => product.brand === 'Air Force 1');
        } else if (brand === 'kobe') {
          return products.filter(product => product.brand === 'Kobe');
        }else {
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
    this.filteredProducts$ = this.nikeProducts$.pipe(
      map(products => this.filterProducts(products)),
      map(products => this.sortProducts(products))
    );

    this.filteredProducts$.subscribe(products => this.filteredProductsCount = products.length);
  }

  filterProducts(products: Product[]): Product[] {
    return products.filter(product => 
      product.variant[0].price >= this.minPrice.toString() && product.variant[0].price <= this.maxPrice.toString()
    );
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

  viewProductDetail(product: any): void {
    this.router.navigate(['/item', product.id], { state: { product } });
  }
}

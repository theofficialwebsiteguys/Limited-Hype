import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Product } from '../models/product';
import { ProductService } from '../product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-jordan',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './jordan.component.html',
  styleUrl: './jordan.component.scss'
})
export class JordanComponent {
  jordanProducts$!: Observable<Product[]>;
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


  ngOnInit(){

    //this.jordanProducts$ = this.productService.getJordanProducts();

    this.jordanProducts$ = this.productService.getJordanProducts().pipe(
      map(products => {
        const tag = this.route.snapshot.routeConfig?.path?.split('/')[1];
        if (tag === 'jordan-1-high') {
          return products.filter(product => product.tag === 'Jordan 1 High');
        } else if (tag === 'jordan-1-mid') {
          return products.filter(product => product.tag === 'Jordan 1 Mid');
        } else if (tag === 'jordan-1-low') {
          return products.filter(product => product.tag === 'Jordan 1 Low');
        }else if (tag === 'jordan-3') {
          return products.filter(product => product.tag === 'Jordan 3');
        }else if (tag === 'jordan-11') {
          return products.filter(product => product.tag === 'Jordan 11');
        }else if (tag === 'jordan-4') {
          return products.filter(product => product.tag === 'Jordan 4');
        }else if (tag === 'jordan-5') {
          return products.filter(product => product.tag === 'Jordan 5');
        }else if (tag === 'jordan-12') {
          return products.filter(product => product.tag === 'Jordan 12');
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
    this.filteredProducts$ = this.jordanProducts$.pipe(
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

  getMinPrice(product: Product) {
    if (product.variant && product.variant.length > 0) {
      return Math.min(...product.variant.map(v => parseFloat(v.price)));
    }
    return null;
  }
}

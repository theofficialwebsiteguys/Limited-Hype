import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Product } from '../models/product';
import { ProductService } from '../product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-yeezy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './yeezy.component.html',
  styleUrl: './yeezy.component.scss'
})
export class YeezyComponent {
  yeezyProducts$!: Observable<Product[]>;
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
    //this.yeezyProducts$ = this.productService.getYeezyProducts();


    this.yeezyProducts$ = this.productService.getYeezyProducts().pipe(
      map(products => {
        const tag = this.route.snapshot.routeConfig?.path?.split('/')[1];
        if (tag === 'slide') {
          return products.filter(product => product.tag === 'Yeezy Slide');
        } else if (tag === 'foam-rnnr') {
          return products.filter(product => product.tag === 'Foam Rnnr');
        } else if (tag === '350') {
          return products.filter(product => product.tag === '350');
        } else if (tag === '450') {
          return products.filter(product => product.tag === '450');
        }else if (tag === '500') {
          return products.filter(product => product.tag === '500');
        }else if (tag === '700') {
          return products.filter(product => product.tag === '700');
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
    this.filteredProducts$ = this.yeezyProducts$.pipe(
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

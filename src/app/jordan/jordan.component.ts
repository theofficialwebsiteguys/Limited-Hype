import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Product } from '../models/product';
import { ProductService } from '../product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-jordan',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './jordan.component.html',
  styleUrl: './jordan.component.scss'
})
export class JordanComponent {
  jordanProducts$!: Observable<Product[]>;

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}


  ngOnInit(){

    //this.jordanProducts$ = this.productService.getJordanProducts();

    this.jordanProducts$ = this.productService.getJordanProducts().pipe(
      map(products => {
        const tag = this.route.snapshot.routeConfig?.path?.split('/')[0];
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
        }else {
          return products;
        }
      })
    );
  }

  viewProductDetail(product: any): void {
    this.router.navigate(['/item', product.id], { state: { product } });
  }
}

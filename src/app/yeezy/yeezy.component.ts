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
        if (tag === 'yeezy-slide') {
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
  }

  viewProductDetail(product: any): void {
    console.log("here");
    this.router.navigate(['/item', product.id], { state: { product } });
  }
}

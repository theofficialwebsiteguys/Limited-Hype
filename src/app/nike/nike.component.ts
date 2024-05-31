import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../models/product';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-nike',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nike.component.html',
  styleUrls: ['./nike.component.scss']
})
export class NikeComponent implements OnInit {
  nikeProducts$!: Observable<Product[]>;

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
        } else if (brand === 'supreme') {
          return products.filter(product => product.brand === 'Supreme');
        } else {
          return products;
        }
      })
    );
  }

  viewProductDetail(product: any): void {
    this.router.navigate(['/item', product.id], { state: { product } });
  }
}

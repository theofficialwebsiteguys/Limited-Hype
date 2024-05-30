import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Product } from '../models/product';
import { ProductService } from '../product.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-yeezy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './yeezy.component.html',
  styleUrl: './yeezy.component.scss'
})
export class YeezyComponent {
  yeezyProducts$!: Observable<Product[]>;

  constructor(private productService: ProductService, private router: Router){}


  ngOnInit(){
    this.yeezyProducts$ = this.productService.getYeezyProducts();
    // this.productService.getYeezyProducts().subscribe(
    //   (products: Product[]) => {
    //     this.yeezyProducts = products;
    //     console.log(this.yeezyProducts);
    //   },
    //   (error: any) => {
    //     console.error('Error fetching Nike products', error);
    //   }
    // );
  }

  viewProductDetail(product: any): void {
    console.log("here");
    this.router.navigate(['/item', product.id], { state: { product } });
  }
}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../models/product';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-nike',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nike.component.html',
  styleUrl: './nike.component.scss'
})
export class NikeComponent implements OnInit {
  nikeProducts$!: Observable<Product[]>;

  constructor(private productService: ProductService, private router: Router){}


  ngOnInit(){

    this.nikeProducts$ = this.productService.getNikeProducts();
    // this.productService.getNikeProducts().subscribe(
    //   (products: Product[]) => {
    //     this.nikeProducts = products;
    //     console.log(this.nikeProducts);
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

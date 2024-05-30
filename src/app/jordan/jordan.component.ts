import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Product } from '../models/product';
import { ProductService } from '../product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-jordan',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './jordan.component.html',
  styleUrl: './jordan.component.scss'
})
export class JordanComponent {
  jordanProducts: Product[] = [];

  constructor(private productService: ProductService, private router: Router){}


  ngOnInit(){
    this.productService.getJordanProducts().subscribe(
      (products: Product[]) => {
        this.jordanProducts = products;
        console.log(this.jordanProducts);
      },
      (error: any) => {
        console.error('Error fetching Nike products', error);
      }
    );
  }

  viewProductDetail(product: any): void {
    console.log("here");
    this.router.navigate(['/item', product.id], { state: { product } });
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Product } from '../models/product';
import { ProductService } from '../product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clothing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clothing.component.html',
  styleUrl: './clothing.component.scss'
})
export class ClothingComponent {
  clothingProducts: Product[] = [];

  constructor(private productService: ProductService, private router: Router){}


  ngOnInit(){
    this.productService.getClothingProducts().subscribe(
      (products: Product[]) => {
        this.clothingProducts = products;
        console.log(this.clothingProducts);
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

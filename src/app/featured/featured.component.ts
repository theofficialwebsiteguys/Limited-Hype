import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Product } from '../models/product';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-featured',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './featured.component.html',
  styleUrl: './featured.component.scss'
})
export class FeaturedComponent {

  featured = [
    {
      id: 1,
      name: 'Nike Dunk Low Retro White Black Panda',
      price: '$160.00 USD',
      image: 'assets/placeholder.jpg' // Update with actual image paths
    },
    {
      id: 2,
      name: 'Nike Dunk Low Triple Pink (GS)',
      price: 'From $180.00 USD',
      image: 'assets/placeholder.jpg'
    },
    {
      id: 3,
      name: 'Nike Dunk Low Retro White Black Panda (GS)',
      price: '$145.00 USD',
      image: 'assets/placeholder.jpg'
    },
    {
      id: 4,
      name: 'Nike Dunk Low Grey Fog',
      price: 'From $155.00 USD',
      image: 'assets/placeholder.jpg'
    },
    
  ];
  
  allProducts: Product[] = [];

  constructor(private productService: ProductService, private router: Router){}


  ngOnInit(){
    this.productService.getAllOrganizedProducts().subscribe(
      (products: Product[]) => {
        this.allProducts = products;
        console.log(this.allProducts);
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

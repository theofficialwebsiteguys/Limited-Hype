import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Product } from '../models/product';
import { ProductService } from '../product.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-featured',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './featured.component.html',
  styleUrl: './featured.component.scss'
})
export class FeaturedComponent {

  featured$!: Observable<Product[]>;
  
  allProducts$!: Observable<Product[]>;

  loadingFeatured = true;
  loadingAll = true;

  constructor(private productService: ProductService, private router: Router){}


  ngOnInit(){
    this.featured$ = this.productService.getFeaturedProducts();
    this.allProducts$ = this.productService.getAllOrganizedProducts();


    // this.productService.getFeaturedProducts().subscribe(
    //   (products: Product[]) => {
    //     this.featured = products;
    //     console.log(this.allProducts);
    //   },
    //   (error: any) => {
    //     console.error('Error fetching Nike products', error);
    //   }
    // );

    // this.productService.getAllOrganizedProducts().subscribe(
    //   (products: Product[]) => {
    //     this.allProducts = products;
    //     console.log(this.allProducts);
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

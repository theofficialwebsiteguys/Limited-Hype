import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Product } from '../models/product';
import { ProductService } from '../product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-clothing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clothing.component.html',
  styleUrl: './clothing.component.scss'
})
export class ClothingComponent {
  clothingProducts$!: Observable<Product[]>;

  constructor(private productService: ProductService, private router: Router, private route: ActivatedRoute){}


  ngOnInit(){

    this.clothingProducts$ = this.productService.getClothingProducts().pipe(
      map(products => {
        const brand = this.route.snapshot.routeConfig?.path?.split('/')[1];
        if (brand === 'essentials') {
          return products.filter(product => product.brand === 'Essentials');
        } else if (brand === 'denim-tears') {
          return products.filter(product => product.brand === 'Denim Tears');
        } else if (brand === 'bape') {
          return products.filter(product => product.brand === 'Bape');
        } else if (brand === 'eric-emanuel') {
          return products.filter(product => product.brand === 'Eric Emanuel');
        } else if (brand === 'hellstar') {
          return products.filter(product => product.brand === 'Hellstar');
        } else if (brand === 'pharaoh-collection') {
          return products.filter(product => product.brand === 'Pharaoh Collections');
        } else if (brand === 'limited-hype') {
          return products.filter(product => product.brand === 'Limited Hype');
        } else {
          return products;
        }
      })
    );

    // this.productService.getClothingProducts().subscribe(
    //   (products: Product[]) => {
    //     this.clothingProducts = products;
    //     console.log(this.clothingProducts);
    //   },
    //   (error: any) => {
    //     console.error('Error fetching Nike products', error);
    //   }
    // );
  }

  viewProductDetail(product: any): void {
    this.router.navigate(['/item', product.id], { state: { product } });
  }
}

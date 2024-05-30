import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from './models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  products: any[] = [];

  organizedProducts: Product[] = [];

  private apiUrl = 'http://localhost:3000/api/products'; // URL of your Node.js server

  constructor(private http: HttpClient) { }

  getAllProducts(): any {
    //Getting the raw products array and setting to local products
    var id = 0;
    this.http.get(this.apiUrl).subscribe((data: any) => {
        data.forEach((product: any) => {
          var variantId = product.variant_parent_id;
          if(product.variant_parent_id && (product.variant_parent_id !== variantId)){
            var variants: { size: string; price: string; }[] = [];
            var image: string = '';
            var variantProducts = data.filter((product: { variant_parent_id: any; id: any }) => 
              product.variant_parent_id === variantId || product.id === variantId
            );
            variantProducts.forEach((variant: any) => {
              if(variant.id === variantId){
                image = variant.image_url;
              }
              variants.push({size: variant.variant_options[0]?.value, price: variant.price_including_tax})
            });
            this.organizedProducts.push(
              new Product(
                id,
                product.name,
                image,
                variants
              )
            )
          }else if(!product.variant_parent_id){
            this.organizedProducts.push(
              new Product(
                id,
                product.name,
                product.image_url,
                [{size: product.variant_options[0]?.value, price: product.price_including_tax}]
              )
            )
          }
        });

        console.log(this.organizedProducts);
      }, error => {
        console.error('There was an error!', error);
      }
    );








    return this.products;
  }

}

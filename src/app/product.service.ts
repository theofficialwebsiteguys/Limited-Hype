import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Product } from './models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'https://limited-hype-server-fc852c1e4c1b.herokuapp.com/api/products'; // URL of your Node.js server
  private organizedProductsSubject = new BehaviorSubject<Product[]>(this.loadProducts());
  organizedProducts$ = this.organizedProductsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.fetchProductsFromServer();
  }

  private fetchProductsFromServer(): void {
    this.http.get<any[]>(this.apiUrl).pipe(
      map(data => {
        const organizedProductsMap = new Map<string, Product>();
        const variants: any[] = [];
  
        data.forEach((product: any) => {
          const variantParentId = product.variant_parent_id;
          const featured = product.categories[0]?.name === 'featured';
          
          if (!variantParentId) {
            // It's a parent product
            const newProduct = new Product(
              product.id,
              organizedProductsMap.size,
              product.name,
              product.image_url,
              product.brand?.name,
              featured,
              [{ size: product.variant_options[0]?.value, price: product.price_including_tax }]
            );
            organizedProductsMap.set(product.id, newProduct);
          } else {
            // It's a variant
            variants.push(product);
          }
        });
  
        // Process variants and associate them with their parent products
        variants.forEach(variant => {
          const parentProduct = organizedProductsMap.get(variant.variant_parent_id);
          if (parentProduct) {
            parentProduct.variant.push({
              size: variant.variant_options[0]?.value,
              price: variant.price_including_tax
            });
          } else {
            // Handle the case where the parent product is still not in the map
            const placeholderProduct = new Product(
              variant.variant_parent_id,
              organizedProductsMap.size,
              '', // Placeholder name
              '', // Placeholder image URL
              '', // Placeholder brand
              false, // Placeholder featured flag
              [{ size: variant.variant_options[0]?.value, price: variant.price_including_tax }]
            );
            organizedProductsMap.set(variant.variant_parent_id, placeholderProduct);
          }
        });
  
        // Ensure placeholders are updated with actual parent product data
        data.forEach((product: any) => {
          if (!product.variant_parent_id && organizedProductsMap.has(product.id)) {
            const parentProduct = organizedProductsMap.get(product.id);
            if (parentProduct) {
              parentProduct.name = product.name;
              parentProduct.imageUrl = product.image_url;
              parentProduct.brand = product.brand?.name;
              parentProduct.featured = product.categories[0]?.name === 'featured';
            }
          }
        });
  
        const organizedProducts = Array.from(organizedProductsMap.values());
        this.saveProducts(organizedProducts);
        console.log(organizedProducts);
        return organizedProducts;
      }),
      tap(products => this.organizedProductsSubject.next(products))
    ).subscribe();
  }
  
  

  getAllOrganizedProducts(): Observable<Product[]> {
    return this.organizedProducts$.pipe(
      map(products => products.filter(product => !product.imageUrl.endsWith('no-image-white-standard.png')))
    );
  }

  getNikeProducts(): Observable<Product[]> {
    return this.organizedProducts$.pipe(
      map(products => products.filter(product => product.brand === 'Nike' || product.brand === 'Nike SB'|| product.brand === 'Supreme'))
    );
  }

  getJordanProducts(): Observable<Product[]> {
    return this.organizedProducts$.pipe(
      map(products => products.filter(product => product.brand === 'Jordan'))
    );
  }

  getYeezyProducts(): Observable<Product[]> {
    return this.organizedProducts$.pipe(
      map(products => products.filter(product => product.brand === 'Yeezy'))
    );
  }

  getClothingProducts(): Observable<Product[]> {
    return this.organizedProducts$.pipe(
      map(products => products.filter(product => ['Denim Tears', 'Essentials', 'Bape', 'Limited Hype', 'Pharaoh Collections', 'Hellstar', 'Eric Emanuel', 'Kaws'].includes(product.brand)))
    );
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.organizedProducts$.pipe(
      map(products => products.filter(product => product.featured))
    );
  }

  getProductById(id: string): Observable<Product | undefined> {
    return this.organizedProducts$.pipe(
      map(products => products.find(product => product.id.toString() === id))
    );
  }

  private saveProducts(products: Product[]): void {
    localStorage.setItem('products', JSON.stringify(products));
  }

  private loadProducts(): Product[] {
    const savedProducts = localStorage.getItem('products');
    return savedProducts ? JSON.parse(savedProducts) : [];
  }
}

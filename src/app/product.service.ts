import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Product } from './models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'https://limited-hype-server-fc852c1e4c1b.herokuapp.com/api/products'; // URL of your Node.js server
  //private apiUrl = 'http://localhost:3000/api/products';
  private organizedProductsSubject = new BehaviorSubject<Product[]>(this.loadProducts());
  organizedProducts$ = this.organizedProductsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.fetchProductsFromServer();
  }

  private getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  private fetchProductsFromServer(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders(), withCredentials: true }).pipe(
        map(data => {
          const organizedProductsMap = new Map<string, Product>();
          const variants: any[] = [];
          let productIdCounter = 0;
  
          data.forEach((product: any) => {
            if (product.name.includes("GRAND OPENING") || product.brand?.name === "Timberland" || product.brand?.name === "Vintage" || product.brand?.name === "BRIXKAPS" || product.brand?.name === "Caught Boarding" || product.brand?.name === "Designer Print Shorts" || product.brand?.name === "Opal Supply") {
              return;
            }
            const variantParentId = product.variant_parent_id;
            const featured = product.categories[0]?.name === 'featured';
            const tag = featured ? product.categories[1]?.name : product.categories[0]?.name;
  
            const images = product.images.map((img: any) => img.url);
  
            if (!variantParentId) {
              // It's a parent product
              const newProduct = new Product(
                product.id,
                productIdCounter++,
                product.name,
                images,
                product.brand?.name,
                featured,
                tag,
                product.product_category?.name,
                [{ originalVariantProductId: '', size: product.variant_options[0]?.value, price: product.price_including_tax }]
              );
              organizedProductsMap.set(product.id, newProduct);
            } else {
              // It's a variant
              variants.push(product);
              // Ensure a placeholder for parent if not already present
              if (!organizedProductsMap.has(variantParentId)) {
                const placeholderProduct = new Product(
                  variantParentId,
                  productIdCounter++,
                  '', // Placeholder name
                  [],
                  '', // Placeholder brand
                  false, // Placeholder featured flag
                  '',
                  '',
                  []
                );
                organizedProductsMap.set(variantParentId, placeholderProduct);
              }
            }
          });
  
          // Process variants and associate them with their parent products
          variants.forEach(variant => {
            const parentProduct = organizedProductsMap.get(variant.variant_parent_id);
            if (parentProduct) {
              const variantImages = variant.skuImages.map((img: any) => img.url);
              parentProduct.variant.push({
                originalVariantProductId: variant.id,
                size: variant.variant_options[0]?.value,
                price: variant.price_including_tax
              });
  
              // Merge variant images into the parent's images array
              parentProduct.images = [...new Set([...parentProduct.images, ...variantImages])];
  
              // If the placeholder parent has empty details, fill them with the first variant's details
              if (!parentProduct.name && !parentProduct.brand) {
                parentProduct.name = variant.name;
                parentProduct.images = [...new Set([...parentProduct.images, ...variantImages])];
                parentProduct.featured = variant.categories[0]?.name === 'featured';
                parentProduct.brand = variant.brand?.name;
                parentProduct.category = variant.product_category?.name;
                parentProduct.tag = variant.categories[0]?.name === 'featured' ? variant.categories[1]?.name : variant.categories[0]?.name
              }
            }
          });
  
          // Ensure placeholders are updated with actual parent product data
          data.forEach((product: any) => {
            if (!product.variant_parent_id && organizedProductsMap.has(product.id)) {
              const parentProduct = organizedProductsMap.get(product.id);
              if (parentProduct) {
                const productImages = product.images.map((img: any) => img.url); // Update images array
                parentProduct.name = product.name;
                parentProduct.images = [...new Set([...parentProduct.images, ...productImages])];
                parentProduct.brand = product.brand?.name;
                parentProduct.featured = product.categories[0]?.name === 'featured';
                parentProduct.category = product.product_category?.name;
                parentProduct.tag = product.categories[0]?.name === 'featured' ? product.categories[1]?.name : product.categories[0]?.name;
              }
            }
          });
  
          const organizedProducts = Array.from(organizedProductsMap.values());
          organizedProducts.sort((a, b) => a.name.localeCompare(b.name));
  
          return organizedProducts; // Return the sorted products
        }),
        switchMap(organizedProducts => {
          return this.getFullProductInventory().pipe(
            map(inventory => {
              if (Array.isArray(inventory)) {
                // Filter the organizedProducts to only include those with non-empty variant arrays after updating
                const updatedProducts = organizedProducts.filter(product => {
                  // Filter the variants to only include those that are in stock
                  product.variant = product.variant.filter(variant => {
                    if (variant.originalVariantProductId === '') {
                      // Check if the product's originalId is in inventory and in stock
                      return inventory.some((inv: any) => inv.product_id === product.originalId && inv.inventory_level >= 1);
                    } else {
                      // Check if the variant's originalVariantProductId is in inventory and in stock
                      return inventory.some((inv: any) => inv.product_id === variant.originalVariantProductId && inv.inventory_level >= 1);
                    }
                  });
  
                  // Return true to keep the product only if it has a non-empty variant array
                  return product.variant.length > 0;
                });
  
                return updatedProducts; // Return the updated products
              } else {
                console.error('Inventory data is not an array', inventory.data);
                throw new Error('Inventory data is not an array');
              }
            })
          );
        }),
        tap(products => this.organizedProductsSubject.next(products))
      ).subscribe({
        next: updatedProducts => {
          this.saveProducts(updatedProducts);
          resolve(updatedProducts);
        },
        error: err => {
          reject(err);
        }
      });
    });
  }


  
  
  getFullProductInventory(): Observable<any> {
    return this.http.get<any>(this.apiUrl + `/inventory`, { headers: this.getHeaders(), withCredentials: true });
  }
  
  getProductInventory(id: string): Observable<any> {
    return this.http.get<any>(this.apiUrl + `/${id}/inventory`, { headers: this.getHeaders(), withCredentials: true });
  }

  getAllOrganizedProducts(): Observable<Product[]> {
    return this.organizedProducts$;
    // return this.organizedProducts$.pipe(
    //   map(products => products.filter(product => !product.imageUrl.endsWith('no-image-white-standard.png')))
    // );
  }

  getNikeProducts(): Observable<Product[]> {
    return this.organizedProducts$.pipe(
      map(products => products.filter(product => product.brand === 'Nike' || product.brand === 'Nike SB'|| product.tag === 'Nike Dunk'|| product.tag === 'Nike Air Max'|| product.tag === 'Air Force 1'|| product.tag === 'Kobe'))
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
      map(products => products.filter(product => ['Denim Tears', 'Essentials', 'Bape', 'Limited Hype', 'Pharaoh Collections', 'Hellstar', 'Eric Emanuel', 'Kaws', 'Supreme', 'Sp5der', 'Yeezy GAP', 'Anti Social Social Club', 'Stussy'].includes(product.brand)))
    );
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.organizedProducts$.pipe(
      map(products => products.filter(product => product.featured))
    );
  }

  getOtherProducts(): Observable<Product[]> {
    return this.organizedProducts$.pipe(
      map(products => products.filter(product => product.brand === 'Used' || product.brand === 'New Balance' || product.brand === 'Crocs' || product.brand === 'Asics' || product.brand === 'Telfar' || product.brand === 'Sneaker Care'|| product.brand === 'Stanley'))
    );
  }

  getProductById(id: string): Observable<Product | undefined> {
    return this.organizedProducts$.pipe(
      map(products => products.find(product => product.originalId.toString() === id))
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

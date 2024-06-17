// src/app/models/product.model.ts
export class Product {
    constructor(
      public originalId: string,
      public id: number,
      public name: string,
      public images: string[],
      // public imageUrl: string,
      // public imageBack: string,
      public brand: string,
      public featured: boolean,
      public tag: string,
      public category: string,
      public variant: {
        originalVariantProductId: string,
        size: string,
        price: string
      }[]

    ) {}
  }
  
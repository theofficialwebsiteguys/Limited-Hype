// src/app/models/product.model.ts
export class Product {
    constructor(
      public originalId: string,
      public id: number,
      public name: string,
      public imageUrl: string,
      public brand: string,
      public featured: boolean,
      public tag: string,
      public variant: {
        size: string,
        price: string
      }[]

    ) {}
  }
  
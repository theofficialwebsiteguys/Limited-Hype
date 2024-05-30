// src/app/models/product.model.ts
export class Product {
    constructor(
      public id: number,
      public name: string,
      public imageUrl: string,
      public brand: string,
      public variant: {
        size: string,
        price: string
      }[]

    ) {}
  }
  
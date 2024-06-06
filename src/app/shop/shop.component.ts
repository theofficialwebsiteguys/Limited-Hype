import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  imagePaths: string[] = [
    'assets/shop/1.JPG',
    'assets/shop/2.JPG',
    'assets/shop/3.JPG',
    'assets/shop/4.JPG',
    'assets/shop/12.JPG',
    'assets/shop/6.JPG',
    'assets/shop/7.JPG',
    'assets/shop/11.JPG',
    'assets/shop/9.JPG',
    'assets/shop/10.JPG',
    'assets/shop/13.JPG',
    'assets/shop/14.JPG',
    'assets/shop/15.JPG'
  ];

  imagesLoaded: { [key: string]: boolean } = {};

  constructor() { }

  ngOnInit(): void {
    this.imagePaths.forEach(path => this.imagesLoaded[path] = false);
  }

  onImageLoad(imagePath: string): void {
    this.imagesLoaded[imagePath] = true;
  }

  onImageError(imagePath: string): void {
    this.imagesLoaded[imagePath] = true; // Treat errors as "loaded" to remove spinner
  }

  isLoading(imagePath: string): boolean {
    return !this.imagesLoaded[imagePath];
  }
}

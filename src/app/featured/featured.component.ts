import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

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
  

  all = [
    {
      name: 'Nike Dunk Low Retro White Black Panda',
      price: '$160.00 USD',
      image: 'assets/placeholder.jpg' // Update with actual image paths
    },
    {
      name: 'Nike Dunk Low Triple Pink (GS)',
      price: 'From $180.00 USD',
      image: 'assets/placeholder.jpg'
    },
    {
      name: 'Nike Dunk Low Retro White Black Panda (GS)',
      price: '$145.00 USD',
      image: 'assets/placeholder.jpg'
    },
    {
      name: 'Nike Dunk Low Grey Fog',
      price: 'From $155.00 USD',
      image: 'assets/placeholder.jpg'
    },
    {
      name: 'Nike Dunk Low Retro White Black Panda',
      price: '$160.00 USD',
      image: 'assets/placeholder.jpg' // Update with actual image paths
    },
    {
      name: 'Nike Dunk Low Triple Pink (GS)',
      price: 'From $180.00 USD',
      image: 'assets/placeholder.jpg'
    },
    {
      name: 'Nike Dunk Low Retro White Black Panda (GS)',
      price: '$145.00 USD',
      image: 'assets/placeholder.jpg'
    },
    {
      name: 'Nike Dunk Low Grey Fog',
      price: 'From $155.00 USD',
      image: 'assets/placeholder.jpg'
    },
    {
      name: 'Nike Dunk Low Retro White Black Panda',
      price: '$160.00 USD',
      image: 'assets/placeholder.jpg' // Update with actual image paths
    },
    {
      name: 'Nike Dunk Low Triple Pink (GS)',
      price: 'From $180.00 USD',
      image: 'assets/placeholder.jpg'
    },
    {
      name: 'Nike Dunk Low Retro White Black Panda (GS)',
      price: '$145.00 USD',
      image: 'assets/placeholder.jpg'
    },
    {
      name: 'Nike Dunk Low Grey Fog',
      price: 'From $155.00 USD',
      image: 'assets/placeholder.jpg'
    },
    
  ];

  constructor(private router: Router) {}

  viewProductDetail(product: any): void {
    console.log("here");
    this.router.navigate(['/item', product.id], { state: { product } });
  }
}

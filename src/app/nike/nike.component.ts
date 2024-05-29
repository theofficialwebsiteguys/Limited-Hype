import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-nike',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nike.component.html',
  styleUrl: './nike.component.scss'
})
export class NikeComponent {
  nikes = [
    {
      name: 'Nike Dunk Low Retro White Black Panda',
      price: '$160.00 USD',
      image: 'assets/placeholder.jpg'
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
}

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  name: string = '';
  email: string = '';
  phone: string = '';
  comment: string = '';

  constructor(private http: HttpClient) {}

  onSubmit() {
    const formData = {
      name: this.name,
      email: this.email,
      phone: this.phone,
      comment: this.comment
    };

    // this.http.post('http://localhost:3000/send-email', formData)
    //   .subscribe(response => {
    //     console.log('Email sent successfully', response);
    //   }, error => {
    //     console.error('Error sending email', error);
    //   });

      this.http.post('https://limited-hype-server-fc852c1e4c1b.herokuapp.com/send-email', formData)
      .subscribe(response => {
        console.log('Email sent successfully', response);
      }, error => {
        console.error('Error sending email', error);
      });
  }
}

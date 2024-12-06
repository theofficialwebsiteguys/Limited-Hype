import { Component, OnInit } from '@angular/core';
import { SignupService } from '../signup.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup-popup.component.html',
  styleUrl: './signup-popup.component.scss',
})
export class SignupPopupComponent implements OnInit {
  email: string = '';
  showPopup: boolean = false;

  constructor(private signupService: SignupService) {}

  ngOnInit() {
    if (!localStorage.getItem('popupShown')) {
      this.showPopup = true;
    }
  }

  onSubmit() {
    this.signupService.signup(this.email).subscribe(response => {
      alert('Signup successful! Look out for exclusive deals.');
      this.closePopup();
    }, error => {
      console.error('Error during signup:', error);
      alert('Signup failed.');
    });
  }

  closePopup() {
    this.showPopup = false;
    localStorage.setItem('popupShown', 'true');
  }
}

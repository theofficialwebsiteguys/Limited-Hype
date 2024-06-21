import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../payment.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {
  sessionId: string | null = null;
  orderDetails: any = null;
  error: string | null = null;
  subscriptionEmail: string = '';

  constructor(private router: Router, private route: ActivatedRoute, private paymentService: PaymentService, private http: HttpClient) { }

  ngOnInit(): void {
    this.sessionId = this.route.snapshot.queryParamMap.get('session_id');
    if (this.sessionId) {
      this.paymentService.getCheckoutSession(this.sessionId).subscribe(
        (session) => {
          this.orderDetails = session;
        },
        (error) => {
          this.error = 'Error retrieving order details';
          console.error('Error retrieving session details:', error);
        }
      );
    } else {
      this.error = 'No session ID found in URL';
    }
  }

  continueShopping(): void {
    // Implement continue shopping logic here
    this.router.navigate(['/home']);
  }

  subscribe(): void {
    // Implement subscription logic here
    console.log(`Subscribed with email: ${this.subscriptionEmail}`);
  }
}

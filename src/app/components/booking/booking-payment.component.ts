import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HotelService } from '../../services/hotel.service';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'app-booking-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslocoModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-12">
      <div class="max-w-3xl mx-auto px-4">
        <div class="space-y-8">
          <!-- Booking Summary -->
          <div class="card">
            <h2 class="text-2xl font-bold mb-6">{{ 'bookingPayment.title' | transloco }}</h2>
            <div class="space-y-4">
              <div class="flex justify-between items-center pb-4 border-b">
                <span class="text-gray-600">{{ 'bookingPayment.roomType' | transloco }}</span>
                <span class="font-semibold">{{ bookingDetails?.room?.type }}</span>
              </div>
              <div class="flex justify-between items-center pb-4 border-b">
                <span class="text-gray-600">{{ 'bookingPayment.checkInDate' | transloco }}</span>
                <span class="font-semibold">{{ bookingDetails?.checkIn | date }}</span>
              </div>
              <div class="flex justify-between items-center pb-4 border-b">
                <span class="text-gray-600">{{ 'bookingPayment.checkOutDate' | transloco }}</span>
                <span class="font-semibold">{{ bookingDetails?.checkOut | date }}</span>
              </div>
              <div class="flex justify-between items-center pb-4 border-b">
                <span class="text-gray-600">{{ 'bookingPayment.numberOfGuests' | transloco }}</span>
                <span class="font-semibold">{{ bookingDetails?.guests }}</span>
              </div>
              <div class="flex justify-between items-center text-lg font-bold">
                <span>{{ 'bookingPayment.totalAmount' | transloco }}</span>
                <span class="text-primary-600">{{ bookingDetails?.totalPrice | currency }}</span>
              </div>
            </div>
          </div>

          <!-- Payment Form -->
          <div class="card">
            <h2 class="text-2xl font-bold mb-6">{{ 'bookingPayment.paymentDetailsTitle' | transloco }}</h2>
            <form (ngSubmit)="processPayment()" class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1" for="cardName">
                  {{ 'bookingPayment.form.cardHolderName' | transloco }}
                </label>
                <input type="text" id="cardName" class="input-field" [(ngModel)]="paymentDetails.cardName" name="cardName" required />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1" for="cardNumber">
                  {{ 'bookingPayment.form.cardNumber' | transloco }}
                </label>
                <input type="text" id="cardNumber" class="input-field" [(ngModel)]="paymentDetails.cardNumber" name="cardNumber" 
                      required pattern="[0-9]{16}" maxlength="16" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1" for="expiryDate">
                    {{ 'bookingPayment.form.expiryDate' | transloco }}
                  </label>
                  <input type="text" id="expiryDate" class="input-field" [(ngModel)]="paymentDetails.expiryDate" name="expiryDate" 
                        placeholder="{{ 'bookingPayment.form.expiryDatePlaceholder' | transloco }}" 
                        required pattern="[0-9]{2}/[0-9]{2}" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1" for="cvv">
                    {{ 'bookingPayment.form.cvv' | transloco }}
                  </label>
                  <input type="text" id="cvv" class="input-field" [(ngModel)]="paymentDetails.cvv" name="cvv" 
                        required pattern="[0-9]{3,4}" maxlength="4" />
                </div>
              </div>
              <div class="flex justify-between items-center pt-4">
                <button type="button" class="btn-secondary" (click)="cancelBooking()">
                  {{ 'bookingPayment.form.cancelButton' | transloco }}
                </button>
                <button type="submit" class="btn-primary">
                  {{ 'bookingPayment.form.confirmPaymentButton' | transloco }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

  `
})
export class BookingPaymentComponent implements OnInit {
  bookingDetails: any;
  paymentDetails = {
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  };

  constructor(
    private hotelService: HotelService,
    private router: Router
  ) {}

  ngOnInit() {
    this.bookingDetails = this.hotelService.getBookingDetails();
    if (!this.bookingDetails) {
      this.router.navigate(['/hotels']);
    }
  }

  processPayment() {
    // Here you would typically process the payment
    alert('Payment processed successfully! Booking confirmed.');
    this.hotelService.clearBookingDetails();
    this.router.navigate(['/']);
  }

  cancelBooking() {
    this.hotelService.clearBookingDetails();
    this.router.navigate(['/hotels']);
  }
}
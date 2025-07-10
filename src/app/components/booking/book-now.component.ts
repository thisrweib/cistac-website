import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { HotelService } from '../../services/hotel.service';
import { Room, Hotel, BookingDetails } from '../../models/user.model';
import { StorageService } from '@app/services/storage/storage.service';
import { Booking, BookingService } from '@app/services/booking.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-book-now',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslocoModule],
  template: `
    <div class="max-w-4xl mx-auto p-6">
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">{{ 'booking.title' | transloco }}</h1>
        <p class="text-gray-600">{{ 'booking.subtitle' | transloco }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Booking Form -->
        <div class="md:col-span-2">
          <div class="card">
            <form (ngSubmit)="proceedToPayment()" class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ 'booking.checkIn' | transloco }}
                </label>
                <input 
                  type="date" 
                  class="input-field" 
                  [(ngModel)]="bookingData.checkIn" 
                  name="checkIn"
                  [min]="today"
                  (change)="checkDateConflicts()"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ 'booking.checkOut' | transloco }}
                </label>
                <input 
                  type="date" 
                  class="input-field" 
                  [(ngModel)]="bookingData.checkOut" 
                  name="checkOut"
                  [min]="bookingData.checkIn || today"
                  (change)="checkDateConflicts()"
                  required
                />
              </div>
              <div *ngIf="isDateConflict" class="text-red-600 mt-4">
                {{ 'booking.dateConflictMessage' | transloco }}
              </div>


              <div class="flex justify-between pt-4">
                <button 
                  type="button" 
                  class="btn-secondary" 
                  (click)="goBack()"
                >
                  {{ 'common.cancel' | transloco }}
                </button>
                <button 
                  type="submit" 
                  class="btn-primary"
                  [disabled]="!isFormValid() || isDateConflict"
                >
                  {{ 'booking.proceedToPayment' | transloco }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Booking Summary -->
        <div class="md:col-span-1">
          <div class="card sticky top-6">
            <h2 class="text-xl font-bold mb-4">{{ 'booking.summary' | transloco }}</h2>
            
            <div class="space-y-4">
              <div *ngIf="room" class="pb-4 border-b">
                <h3 class="font-semibold">{{room.type}}</h3>
                <p class="text-gray-600">{{hotel.name}}</p>
                <p class="text-primary-600 font-bold mt-2">
                  {{room.pricePerNight | currency}} / {{ 'booking.perNight' | transloco }}
                </p>
              </div>

              <div *ngIf="bookingData.checkIn && bookingData.checkOut" class="pb-4 border-b">
                <div class="flex justify-between text-sm">
                  <span>{{ 'booking.nights' | transloco }}</span>
                  <span>{{calculateNights()}} {{ 'booking.nightsCount' | transloco }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span>{{ 'booking.basePrice' | transloco }}</span>
                  <span>{{calculateBasePrice() | currency}}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span>{{ 'booking.taxes' | transloco }}</span>
                  <span>{{calculateTaxes() | currency}}</span>
                </div>
              </div>

              <div class="pt-2">
                <div class="flex justify-between font-bold">
                  <span>{{ 'booking.total' | transloco }}</span>
                  <span>{{calculateTotal() | currency}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class BookNowComponent implements OnInit {
  hotel: Hotel | undefined;
  room: Room | undefined;
  today = new Date().toISOString().split('T')[0];
  hotelId: number;
  roomBookings: Booking[] = [];
  isDateConflict = false;
  
  bookingData = {
    roomId: null,
    hotelId: null,
    userId: null,
    checkIn: '',
    checkOut: '',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hotelService: HotelService,
    private bookingService: BookingService,
    private toastr: ToastrService,
    private t : TranslocoService
  ) {}

  ngOnInit() {
    this.hotelId = Number(this.route.snapshot.paramMap.get('hotelId'));
    const roomId = Number(this.route.snapshot.paramMap.get('roomId'));

    this.hotelService.getHotel(this.hotelId).subscribe(hotel => {
      this.hotel = hotel;
      this.room = hotel?.rooms.find(r => r.roomId === roomId);

      if (!this.room) {
        this.router.navigate(['/hotels']);
        return;
      }

      // 💡 Rezervasyonları sadece bir kere çekiyoruz
      this.bookingService.getBookingByRoomId(this.room.roomId).subscribe({
        next: (bookings) => {
          this.roomBookings = bookings;
        },
        error: (err) => {
          if (err.status === 404) {
            // Booking bulunamadı, boş dizi ata, hata gösterme
            this.roomBookings = [];
            
          } else {
            // Diğer hatalar için opsiyonel olarak hata logla veya göster
            console.error('Booking fetch error:', err);
            // istersen kullanıcıya mesaj göster
          }
        }
      });
    });
  }

  calculateNights(): number {
    if (!this.bookingData.checkIn || !this.bookingData.checkOut) return 0;
    const checkIn = new Date(this.bookingData.checkIn);
    const checkOut = new Date(this.bookingData.checkOut);
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  }

  calculateBasePrice(): number {
    return (this.room?.pricePerNight || 0) * this.calculateNights();
  }

  calculateTaxes(): number {
    return this.calculateBasePrice() * 0.1; // 10% tax
  }

  calculateTotal(): number {
    return this.calculateBasePrice() + this.calculateTaxes();
  }

  isFormValid(): boolean {
    return !!(
      this.bookingData.checkIn &&
      this.bookingData.checkOut &&
      this.calculateNights() > 0
    );
  }

  proceedToPayment() {
    if (!this.room) return;

    const bookingDetails: BookingDetails = {
      hotelId: this.hotelId,
      roomId: this.room.roomId,
      userId: StorageService.getUserId(),
      checkInDate: this.formatDate(new Date(this.bookingData.checkIn)),
      checkOutDate: this.formatDate(new Date(this.bookingData.checkOut)),
    };

    this.bookingService.createBooking(bookingDetails).subscribe({
      next: () => this.toastr.success(this.t.translate('toastr.success')),
      error: err => this.toastr.error(this.t.translate('toastr.error'))
    });


    
    // this.router.navigate(['/booking/payment']);
  }

  goBack() {
    this.router.navigate(['/hotels']);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Aylar 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  checkDateConflicts() {
    if (!this.room || !this.bookingData.checkIn || !this.bookingData.checkOut) {
      this.isDateConflict = false;
      return;
    }

    const checkIn = new Date(this.bookingData.checkIn);
    const checkOut = new Date(this.bookingData.checkOut);

    this.isDateConflict = this.roomBookings.some(booking => {
      const bookedCheckIn = new Date(booking.checkInDate);
      const bookedCheckOut = new Date(booking.checkOutDate);

      // Çakışma kontrolü:
      return (
        (checkIn < bookedCheckOut) && (checkOut > bookedCheckIn)
      );
    });
  }



}
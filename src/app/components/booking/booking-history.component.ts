import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HotelService } from '../../services/hotel.service';
import { Reservation } from '../../models/user.model';
import { TranslocoModule } from '@ngneat/transloco';
import { FeedbackDialogComponent } from './feedback-dialog.component';
import { StorageService } from '@app/services/storage/storage.service';
import { BookingService } from '@app/services/booking.service';
import { RequestDialogComponent } from './request-dialog.component';
import { RecommendationService } from '@app/services/recommendation.service';

@Component({
  selector: 'app-booking-history',
  standalone: true,
  imports: [CommonModule, TranslocoModule, FeedbackDialogComponent, RequestDialogComponent, TranslocoModule],
  template: `
    <div class="space-y-6">
      <h1 class="text-3xl font-bold text-gray-900">{{ 'bookingHistory.title' | transloco }}</h1>

      <!-- Ongoing Bookings -->
      <div class="space-y-4">
        <h2 class="text-xl font-semibold text-gray-900">{{ 'bookingHistory.sections.ongoing.title' | transloco }}</h2>
        <div class="grid gap-4">
          <div *ngFor="let booking of onGoingBookings" class="card hover:shadow-lg transition-shadow">
            <div class="flex flex-col md:flex-row justify-between">
              <div class="space-y-2">
                <div class="flex items-center space-x-2">
                  <span class="text-lg font-semibold">
                    {{ 'bookingHistory.sections.ongoing.reservationLabel' | transloco:{bookingId: booking.bookingId} }}
                  </span>
                 <span [class]="getStatusBadgeClass(booking.bookingStatus)">
                    {{ ('bookingHistory.statuses.' + booking.bookingStatus) | transloco }}
                  </span>
                </div>
                <p class="text-gray-600">
                  {{ 'bookingHistory.sections.ongoing.checkIn' | transloco }}: {{ booking.checkInDate | date }} - 
                  {{ 'bookingHistory.sections.ongoing.checkOut' | transloco }}: {{ booking.checkOutDate | date }}
                </p>
                <p class="text-gray-600 font-medium">
                  {{ 'bookingHistory.sections.ongoing.total' | transloco }}: {{ booking.totalPrice | currency }}
                </p>
              </div>
              <div class="mt-4 md:mt-0 flex flex-col justify-between items-end">
                <div class="space-y-2">
                  <button *ngIf="booking.bookingStatus == 'confirmed'" 
                          (click)="requestDialog(booking)"
                          class="btn-primary text-sm">
                    {{ 'bookingHistory.sections.ongoing.requestButton' | transloco }}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div *ngIf="onGoingBookings.length == 0" class="text-center ">
            <p class="text-gray-500 text-lg">
              {{ 'bookingHistory.sections.ongoing.noBookings' | transloco }}
            </p>
          </div>
        </div>
      </div>

      <!-- Active Bookings -->
      <div class="space-y-4">
        <h2 class="text-xl font-semibold text-gray-900">{{ 'bookingHistory.sections.active.title' | transloco }}</h2>
        <div class="grid gap-4">
          <div *ngFor="let booking of activeBookings" class="card hover:shadow-lg transition-shadow">
            <div class="flex flex-col md:flex-row justify-between">
              <div class="space-y-2">
                <div class="flex items-center space-x-2">
                  <span class="text-lg font-semibold">
                    {{ 'bookingHistory.sections.active.reservationLabel' | transloco:{bookingId: booking.bookingId} }}
                  </span>
                  <span [class]="getStatusBadgeClass(booking.bookingStatus)">
                    {{ ('bookingHistory.statuses.' + booking.bookingStatus) | transloco }}
                  </span>
                </div>
                <p class="text-gray-600">
                  {{ 'bookingHistory.sections.active.checkIn' | transloco }}: {{ booking.checkInDate | date }} - 
                  {{ 'bookingHistory.sections.active.checkOut' | transloco }}: {{ booking.checkOutDate | date }}
                </p>
                <p class="text-gray-600 font-medium">
                  {{ 'bookingHistory.sections.active.total' | transloco }}: {{ booking.totalPrice | currency }}
                </p>
              </div>
              <div class="mt-4 md:mt-0 flex flex-col justify-between items-end">
                <div class="space-y-2">
                  <button *ngIf="booking.bookingStatus == 'completed'" 
                          (click)="logAndSelect(booking)"
                          class="btn-primary text-sm">
                    {{ 'bookingHistory.sections.active.leaveFeedbackButton' | transloco }}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div *ngIf="activeBookings.length == 0" class="text-center">
            <p class="text-gray-500 text-lg">
              {{ 'bookingHistory.sections.active.noBookings' | transloco }}
            </p>
          </div>
        </div>
      </div>

      <!-- Past Bookings -->
      <div class="space-y-4">
        <h2 class="text-xl font-semibold text-gray-900">{{ 'bookingHistory.sections.past.title' | transloco }}</h2>
        <div class="grid gap-4">
          <div *ngFor="let booking of pastBookings" class="card hover:shadow-lg transition-shadow">
            <div class="flex flex-col md:flex-row justify-between">
              <div class="space-y-2">
                <div class="flex items-center space-x-2">
                  <span class="text-lg font-semibold">
                    {{ 'bookingHistory.sections.past.reservationLabel' | transloco:{bookingId: booking.bookingId} }}
                  </span>
                  <span [class]="getStatusBadgeClass(booking.bookingStatus)">
                    {{ ('bookingHistory.statuses.' + booking.bookingStatus) | transloco }}
                  </span>
                </div>
                <p class="text-gray-600">
                  {{ 'bookingHistory.sections.past.checkIn' | transloco }}: {{ booking.checkInDate | date }} - 
                  {{ 'bookingHistory.sections.past.checkOut' | transloco }}: {{ booking.checkOutDate | date }}
                </p>
                <p class="text-gray-600 font-medium">
                  {{ 'bookingHistory.sections.past.total' | transloco }}: {{ booking.totalPrice | currency }}
                </p>
              </div>
              <div class="mt-4 md:mt-0 flex flex-col justify-between items-end">
                <div class="space-y-2">
                  <button (click)="logAndSelect(booking)" class="btn-primary text-sm">
                    {{ 'bookingHistory.sections.past.leaveFeedbackButton' | transloco }}
                  </button>
                </div>
                <div *ngIf="booking.feedback" class="text-sm text-gray-500">
                  {{ 'bookingHistory.sections.past.yourRating' | transloco:{rating: booking.feedback.rating} }}
                </div>
              </div>
            </div>
          </div>
          <div *ngIf="pastBookings.length == 0" class="text-center">
            <p class="text-gray-500 text-lg">
              {{ 'bookingHistory.sections.past.noBookings' | transloco }}
            </p>
          </div>
        </div>
      </div>

      <!-- No Bookings Message -->
      <div *ngIf="activeBookings.length === 0 && pastBookings.length === 0" class="text-center py-12">
        <p class="text-gray-600">{{ 'bookingHistory.noBookingsOverall' | transloco }}</p>
      </div>

      <!-- Feedback Dialog -->
      <app-feedback-dialog
        *ngIf="selectedReservation"
        [reservation]="selectedReservation"
        (close)="selectedReservation = null"
        (submitted)="onSubmitted()">
      </app-feedback-dialog>

      <!-- Request Dialog -->
      <app-request-dialog
        *ngIf="selectedReservationRequest"
        [reservation]="selectedReservationRequest"
        (close)="selectedReservationRequest = null"
        (submitted)="onSubmitted()">
      </app-request-dialog>
    </div>

  `
})
export class BookingHistoryComponent implements OnInit {
  onGoingBookings = [];
  activeBookings = [];
  pastBookings = [];
  reservations :any;
  selectedReservation: Reservation | null = null;
  selectedReservationRequest: Reservation | null = null
  userId:any;
  constructor(private hotelService: HotelService,
              private bookingService: BookingService, private recom:RecommendationService
  ) {}

  ngOnInit() {    
    this.loadBookings();
  }

  loadBookings() {
    this.userId = StorageService.getUserId();
      this.bookingService.getUserBookings(this.userId).subscribe(bookings => {
        const now = new Date();

        // Devam eden rezervasyonlar
        this.onGoingBookings = bookings.filter(booking =>
          new Date(booking.checkInDate) <= now && new Date(booking.checkOutDate) >= now
        );

        // Aktif rezervasyonlar (devam edenleri hariç tut)
        this.activeBookings = bookings.filter(booking =>
          new Date(booking.checkOutDate) > now &&
          !this.onGoingBookings.some(ongoing => ongoing.bookingId === booking.bookingId)
        );
        

        // Geçmiş rezervasyonlar
        this.pastBookings = bookings.filter(booking =>
          new Date(booking.checkOutDate) < now
        );

        this.reservations = bookings
        this.mapHotelsToBookings();
        

    });
  
  }

  logAndSelect(booking: any) {
    this.selectedReservation = { ...booking }; 
  }

  requestDialog(booking: any){
    this.selectedReservationRequest = {...booking}
    
  }

  mapHotelsToBookings() {
    if (!this.reservations) return;

    this.hotelService.getHotels().subscribe(hotels => {
      this.reservations.forEach((booking: any) => {
        // Oteli ata
        const hotel = hotels.find((h: any) => h.hotelId === booking.hotelId);
        booking.hotel = hotel;
        

        if (hotel && hotel.rooms) {
          // Odayı bul
          const room = hotel.rooms.find((r: any) => r.roomId === booking.roomId);
          booking.room = room;

          if (room) {
            // Kalış süresi (gün cinsinden)
            const checkIn = new Date(booking.checkInDate);
            const checkOut = new Date(booking.checkOutDate);
            const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            // Toplam fiyatı hesapla
            booking.totalPrice = room.pricePerNight * diffDays;
            
          }
        }
      });
    });
  }

  getStatusBadgeClass(status: string): string {
    const baseClasses = 'px-2 py-1 text-xs font-semibold rounded-full';
    switch (status) {
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'confirmed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'completed':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'cancalled':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  }

  onSubmitted() {
    this.loadBookings();
  }

}
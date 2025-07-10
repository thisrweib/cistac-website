import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { HotelService } from '../../services/hotel.service';
import { Reservation } from '../../models/user.model';
import { BookingService } from '@app/services/booking.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pending-approvals-dialog',
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">{{ 'admin.dashboard.pendingApprovals' | transloco }}</h2>
          <button (click)="close.emit()" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <div *ngFor="let reservation of pendingReservations" 
               class="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
            <div class="flex justify-between items-start">
              <div>
                <p class="font-medium">{{ 'booking.reservation' | transloco }} #{{reservation.bookingId}}</p>
                <p class="text-sm text-gray-600">
                  {{reservation.checkInDate | date}} - {{reservation.checkOutDate | date}}
                </p>
                <p class="text-sm text-gray-600">
                  {{ 'booking.bookingHotel' | transloco }}: {{ reservation.hotel.name}}
                </p>
                <p class="text-lg text-gray-700 ">
                  {{ 'booking.totalPrice' | transloco }}: {{reservation.totalPrice | currency}}
                </p>
              </div>
              <div class="flex space-x-2">
                <button (click)="approveReservation(reservation.bookingId)" 
                        class="px-4 py-2 font-medium bg-green-600 text-white rounded-lg hover:bg-green-700">
                  {{ 'common.approve' | transloco }}
                </button>
                <button (click)="rejectReservation(reservation.bookingId)" 
                        class="px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700">
                  {{ 'common.reject' | transloco }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="pendingReservations?.length === 0" class="text-center py-8">
          <p class="text-gray-600">{{ 'admin.dashboard.noPendingApprovals' | transloco }}</p>
        </div>
      </div>
    </div>
  `
})
export class PendingApprovalsDialogComponent implements OnInit {
  @Input() hotel:any;
  @Output() close = new EventEmitter<void>();
  pendingReservations :any;

  constructor(private hotelService: HotelService,
              private bookingService: BookingService,
                      private toastr: ToastrService,
                      private t : TranslocoService
              
  ) {}

  ngOnInit() {
    this.loadPendingReservations();
  }

  loadPendingReservations() {
    this.bookingService.getBookings().subscribe(bookings => {
      this.pendingReservations = bookings.filter(b => b.bookingStatus.toLowerCase() === 'pending');
      this.mapHotelsToBookings();
    });
  }

  mapHotelsToBookings() {
    if (!this.pendingReservations || !this.hotel) return;

    this.pendingReservations.forEach((booking: any) => {
      // Oteli ata
      const hotel = this.hotel.find((h: any) => h.hotelId === booking.hotelId);
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
  }

  approveReservation(id: number) {
    this.bookingService.updateBookingStatus(id, 'confirmed').subscribe({
      next: () => {
        this.loadPendingReservations();
        this.toastr.success(this.t.translate('toastr.success'));
      },
      error: (error) => {

        this.toastr.error(this.t.translate('toastr.error'));
      }
    });
  }

  rejectReservation(id: number) {
    this.bookingService.updateBookingStatus(id, 'rejected').subscribe({
      next: () => {
        this.loadPendingReservations();
        this.toastr.success(this.t.translate('toastr.success'));
      },
      error: (error) => {
        this.toastr.error(this.t.translate('toastr.error'));
      }
    });
  }


}
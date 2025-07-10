import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Booking, BookingService } from '@app/services/booking.service';
import { HotelService } from '@app/services/hotel.service';
import { TranslocoModule } from '@ngneat/transloco';
import { FormsModule } from '@angular/forms';
import { User, UserService } from '@app/services/user.service';
import { Room } from '@app/models/user.model';
import { RoomService } from '@app/services/room.service';

@Component({
  selector: 'app-all-reservations',
  standalone: true,
  imports: [CommonModule, TranslocoModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">{{ 'reservations.title' | transloco }}</h2>
        <div class="flex items-center gap-4">
          <label class="text-sm font-medium text-gray-700">{{ 'reservations.filterLabel' | transloco }}</label>
          <select [(ngModel)]="selectedHotelId" (change)="filterByHotel()" class="border rounded px-2 py-1">
            <option [ngValue]="null">{{ 'reservations.allHotels' | transloco }}</option>
            <option *ngFor="let hotel of hotels" [ngValue]="hotel.hotelId">{{ hotel.name }}</option>
          </select>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow overflow-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{{ 'reservations.tableHeader.reservationId' | transloco }}</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{{ 'reservations.tableHeader.user' | transloco }}</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{{ 'reservations.tableHeader.hotelName' | transloco }}</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{{ 'reservations.tableHeader.roomNumber' | transloco }}</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{{ 'reservations.tableHeader.reservationDate' | transloco }}</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{{ 'reservations.tableHeader.reservationStatus' | transloco }}</th>
              
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr *ngFor="let booking of filteredBookings">
              <td class="px-6 py-4 text-sm text-gray-900">{{ booking.bookingId }}</td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ getUserName(booking.userId) }}</td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ getHotelName(booking.hotelId) }}</td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ getRoomNumber(booking.roomId) }}</td>
              <td class="px-6 py-4 text-sm text-gray-900">
                {{ booking.checkInDate | date }} → {{ booking.checkOutDate | date }}
              </td>
              <td class="px-6 py-4 text-sm">
                <span
                  class="px-2 py-1 rounded-xl text-xs font-medium"
                  [ngClass]="{
                    'text-green-800 bg-green-100': booking.bookingStatus === 'confirmed',
                    'text-yellow-800 bg-yellow-100': booking.bookingStatus === 'pending',
                    'text-red-800 bg-red-100': booking.bookingStatus === 'cancelled',
                    'text-blue-800 bg-blue-100': booking.bookingStatus === 'completed'
                  }">
                  {{ booking.bookingStatus | titlecase }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AllReservationsComponent implements OnInit {
  bookings: Booking[] = [];
  filteredBookings: Booking[] = [];
  hotels: any[] = [];
  selectedHotelId: number | null = null;
  users: User[] = [];
  rooms: Room[] = [];

  constructor(
    private bookingService: BookingService,
    private hotelService: HotelService,
    private userService: UserService,
    private roomService: RoomService
  ) {}

  ngOnInit(): void {
    this.loadBookings();
    this.loadHotels();
    this.loadUsers();
  }

  loadBookings(): void {
    this.bookingService.getBookings().subscribe({
      next: (data) => {
        this.bookings = data;
        this.filterByHotel();
      },
      error: (err) => console.error('Failed to fetch bookings:', err)
    });
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error('Failed to fetch users:', err)
    });
  }

  loadHotels(): void {
    this.hotelService.getHotels().subscribe({
      next: (data) => (this.hotels = data),
      error: (err) => console.error('Failed to fetch hotels:', err)
    });
  }
  

  filterByHotel(): void {
    this.filteredBookings = this.selectedHotelId
      ? this.bookings.filter(b => b.hotelId === this.selectedHotelId)
      : this.bookings;
      console.log(this.filteredBookings);
      
  }

  getRoomNumber(roomId: number): string {
    const allRooms = this.hotels.flatMap(hotel => hotel.rooms || []);
    const room = allRooms.find(r => r.roomId === roomId);
    return room ? room.roomNumber : `Room #${roomId}`;
  }

  getUserName(userId: number): string {
    const user = this.users.find(u => u.userId === userId);
    return user ? `${user.name} ${user.surname}` : `User #${userId}`;
  }

  getHotelName(hotelId: number): string {
    const hotel = this.hotels.find(h => h.hotelId === hotelId);
    return hotel ? hotel.name : `Hotel #${hotelId}`;
  }
}

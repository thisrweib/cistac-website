import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Hotel, Room, Reservation, BookingDetails, Feedback } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Booking } from './booking.service';


@Injectable({
  providedIn: 'root'
})

export class HotelService {

    private baseUrl = 'https://localhost:44379/api/hotelsapi'; // Portunu ve API yolunu ayarla


  private currentBooking: BookingDetails | null = null;

  constructor(private http : HttpClient) {}

  getHotels(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(this.baseUrl);
  }

  getHotel(id: number): Observable<Hotel> {
    return this.http.get<Hotel>(`${this.baseUrl}/${id}`);
  }

  addHotel(hotel: Partial<Hotel>): Observable<any> {
    return this.http.post<any>(this.baseUrl, hotel);
  }

  deleteHotel(hotelId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${hotelId}`)
  }


  

  // getPendingReservations(): Observable<Reservation[]> {
  //   return of(this.mockBookings.filter(r => r.status === 'pending'));
  // }

  // submitFeedback(reservationId: number, feedback: Omit<Feedback, 'id' | 'reservationId' | 'userId' | 'createdAt'>): Observable<Feedback> {
  //   const reservation = this.mockBookings.find(b => b.id === reservationId);
  //   if (!reservation) {
  //     throw new Error('Reservation not found');
  //   }

  //   const newFeedback: Feedback = {
  //     id: Math.floor(Math.random() * 1000),
  //     reservationId,
  //     userId: reservation.userId,
  //     ...feedback,
  //     createdAt: new Date()
  //   };

  //   reservation.feedback = newFeedback;
  //   return of(newFeedback);
  // }

  // addHotel(hotel: Omit<Hotel, 'id'>): Observable<Hotel> {
  //   const newHotel = {
  //     ...hotel,
  //     id: this.mockHotels.length + 1,
  //     rooms: hotel.rooms.map((room, index) => ({
  //       ...room,
  //       id: (this.mockHotels.length + 1) * 100 + index + 1,
  //       hotelId: this.mockHotels.length + 1
  //     }))
  //   };
  //   this.mockHotels.push(newHotel);
  //   return of(newHotel);
  // }

  // updateHotel(hotel: Hotel): Observable<Hotel> {
  //   const index = this.mockHotels.findIndex(h => h.id === hotel.id);
  //   if (index !== -1) {
  //     this.mockHotels[index] = hotel;
  //     return of(hotel);
  //   }
  //   throw new Error('Hotel not found');
  // }

  // deleteHotel(id: number): Observable<boolean> {
  //   const index = this.mockHotels.findIndex(h => h.id === id);
  //   if (index !== -1) {
  //     this.mockHotels.splice(index, 1);
  //     return of(true);
  //   }
  //   return of(false);
  // }

  // isRoomAvailable(roomId: number, checkIn: Date, checkOut: Date): boolean {
  //   return !this.mockBookings.some(booking => 
  //     booking.roomId === roomId && 
  //     ((checkIn >= booking.checkIn && checkIn < booking.checkOut) ||
  //      (checkOut > booking.checkIn && checkOut <= booking.checkOut) ||
  //      (checkIn <= booking.checkIn && checkOut >= booking.checkOut))
  //   );
  // }

  // setBookingDetails(details: BookingDetails) {
  //   const room = this.mockHotels
  //     .flatMap(hotel => hotel.rooms)
  //     .find(room => room.id === details.roomId);
    
  //   this.currentBooking = {
  //     ...details,
  //     room
  //   };
  // }

  getBookingDetails(): BookingDetails | null {
    return this.currentBooking;
  }

  clearBookingDetails() {
    this.currentBooking = null;
  }

  // updateReservationStatus(id: number, status: 'approved' | 'rejected'): Observable<boolean> {
  //   const reservation = this.mockBookings.find(r => r.id === id);
  //   if (reservation) {
  //     reservation.status = status;
  //     return of(true);
  //   }
  //   return of(false);
  // }
}
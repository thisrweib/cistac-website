import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Booking {
  bookingId?: number;
  userId: number;
  hotelId: number;
  roomId: number;
  paymentId?: number;
  checkInDate: string; // format: "yyyy-MM-dd"
  checkOutDate: string;
  bookingStatus: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'https://localhost:44379/api/BookingApi';

  constructor(private http: HttpClient) {}

  // Get all bookings
  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl);
  }

  // Get booking by ID
  getBooking(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/${id}`);
  }

  getUserBookings(userId: number){
  return this.http.get<Booking[]>(`${this.apiUrl}/user/${userId}`);
  }
  
  getBookingByRoomId(roomId: number){
    return this.http.get<Booking[]>(`${this.apiUrl}/room/${roomId}`)
  }

   // Yeni rezervasyon oluştur
  createBooking(booking): Observable<any> {
    return this.http.post(this.apiUrl, booking);
  }

  // Mevcut rezervasyonu güncelle
  updateBooking(bookingId: number, booking: Booking): Observable<any> {
    return this.http.put(`${this.apiUrl}/${bookingId}`, booking);
  }

  updateBookingStatus(bookingId: number, status: 'confirmed' | 'rejected') {
    return this.http.put(`${this.apiUrl}/${bookingId}/status`, { status });
  }
}

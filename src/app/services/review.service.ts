import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Review {
  reviewId: number;
  userId: number;
  roomId: number;
  rating: number;
  comment?: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = 'https://localhost:44379/api/ReviewApi';

  constructor(private http: HttpClient) {}

  // Get all reviews
  getReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(this.apiUrl);
  }

  // Get review by ID
  getReview(id: number): Observable<Review> {
    return this.http.get<Review>(`${this.apiUrl}/${id}`);
  }

// Get review by Hotel ID
  getReviewsByHotel(hotelId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/hotel/${hotelId}`);
  }
  
  addReview(reviewData: {
    userId: number;
    roomId: number;
    rating: number;
    comment: string;
  }): Observable<any> {
    return this.http.post(this.apiUrl, reviewData);
  }
}

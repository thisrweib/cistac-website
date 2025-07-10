import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  private baseUrl = 'https://localhost:44379/api';

  constructor(private http: HttpClient) {}

  

  // Tüm Recommendation isteklerini al
  getAllRecommendation(): Observable<any> {
    return this.http.get(`${this.baseUrl}/recommendationapi`);
  }

  getUserRecommendation(userId): Observable<any> {
    return this.http.get(`${this.baseUrl}/recommendationapi/user/${userId}`)
  }
}

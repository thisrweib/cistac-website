import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ServiceRequest {
  roomId: number;
  userId: number;
  request: string;
}

export interface UpdateServiceRequest {
  roomID: number;
  userID: number;
  staffID: number;
  request: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private baseUrl = 'https://localhost:44379/api/servicerequestapi';

  constructor(private http: HttpClient) {}

  // Yeni servis isteği oluştur
  createServiceRequest(request: ServiceRequest): Observable<any> {
    return this.http.post(this.baseUrl, request);
  }

  // Var olan isteği güncelle
  updateServiceRequest(id: number, updatedRequest: UpdateServiceRequest): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, updatedRequest);
  }

  // Belirli bir isteği al
  getServiceRequest(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  // Tüm servis isteklerini al
  getAllServiceRequests(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  getServiceRequestByUserId(userId): Observable<any>{
    return this.http.get(`${this.baseUrl}/user/${userId}`)
  }

  getServiceRequestByStaffId(staffId): Observable<any>{
    return this.http.get(`${this.baseUrl}/staff/${staffId}`)
  }
}

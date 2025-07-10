import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Staff {
  staffId?: number;
  hotelId: number;
  name: string;
  surname: string;
  position: string;
  eMail?: string;
  shift?: string;
  phoneNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  private apiUrl = 'https://localhost:44379/api/staff'; // ASP.NET Core endpoint

  constructor(private http: HttpClient) {}

  getStaff(): Observable<Staff[]> {
    return this.http.get<Staff[]>(this.apiUrl);
  }

  getStaffById(id: number): Observable<Staff> {
    return this.http.get<Staff>(`${this.apiUrl}/${id}`);
  }

   // POST (Create new staff)
  addStaff(staffData: any): Observable<any> {
    return this.http.post(this.apiUrl, staffData);
  }

  // PUT (Update existing staff)
  updateStaff(id: number, staffData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, staffData);
  }

  deleteStaff(id: number){
    return this.http.delete(`${this.apiUrl}/${id}`)
  }
}

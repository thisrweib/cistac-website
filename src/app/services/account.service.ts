import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = 'https://localhost:44379/api/AccountApi'; // Backend adresin

  constructor(private http: HttpClient) { }

  login(form: any): Observable<any> {
    const model = {
      email: form.value.email,
      password: form.value.password,
    //   rememberMe: form.value.rememberMe || false
    };

    return this.http.post(`${this.apiUrl}/Login`, model, {
      withCredentials: true // Cookie gönderimi için
    });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/Logout`, {}, {
      withCredentials: true
    });
  }

  register(form: any): Observable<any> {
    const model = {
      email: form.email,
      password: form.password,
      name: form.name,
      surname: form.surname,
      phoneNumber: form.Phone_Number
    };

    return this.http.post(`${this.apiUrl}/Register`, model, {
      withCredentials: true
    });
  }
}

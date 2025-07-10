import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const TOKEN = 'token';
const USER = 'user';
const RECOMMENDATIONDIALOGCLOSEDAT = "recommendationDialogClosedAt"
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private static userSubject = new BehaviorSubject<any>(StorageService.getStoredUser());
  static user$ = StorageService.userSubject.asObservable();

  constructor() {}

  private static getStoredUser(): any {
    const userStr = window.localStorage.getItem(USER);
    return userStr ? JSON.parse(userStr) : null;
  }

  static saveToken(token: string): void {
    window.localStorage.setItem(TOKEN, token);
  }

  static saveUser(user: any): void {
    window.localStorage.setItem(USER, JSON.stringify(user));
    StorageService.userSubject.next(user); // 🔁 Güncelleme
  }

  static getToken(): string {
    return window.localStorage.getItem(TOKEN);
  }

  static getUser(): any {
    return this.getStoredUser();
  }

  static getUserRole(): string {
    const user = this.getUser();
    return user ? user.role : null;
  }

  static isAdminLoggedIn(): boolean {
    return !!this.getToken() && this.getUserRole() === 'admin';
  }

  static isCustomerLoggedIn(): boolean {
    return !!this.getToken() && this.getUserRole() === 'customer';
  }

  static getUserId(): number {
    const user = this.getUser();
    return user ? user.userId : null;
  }

  static logOut(): void {
    window.localStorage.removeItem(TOKEN);
    window.localStorage.removeItem(USER);
    window.localStorage.removeItem(RECOMMENDATIONDIALOGCLOSEDAT);

    StorageService.userSubject.next(null); // 🔁 Reactive logout
  }
}

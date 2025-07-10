// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
// import { User, LoginCredentials, RegisterCredentials } from '../models/user.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private currentUserSubject = new BehaviorSubject<User | null>(null);
//   currentUser$ = this.currentUserSubject.asObservable();

//   // Mock users database
//   private users: User[] = [
//     {
//       id: 1,
//       fullName: 'Admin User',
//       username: 'admin',
//       email: 'admin@example.com',
//       role: 'admin',
//       password: 'admin123'
//     },
//     {
//       id: 2,
//       fullName: 'Test User',
//       username: 'user',
//       email: 'user@example.com',
//       role: 'user',
//       password: 'user123'
//     }
//   ];

//   constructor() {}

//   login(credentials: LoginCredentials): Observable<User> {
//     const user = this.users.find(u => 
//       u.email === credentials.email && u.password === credentials.password
//     );

//     if (user) {
//       const { password, ...userWithoutPassword } = user;
//       this.currentUserSubject.next(userWithoutPassword);
//       return of(userWithoutPassword);
//     }

//     return throwError(() => new Error('Invalid email or password'));
//   }

//   register(credentials: RegisterCredentials): Observable<User> {
//     // Check if email already exists
//     if (this.users.some(u => u.email === credentials.email)) {
//       return throwError(() => new Error('Email already exists'));
//     }

//     const newUser: User = {
//       userId: this.users.length + 1,
//       name: credentials.fullName,
//       username: credentials.email.split('@')[0],
//       email: credentials.email,
//       role: credentials.role,
//       password: credentials.password
//     };

//     this.users.push(newUser);
//     const { password, ...userWithoutPassword } = newUser;
//     this.currentUserSubject.next(userWithoutPassword);
//     return of(userWithoutPassword);
//   }

//   logout(): void {
//     this.currentUserSubject.next(null);
//   }

//   isAuthenticated(): boolean {
//     return !!this.currentUserSubject.value;
//   }

//   hasRole(role: string): boolean {
//     return this.currentUserSubject.value?.role === role;
//   }
// }
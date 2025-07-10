import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app/app.component';
import { HomeComponent } from './app/components/home/home.component';
import { HotelListComponent } from './app/components/hotel-list/hotel-list.component';
import { HotelDetailComponent } from './app/components/hotel-detail/hotel-detail.component';
import { AdminDashboardComponent } from './app/components/admin/admin-dashboard.component';
import { LoginComponent } from './app/components/auth/login.component';
import { BookNowComponent } from './app/components/booking/book-now.component';
import { AboutComponent } from './app/components/about/about.component';
import { ContactComponent } from './app/components/contact/contact.component';
import { BookingHistoryComponent } from './app/components/booking/booking-history.component';
import { TranslocoRootModule } from './app/i18n/transloco-root.module';
import { AuthGuard } from '@app/auth.guard';
import { AccessDeniedComponent } from '@app/components/access-denied.component';
import { RoomDetailComponent } from '@app/components/hotel-detail/room-detail.component';
import { RecommendationComponent } from '@app/components/recommendation/recommendation.component';
import { RequestComponent } from '@app/components/request/request.component';

const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent 
  },
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: 'hotels', 
    component: HotelListComponent 
  },
  { 
    path: 'hotels/:id', 
    component: HotelDetailComponent 
  },
  {
    path: 'room/:hotelId/:roomId',
    component: RoomDetailComponent
  },
  { 
    path: 'admin', 
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: 'admin' }
  },
  { 
    path: 'booking/:hotelId/:roomId', 
    component: BookNowComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: ['admin', 'customer'] }
  },
  { 
    path: 'about', 
    component: AboutComponent 
  },
  { 
    path: 'contact', 
    component: ContactComponent 
  },
  { 
    path: 'my-bookings', 
    component: BookingHistoryComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: ['admin', 'customer'] }
  },
  // { 
  //   path: 'rooms', 
  //   component: RoomsComponent 
  // },
  // { 
  //   path: 'galleries', 
  //   component: GalleriesComponent 
  // },
  { 
    path: 'recommendation', 
    component: RecommendationComponent 
  },
  { 
    path: 'request', 
    component: RequestComponent 
  },
  {
    path: 'access-denied',
    component: AccessDeniedComponent
  },
  // { 
  //   path: '**', 
  //   component: HomeComponent 
  // },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(TranslocoRootModule),
    importProvidersFrom(
      BrowserAnimationsModule,
      ToastrModule.forRoot({
        positionClass: 'toast-top-right',
        preventDuplicates: true,
        timeOut: 3000,
        progressBar: true,
        closeButton: true
      })
    )
  ]
});
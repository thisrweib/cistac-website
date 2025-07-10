import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelService } from '../../services/hotel.service';
// import { AuthService } from '../../services/auth.service';
import { Hotel, Room } from '../../models/user.model';
import { RoomDetailDialogComponent } from './room-detail-dialog.component';
import { ReviewService } from '@app/services/review.service';
import { PhonePipe } from '@app/pipes/number-pipe';
import { UserService } from '@app/services/user.service';
import { Booking, BookingService } from '@app/services/booking.service';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'app-hotel-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RoomDetailDialogComponent, PhonePipe, TranslocoModule],
  template: `
    <div class="space-y-8">
      <!-- Hotel Header -->
      <div class="relative h-[400px]">
        <img 
            [src]="id <= 20 ? 'assets/images/hotels/' + id + '.jpg' : 'assets/images/hotel_placeholder.png'" 
            [alt]="'hotel'" 
            class="w-full h-full object-cover"
          />

        <div class="absolute inset-0 bg-black bg-opacity-40 rounded-md"></div>
        <div class="absolute bottom-0 left-0 right-0 p-8 text-white">
          <h1 class="text-4xl font-bold mb-2">{{hotel?.name}}</h1>
          <div class="flex items-center space-x-4">
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"/>
              </svg>
              <span>{{hotel?.location}}</span>
            </div>
            <div class="flex text-yellow-400">
              <ng-container *ngFor="let starType of getStars(hotel?.rating || 0)">
                <ng-container [ngSwitch]="starType">
                  
                  <!-- Tam Yıldız -->
                  <svg *ngSwitchCase="'full'" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>

                  <!-- Yarım Yıldız -->
                  <svg *ngSwitchCase="'half'" class="w-5 h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="halfGrad">
                        <stop offset="50%" stop-color="currentColor"/>
                        <stop offset="50%" stop-color="transparent"/>
                      </linearGradient>
                    </defs>
                    <path fill="url(#halfGrad)" stroke="currentColor" stroke-width="0" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>

                  <!-- Boş Yıldız -->
                  <svg *ngSwitchCase="'empty'" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>

                </ng-container>
              </ng-container>
            </div>
          </div>
        </div>
      </div>

      

      <!-- Hotel Description -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="md:col-span-2 space-y-6">
          <div class="card bg-white shadow-md rounded-xl p-6  mx-auto">
            <h2 class="text-2xl font-bold mb-5 border-b border-gray-200 pb-2">{{ 'hotelDetail.aboutHotel' | transloco }}</h2>

            <div class="flex justify-between py-2 border-b border-gray-300 ">
            <p class="font-medium text-gray-700">{{ 'hotelDetail.email' | transloco }}</p>
              <p class="text-gray-600 truncate max-w-xs">{{hotel?.eMail}}</p>
            </div>

             <div class="flex justify-between py-2 border-b border-gray-300">
              <p class="font-medium text-gray-700">{{ 'hotelDetail.rating' | transloco }}</p>
              <p class="text-yellow-500 font-semibold">{{ hotel?.rating }} ⭐</p>
            </div>
            <div class="flex justify-between py-2">
              <p class="font-medium text-gray-700">{{ 'hotelDetail.phoneNumber' | transloco }}</p>
              <p class="text-yellow-500 font-semibold">{{ hotel?.phoneNumber | phone }}</p>
            </div>
          </div>


          <div class="card">
            <h2 class="text-2xl font-bold mb-4">{{ 'hotelDetail.amenities' | transloco }}</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div *ngFor="let amenity of amenities" class="flex items-center text-gray-600">
                <svg class="w-5 h-5 mr-2 min-w-5 min-h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                <span class="text-gray-600 font-semibold">{{amenity}}</span>
              </div>
            </div>
          </div>

          <!-- Rooms Section -->
          <div class="space-y-4">
            <div class="flex flex-row items-center justify-between">
              <h2 class="text-2xl font-bold">{{ 'hotelDetail.availableRooms' | transloco }}</h2>
              <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-sm font-medium mr-2">
                {{ filteredRooms.length }}
              </span>
            </div>
            <div class="grid gap-6">
              <div *ngFor="let room of filteredRooms" class="card hover:shadow-lg  overflow-auto w-max-100 hover:scale-105 duration-200 cursor-pointer" (click)="showRoomDetails(room)" [class.cursor-not-allowed]="room.availabilityStatus !== 'Available'" >
                <div class="flex flex-col md:flex-row">
                 <img 
                [src]="'assets/images/rooms/' + room.type.toLowerCase() + '.jpg'"
                [alt]="room.type"
                class="w-full md:w-48 h-48 object-cover rounded-lg"
                
              />
                  <div class="flex-1 p-4">
                    <div class="flex justify-between items-start">
                      <div>
                        <h3 class="text-xl font-semibold">{{room.type}}</h3>
                        <p class="text-gray-600">Room {{room.roomNumber}}</p>
                      </div>
                      <div class="text-right">
                        <p class="text-3xl font-bold text-primary-600">{{room.pricePerNight | currency}}</p>
                        <p class="text-sm text-gray-500">{{ 'hotelDetail.perNight' | transloco }}</p>
                      </div>
                    </div>
                    <div class="mt-4">
                      <div class="flex items-center text-gray-600 mb-2">
                        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
                        </svg>
                    <span>{{ 'hotelDetail.capacity' | transloco }}: {{ room.capacity }} {{ 'hotelDetail.persons' | transloco }}</span>
                      </div>
                      <div class="flex justify-between items-center mt-4">
                        <span [class]="'text-sm ' + 
                        (room.availabilityStatus === 'Available' ? 'text-green-600' : 
                        room.availabilityStatus === 'Booked' ? 'text-red-600' : 
                        'text-yellow-600')">
                        {{ room.availabilityStatus === 'Available' ? ('hotelDetail.available' | transloco) : 
                          room.availabilityStatus === 'Booked' ? ('hotelDetail.notAvailable' | transloco) : 
                          ('hotelDetail.underMaintenance' | transloco) }}
                            <span *ngIf="room.availabilityStatus === 'Booked' && filters.checkIn && filters.checkOut" class="text-gray-500">
                          ({{ 'hotelDetail.bookedFor' | transloco }} {{ filters.checkIn | date:'mediumDate' }} - {{ filters.checkOut | date:'mediumDate' }})
                            </span>
                            <span *ngIf="room.availabilityStatus === 'Booked' && (!filters.checkIn || !filters.checkOut)" class="text-gray-500">
                              {{ 'hotelDetail.currentlyUnavailable' | transloco }}
                            </span>
                      </span>

                      <button class="btn-primary bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-medium " 
                              [disabled]="room.availabilityStatus !== 'Available'"
                              (click)="bookRoom(room)">
                        {{ 'hotelDetail.bookNow' | transloco }}
                      </button>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Quick Booking -->
          <div class="card">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-xl font-bold">{{ 'hotelDetail.quickBooking' | transloco }}</h3>
              <button class="btn-primary bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-medium" 
                      (click)="clearFilters()">
                {{ 'hotelDetail.clearFilters' | transloco }}
              </button>
            </div>
            <form class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'hotelDetail.checkInDate' | transloco }}</label>
                <input type="date" class="input-field" [(ngModel)]="filters.checkIn" name="checkIn" 
                       (change)="applyFilters()" [min]="today"/>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'hotelDetail.checkOutDate' | transloco }}</label>
                <input type="date" class="input-field" [(ngModel)]="filters.checkOut" name="checkOut" 
                       (change)="applyFilters()" [min]="filters.checkIn || today"/>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'hotelDetail.guests' | transloco }}</label>
                <select class="input-field" [(ngModel)]="filters.capacity" name="guests" (change)="applyFilters()">
                  <option [ngValue]="1">1 {{'hotelDetail.persons' | transloco}}</option>
                  <option [ngValue]="2">2 {{'hotelDetail.persons' | transloco}}</option>
                  <option [ngValue]="3">3 {{'hotelDetail.persons' | transloco}}</option>
                  <option [ngValue]="4">4+ {{'hotelDetail.persons' | transloco}}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                <select class="input-field" [(ngModel)]="filters.roomType" name="roomType" (change)="applyFilters()">
                  <option value="">{{ 'hotelDetail.allTypes' | transloco }}</option>
                  <option value="Standard">{{ 'hotelDetail.standard' | transloco }}</option>
                  <option value="Deluxe">{{ 'hotelDetail.deluxe' | transloco }}</option>
                  <option value="Suite">{{ 'hotelDetail.suite' | transloco }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                <div class="flex items-center space-x-2">
                  <input type="number" class="input-field" placeholder="Min" 
                         [(ngModel)]="filters.minPrice" name="minPrice" (change)="applyFilters()"/>
                  <span>-</span>
                  <input type="number" class="input-field" placeholder="Max" 
                         [(ngModel)]="filters.maxPrice" name="maxPrice" (change)="applyFilters()"/>
                </div>
              </div>
            </form>
          </div>

          <div class="mt-10 p-4 border-t border-gray-300">
            <h2 class="text-xl font-semibold mb-4">{{ 'hotelDetail.reviews' | transloco }}</h2>

            <div *ngIf="reviews?.length === 0" class="text-gray-500 italic">
              {{ 'hotelDetail.noReviews' | transloco }}
            </div>

            <div *ngFor="let review of reviews" class="bg-white rounded-2xl shadow p-4 mb-4">
              <div class="flex justify-between items-center mb-2">
                <div class="font-medium text-gray-800">
                  {{ review.user.name }} {{ review.user.surname }}
                </div>
                <div class="text-yellow-500 font-semibold">
                  ⭐ {{ review.rating }}/5
                </div>
              </div>

              <!-- Yorum içeriği -->
              <p class="text-gray-700 mb-2 italic">
                {{ review.expanded ? review.comment : (review.comment | slice:0:100) + (review.comment?.length > 100 ? '...' : '') }}
              </p>

              <!-- Devamını Göster / Daha Az Göster butonu -->
              <button
                *ngIf="review.comment?.length > 100"
                (click)="toggleExpanded(review)"
                class="text-blue-400 text-sm hover:cursor-pointer font-semibold focus:outline-none mb-2">
                {{ review.expanded ? ('hotelDetail.showLess' | transloco) : ('hotelDetail.showMore' | transloco) }}
              </button>

              <div class="text-sm text-gray-400">
                {{ review.createdAt | date:'mediumDate' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <app-room-detail-dialog
      *ngIf="selectedRoom"
      [room]="selectedRoom"
      [hotelId]="hotel.hotelId || 0"
      (close)="selectedRoom = null">
    </app-room-detail-dialog>
  `
})
export class HotelDetailComponent implements OnInit {
  hotel: Hotel | undefined;
  reviews: any;
  rooms: Room[] = []  
  filteredRooms: Room[] = [];
  selectedRoom: Room | null = null;
  today = new Date().toISOString().split('T')[0];
  amenities :any;
  roomBookings: Booking[] = [];
  id: number;

  filters = {
    checkIn: '',
    checkOut: '',
    capacity: null,
    roomType: '',
    minPrice: null,
    maxPrice: null,
  };


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hotelService: HotelService,
    // private authService: AuthService,
    private reviewService : ReviewService,
    private userService : UserService,
    private bookingService : BookingService
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.hotelService.getHotel(this.id).subscribe(
      hotel => {this.hotel = hotel
        this.rooms = hotel.rooms
        
        this.filteredRooms = [...this.rooms];
        
        this.amenities = hotel.hotelAmenities.split(',').map((item : any) => item.trim());

      }
    );

    this.reviewService.getReviewsByHotel(this.id).subscribe(reviews => {
      this.userService.getUsers().subscribe(users => {
        // İlk 10 yorumu al ve user eşlemesini yap
        this.reviews = reviews.slice(0, 10).map(r => ({
          ...r,
          user: users.find(u => u.userId === r.userId),
          expanded: false
        }));
      });
    });
    this.bookingService.getBookings().subscribe(bookings => {
        this.roomBookings = bookings;
    });

   
    // this.filteredRooms = [...this.rooms];
  }

  toggleExpanded(review: any) {
  review.expanded = !review.expanded;
}

  showRoomDetails(room: Room) {
    if(room.availabilityStatus !== "Available") return;
  
    this.selectedRoom = room;
  }

  getStars(rating: number): ('full' | 'half' | 'empty')[] {
    const stars: ('full' | 'half' | 'empty')[] = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push('full');
      } else if (rating + 0.5 >= i) {
        stars.push('half');
      } else {
        stars.push('empty');
      }
    }
    return stars;
  }



  applyFilters() {
    const capacity = Number(this.filters.capacity);
    const minPrice = Number(this.filters.minPrice);
    const maxPrice = Number(this.filters.maxPrice);
    const roomType = this.filters.roomType?.toLowerCase().replace(' room', '');
    const checkIn = new Date(this.filters.checkIn);
    const checkOut = new Date(this.filters.checkOut);

    this.filteredRooms = this.rooms.filter(room => {
      
      if (capacity) {
        if (capacity === 4) {
          if (room.capacity < 4) return false;
        } else {
          if (room.capacity !== capacity) return false;
        }
      }
      if (roomType && room.type.toLowerCase() !== roomType) return false;
      if (minPrice && room.pricePerNight < minPrice) return false;
      if (maxPrice && room.pricePerNight > maxPrice) return false;
      if (this.filters.checkIn && this.filters.checkOut) {
      const bookingsForRoom = this.roomBookings.filter(
        booking => booking.roomId === room.roomId
      );

      const hasConflict = bookingsForRoom.some(booking => {
        const bookingStart = new Date(booking.checkInDate);
        const bookingEnd = new Date(booking.checkOutDate);

        // Tarihler çakışıyorsa true döner, yani bu oda rezerve edilmiş
        return checkIn < bookingEnd && checkOut > bookingStart;
      });

      if (hasConflict) return false;
    }

      return true;
    });
  }

clearFilters() {
    this.filters = {
      checkIn: '',
      checkOut: '',
      capacity: null,
      roomType: '',
      minPrice: null,
      maxPrice: null,
    };
    this.applyFilters();
  }

  checkDateConflicts(bookings: Booking[], checkIn: string, checkOut: string): boolean {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    return bookings.some(booking => {
      const bookingStart = new Date(booking.checkInDate);
      const bookingEnd = new Date(booking.checkOutDate);

      return checkInDate < bookingEnd && checkOutDate > bookingStart;
    });
  }





  // isRoomAvailable(room: Room): boolean {
  //   if (!room.availabilityStatus) return false;
  //   if (!this.filters.checkIn || !this.filters.checkOut) return room.availabilityStatus;
    
  //   return this.hotelService.isRoomAvailable(
  //     room.roomId,
  //     new Date(this.filters.checkIn),
  //     new Date(this.filters.checkOut)
  //   );
  // }

   bookRoom(room: Room) {
  //   if (!this.authService.isAuthenticated()) {
  //     // Store intended booking details in service
  //     if (this.filters.checkIn && this.filters.checkOut) {
  //       this.hotelService.setBookingDetails({
  //         roomId: room.id,
  //         checkIn: new Date(this.filters.checkIn),
  //         checkOut: new Date(this.filters.checkOut),
  //         guests: this.filters.guests,
  //         totalPrice: room.price * this.getDaysDifference(
  //           new Date(this.filters.checkIn),
  //           new Date(this.filters.checkOut)
  //         )
  //       });
  //     }
  //     // Redirect to login page
  //     this.router.navigate(['/login']);
  //     return;
  //   }

  //   // If dates are selected, proceed to payment
  //   if (this.filters.checkIn && this.filters.checkOut) {
  //     this.hotelService.setBookingDetails({
  //       roomId: room.id,
  //       checkIn: new Date(this.filters.checkIn),
  //       checkOut: new Date(this.filters.checkOut),
  //       guests: this.filters.guests,
  //       totalPrice: room.price * this.getDaysDifference(
  //         new Date(this.filters.checkIn),
  //         new Date(this.filters.checkOut)
  //       )
  //     });
  //     this.router.navigate(['/booking/payment']);
  //   } else {
  //     // Show error message or prompt to select dates
  //     alert('Please select check-in and check-out dates before booking.');
  //   }
   }

  private getDaysDifference(start: Date, end: Date): number {
    const diff = end.getTime() - start.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}
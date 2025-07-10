import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomService } from '@app/services/room.service';
import { Room } from '../../models/user.model';
import { TranslocoModule } from '@ngneat/transloco';
import { Location } from '@angular/common';


@Component({
  selector: 'app-room-detail',
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  template: `
    <div class="w-full h-screen p-6 bg-white rounded-none shadow-md overflow-auto">
      <div class="relative mb-6">
        <img *ngIf="!isLoading"
          [src]="'assets/images/rooms/' + room?.type?.toLowerCase() + '.jpg'"
          [alt]="'room'"
          class="w-full h-64 object-cover rounded-lg"
          (error)="img.src='assets/images/hotel_room_placeholder.jpg'"
          #img
        />
      </div>

      <div *ngIf="room; else loading">
        <!-- Başlık ve Fiyat -->
        <div class="flex justify-between items-center mb-6">
          <div>
            <h2 class="text-3xl font-bold text-gray-900">{{ room.type }}</h2>
            <p class="text-gray-600 mt-1">{{ 'roomDetail.roomNumber' | transloco }} {{ room.roomNumber }}</p>
          </div>
          <div class="text-right">
            <p class="text-3xl font-bold text-primary-600">{{ room.pricePerNight | currency }}</p>
            <p class="text-sm text-gray-500">{{ 'roomDetail.perNight' | transloco }}</p>
          </div>
        </div>

        <!-- Özellikler -->
        <section class="mb-8">
          <h3 class="text-xl font-semibold mb-4 border-b border-gray-200 pb-2">{{ 'roomDetail.features' | transloco }}</h3>
          <div class="grid grid-cols-2 gap-4">
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              <span>{{ room.capacity }} {{ 'roomDetail.person' | transloco }}</span>
            </div>

            <ng-container *ngFor="let amenity of amenities">
              <div class="flex items-center space-x-2">
                <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span>{{ amenity }}</span>
              </div>
            </ng-container>
          </div>
        </section>

        <!-- Açıklama -->
        <section class="mb-8">
          <h3 class="text-xl font-semibold mb-4 border-b border-gray-200 pb-2">{{ 'roomDetail.description' | transloco }}</h3>
          <p class="text-gray-700 leading-relaxed">
            {{ 'roomDetail.descriptionText' | transloco: { type: room.type, capacity: room.capacity, guestText: room.capacity > 1 ? ('roomDetail.guests' | transloco) : ('roomDetail.guest' | transloco) } }}
          </p>
        </section>

        <!-- Kurallar -->
        <div>
          <h3 class="text-lg font-semibold mb-3">{{ 'roomDetail.policies' | transloco }}</h3>
          <ul class="space-y-2 text-gray-600">
            <li class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>{{ 'roomDetail.checkIn' | transloco }}</span>
            </li>
            <li class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>{{ 'roomDetail.checkOut' | transloco }}</span>
            </li>
            <li class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>{{ 'roomDetail.noSmoking' | transloco }}</span>
            </li>
          </ul>
        </div>

        <!-- Buton -->
        <div class="mt-8 flex justify-end space-x-4">
          <button (click)="goBack()" class="btn-secondary">{{ 'roomDetail.goBack' | transloco }}</button>
          <button 
              (click)="bookRoom()" 
              class="btn-primary px-6 py-3 rounded-md font-semibold transition disabled:opacity-50"
              [disabled]="!room.availabilityStatus">
              {{ 'roomDetail.bookNow' | transloco }}
          </button>
        </div>
      </div>

      <ng-template #loading>
        <p class="text-center text-gray-500 py-20">{{ 'roomDetail.loading' | transloco }}</p>
      </ng-template>

    </div>

  `
})
export class RoomDetailComponent implements OnInit {

    room!: Room;
    amenities: string[] = [];
    hotelId!: number;
    roomIdParam;
    hotelIdParam;
    isLoading: boolean = true
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private roomService: RoomService,
        private location: Location
    ) {}

    ngOnInit(): void {
        this.roomIdParam = this.route.snapshot.paramMap.get('roomId');
        this.hotelIdParam = this.route.snapshot.paramMap.get('hotelId');
        this.hotelId = history.state.hotelId;

        if (!this.roomIdParam) {
        this.router.navigate(['/rooms']);
        return;
        }

        this.roomService.getRoomById(this.roomIdParam).subscribe({
        next: (room) => {
            this.room = room;
            this.amenities = room.roomAmenities?.split(',').map(a => a.trim()) || [];
            this.isLoading = false
        },
        error: () => {
            // Hata durumunda yönlendir veya mesaj göster
            this.router.navigate(['/rooms']);
        }
        });
    }

    bookRoom() {
        // if (this.room && this.hotelId) {
        this.router.navigate(['/booking', this.hotelIdParam, this.roomIdParam]);
        // }
    }

    goBack() {
        this.location.back();
    }
}

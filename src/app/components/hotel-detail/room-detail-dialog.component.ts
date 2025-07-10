import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Room } from '../../models/user.model';
import { Router } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'app-room-detail-dialog',
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg max-w-3xl w-full mx-4 max-h-[95vh] overflow-auto">
        <!-- Dialog Header -->
        <div class="relative">
            <img 
            [src]="'assets/images/rooms/' + room.type.toLowerCase() + '.jpg'"
            [alt]="room.type"
            class="w-full h-64 object-cover"
            (error)="img.src='assets/images/hotel_room_placeholder.jpg'"
            #img
          />
          <button (click)="close.emit()" 
                  class="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100"
                  [attr.aria-label]="'roomDetail.close' | transloco">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Room Details -->
        <div class="p-6">
          <div class="flex justify-between items-start mb-6">
            <div>
              <h2 class="text-2xl font-bold text-gray-900">{{room.type}}</h2>
              <p class="text-gray-600">{{ 'roomDetail.roomNumber' | transloco }} {{room.roomNumber}}</p>
            </div>
            <div class="text-right">
              <p class="text-3xl font-bold text-primary-600">{{room.pricePerNight | currency}}</p>
              <p class="text-sm text-gray-500">{{ 'roomDetail.perNight' | transloco }}</p>
            </div>
          </div>

          <!-- Room Features -->
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold mb-3">{{ 'roomDetail.features' | transloco }}</h3>
              <div class="grid grid-cols-2 gap-4">
                <div class="flex items-center space-x-2">
                  <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>{{room.capacity}} {{ room.capacity > 1 ? ('roomDetail.persons' | transloco) : ('roomDetail.person' | transloco) }}</span>
                </div>
                <ng-container *ngFor="let item of amenities">
                  <div class="flex items-center space-x-2">
                    <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span>{{item}}</span>
                  </div>
                </ng-container>
              </div>
            </div>

            <!-- Room Description -->
            <div>
              <h3 class="text-lg font-semibold mb-3">{{ 'roomDetail.description' | transloco }}</h3>
              <p class="text-gray-600">
                {{ 'roomDetail.descriptionText' | transloco: { 
                  type: room.type,
                  capacity: room.capacity, 
                  guestText: room.capacity > 1 ? ('roomDetail.guests' | transloco) : ('roomDetail.guest' | transloco)
                } }}
              </p>
            </div>

            <!-- Room Policies -->
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
          </div>

          <!-- Action Buttons -->
          <div class="mt-8 flex justify-end space-x-4">
            <button (click)="close.emit()" 
                    class="btn-secondary">
              {{ 'roomDetail.close' | transloco }}
            </button>
            <button (click)="bookRoom()" 
                    class="btn-primary"
                    [disabled]="!room.availabilityStatus">
              {{ 'roomDetail.bookNow' | transloco }}
            </button>
          </div>
        </div>
      </div>
    </div>

  `
})
export class RoomDetailDialogComponent {
  @Input() room!: Room;
  @Input() hotelId!: number;
  @Output() close = new EventEmitter<void>();
  amenities: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.amenities = this.room.roomAmenities.split(',').map((item : any) => item.trim());
  }

  bookRoom() {
    this.router.navigate(['/booking', this.hotelId, this.room.roomId]);
  }
}
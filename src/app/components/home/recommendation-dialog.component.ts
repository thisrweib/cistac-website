import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Reservation, Hotel } from '../../models/user.model';
import { HotelService } from '../../services/hotel.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { RecommendationService } from '@app/services/recommendation.service';
import { StorageService } from '@app/services/storage/storage.service';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'app-recommendation-dialog',
  standalone: true,
  imports: [CommonModule,RouterModule, FormsModule, TranslocoModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
    <!-- Popup Container -->
    <div class="relative bg-white/90 rounded-2xl shadow-2xl max-w-7xl w-full h-[85vh] mx-4 overflow-y-auto p-8 border border-gray-200">

      <!-- Sabit Close Butonu -->
      <button (click)="close.emit()"
              class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition bg-white rounded-full p-1 shadow-md z-50">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Başlık -->
      <div class="mb-6">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-800">
          {{ 'recommendationDialog.title' | transloco }}
        </h2>
      </div>

      <!-- Room Kartları -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div *ngFor="let item of recommendedRooms" class="card p-0 overflow-hidden">
          <img [src]="'assets/images/rooms/' + item.room.type.toLowerCase() + '.jpg'"
              [alt]="'recommendationDialog.room' | transloco: { type: item.room.type }"
              class="w-full h-48 object-cover" />
          <div class="flex flex-col gap-4 p-4 justify-end">
            <h3 class="text-xl font-bold mb-2">
              {{ 'recommendationDialog.room' | transloco: { type: item.room.type } }}
            </h3>
            <p class="text-gray-600 mb-4">
              {{ 'recommendationDialog.roomFrom' | transloco: { hotelName: item.hotelName } }}
            </p>
            <ul class="space-y-2 mb-6">
              <li *ngFor="let amenity of getAmenities(item.room.roomAmenities) | slice:0:3" class="flex items-center text-gray-600">
                <svg class="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                {{ amenity }}
              </li>

              <li *ngIf="(getAmenities(item.room.roomAmenities).length - 3) > 0" class="text-gray-500 italic">
                {{ 'recommendationDialog.moreAmenities' | transloco: { count: getAmenities(item.room.roomAmenities).length - 3 } }}
              </li>
            </ul>

            <div class="flex justify-between items-center gap-4">
              <span class="text-2xl font-bold text-primary-600">
                {{ 'recommendationDialog.pricePerNight' | transloco: { price: item.room.pricePerNight } }}
              </span>
              <button (click)="routeToRoom(item.hotelId,item.roomId)" class="btn-primary">
                {{ 'recommendationDialog.viewButton' | transloco }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>




  `
})
export class RecommendationtDialogComponent {
  @Input() reservation!: Reservation;
  @Output() close = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<void>();

    filteredHotels: Hotel[] = [];
    hotels: Hotel[] = [];

  

    recommendedRooms: Array<{hotelName: string, room: any, hotelId:number, roomId: number}> = [];

  assignedStaff:any;
  constructor(
    private hotelService: HotelService,
    private toastr: ToastrService,
    private recommendationService: RecommendationService,
    private router: Router
  ) {

  }

ngOnInit() {
    this.hotelService.getHotels().subscribe(hotels => {
      this.recommendationService.getUserRecommendation(StorageService.getUserId()).subscribe(recommendations => {
        const recommendedRoomIds = recommendations.map(r => r.recommendedRoomID);

        this.recommendedRooms = [];

        hotels.forEach(hotel => {
          hotel.rooms.forEach(room => {
            if (recommendedRoomIds.includes(room.roomId)) {
              this.recommendedRooms.push({
                hotelName: hotel.name,
                room: room,
                hotelId: hotel.hotelId,
                roomId: room.roomId
              });

            }
          });
        });
      });
    });
    
  }

  routeToRoom(hotelId: number, roomId: number) {
    this.close.emit();
    this.router.navigate(['/room', hotelId, roomId]);
  }

  getAmenities(roomAmenities: string): string[] {
    return roomAmenities.split(',').map(a => a.trim());
  }

}
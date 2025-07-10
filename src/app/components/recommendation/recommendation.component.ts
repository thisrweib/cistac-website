import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HotelService } from '../../services/hotel.service';
import { TranslocoModule } from '@ngneat/transloco';
import { StorageService } from '@app/services/storage/storage.service';
import { RecommendationService } from '@app/services/recommendation.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-recommendation',
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  template: `
   <!-- Ana Sayfa Konteyneri -->
    <div class="min-h-screen bg-gray-50 py-12 px-4 md:px-8 lg:px-16">

      <!-- Başlık -->
      <div class="mb-10 text-center">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-800">
          {{ 'recommendation.title' | transloco }}
        </h1>
        <p class="text-gray-600 mt-2">
          {{ 'recommendation.subtitle' | transloco }}
        </p>
      </div>

      <!-- Önerilen Odalar Varsa -->
      <div *ngIf="recommendedRooms?.length > 0; else noRecommendations" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div *ngFor="let item of recommendedRooms" class="bg-white rounded-2xl shadow-lg overflow-hidden transition hover:shadow-2xl">
          
          <!-- Oda Görseli -->
            <img 
            [src]="'assets/images/rooms/' + item.room.type.toLowerCase() + '.jpg'"
            [alt]="item.room.type"
            class="w-full h-64 object-cover"
            (error)="img.src='assets/images/hotel_room_placeholder.jpg'"
            #img
          />
          
          <!-- Oda Bilgileri -->
          <div class="p-6 flex flex-col justify-between h-fit">
            <div class="mb-4">
              <h3 class="text-xl font-semibold text-gray-800 mb-1">
                {{ item.room.type }} {{ 'recommendation.roomSuffix' | transloco }}
              </h3>
              <p class="text-gray-500 text-sm">
                {{ 'recommendation.from' | transloco }} <span class="font-medium text-gray-700">{{ item.hotelName }}</span>
              </p>
            </div>

            <!-- Özellikler -->
            <ul class="text-sm text-gray-600 space-y-2 mb-6">
              <li *ngFor="let amenity of getAmenities(item.room.roomAmenities) | slice:0:3" class="flex items-center">
                <svg class="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                {{ amenity }}
              </li>
              <li *ngIf="(getAmenities(item.room.roomAmenities).length - 3) > 0" class="italic text-gray-400">
                +{{ getAmenities(item.room.roomAmenities).length - 3 }} {{ 'recommendation.moreText' | transloco }}
              </li>
            </ul>

            <!-- Fiyat ve Buton -->
            <div class="flex justify-between items-center">
              <span class="text-lg font-bold text-primary-600">\${{ item.room.pricePerNight }}/ {{ 'recommendation.night' | transloco }}</span>
              <button (click)="routeToRoom(item.hotelId,item.roomId)" class="bg-primary-600 text-white px-4 py-2 rounded-xl hover:bg-primary-700 transition">
                {{ 'recommendation.viewButton' | transloco }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Önerilen Oda Yoksa Uyarı -->
      <ng-template #noRecommendations>
        <div class="text-center mt-20">
          <h2 class="text-2xl font-semibold text-gray-700 mb-4">
            {{ 'recommendation.noRoomsTitle' | transloco }}
          </h2>
          <p class="text-gray-500">
            {{ 'recommendation.noRoomsText' | transloco }}
          </p>
        </div>
      </ng-template>

    </div>



  `
})
export class RecommendationComponent implements OnInit {
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
      // this.close.emit();
      this.router.navigate(['/room', hotelId, roomId]);
    }
  
    getAmenities(roomAmenities: string): string[] {
      return roomAmenities.split(',').map(a => a.trim());
    }
  
  }
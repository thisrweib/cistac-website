import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HotelService } from '../../services/hotel.service';
import { Hotel } from '../../models/user.model';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'app-hotel-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TranslocoModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 class="text-3xl font-bold text-gray-900">{{ 'hotelList.availableHotels' | transloco }}</h1>
        <div class="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <input type="text" 
                [placeholder]="'hotelList.searchPlaceholder' | transloco"
                class="input-field"
                [(ngModel)]="filters.search"
                (input)="applyFilters()"/>
          <select class="input-field"
                  [(ngModel)]="filters.location"
                  (change)="applyFilters()">
            <option value="">{{ 'hotelList.allLocations' | transloco }}</option>
            <option *ngFor="let location of locations" [value]="location">
              {{location}}
            </option>
          </select>
          <select class="input-field"
                  [(ngModel)]="filters.priceRange"
                  (change)="applyFilters()">
            <option value="">{{ 'hotelList.allPrices' | transloco }}</option>
            <option value="1000-1500">$1000 - $1500</option>
            <option value="1500-2000">$1500 - $2000</option>
            <option value="2000-2500">$2000 - $2500 </option>
            <option value="2500-3000">$2500 - $3000</option>
            <option value="3000-3500">$3000 - $3500</option>
            <option value="3500-4000">$3500 - $4000</option>
            <option value="4000-4500">$4000 - $4500</option>
            <option value="4500-5000">$4500 - $5000</option>
            <option value="5000-6000">$5000 - $6000</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       <div *ngFor="let hotel of filteredHotels; let i = index" class="card hover:shadow-xl transition-shadow">
          <img 
              [src]="
                hotels.indexOf(hotel) < 20 
                  ? 'assets/images/hotels/' + (hotels.indexOf(hotel) + 1) + '.jpg' 
                  : 'assets/images/hotel_placeholder.png'
              " 
              [alt]="hotel.name" 
              class="w-full h-48 object-cover rounded-lg mb-4"
            />
          <div class="space-y-2">
            <h3 class="text-xl font-semibold text-gray-900">{{ hotel.name }}</h3>
            <p class="text-gray-600">{{ hotel.description }}</p>
            <div class="flex items-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
              </svg>
              <span>{{ hotel.location }}</span>
            </div>
            <button [routerLink]="['/hotels', hotel.hotelId]" 
                    class="btn-primary w-full mt-4 text-white py-2 px-6 rounded-lg shadow-md
              bg-gradient-to-r from-emerald-600 to-cyan-600
              transition duration-300 font-medium">{{ 'hotelList.viewDetails' | transloco }}</button>
          </div>
        </div>
      </div>

      <div *ngIf="filteredHotels.length === 0" class="text-center py-8">
        <p class="text-gray-600">{{ 'hotelList.noHotelsFound' | transloco }}</p>
      </div>
    </div>

  `
})
export class HotelListComponent implements OnInit {
  hotels: Hotel[] = [];
  filteredHotels: Hotel[] = [];
  locations: string[] = ['İstanbul', 'Ankara', 'Antalya', 'Muğla', 'Nevşehir'];

  filters = {
    search: '',
    location: '',
    priceRange: ''
  };

  constructor(private hotelService: HotelService) {}

  ngOnInit() {
    this.hotelService.getHotels().subscribe(hotels => {
      this.hotels = hotels;
      this.filteredHotels = hotels;
      
    });
  }

  applyFilters() {
    this.filteredHotels = this.hotels.filter(hotel => {

      if (!hotel.rooms || hotel.rooms.length === 0) {
        return false;
      }
      // Search filter
      if (this.filters.search) {
        const searchTerm = this.filters.search.toLowerCase();
        const nameMatch = hotel.name?.toLowerCase().includes(searchTerm);
        const descMatch = hotel.description?.toLowerCase().includes(searchTerm);
        if (!nameMatch && !descMatch) {
          return false;
        }
      }

      // Location filter: Partial match (contains "İstanbul")
      if (this.filters.location) {
        const filterLocation = this.filters.location.toLowerCase();
        const hotelLocation = hotel.location?.toLowerCase() || '';
        if (!hotelLocation.includes(filterLocation)) {
          return false;
        }
      }

      // Price range filter
      if (this.filters.priceRange && hotel.rooms && hotel.rooms.length > 0) {
      const [rawMin, rawMax] = this.filters.priceRange.split('-').map(s => s.trim());
      const min = Number(rawMin) || 0;  // Eğer boşsa 0 al
      const max = (rawMax && rawMax.includes('+')) ? Infinity : Number(rawMax);

      // Otelin odalarından en az birinin fiyatı aralıkta mı kontrol et
      const hasRoomInPriceRange = hotel.rooms.some(room => {
        const price = room.pricePerNight;
        return price >= min && price <= max;
      });

      if (!hasRoomInPriceRange) {
        return false;
      }
    }

      return true;
    });
  }

}
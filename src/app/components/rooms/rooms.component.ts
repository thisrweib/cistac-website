import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-12">
      <div class="text-center mb-16">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Our Rooms</h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover our selection of comfortable and luxurious rooms designed for your perfect stay.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Standard Room -->
        <div class="card overflow-hidden">
          <img src="assets/images/hotel_room_placeholder.jpg" 
               alt="Standard Room"
               class="w-full h-48 object-cover"/>
          <div class="p-6">
            <h3 class="text-xl font-bold mb-2">Standard Room</h3>
            <p class="text-gray-600 mb-4">
              Perfect for solo travelers or couples, our standard rooms offer comfort and essential amenities.
            </p>
            <ul class="space-y-2 mb-6">
              <li class="flex items-center text-gray-600">
                <svg class="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                Queen-size bed
              </li>
              <li class="flex items-center text-gray-600">
                <svg class="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                Free Wi-Fi
              </li>
              <li class="flex items-center text-gray-600">
                <svg class="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                32" LCD TV
              </li>
            </ul>
            <div class="flex justify-between items-center">
              <span class="text-2xl font-bold text-primary-600">$150/night</span>
              <a routerLink="/hotels" class="btn-primary">View Hotels</a>
            </div>
          </div>
        </div>

        <!-- Deluxe Room -->
        <div class="card overflow-hidden">
          <img src="https://source.unsplash.com/800x600/?luxury,hotel" 
               alt="Deluxe Room"
               class="w-full h-48 object-cover"/>
          <div class="p-6">
            <h3 class="text-xl font-bold mb-2">Deluxe Room</h3>
            <p class="text-gray-600 mb-4">
              Spacious rooms with premium amenities and stunning views for a luxurious stay.
            </p>
            <ul class="space-y-2 mb-6">
              <li class="flex items-center text-gray-600">
                <svg class="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                King-size bed
              </li>
              <li class="flex items-center text-gray-600">
                <svg class="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                City view
              </li>
              <li class="flex items-center text-gray-600">
                <svg class="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                Mini bar
              </li>
            </ul>
            <div class="flex justify-between items-center">
              <span class="text-2xl font-bold text-primary-600">$250/night</span>
              <a routerLink="/hotels" class="btn-primary">View Hotels</a>
            </div>
          </div>
        </div>

        <!-- Suite -->
        <div class="card overflow-hidden">
          <img src="https://source.unsplash.com/800x600/?suite,hotel" 
               alt="Suite"
               class="w-full h-48 object-cover"/>
          <div class="p-6">
            <h3 class="text-xl font-bold mb-2">Suite</h3>
            <p class="text-gray-600 mb-4">
              The ultimate luxury experience with separate living areas and premium services.
            </p>
            <ul class="space-y-2 mb-6">
              <li class="flex items-center text-gray-600">
                <svg class="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                Separate living room
              </li>
              <li class="flex items-center text-gray-600">
                <svg class="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                Private balcony
              </li>
              <li class="flex items-center text-gray-600">
                <svg class="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                Butler service
              </li>
            </ul>
            <div class="flex justify-between items-center">
              <span class="text-2xl font-bold text-primary-600">$400/night</span>
              <a routerLink="/hotels" class="btn-primary">View Hotels</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RoomsComponent {}
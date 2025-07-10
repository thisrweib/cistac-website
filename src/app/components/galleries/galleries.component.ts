import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-galleries',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-12">
      <div class="text-center mb-16">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Our Gallery</h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Take a visual journey through our stunning hotels and facilities.
        </p>
      </div>

      <!-- Gallery Categories -->
      <div class="flex justify-center mb-12 space-x-4">
        <button *ngFor="let category of categories" 
                (click)="activeCategory = category"
                [class]="'px-4 py-2 rounded-lg transition-colors ' + 
                         (activeCategory === category ? 
                          'bg-primary-600 text-white' : 
                          'bg-gray-100 text-gray-700 hover:bg-gray-200')">
          {{category}}
        </button>
      </div>

      <!-- Gallery Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let image of filteredImages" 
             class="relative group cursor-pointer overflow-hidden rounded-lg"
             (click)="openImage(image)">
          <img [src]="image.url" 
               [alt]="image.title"
               class="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"/>
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center">
            <h3 class="text-white text-xl font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              {{image.title}}
            </h3>
          </div>
        </div>
      </div>

      <!-- Lightbox -->
      <div *ngIf="selectedImage" 
           class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
           (click)="selectedImage = null">
        <div class="relative max-w-4xl w-full">
          <img [src]="selectedImage.url" 
               [alt]="selectedImage.title"
               class="w-full h-auto"/>
          <button class="absolute top-4 right-4 text-white hover:text-gray-300"
                  (click)="selectedImage = null">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `
})
export class GalleriesComponent {
  categories = ['All', 'Rooms', 'Facilities', 'Dining', 'Events'];
  activeCategory = 'All';
  selectedImage: any = null;

  images = [
    {
      url: 'https://source.unsplash.com/800x600/?hotel,room',
      title: 'Luxury Suite',
      category: 'Rooms'
    },
    {
      url: 'https://source.unsplash.com/800x600/?hotel,pool',
      title: 'Swimming Pool',
      category: 'Facilities'
    },
    {
      url: 'https://source.unsplash.com/800x600/?hotel,restaurant',
      title: 'Fine Dining Restaurant',
      category: 'Dining'
    },
    {
      url: 'https://source.unsplash.com/800x600/?hotel,spa',
      title: 'Spa & Wellness',
      category: 'Facilities'
    },
    {
      url: 'https://source.unsplash.com/800x600/?hotel,ballroom',
      title: 'Grand Ballroom',
      category: 'Events'
    },
    {
      url: 'https://source.unsplash.com/800x600/?hotel,suite',
      title: 'Presidential Suite',
      category: 'Rooms'
    },
    {
      url: 'https://source.unsplash.com/800x600/?hotel,bar',
      title: 'Rooftop Bar',
      category: 'Dining'
    },
    {
      url: 'https://source.unsplash.com/800x600/?hotel,gym',
      title: 'Fitness Center',
      category: 'Facilities'
    },
    {
      url: 'https://source.unsplash.com/800x600/?hotel,conference',
      title: 'Conference Room',
      category: 'Events'
    }
  ];

  get filteredImages() {
    return this.activeCategory === 'All' 
      ? this.images 
      : this.images.filter(img => img.category === this.activeCategory);
  }

  openImage(image: any) {
    this.selectedImage = image;
  }
}
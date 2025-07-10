import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HotelService } from '../../services/hotel.service';
import { Hotel, User } from '../../models/user.model';
import { ReviewService } from '@app/services/review.service';
import { UserService } from '@app/services/user.service';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslocoModule],
  template: `
    <!-- Hero Section -->
    <div class="relative rounded-lg bg-black h-[500px] overflow-hidden">
      <div class="absolute inset-0">
        <img src="assets/images/home-page-placeholder.png" alt="" class="w-full h-full object-cover opacity-60" />
      </div>
      <div class="relative max-w-7xl mx-auto px-4 h-full flex items-center">
        <div class="text-white z-10">
           <h1 class="text-5xl font-bold mb-4">{{ 'home.hero.title' | transloco }}</h1>
          <p class="text-xl mb-8">{{ 'home.hero.subtitle' | transloco }}</p>
          <a routerLink="/hotels" class="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            {{ 'home.hero.button' | transloco }}
          </a>
        </div>
      </div>
    </div>


    <!-- Featured Hotels -->
    <div class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4">
        <h2 class="text-3xl font-bold text-gray-900 mb-8">{{ 'home.featured.title' | transloco }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div *ngFor="let hotel of featuredHotels let i = index" class="card hover:shadow-xl transition-shadow">
            <img [src]="i < 20 ? 'assets/images/hotels/' + (i + 1) + '.jpg' : 'assets/images/hotel_placeholder.png'"  class="w-full h-48 object-cover rounded-t-lg"/>
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-2">{{ hotel.name }}</h3>
              <p class="text-gray-600 mb-4">{{ hotel.description }}</p>
              <a [routerLink]="['/hotels', hotel.hotelId]" class="btn-primary inline-block">
                {{ 'home.featured.viewDetails' | transloco }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reviews Section -->
    <div class="py-16">
      <div class="max-w-7xl mx-auto px-4">
        <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">{{ 'home.reviews.title' | transloco }}</h2>
        <div class="relative">
          <div class="overflow-hidden">
            <div class="flex transition-transform duration-500 ease-in-out" 
                [style.transform]="'translateX(-' + (currentReview * 100) + '%)'">
              <div *ngFor="let review of reviews" class="w-full flex-shrink-0 px-4 my-3">
                <div class="card max-w-2xl mx-auto">
                  <div class="flex items-center mb-4">
                    <img src="assets/images/user_placeholder.png" [alt]="review.name" class="w-12 h-12 rounded-full"/>
                    <div class="ml-4">
                      <h4 class="font-semibold">{{ review.user.name }} {{ review.user.surname }}</h4>
                      <div class="flex text-yellow-400">
                        <svg *ngFor="let star of getStarsArray(review.rating)" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <p class="text-gray-600">{{ review.comment }}</p>
                </div>
              </div>
            </div>
          </div>
          <button (click)="previousReview()" 
              class="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
                  [class.opacity-50]="currentReview === 0">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <button (click)="nextReview()" 
                  class="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
                  [class.opacity-50]="currentReview === reviews?.length - 1">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Contact Section -->
    <div class="py-16 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <!-- Sol kısım: iletişim metni -->
          <div>
            <h2 class="text-3xl font-bold text-gray-900 mb-4">{{ 'home.contact.title' | transloco }}</h2>
            <p class="text-gray-600 mb-8">{{ 'home.contact.subtitle' | transloco }}</p>
            <div class="space-y-4">
              <div class="flex items-center">
                <svg class="w-6 h-6 text-primary-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{{ 'home.contact.phone' | transloco }}</span>
              </div>
              <div class="flex items-center">
                <svg class="w-6 h-6 text-primary-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{{ 'home.contact.email' | transloco }}</span>
              </div>
              <div class="flex items-center">
                <svg class="w-6 h-6 text-primary-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{{ 'home.contact.address' | transloco }}</span>
              </div>
            </div>
          </div>

          <!-- Sağ kısım: Görsel -->
          <div class="flex items-center justify-center">
            <img 
              src="assets/images/cistac1.png" 
              alt="Contact illustration" 
              class="w-full h-auto  object-contain rounded-xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>


    <!-- Footer -->
    <footer class="bg-gray-900 text-white rounded-b-md">
      <div class="max-w-7xl mx-auto px-4 py-12">
        <div class="flex flex-row justify-between">
          <div class="flex-1">
            <h3 class="text-xl font-bold mb-4">{{ 'home.footer.title' | transloco }}</h3>
            <p class="text-gray-400">{{ 'home.footer.description' | transloco }}</p>
          </div>
          <div class="flex-1">
            <h4 class="font-semibold mb-4">{{ 'home.footer.quickLinks' | transloco }}</h4>
            <ul class="space-y-2">
              <li><a routerLink="/about" class="text-gray-400 hover:text-white">{{ 'home.footer.links.about' | transloco }}</a></li>
              <li><a routerLink="/hotels" class="text-gray-400 hover:text-white">{{ 'home.footer.links.hotels' | transloco }}</a></li>
              <li><a routerLink="/rooms" class="text-gray-400 hover:text-white">{{ 'home.footer.links.rooms' | transloco }}</a></li>
              <li><a routerLink="/contact" class="text-gray-400 hover:text-white">{{ 'home.footer.links.contact' | transloco }}</a></li>
            </ul>
          </div>
          <div class="flex-1">
            <h4 class="font-semibold mb-4">{{ 'home.footer.support' | transloco }}</h4>
            <ul class="space-y-2">
              <li><a href="#" class="text-gray-400 hover:text-white">{{ 'home.footer.links.faq' | transloco }}</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white">{{ 'home.footer.links.privacy' | transloco }}</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white">{{ 'home.footer.links.terms' | transloco }}</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white">{{ 'home.footer.links.cancellation' | transloco }}</a></li>
            </ul>
          </div>
          <div class="flex-1">
            <h4 class="font-semibold mb-4">{{ 'home.footer.newsletter.title' | transloco }}</h4>
            <p class="text-gray-400 mb-4">{{ 'home.footer.newsletter.subtitle' | transloco }}</p>
            <div class="flex">
              <input type="email" [placeholder]="'home.footer.newsletter.placeholder' | transloco" class="flex-1 px-4 py-2 rounded-l-lg"/>
              <button class="px-4 py-2 rounded-l-none rounded-r-lg btn-primary bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-medium">
                {{ 'home.footer.newsletter.button' | transloco }}
              </button>
            </div>
          </div>
        </div>
        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>{{ 'home.footer.copyright' | transloco }}</p>
        </div>
      </div>
    </footer>
  `
})
export class HomeComponent implements OnInit {
  featuredHotels: Hotel[] = [];
  currentReview = 0;
  reviews: any;
  usersMap = new Map<number, User>();

  constructor(private hotelService: HotelService, 
              private reviewService: ReviewService,
              private userService: UserService
            ) {}

  ngOnInit() {
    this.hotelService.getHotels().subscribe(hotels => {
      this.featuredHotels = hotels.slice(0, 3);
    });

    this.userService.getUsers().subscribe(users => {
      // UserId -> User eşleşmesi
      users.forEach(user => this.usersMap.set(user.userId, user));

      this.reviewService.getReviews().subscribe(reviews => {
        // Her review'a user nesnesini eşleştir
        this.reviews = reviews.slice(0, 10).map(review => ({
          ...review,
          user: this.usersMap.get(review.userId)
        }));
      });
    });

    

    // Auto-advance carousel every 5 seconds
    setInterval(() => {
      if (this.currentReview < this.reviews.length - 1) {
        this.currentReview++;
      } else {
        this.currentReview = 0;
      }
    }, 5000);
  }

  getStarsArray(rating: number): number[] {
    return Array.from({ length: rating }, (_, i) => i);
  }

  previousReview() {
    if (this.currentReview > 0) {
      this.currentReview--;
    }
  }

  nextReview() {
    if (this.currentReview < this.reviews.length - 1) {
      this.currentReview++;
    }
  }
}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-12">
      <!-- Hero Section -->
        <div class="text-center mb-16">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ 'aboutUs.hero.title' | transloco }}</h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">{{ 'aboutUs.hero.description' | transloco }}</p>
        </div>

        <!-- Mission & Vision -->
        <div class="grid md:grid-cols-2 gap-12 mb-16">
          <div class="card">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">{{ 'aboutUs.mission.title' | transloco }}</h2>
            <p class="text-gray-600">{{ 'aboutUs.mission.description' | transloco }}</p>
          </div>
          <div class="card">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">{{ 'aboutUs.vision.title' | transloco }}</h2>
            <p class="text-gray-600">{{ 'aboutUs.vision.description' | transloco }}</p>
          </div>
        </div>

      <!-- Core Values -->
      <div class="mb-16">
        <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">{{ 'aboutUs.coreValues.title' | transloco }}</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="card text-center">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">{{ 'aboutUs.coreValues.innovation.title' | transloco }}</h3>
            <p class="text-gray-600">
              {{ 'aboutUs.coreValues.innovation.description' | transloco }}
            </p>
          </div>
          <div class="card text-center">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
             <h3 class="text-xl font-semibold mb-2">{{ 'aboutUs.coreValues.customerFocus.title' | transloco }}</h3>
            <p class="text-gray-600">{{ 'aboutUs.coreValues.customerFocus.description' | transloco }}</p>
          </div>
          <div class="card text-center">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">{{ 'aboutUs.coreValues.excellence.title' | transloco }}</h3>
            <p class="text-gray-600">{{ 'aboutUs.coreValues.excellence.description' | transloco }}</p>
          </div>
        </div>
      </div>

      <!-- Team Section -->
      <div>
        <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">{{ 'aboutUs.team.title' | transloco }}</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="card text-center">
            <img src="assets/images/contributors/burakyaman.jpeg"
                alt="CEO" 
                class="w-40 h-40 rounded-full mx-auto mb-4 object-cover"/>
            <h3 class="text-xl font-semibold mb-1">Burak Yaman</h3>
            <p class="text-gray-600 mb-2">{{ 'aboutUs.team.ceo.position' | transloco }}</p>
            <p class="text-sm text-gray-500">{{ 'aboutUs.team.ceo.description' | transloco }}</p>
          </div>
          <div class="card text-center">
            <img src="assets/images/contributors/cihanozun.png"
                alt="CTO" 
                class="w-40 h-40 rounded-full mx-auto mb-4 object-cover"/>
            <h3 class="text-xl font-semibold mb-1">Cihan Özün</h3>
            <p class="text-gray-600 mb-2">{{ 'aboutUs.team.cto.position' | transloco }}</p>
            <p class="text-sm text-gray-500">{{ 'aboutUs.team.cto.description' | transloco }}</p>
          </div>
          <div class="card text-center">
            <img src="assets/images/contributors/eneseren.jpeg"
                alt="COO" 
                class="w-40 h-40 rounded-full mx-auto mb-4 object-cover"/>
            <h3 class="text-xl font-semibold mb-1">Enes Eren</h3>
            <p class="text-gray-600 mb-2">{{ 'aboutUs.team.coo.position' | transloco }}</p>
            <p class="text-sm text-gray-500">{{ 'aboutUs.team.coo.description' | transloco }}</p>
          </div>
        </div>
      </div>

  `
})
export class AboutComponent {}
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'app-access-denied',
  imports: [RouterModule, TranslocoModule ],
  standalone : true,
  template: `
    <div class="flex items-center justify-center min-h-screen px-4">
      <div class="p-12 rounded-lg text-center max-w-md w-full">
        <!-- Kilit ikonu -->
        <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto mb-6 h-16 w-16 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 11c1.104 0 2-.896 2-2V7a2 2 0 10-4 0v2c0 1.104.896 2 2 2z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 11h14a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2z" />
        </svg>

        <h2 class="text-4xl font-extrabold text-red-700 mb-6">
          {{ 'accessDenied.title' | transloco }}
        </h2>
        <p class="text-lg text-gray-800 mb-8">
          {{ 'accessDenied.message' | transloco }}
        </p>
        <button routerLink="/" class="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
          {{ 'accessDenied.backButton' | transloco }}
        </button>
      </div>
    </div>

  `
})
export class AccessDeniedComponent {}

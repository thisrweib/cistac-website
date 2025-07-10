import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { StorageService } from './services/storage/storage.service';
import { RecommendationService } from './services/recommendation.service';
import { RecommendationtDialogComponent } from './components/home/recommendation-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslocoModule, RecommendationtDialogComponent],
  template: `
    <div class="min-h-screen bg-gray-100">
      <nav class="bg-white shadow-lg">
        <div class="max-w-screen-2xl mx-auto px-4">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <!-- <a routerLink="/" class="text-2xl font-bold text-primary-600">CISTAC</a> -->
              <img routerLink="/" src="assets/images/logo.png" class="size-16 " alt="" [class.pointer-events-none]= "!isLoggedIn">
              <div class="hidden md:flex items-center space-x-4 ml-10">
                <ng-container *ngIf="user$ | async as user; else guestLinks">
                  <div *ngIf="user.role === 'customer' || 'admin'" class="flex flex-row space-x-2">
                    <a routerLink="/hotels" *ngIf="user.role != 'staff'"
                      routerLinkActive="border-l-4 border-primary-600 bg-primary-50 font-semibold shadow-md scale-[1.03]"
                      [routerLinkActiveOptions]="{ exact: true }"
                      class="group transition-all duration-300 ease-in-out transform font-medium flex items-center gap-2 text-gray-700 px-4 py-2 pl-3 rounded border-l-4 border-transparent
                              hover:border-primary-400 hover:bg-primary-100 hover:text-primary-700 hover:shadow-sm hover:scale-[1.01]">
                      {{ 'nav.hotels' | transloco }}
                    </a>

                    <a routerLink="/about" *ngIf="user.role != 'staff'"
                      routerLinkActive="border-l-4 border-primary-600 bg-primary-50 font-semibold shadow-md scale-[1.03]"
                      [routerLinkActiveOptions]="{ exact: true }"
                      class="group transition-all duration-300 ease-in-out transform font-medium flex items-center gap-2 text-gray-700 px-4 py-2 pl-3 rounded border-l-4 border-transparent
                              hover:border-primary-400 hover:bg-primary-100 hover:text-primary-700 hover:shadow-sm hover:scale-[1.01]">
                      {{ 'nav.about' | transloco }}
                    </a>

                    <a routerLink="/contact" *ngIf="user.role != 'staff'"
                      routerLinkActive="border-l-4 border-primary-600 bg-primary-50 font-semibold shadow-md scale-[1.03]"
                      [routerLinkActiveOptions]="{ exact: true }"
                      class="group transition-all duration-300 ease-in-out transform font-medium flex items-center gap-2 text-gray-700 px-4 py-2 pl-3 rounded border-l-4 border-transparent
                              hover:border-primary-400 hover:bg-primary-100 hover:text-primary-700 hover:shadow-sm hover:scale-[1.01]">
                      {{ 'nav.contact' | transloco }}
                    </a>
                  </div>

                  <a *ngIf="user.role === 'admin'" routerLink="/admin"
                    routerLinkActive="border-l-4 border-primary-600 bg-primary-50 font-semibold shadow-md scale-[1.03]"
                    [routerLinkActiveOptions]="{ exact: true }"
                    class="group transition-all duration-300 ease-in-out transform font-medium text-gray-700 px-4 py-2 pl-3 rounded border-l-4 border-transparent
                            hover:border-primary-400 hover:bg-primary-100 hover:text-primary-700 hover:shadow-sm hover:scale-[1.01]">
                    {{ 'nav.admin' | transloco }}
                  </a>

                  <a *ngIf="user.role === 'customer'" routerLink="/my-bookings"
                    routerLinkActive="border-l-4 border-primary-600 bg-primary-50 font-semibold shadow-md scale-[1.03]"
                    [routerLinkActiveOptions]="{ exact: true }"
                    class="group transition-all duration-300 ease-in-out transform font-medium text-gray-700 px-4 py-2 pl-3 rounded border-l-4 border-transparent
                            hover:border-primary-400 hover:bg-primary-100 hover:text-primary-700 hover:shadow-sm hover:scale-[1.01]">
                    {{ 'nav.myBookings' | transloco }}
                  </a>

                  <a *ngIf="user.role === 'customer'" routerLink="/recommendation"
                    routerLinkActive="border-l-4 border-primary-600 bg-primary-50 font-semibold shadow-md scale-[1.03]"
                    [routerLinkActiveOptions]="{ exact: true }"
                    class="group transition-all duration-300 ease-in-out transform font-medium text-gray-700 px-4 py-2 pl-3 rounded border-l-4 border-transparent
                            hover:border-primary-400 hover:bg-primary-100 hover:text-primary-700 hover:shadow-sm hover:scale-[1.01]">
                    {{ 'nav.recommendation' | transloco }}
                  </a>

                  <a routerLink="/request" *ngIf="user.role == 'customer' || user.role =='staff'"
                    routerLinkActive="border-l-4 border-primary-600 bg-primary-50 font-semibold shadow-md scale-[1.03]"
                    [routerLinkActiveOptions]="{ exact: true }"
                    class="group transition-all duration-300 ease-in-out transform font-medium text-gray-700 px-4 py-2 pl-3 rounded border-l-4 border-transparent
                            hover:border-primary-400 hover:bg-primary-100 hover:text-primary-700 hover:shadow-sm hover:scale-[1.01]">
                    {{ 'nav.requests' | transloco }}
                  </a>
                </ng-container>

                <ng-template #guestLinks>
                  <a routerLink="/hotels"
                    routerLinkActive="border-l-4 border-primary-600 bg-primary-50 font-semibold shadow-md scale-[1.03]"
                    [routerLinkActiveOptions]="{ exact: true }"
                    class="group transition-all duration-300 ease-in-out transform font-medium flex items-center gap-2 text-gray-700 px-4 py-2 pl-3 rounded border-l-4 border-transparent
                            hover:border-primary-400 hover:bg-primary-100 hover:text-primary-700 hover:shadow-sm hover:scale-[1.01]">
                    {{ 'nav.hotels' | transloco }}
                  </a>
                  <a routerLink="/about"
                    routerLinkActive="border-l-4 border-primary-600 bg-primary-50 font-semibold shadow-md scale-[1.03]"
                    [routerLinkActiveOptions]="{ exact: true }"
                    class="group transition-all duration-300 ease-in-out transform font-medium flex items-center gap-2 text-gray-700 px-4 py-2 pl-3 rounded border-l-4 border-transparent
                            hover:border-primary-400 hover:bg-primary-100 hover:text-primary-700 hover:shadow-sm hover:scale-[1.01]">
                    {{ 'nav.about' | transloco }}
                  </a>
                  <a routerLink="/contact"
                    routerLinkActive="border-l-4 border-primary-600 bg-primary-50 font-semibold shadow-md scale-[1.03]"
                    [routerLinkActiveOptions]="{ exact: true }"
                    class="group transition-all duration-300 ease-in-out transform font-medium flex items-center gap-2 text-gray-700 px-4 py-2 pl-3 rounded border-l-4 border-transparent
                            hover:border-primary-400 hover:bg-primary-100 hover:text-primary-700 hover:shadow-sm hover:scale-[1.01]">
                    {{ 'nav.contact' | transloco }}
                  </a>
                </ng-template>
              </div>


            </div>
            <div class="flex items-center space-x-4">
              <select class="input-field" (change)="switchLang($event)">
                <option value="en" [selected]="currentLang === 'en'">English</option>
                <option value="tr" [selected]="currentLang === 'tr'">Türkçe</option>
              </select>
              <ng-container *ngIf="currentUser ">
                <button (click)="logout()" class="btn-primary">{{ 'nav.logout' | transloco }}</button>
                <span class="text-gray-700 font-medium min-w-fit">
                  {{ 'nav.welcome' | transloco }}, 
                  <span class="text-cyan-600">{{currentUser.name}} {{currentUser.surname}}</span>
                </span>
              </ng-container>
              <a *ngIf="!isLoggedIn" 
                 routerLink="/login" 
                 class="btn-primary">{{ 'nav.login' | transloco }}</a>
            </div>
          </div>
        </div>
      </nav>

      <main class=" mx-auto py-6 px-4">
        <router-outlet></router-outlet>
      </main>
      <app-recommendation-dialog
        *ngIf="showRecommendationDialog"
        (close)="onRecommendationDialogClose()">
      </app-recommendation-dialog>
      
    </div>
  `
})
export class AppComponent {
    currentLang: string;
    currentUser: any;
    isLoggedIn: boolean = false;
    showRecommendationDialog = false;
    user$ = StorageService.user$; 
    userRecommendation: any;
    private readonly STORAGE_KEY = 'recommendationDialogClosedAt';
    private readonly DIALOG_HIDE_DURATION_MS = 60 * 60 * 1000; // 1 saat

    constructor(
      private translocoService: TranslocoService,
      private router: Router,
      private recommendationService: RecommendationService
    ) {
      const savedLang = localStorage.getItem('appLang');
      this.currentLang = savedLang || this.translocoService.getActiveLang();
      this.translocoService.setActiveLang(this.currentLang);

      StorageService.user$.subscribe(user => {
        this.currentUser = user;
        this.isLoggedIn = !!user;

        if (this.isLoggedIn && user?.userId && user?.role == 'customer') {
          // localStorage'daki kapanma zamanını kontrol et
          const closedAt = localStorage.getItem(this.STORAGE_KEY);
          const now = Date.now();

          if (closedAt) {
            const closedTimestamp = parseInt(closedAt, 10);
            const timeSinceClose = now - closedTimestamp;
            

            // Eğer 1 saatten kısa süre geçtiyse dialogu açma
            if (timeSinceClose < this.DIALOG_HIDE_DURATION_MS) {
              this.showRecommendationDialog = false;
              return;
            }
          }

          // Dialogu göster ve önerileri al
          this.recommendationService.getAllRecommendation().subscribe(recommendations => {
            const matched = recommendations.find(rec => rec.userID === user.userId);

            if (matched) {
              this.userRecommendation = matched;
              this.showRecommendationDialog = true;
            } else {
              this.userRecommendation = null;
              this.showRecommendationDialog = false;
            }
          });
        } else {
          this.userRecommendation = null;
          this.showRecommendationDialog = false;
        }
      });
  }

  onRecommendationDialogClose() {
    this.showRecommendationDialog = false;
    localStorage.setItem(this.STORAGE_KEY, Date.now().toString());
  }

  switchLang(event: Event) {
    const select = event.target as HTMLSelectElement;
    const lang = select.value;
    this.currentLang = lang;
    this.translocoService.setActiveLang(lang);
    localStorage.setItem('appLang', lang);
  }

  logout() {
    StorageService.logOut();
    this.router.navigate(['/login']);
  }
}
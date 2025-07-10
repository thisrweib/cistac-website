import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { HotelService } from '../../services/hotel.service';
import { Hotel, Room } from '../../models/user.model';
import { ToastrService } from 'ngx-toastr';

interface HotelFormData {
  name: string;
  location: string;
  phoneNumber: string;
  eMail: string;
  hotelAmenities: string;
}

@Component({
  selector: 'app-add-hotel-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslocoModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[95vh] overflow-auto  ">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">{{ 'admin.addHotel.title' | transloco }}</h2>
          <button (click)="close.emit()" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form #hotelForm="ngForm" (ngSubmit)="addHotel()" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'admin.addHotel.hotelName' | transloco }}</label>
            <input type="text" class="input-field" [(ngModel)]="hotelData.name" name="name" required #hotelName="ngModel"/>
            <div *ngIf="hotelName.invalid && hotelName.touched"         class="text-red-600 text-sm">
              {{ 'common.validation.required' | transloco }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'admin.addHotel.location' | transloco }}</label>
            <input type="text" class="input-field" [(ngModel)]="hotelData.location" name="location" required #location="ngModel"/>
            <div *ngIf="location.invalid && location.touched"         class="text-red-600 text-sm">
              {{ 'common.validation.required' | transloco }}
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'admin.addHotel.eMail' | transloco }}</label>
            <input type="text" class="input-field" [(ngModel)]="hotelData.eMail" name="eMail" required #eMail="ngModel"/>
            <div *ngIf="eMail.invalid && eMail.touched"         class="text-red-600 text-sm">
              {{ 'common.validation.required' | transloco }}
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'admin.addHotel.hotelAmenities' | transloco }}</label>
            <input type="text" class="input-field" [(ngModel)]="hotelData.hotelAmenities" name="hotelAmenities" required #hotelAmenities="ngModel"/>
            <div *ngIf="hotelAmenities.invalid && hotelAmenities.touched"         class="text-red-600 text-sm">
              {{ 'common.validation.required' | transloco }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'admin.addHotel.phoneNumber' | transloco }}</label>
            <input type="tel" class="input-field" [(ngModel)]="hotelData.phoneNumber" name="phoneNumber" required #phoneNumber="ngModel"  pattern="^[0-9]*$" 
             (input)="onPhoneInput($event)" />
            <div *ngIf="phoneNumber.invalid && phoneNumber.touched"         class="text-red-600 text-sm">
              {{ 'common.validation.required' | transloco }}
            </div>
          </div>
          
          <div class="flex justify-end space-x-4 pt-4">
            <button type="button" class="btn-secondary" (click)="close.emit()" >{{ 'common.cancel' | transloco }}</button>
            <button type="submit" class="btn-primary" [disabled]="hotelForm.invalid">{{ 'admin.addHotel.submit' | transloco }}</button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class AddHotelDialogComponent {
  hotelData: HotelFormData = {
    name: '',
    location: '',
    phoneNumber: '',
    eMail:'',
    hotelAmenities:''    
  };

  @Output() close = new EventEmitter<boolean>();
  hotels: Hotel[];

  constructor(private hotelService: HotelService,
        private toastr: ToastrService,private t : TranslocoService
  ) {}




  addHotel() {
    const hotelToAdd = {
      name: this.hotelData.name,
      location: this.hotelData.location,
      phoneNumber: this.hotelData.phoneNumber,
      eMail: this.hotelData.eMail,
      hotelAmenities: this.hotelData.hotelAmenities
    };

    this.hotelService.addHotel(hotelToAdd).subscribe({
      next: () => {
        this.toastr.success(this.t.translate('toastr.success'));
        this.close.emit(true);
        
      },
      error: (error) => {
        this.toastr.error(this.t.translate('toastr.error'));
      }
    });

  }

  onPhoneInput(event: any) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
    this.hotelData.phoneNumber = input.value;
  }
}
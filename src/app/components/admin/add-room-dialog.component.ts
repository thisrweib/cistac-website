import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { HotelService } from '../../services/hotel.service';
import { Hotel, Room } from '../../models/user.model';
import { RoomService } from '@app/services/room.service';
import { ToastrService } from 'ngx-toastr';

export interface RoomFormData {
  hotelId: number;
  roomNumber: string;
  type: string;
  pricePerNight: number;
  availabilityStatus: string;
  capacity: number;
  roomAmenities: string;
}

@Component({
  selector: 'app-add-room-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslocoModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[95vh] overflow-auto  ">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">{{ 'admin.addRoom.title' | transloco }}</h2>
          <button (click)="close.emit()" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form #roomForm="ngForm" class="space-y-6">
         
          
            <div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">{{ 'admin.addRoom.rooms' | transloco }}</h3>
                <div class="space-y-4">
                <div *ngFor="let room of roomData; let i = index" class="p-4 border rounded-lg">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'admin.addRoom.roomNumber' | transloco }}</label>
                            <input type="text" class="input-field" [(ngModel)]="room.roomNumber" [name]="'roomNumber' + i" required #roomNumber="ngModel"/>
                            <div *ngIf="roomNumber.invalid && roomNumber.touched"         class="text-red-600 text-sm">
                                {{ 'common.validation.required' | transloco }}
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'admin.addRoom.roomType' | transloco }}</label>
                            <select class="input-field" [(ngModel)]="room.type" [name]="'roomType' + i" required #roomType="ngModel">
                            <option value="Standard Room">{{ 'admin.addRoom.standardRoom' | transloco }}</option>
                            <option value="Deluxe Room">{{ 'admin.addRoom.deluxeRoom' | transloco }}</option>
                            <option value="Suite">{{ 'admin.addRoom.suite' | transloco }}</option>
                            <div *ngIf="roomType.invalid && roomType.touched"         class="text-red-600 text-sm">
                                {{ 'common.validation.required' | transloco }}
                            </div>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'admin.addRoom.price' | transloco }}</label>
                            <input type="number" class="input-field" [(ngModel)]="room.pricePerNight" [name]="'roomPrice' + i" required #roomPrice="ngModel"/>
                            <div *ngIf="roomPrice.invalid && roomPrice.touched"         class="text-red-600 text-sm">
                                {{ 'common.validation.required' | transloco }}
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'admin.addRoom.capacity' | transloco }}</label>
                            <input type="number" class="input-field" [(ngModel)]="room.capacity" [name]="'roomCapacity' + i" required [max]="7" [min]="1" (input)="onCapacityInput($event)" #roomCapacity="ngModel"/>
                            <div *ngIf="roomCapacity.invalid && roomCapacity.touched"         class="text-red-600 text-sm">
                                {{ 'common.validation.required' | transloco }}
                            </div>
                        </div>

                        <div class="col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'admin.addRoom.roomAmenities' | transloco }}</label>
                            <textarea class="input-field" rows="3" [(ngModel)]="room.roomAmenities" [name]="'amenities' + i" required #amenities="ngModel"></textarea>
                            <div *ngIf="amenities.invalid && amenities.touched"         class="text-red-600 text-sm">
                                {{ 'common.validation.required' | transloco }}
                            </div>
                        </div>
                    </div>
                        <button type="button" class="mt-2 text-red-600 hover:text-red-800" (click)="removeRoom(i)">
                        {{ 'admin.addRoom.removeRoom' | transloco }}
                        </button>
                </div>
            </div>
                <button type="button" class="mt-4 text-primary-600 hover:text-primary-800" (click)="addRoom()">
                {{ 'admin.addRoom.addRoom' | transloco }}
                </button>
            </div>
          
          <div class="flex justify-end space-x-4 pt-4">
            <button type="button" class="btn-secondary" (click)="close.emit()" >{{ 'common.cancel' | transloco }}</button>
            <button (click)="submitRooms()" class="btn-primary" [disabled]="roomForm.invalid" >{{ 'admin.addRoom.submit' | transloco }}</button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class AddRoomDialogComponent {
    @Output() close = new EventEmitter<boolean>();
    roomDataList: RoomFormData[] = [this.createEmptyRoom()];
    hotels: Hotel[] = [];
    roomData: RoomFormData[] = [];
    @Input() hotelId;
    constructor(private hotelService: HotelService, private roomService: RoomService,  private toastr: ToastrService,private t : TranslocoService) {
        this.fetchHotels();
    }

  private createEmptyRoom(): RoomFormData {
    return {
      hotelId: null,
      roomNumber: '',
      type: 'Standard Room',
      pricePerNight: null,
      availabilityStatus: '',
      capacity: null,
      roomAmenities: ''
    };
  }

    fetchHotels() {
        this.hotelService.getHotels().subscribe((res) => {
        this.hotels = res;
        });
    }

    addRoom() {
        this.roomData.push({
            hotelId: this.hotelId,
            roomNumber: '',
            type: '',
            pricePerNight: null,
            availabilityStatus: '',
            capacity: null,
            roomAmenities: ''
        });
    }

    removeRoom(index: number) {
        this.roomData.splice(index, 1);
    }

    onCapacityInput(event: Event) {
        const input = event.target as HTMLInputElement;
        if (+input.value > 8) {
            input.value = '7';
            
        }else if(+input.value < 0){
            input.value = '1';
        }
    }

    submitRooms() {
    this.roomService.createRoomsBulk(this.roomData).subscribe({
      next: () => {
        this.toastr.success(this.t.translate('toastr.success'));
        this.close.emit(true);
      },
      error: (err) => {
        this.toastr.error(this.t.translate('toastr.error'));
      }
    });
  }
}
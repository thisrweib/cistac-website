import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { HotelService } from '../../services/hotel.service';
import { Hotel, Room } from '../../models/user.model';
import { RoomService } from '@app/services/room.service';
import { RoomFormData } from './add-room-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-room-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslocoModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[95vh] overflow-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">{{ 'admin.editRoom' | transloco }}</h2>
          <button (click)="close.emit('close')" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form class="space-y-6">
          
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">{{ 'admin.addHotel.rooms' | transloco }}</h3>
            <div class="space-y-4">
              <div *ngFor="let room of editedHotel.rooms; let i = index" class="p-4 border rounded-lg">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'admin.addHotel.roomNumber' | transloco }}</label>
                    <input type="text" class="input-field" [(ngModel)]="room.roomNumber" [name]="'roomNumber' + i" required/>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'admin.addHotel.roomType' | transloco }}</label>
                    <select class="input-field" [(ngModel)]="room.type" [name]="'roomType' + i" required>
                      <option value="Standard">{{ 'admin.addHotel.standardRoom' | transloco }}</option>
                      <option value="Deluxe">{{ 'admin.addHotel.deluxeRoom' | transloco }}</option>
                      <option value="Suite">{{ 'admin.addHotel.suite' | transloco }}</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'admin.addHotel.price' | transloco }}</label>
                    <input type="number" class="input-field" [(ngModel)]="room.pricePerNight" [name]="'roomPrice' + i" required/>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'admin.addHotel.capacity' | transloco }}</label>
                    <input type="number" class="input-field" [(ngModel)]="room.capacity" [name]="'roomCapacity' + i" required/>
                  </div>
                </div>
                <button type="button" class="mt-2 text-red-600 hover:text-red-800" (click)="removeRoom(room.roomId)">
                  {{ 'admin.addHotel.removeRoom' | transloco }}
                </button>
              </div>
            </div>
          </div>
          
          <div class="flex justify-end space-x-4 pt-4">
            <button type="button" class="btn-secondary" (click)="close.emit('close')">{{ 'common.cancel' | transloco }}</button>
            <button type="button" (click)="updateRooms()" class="btn-primary">{{ 'common.save' | transloco }}</button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class EditHotelDialogComponent implements OnInit {
  @Input() hotel!: Hotel;
  @Output() close = new EventEmitter<string>();
  hotels: Hotel[] = [];
  roomData: RoomFormData[] = [];
  @Input() hotelId;

  editedHotel!: Hotel;

  constructor(private hotelService: HotelService,
              private roomService: RoomService,
                      private toastr: ToastrService,private t : TranslocoService
              
  ) {}

  ngOnInit() {
    this.editedHotel = JSON.parse(JSON.stringify(this.hotel));
    
  }


  removeRoom(roomId: number) {
    this.roomService.deleteRoom(roomId).subscribe({
      next: () => {
        this.toastr.success(this.t.translate('toastr.success'));
        this.close.emit("false");
        this.editedHotel = JSON.parse(JSON.stringify(this.hotel));
      },
      error: (error) => {
        this.toastr.error(this.t.translate('toastr.error'));
      }
    });
    
  }

  updateRooms() {
    // Validasyon yapabilirsin burada, boş alan kontrolü vs.
    if (this.editedHotel.rooms.some(r => !r.roomNumber || !r.type || !r.pricePerNight || !r.capacity)) {
      alert('Lütfen tüm oda alanlarını doldurunuz.');
      return;
    }

    // Bulk update için Room[] olarak gönderiyoruz
    this.roomService.updateRoomsBulk(this.editedHotel.rooms).subscribe({
      next: () => {
        this.toastr.success(this.t.translate('toastr.success'));
        this.close.emit("true");
      },
      error: (error) => {
        this.toastr.error(this.t.translate('toastr.error'));
      }
    });
  }
}
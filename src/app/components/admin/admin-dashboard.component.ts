import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { HotelService } from '../../services/hotel.service';
import { InventoryService } from '../../services/inventory.service';
import { StaffService } from '../../services/staff.service';
import { Reservation, Hotel, Room } from '../../models/user.model';
import { AddHotelDialogComponent } from './add-hotel-dialog.component';
import { EditHotelDialogComponent } from './edit-hotel-dialog.component';
import { PendingApprovalsDialogComponent } from './pending-approvals-dialog.component';
import { InventoryManagementComponent } from './inventory-management.component';
import { StaffManagementComponent } from './staff-management.component';
import { FormsModule } from '@angular/forms';
import { BookingService } from '@app/services/booking.service';
import { AddRoomDialogComponent } from './add-room-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { AllReservationsComponent } from './all-reservations.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    TranslocoModule, 
    AddHotelDialogComponent, 
    EditHotelDialogComponent,
    PendingApprovalsDialogComponent,
    InventoryManagementComponent,
    StaffManagementComponent,
    AddRoomDialogComponent,
    AllReservationsComponent,
    FormsModule
  ],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900">{{ 'admin.dashboard.title' | transloco }}</h1>
        <div class="flex space-x-4">
          <button class="btn-primary" (click)="showAddHotelDialog = true">
            {{ 'admin.addHotel.title' | transloco }}
          </button>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="card bg-primary-50">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            {{ 'admin.dashboard.totalBookings' | transloco }}
          </h3>
          <p class="text-3xl font-bold text-primary-600">{{statistics.totalBookings}}</p>
          <p class="text-sm text-gray-600 mt-2">
            +{{statistics.newBookings}} {{ 'admin.dashboard.newToday' | transloco }}
          </p>
        </div>
        
        <div class="card bg-green-50">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            {{ 'admin.dashboard.revenue' | transloco }}
          </h3>
          <p class="text-3xl font-bold text-green-600">{{statistics.revenue | currency}}</p>
          <p class="text-sm text-gray-600 mt-2">
            +{{statistics.revenueGrowth}}% {{ 'admin.dashboard.thisMonth' | transloco }}
          </p>
        </div>
        
        <div class="card bg-yellow-50 cursor-pointer" (click)="showPendingApprovalsDialog = true">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            {{ 'admin.dashboard.pendingApprovals' | transloco }}
          </h3>
          <p class="text-3xl font-bold text-yellow-600">{{statistics.pendingApprovals}}</p>
        </div>
        
        <div class="card bg-blue-50">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            {{ 'admin.dashboard.occupancyRate' | transloco }}
          </h3>
          <p class="text-3xl font-bold text-blue-600">{{statistics.occupancyRate.toFixed(2)}}%</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-white rounded-lg shadow">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex">
            <button 
              *ngFor="let tab of tabs" 
              (click)="activeTab = tab.id"
              [class]="'px-6 py-3 border-b-2 text-sm font-medium ' + 
                      (activeTab === tab.id ? 
                        'border-primary-500 text-primary-600' : 
                        'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')">
              {{ tab.nameKey | transloco }}
            </button>
          </nav>
        </div>

        <div class="p-6">
          <!-- Hotel Management Tab -->
          <div *ngIf="activeTab === 'hotels'" class="space-y-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">
              {{ 'admin.dashboard.hotelManagement' | transloco }}
            </h2>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {{ 'admin.dashboard.hotelName' | transloco }}
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {{ 'admin.dashboard.location' | transloco }}
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {{ 'admin.dashboard.rooms' | transloco }}
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {{ 'admin.dashboard.occupancy' | transloco }}
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {{ 'admin.dashboard.actions' | transloco }}
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr *ngFor="let hotel of hotels">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">{{hotel.name}}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-500">{{hotel.location}}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-500">{{hotel.rooms.length}}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-500">
                        {{calculateOccupancy(hotel)}}%
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button  class="text-primary-600 hover:text-primary-900 mr-3" (click)="addRoom(hotel.hotelId)">
                        {{ 'admin.addRoom.addRoom' | transloco }}
                      </button>
                      <button *ngIf="hotel.rooms.length > 0" class="text-primary-600 hover:text-primary-900 mr-3" 
                              (click)="editHotel(hotel)">
                        {{ 'common.edit' | transloco }}
                      </button>
                      <button *ngIf="hotel.rooms.length == 0" class="text-red-600 hover:text-red-900"
                              (click)="deleteHotel(hotel)">
                        {{ 'common.delete' | transloco }}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Inventory Management Tab -->
          <app-inventory-management *ngIf="activeTab === 'inventory'">
          </app-inventory-management>

          <!-- Staff Management Tab -->
          <app-staff-management *ngIf="activeTab === 'staff'">
          </app-staff-management>

          <app-all-reservations *ngIf="activeTab === 'reservation'">

          </app-all-reservations>
        </div>
      </div>
    </div>

    <app-add-hotel-dialog 
      *ngIf="showAddHotelDialog" 
      (close)="onHotelDialogClosed($event)">
    </app-add-hotel-dialog>

    <app-staff-management
    *ngIf="showAddStaffDialog" 
      (close)="showAddStaffDialog = false">
    </app-staff-management>

    <app-edit-room-dialog
      *ngIf="showEditRoomDialog"
      [hotel]="selectedHotel!"
      (close)="closeEditRoomDialog($event)">
    </app-edit-room-dialog>

    <app-pending-approvals-dialog
      *ngIf="showPendingApprovalsDialog"
      [hotel]="hotels"
      (close)="showPendingApprovalsDialog = false">
    </app-pending-approvals-dialog>
      <!-- [room]="room" -->

    <app-add-room-dialog
    *ngIf="showAddRoomDialog"
    [hotelId]= "selectedHotelId"
      (close)="onRoomDialogClosed($event)">
    </app-add-room-dialog>
  `
})
export class AdminDashboardComponent implements OnInit {
  showAddHotelDialog = false;
  showEditRoomDialog = false;
  showAddStaffDialog = false;
  showEditStaffDialog = false;
  showPendingApprovalsDialog = false;
  showAddRoomDialog = false;

  selectedHotelId : number;
  selectedHotel: Hotel | null = null;
  hotels: Hotel[] = [];
  activeTab = 'hotels';
  booking: any;
  totalRooms: any;
  tabs = [
    { id: 'hotels', nameKey: 'dashboardTabs.hotels' },
    { id: 'inventory', nameKey: 'dashboardTabs.inventory' },
    { id: 'staff', nameKey: 'dashboardTabs.staff' },
    { id: 'reservation', nameKey: 'dashboardTabs.reservation' }
  ];
  
  statistics = {
    totalBookings:0,
    newBookings: 0,
    revenue: 0,
    revenueGrowth: 0,
    pendingApprovals: 0,
    occupancyRate: 0
  };

  constructor(
    private hotelService: HotelService,
    private inventoryService: InventoryService,
    private staffService: StaffService,
    private bookingService: BookingService,
     private toastr: ToastrService,
     private t : TranslocoService
  ) {}

  ngOnInit() {
    this.loadHotels();
    
  }

  loadBookings() {
  this.bookingService.getBookings().subscribe(bookings => {
    this.booking = bookings;
    this.statistics.totalBookings = bookings.length;

    const today = new Date();
    const threeDaysLater = new Date();
    threeDaysLater.setDate(today.getDate() + 3);

    // newBookings: checkInDate bugün veya 3 gün içerisinde olanlar
    this.statistics.newBookings = bookings.filter(b => {
      const checkIn = new Date(b.checkInDate);
      return checkIn >= today && checkIn <= threeDaysLater;
    }).length;

    // pending approvals
    this.statistics.pendingApprovals = bookings.filter(b => b.bookingStatus.toLowerCase() === 'pending').length;

    // revenue (örnek, gece sayısı * sabit fiyat, fiyat servisten veya oda objesinden alınmalı)
    this.statistics.revenue = bookings
      .filter(b => b.bookingStatus.toLowerCase() === 'confirmed')
      .reduce((total, b) => {
        const checkIn = new Date(b.checkInDate);
        const checkOut = new Date(b.checkOutDate);
        const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const pricePerNight = 1000; // Örnek sabit fiyat, bunu gerçek veriden alman lazım
        return total + diffDays * pricePerNight;
      }, 0);

    // occupancyRate (örnek: aktif bookinglerin oranı)
    const activeBookings = bookings.filter(b => new Date(b.checkOutDate) >= today).length;
    const totalRooms = this.totalRooms || 0;
    this.statistics.occupancyRate = (totalRooms > 0 ? (activeBookings / totalRooms) * 100 : 0);

    // revenueGrowth hesaplaması için önceki dönemin gelmesi gerekir, örnek atlanabilir
    this.statistics.revenueGrowth = 0; // Burayı ihtiyaç halinde hesaplayabilirsin
  });
}


  loadHotels() {
    this.hotelService.getHotels().subscribe(hotels => {
      this.hotels = hotels;

      this.totalRooms = this.hotels.reduce((total, hotel) => total + (hotel.rooms?.length || 0), 0);
      this.loadBookings();

    });
  }

  calculateOccupancy(hotel: Hotel): number {
  if (!hotel.rooms || hotel.rooms.length === 0) return 0;

  // Doluluğu "Available" olmayan odalar olarak sayıyoruz
  const occupiedRooms = hotel.rooms.filter(room => room.availabilityStatus !== 'Available').length;

  return Math.round((occupiedRooms / hotel.rooms.length) * 100);
}

  onHotelDialogClosed(success: boolean) {
    this.showAddHotelDialog = false;  // Dialogu kapat
    if (success) {
      this.loadHotels(); // Sadece otel başarıyla eklendiyse listeyi yenile
    }
  }

  onRoomDialogClosed(success: boolean){
    this.showAddRoomDialog = false;
    if (success) {
      this.loadHotels(); 
    }
  }

  addRoom(hotelId: number) {
      this.selectedHotelId = hotelId;
      this.showAddRoomDialog = true;
  }


  editHotel(hotel: Hotel) {
    this.selectedHotel = hotel;
    
    this.showEditRoomDialog = true;
  }

  closeEditRoomDialog(status: string) {
    if (status == "true" || status == "close") {
      this.selectedHotel = null;
      this.showEditRoomDialog = false;
    }else if(status == 'false'){
       this.showEditRoomDialog = false;
      this.hotelService.getHotel(this.selectedHotel.hotelId).subscribe({
        next: (hotel) => {
          this.selectedHotel = hotel;
        this.toastr.success(this.t.translate('toastr.success'));

          setTimeout(() => {
            this.showEditRoomDialog = true;
          }, 0);
        },
        error: (err) => {
        this.toastr.error(this.t.translate('toastr.error'));

        }
      });
    }
    

  }

  deleteHotel(hotel: Hotel) {
    if (confirm('Are you sure you want to delete this hotel?')) {
      this.hotelService.deleteHotel(hotel.hotelId).subscribe({
        next: () => {
          this.loadHotels();
          this.toastr.success(this.t.translate('toastr.success'));
        },
        error: (error) => {
          this.toastr.error(this.t.translate('toastr.error'));
        }
      });
    }
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Staff, StaffService } from '../../services/staff.service';
import { StaffMember, StaffSchedule } from '../../models/user.model';
import { ToastrService } from 'ngx-toastr';
import { HotelService } from '@app/services/hotel.service';
import { PhonePipe } from '@app/pipes/number-pipe';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-staff-management',
  standalone: true,
  imports: [CommonModule, FormsModule, PhonePipe, TranslocoModule],
  template: `
    <div class="space-y-6">
  <!-- Üst başlık ve otel filtresi -->
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-2xl font-bold">{{ 'staff-management.title' | transloco }}</h2>
    <div class="flex items-center gap-4">
      <label class="text-sm font-medium text-gray-700">{{ 'staff-management.filterLabel' | transloco }}</label>
      <select [(ngModel)]="selectedHotelId" class="border rounded px-2 py-1">
        <option [ngValue]="null">{{'inventoryManagement.allHotels' | transloco}}</option>
        <option *ngFor="let hotel of hotels" [ngValue]="hotel.hotelId">{{ hotel.name }}</option>
      </select>
      <button (click)="showAddStaffForm = true" class="btn-primary">
        {{ 'staff-management.buttonAddStaff' | transloco }}
      </button>
    </div>
  </div>


  <!-- Staff List -->
  <div class="bg-white rounded-lg shadow overflow-auto max-h-[200vh]">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
           <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ 'staff-management.tableHeaders.name' | transloco }}</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ 'staff-management.tableHeaders.role' | transloco }}</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ 'staff-management.tableHeaders.contact' | transloco }}</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ 'staff-management.tableHeaders.shift' | transloco }}</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ 'staff-management.tableHeaders.createdAt' | transloco }}</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ 'staff-management.tableHeaders.hotel' | transloco }}</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ 'staff-management.tableHeaders.actions' | transloco }}</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr *ngFor="let staff of filteredStaffMembers()">
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900">{{ staff.name }} {{ staff.surname }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
              [ngClass]="{
                'bg-green-100 text-green-800': staff.position === 'Manager',
                'bg-blue-100 text-blue-800': staff.position === 'Receptionist',
                'bg-purple-100 text-purple-800': staff.position === 'Security',
                'bg-yellow-100 text-yellow-800': staff.position === 'Cleaner',
                'bg-gray-100 text-gray-800': staff.position === 'Maintenance',
                'bg-pink-200 text-pink-800': staff.position === 'Bellhop',
                'bg-pink-100 text-pink-700': staff.position == 'Bellhop (St. Regis Butler)',
                'bg-red-200 text-red-800': staff.position === 'Concierge',
                'bg-red-100 text-red-700': staff.position == 'Concierge (Chief Butler)',
                'bg-teal-100 text-teal-800': staff.position === 'Guest Relations Officer',
                'bg-cyan-100 text-cyan-800': staff.position === 'Pool Attendant',
                'bg-indigo-100 text-indigo-800': staff.position === 'Spa Therapist',
                'bg-orange-100 text-orange-800': staff.position === 'Waiter/Waitress',
                'bg-rose-100 text-rose-800': staff.position === 'Bartender',
                'bg-lime-100 text-lime-800': staff.position === 'Housekeeping Supervisor',
                'bg-amber-100 text-amber-800': staff.position === 'Chef',
                'bg-amber-200 text-amber-800': staff.position === 'Chef (Palace Cuisine)',
                'bg-amber-200 text-amber-700': staff.position === 'Chef (Resort Cuisine)',
                'bg-sky-100 text-sky-800': staff.position === 'Activities Coordinator'
              }">
              {{ ('staff-management.formRoles.' + staff.position) | transloco }}            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">{{ staff.phoneNumber | phone }}</div>
            <div class="text-sm text-gray-500">{{ staff.eMail }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">{{ staff.shift }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ staff.createdAt | date:'short' }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {{ staff.hotel?.name?.length > 20 ? (staff.hotel.name | slice:0:20) + '...' : staff.hotel?.name }}

          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium flex flex-row gap-3">
            <button (click)="openEditForm(staff)" class="text-primary-600 hover:text-primary-900">{{ 'staff-management.buttons.editStaff' | transloco }}</button>
            <button (click)="deleteStaff(staff)" class="text-red-600 hover:text-red-900">{{ 'staff-management.buttons.deleteStaff' | transloco }}</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Add Staff Modal -->
  <div *ngIf="showAddStaffForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white rounded-lg p-8 max-w-md w-full">
      <h3 class="text-lg font-medium mb-4">{{ 'staff-management.modalAddTitle' | transloco }}</h3>
      <form (ngSubmit)="addNewStaff()" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">{{ 'staff-management.formLabels.name' | transloco }}</label>
          <input type="text" [(ngModel)]="newStaff.name" name="name"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">{{ 'staff-management.formLabels.surname' | transloco }}</label>
          <input type="text" [(ngModel)]="newStaff.surname" name="surname"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">{{ 'staff-management.formLabels.hotel' | transloco }}</label>
          <select [(ngModel)]="newStaff.hotelId" name="hotel" class="border rounded px-2 py-1">
            <option *ngFor="let hotel of hotels" [ngValue]="hotel.hotelId">{{ hotel.name }}</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">{{ 'staff-management.formLabels.role' | transloco }}</label>
          <select [(ngModel)]="newStaff.position" name="position"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500">
              <optgroup label="{{ 'staff-management.formRoleGroups.management' | transloco }}">
                <option value="Manager">{{ 'staff-management.formRoles.Manager' | transloco }}</option>
                <option value="Guest Relations Officer">{{ 'staff-management.formRoles.Guest Relations Officer' | transloco }}</option>
                <option value="Concierge (Chief Butler)">{{ 'staff-management.formRoles.Concierge (Chief Butler)' | transloco }}</option>
              </optgroup>

              <optgroup label="{{ 'staff-management.formRoleGroups.receptionFrontOffice' | transloco }}">
                <option value="Receptionist">{{ 'staff-management.formRoles.Receptionist' | transloco }}</option>
                <option value="Concierge">{{ 'staff-management.formRoles.Concierge' | transloco }}</option>
                <option value="Bellhop">{{ 'staff-management.formRoles.Bellhop' | transloco }}</option>
                <option value="Bellhop (St. Regis Butler)">{{ 'staff-management.formRoles.Bellhop (St. Regis Butler)' | transloco }}</option>
              </optgroup>

              <optgroup label="{{ 'staff-management.formRoleGroups.housekeepingMaintenance' | transloco }}">
                <option value="Housekeeping Supervisor">{{ 'staff-management.formRoles.Housekeeping Supervisor' | transloco }}</option>
                <option value="Cleaner">{{ 'staff-management.formRoles.Cleaner' | transloco }}</option>
                <option value="Maintenance">{{ 'staff-management.formRoles.Maintenance' | transloco }}</option>
              </optgroup>

              <optgroup label="{{ 'staff-management.formRoleGroups.serviceCulinary' | transloco }}">
                <option value="Waiter/Waitress">{{ 'staff-management.formRoles.Waiter/Waitress' | transloco }}</option>
                <option value="Bartender">{{ 'staff-management.formRoles.Bartender' | transloco }}</option>
                <option value="Chef">{{ 'staff-management.formRoles.Chef' | transloco }}</option>
                <option value="Chef (Palace Cuisine)">{{ 'staff-management.formRoles.Chef (Palace Cuisine)' | transloco }}</option>
                <option value="Chef (Resort Cuisine)">{{ 'staff-management.formRoles.Chef (Resort Cuisine)' | transloco }}</option>
              </optgroup>

              <optgroup label="{{ 'staff-management.formRoleGroups.spaWellness' | transloco }}">
                <option value="Spa Therapist">{{ 'staff-management.formRoles.Spa Therapist' | transloco }}</option>
                <option value="Pool Attendant">{{ 'staff-management.formRoles.Pool Attendant' | transloco }}</option>
              </optgroup>

              <optgroup label="{{ 'staff-management.formRoleGroups.activitiesSecurity' | transloco }}">
                <option value="Activities Coordinator">{{ 'staff-management.formRoles.Activities Coordinator' | transloco }}</option>
                <option value="Security">{{ 'staff-management.formRoles.Security' | transloco }}</option>
              </optgroup>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">{{ 'staff-management.formLabels.defaultShift' | transloco }}</label>
          <select [(ngModel)]="newStaff.shift" name="shift"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500">
            <option value="Morning">{{ 'staff-management.formShifts.Morning' | transloco }}</option>
            <option value="Afternoon">{{ 'staff-management.formShifts.Afternoon' | transloco }}</option>
            <option value="Night">{{ 'staff-management.formShifts.Night' | transloco }}</option>
            <option value="Day">{{ 'staff-management.formShifts.Day' | transloco }}</option>
            <option value="Evening">{{ 'staff-management.formShifts.Evening' | transloco }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">{{ 'staff-management.formLabels.contactNumber' | transloco }}</label>
          <input type="tel" [(ngModel)]="newStaff.phoneNumber" name="phoneNumber"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">{{ 'staff-management.formLabels.email' | transloco }}</label>
          <input type="email" [(ngModel)]="newStaff.eMail" name="eMail"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
        </div>
        <div class="flex justify-end space-x-3 mt-6">
          <button type="button" (click)="showAddStaffForm = false" class="btn-secondary">{{ 'staff-management.buttons.cancel' | transloco }}</button>
          <button type="submit" class="btn-primary"> {{ 'staff-management.buttons.addStaff' | transloco }}</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Edit Staff -->
  <div *ngIf="showEditStaffForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white rounded-lg p-8 max-w-md w-full">
      <h3 class="text-lg font-medium mb-4">{{ 'staff-management.modalEditTitle' | transloco }}</h3>
      <form (ngSubmit)="editStaff()" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">{{ 'staff-management.formLabels.name' | transloco }}</label>
          <input type="text" [(ngModel)]="updatedStaff.name" name="name"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">{{ 'staff-management.formLabels.surname' | transloco }}</label>
          <input type="text" [(ngModel)]="updatedStaff.surname" name="surname"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">{{ 'staff-management.formLabels.hotel' | transloco }}</label>
          <select [(ngModel)]="updatedStaff.hotelId" name="hotel" class="border rounded px-2 py-1">
            <option *ngFor="let hotel of hotels" [ngValue]="hotel.hotelId">{{ hotel.name }}</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">{{ 'staff-management.formLabels.role' | transloco }}</label>
          <select [(ngModel)]="updatedStaff.position" name="position"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500">
              <optgroup [label]="'staff-management.formRoleGroups.management' | transloco">
                <option value="Manager">{{ 'staff-management.formRoles.Manager' | transloco }}</option>
                <option value="Guest Relations Officer">{{ 'staff-management.formRoles.Guest Relations Officer' | transloco }}</option>
                <option value="Concierge (Chief Butler)">{{ 'staff-management.formRoles.Concierge (Chief Butler)' | transloco }}</option>
              </optgroup>

              <optgroup [label]="'staff-management.formRoleGroups.receptionFrontOffice' | transloco">
                <option value="Receptionist">{{ 'staff-management.formRoles.Receptionist' | transloco }}</option>
                <option value="Concierge">{{ 'staff-management.formRoles.Concierge' | transloco }}</option>
                <option value="Bellhop">{{ 'staff-management.formRoles.Bellhop' | transloco }}</option>
                <option value="Bellhop (St. Regis Butler)">{{ 'staff-management.formRoles.Bellhop (St. Regis Butler)' | transloco }}</option>
              </optgroup>

              <optgroup [label]="'staff-management.formRoleGroups.housekeepingMaintenance' | transloco">
                <option value="Housekeeping Supervisor">{{ 'staff-management.formRoles.Housekeeping Supervisor' | transloco }}</option>
                <option value="Cleaner">{{ 'staff-management.formRoles.Cleaner' | transloco }}</option>
                <option value="Maintenance">{{ 'staff-management.formRoles.Maintenance' | transloco }}</option>
              </optgroup>

              <optgroup [label]="'staff-management.formRoleGroups.serviceCulinary' | transloco">
                <option value="Waiter/Waitress">{{ 'staff-management.formRoles.Waiter/Waitress' | transloco }}</option>
                <option value="Bartender">{{ 'staff-management.formRoles.Bartender' | transloco }}</option>
                <option value="Chef">{{ 'staff-management.formRoles.Chef' | transloco }}</option>
                <option value="Chef (Palace Cuisine)">{{ 'staff-management.formRoles.Chef (Palace Cuisine)' | transloco }}</option>
                <option value="Chef (Resort Cuisine)">{{ 'staff-management.formRoles.Chef (Resort Cuisine)' | transloco }}</option>
              </optgroup>

              <optgroup [label]="'staff-management.formRoleGroups.spaWellness' | transloco">
                <option value="Spa Therapist">{{ 'staff-management.formRoles.Spa Therapist' | transloco }}</option>
                <option value="Pool Attendant">{{ 'staff-management.formRoles.Pool Attendant' | transloco }}</option>
              </optgroup>

              <optgroup [label]="'staff-management.formRoleGroups.activitiesSecurity' | transloco">
                <option value="Activities Coordinator">{{ 'staff-management.formRoles.Activities Coordinator' | transloco }}</option>
                <option value="Security">{{ 'staff-management.formRoles.Security' | transloco }}</option>
              </optgroup>
          </select>
        </div>
        <div>
           <label class="block text-sm font-medium text-gray-700">{{ 'staff-management.formLabels.defaultShift' | transloco }}</label>
          <select [(ngModel)]="updatedStaff.shift" name="shift"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500">
            <option value="Morning">{{ 'staff-management.formShifts.Morning' | transloco }}</option>
            <option value="Afternoon">{{ 'staff-management.formShifts.Afternoon' | transloco }}</option>
            <option value="Night">{{ 'staff-management.formShifts.Night' | transloco }}</option>
            <option value="Day">{{ 'staff-management.formShifts.Day' | transloco }}</option>
            <option value="Evening">{{ 'staff-management.formShifts.Evening' | transloco }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">{{ 'staff-management.formLabels.contactNumber' | transloco }}</label>
          <input type="tel" [(ngModel)]="updatedStaff.phoneNumber" name="phoneNumber"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">{{ 'staff-management.formLabels.email' | transloco }}</label>
          <input type="email" [(ngModel)]="updatedStaff.eMail" name="eMail"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
        </div>
        <div class="flex justify-end space-x-3 mt-6">
          <button type="button" (click)="showEditStaffForm = false" class="btn-secondary">{{ 'staff-management.buttons.cancel' | transloco }}</button>
          <button type="submit" class="btn-primary">{{ 'staff-management.buttons.editStaff' | transloco }}</button>
        </div>
      </form>
    </div>
  </div>
</div>

  `
})
export class StaffManagementComponent implements OnInit {
  staffMembers: Staff[] = [];
  schedules: Staff[] = [];
  currentWeekStart: Date = new Date();
  weekDates: Date[] = [];
  showAddStaffForm = false;
  showEditStaffForm = false;
  selectedHotelId: number | null = null;
  newStaffselectedHotelId: number | null = null;
  hotels: any[] = []; 
  selectedStaffId: number | null = null;

  newStaff: Partial<StaffMember> = {
    name: '',
    surname: '',
    position: '',
    shift: '',
    hotelId: null,
    phoneNumber: '',
    eMail: ''
  };

  updatedStaff: Partial<StaffMember> = {
    name: '',
    surname: '',
    position: '',
    shift: '',
    hotelId: null,
    phoneNumber: '',
    eMail: ''
  };

  constructor(
    private staffService: StaffService,
    private toastr: ToastrService,
    private hotelService: HotelService,
    private t : TranslocoService
  ) {
    this.setWeekDates();
  }

  ngOnInit() {
    this.loadStaffMembers();
    // this.loadSchedules();
    this.loadHotels();
  }

  loadStaffMembers() {
    this.staffService.getStaff().subscribe(staff => {
      
      this.staffMembers = staff;
    });
  }

  loadSchedules() {
    this.staffService.getStaff().subscribe(schedules => {
      this.schedules = schedules;
    });
  }

  loadHotels(){
    this.hotelService.getHotels().subscribe(hotels => {
      this.hotels = hotels;
    });
  }

  setWeekDates() {
    this.weekDates = [];
    const startDate = new Date(this.currentWeekStart);
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      this.weekDates.push(date);
    }
  }

  previousWeek() {
    const newStart = new Date(this.currentWeekStart);
    newStart.setDate(newStart.getDate() - 7);
    this.currentWeekStart = newStart;
    this.setWeekDates();
    // this.loadSchedules();
  }

  nextWeek() {
    const newStart = new Date(this.currentWeekStart);
    newStart.setDate(newStart.getDate() + 7);
    this.currentWeekStart = newStart;
    this.setWeekDates();
    // this.loadSchedules();
  }

  filteredStaffMembers(): any[] {
    if (!this.selectedHotelId) return this.staffMembers;
    return this.staffMembers.filter(s => s.hotelId === this.selectedHotelId);
  }

  

  openEditForm(staff: any) {
    this.selectedStaffId = staff.staffId;
    this.updatedStaff = { ...staff }; // varsa formu doldurmak için
    this.showEditStaffForm = true;
  }

  addNewStaff() {
    (this.newStaff);
    this.staffService.addStaff( this.newStaff).subscribe({
      next: res =>{
        this.showAddStaffForm = false;
        this.loadStaffMembers();
        this.toastr.success(this.t.translate('toastr.success'));
      },
      error: err => this.toastr.error(this.t.translate('toastr.error'))
    });
  }

  editStaff(){
    this.staffService.updateStaff(this.selectedStaffId, this.updatedStaff).subscribe({
      next: res =>{
        this.showEditStaffForm = false;
        this.loadStaffMembers();
        this.toastr.success(this.t.translate('toastr.success'));
        },
        error: err => this.toastr.error(this.t.translate('toastr.error'))
    });
      
  }


  deleteStaff(staff){
    this.staffService.deleteStaff(staff.staffId).subscribe({
      next: res =>{
        this.loadStaffMembers();
        this.toastr.success(this.t.translate('toastr.success'));
        },
        error: err => this.toastr.error(this.t.translate('toastr.error'))
    });
    
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private resetNewStaff() {
    this.newStaff = {
      name: '',
      position: 'housekeeping',
      shift: 'morning',
      hotelId: 1,
      phoneNumber: '',
      eMail: ''
    };
  }
}
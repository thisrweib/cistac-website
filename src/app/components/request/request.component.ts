import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestService } from '@app/services/request.service';
import { StorageService } from '@app/services/storage/storage.service';
import { TranslocoModule } from '@ngneat/transloco';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StaffService } from '@app/services/staff.service';
import { PhonePipe } from '@app/pipes/number-pipe';

@Component({
  selector: 'app-request',
  standalone: true,
  imports: [CommonModule, TranslocoModule, RouterModule, FormsModule, PhonePipe],
  template: `
   <!-- Service Request Card -->
  <div  class="mt-10">
    <ng-container *ngIf="userRole == 'customer'; else elseTemplate">
      <h1 class="text-4xl font-bold text-center text-gray-800 mb-8">
        {{ 'serviceRequest.title.customer' | transloco }}
      </h1>
    </ng-container>
    <ng-template #elseTemplate>
      <h1 class="text-4xl font-bold text-center text-gray-800 mb-8">
        {{ userRole === 'admin' 
          ? ('serviceRequest.title.customer' | transloco) 
          : ('serviceRequest.title.staff' | transloco:{ name: user.name, surname: user.surname }) }}
      </h1>
    </ng-template>
    

    <div *ngIf="serviceRequests.length > 0; else noRequests" class="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
  <!-- Service Requests -->
  <div
    [ngClass]="{
      'lg:col-span-2': userRole === 'staff',
      'lg:col-span-3': userRole !== 'staff'
    }"
    class="space-y-6"
  >
    <div *ngFor="let serviceRequest of serviceRequests let i = index" class="bg-white shadow-xl rounded-2xl overflow-hidden border">
      <div class="px-6 py-5 sm:px-8 sm:py-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 class="text-xl font-semibold text-gray-900 mb-1">
              {{ 'serviceRequest.requestId' | transloco }} {{ i +1 }}
            </h2>
            <p class="text-sm text-gray-500">{{ 'serviceRequest.roomId' | transloco }}: {{ serviceRequest.roomID }}</p>
          </div>
          <span
            [class]="getStatusBadgeClass(serviceRequest.status)"
            class="text-sm font-medium px-3 py-1 rounded-full inline-block capitalize"
          >
            {{ ('serviceRequest.status.' + (serviceRequest.status | lowercase)) | transloco }}
          </span>
        </div>

        <div class="mt-4 border-t pt-4">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p class="text-gray-700 text-base leading-relaxed flex-1">
              {{ serviceRequest.request }}
            </p>

            <div class="flex items-center gap-2" *ngIf="serviceRequest.status">
              <button
                *ngIf="serviceRequest.status === 'Pending' && userRole == 'staff'"
                (click)="updateStatus(serviceRequest, 'In Progress')"
                class="bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold px-4 py-2 rounded-lg"
              >
                {{ 'serviceRequest.button.markInProgress' | transloco }}
              </button>

              <button
                *ngIf="serviceRequest.status === 'In Progress' && userRole == 'staff'"
                (click)="updateStatus(serviceRequest, 'Completed')"
                class="bg-cyan-400 hover:bg-cyan-500 text-white text-sm font-semibold px-4 py-2 rounded-lg"
              >
                {{ 'serviceRequest.button.markCompleted' | transloco }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Staff Dashboard Sidebar -->
  <div *ngIf="userRole === 'staff' && staff" class="bg-gray-300 rounded-2xl p-6 shadow-md space-y-4 h-fit sticky top-20 font-medium">
    <h2 class="text-xl font-bold">
      {{ 'serviceRequest.staffDashboard.title' | transloco }}
    </h2>
    <div class="text-gray-700 text-sm space-y-1">
      <p><strong>{{ 'serviceRequest.staffDashboard.name' | transloco }}:</strong> {{ staff.name }} {{ staff.surname }}</p>
      <p><strong>{{ 'serviceRequest.staffDashboard.position' | transloco }}:</strong> {{ staff.position }}</p>
      <p><strong>{{ 'serviceRequest.staffDashboard.shift' | transloco }}:</strong> {{ staff.shift }}</p>
      <p><strong>{{ 'serviceRequest.staffDashboard.phone' | transloco }}:</strong> {{ staff.phoneNumber | phone }}</p>
      <p><strong>{{ 'home.contact.form.email' | transloco }}:</strong> {{ staff.eMail | phone }}</p>
    </div>
    <hr class="border-blue-200">
    <div class="text-gray-700 text-sm space-y-1">
      <p><strong>{{ 'serviceRequest.staffDashboard.hotelName' | transloco }}:</strong> {{ staff.hotel.name }}</p>
      <p><strong>{{ 'serviceRequest.staffDashboard.location' | transloco }}:</strong> {{ staff.hotel.location }}</p>
      <p><strong>{{ 'serviceRequest.staffDashboard.rating' | transloco }}:</strong> {{ staff.hotel.rating }}</p>
      <p><strong>{{ 'serviceRequest.staffDashboard.hotelPhone' | transloco }}:</strong> {{ staff.hotel.phoneNumber | phone }}</p>
    </div>
  </div>
</div>

<ng-template #noRequests>
    <div class="text-center py-16">
      <p class="text-gray-500 text-lg">
        {{ 'serviceRequest.noRequests.message' | transloco }}
      </p>
      <a *ngIf="userRole== 'customer'"
        routerLink="/my-bookings"
        class="inline-block mt-6 px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
      >
        {{ 'serviceRequest.noRequests.link' | transloco }}
      </a>
    </div>
  </ng-template>



  `
})
export class RequestComponent implements OnInit {
  serviceRequests: any[] = [];
  isLoading = true;
  serviceRequest: any = null;
  userRole = StorageService.getUserRole();
  user = StorageService.getUser();
  staff : any
  selectedStatus: string = '';
  stafflist : any[] = [];
  constructor(private requestService: RequestService, private staffService: StaffService) {}

  ngOnInit() {
    this.loadStaff();

  }


  loadRequests() {
    this.isLoading = true;
    if(this.userRole == 'customer'){
      this.requestService.getServiceRequestByUserId(StorageService.getUserId()).subscribe({
        next: (req) => {
        this.serviceRequests = req;   
        if(this.serviceRequests.length > 0) {
          this.selectedStatus = this.serviceRequests[0].status; 
        }
        this.isLoading = false;
        },
        error: (err) => {
          console.error('Service request load error:', err);
          this.serviceRequests = [];
          this.isLoading = false;
        }
      });
    }else if(this.userRole == 'staff'){
      this.staff = this.getStaffIdFromUser(this.user,this.stafflist)
      console.log(this.staff);
      
      this.requestService.getServiceRequestByStaffId(this.staff.staffId).subscribe({
        next: (req) => {
        this.serviceRequests = req;
        if(this.serviceRequests.length > 0) {
          this.selectedStatus = this.serviceRequests[0].status; 
        }
        this.isLoading = false;
        },
        error: (err) => {
          console.error('Service request load error:', err);
          this.serviceRequests = [];
          this.isLoading = false;
        }
      });
    }
    else if(this.userRole == 'admin'){
      this.requestService.getAllServiceRequests().subscribe({
        next: (req) => {
        this.serviceRequests = req;   
        if(this.serviceRequests.length > 0) {
          this.selectedStatus = this.serviceRequests[0].status; 
        }
        this.isLoading = false;
        },
        error: (err) => {
          console.error('Service request load error:', err);
          this.serviceRequests = [];
          this.isLoading = false;
        }
      });
    }
  }

  loadStaff(){
    this.staffService.getStaff().subscribe(staffs => {
      this.stafflist = staffs;
      this.loadRequests();
      
    })
  }


  getStatusBadgeClass(status: string): string {
    const baseClasses = 'px-2 py-1 text-xs font-semibold rounded-full';
    switch (status?.toLowerCase()) {
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'in progress':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  }

  getStaffIdFromUser(user: any, staffList: any[]) {
    const matchedStaff = staffList.find(staff =>
      staff.eMail === user.eMail &&
      staff.name === user.name &&
      staff.surname === user.surname
    );

    return matchedStaff ? matchedStaff : null;
  }

  updateStatus(serviceRequest: any, newStatus: string) {
    if (!newStatus || newStatus === serviceRequest.status) return;

    const updatedRequest = {
      ...serviceRequest,
      status: newStatus
    };

    this.requestService.updateServiceRequest(updatedRequest.serviceRequestID, updatedRequest)
      .subscribe({
        next: () => {
          serviceRequest.status = newStatus;
        },
        error: err => console.error('Update failed:', err)
      });
  }

}

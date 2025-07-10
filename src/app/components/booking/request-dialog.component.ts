import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Reservation, Feedback } from '../../models/user.model';
import { HotelService } from '../../services/hotel.service';
import { ToastrService } from 'ngx-toastr';
import { RequestService } from '@app/services/request.service';
import { StaffService } from '@app/services/staff.service';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-request-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslocoModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">{{ 'requestDialog.title' | transloco }}</h2>
          <button (click)="close.emit()" class="text-gray-500 hover:text-gray-700" aria-label="Close">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <form (ngSubmit)="submitRequest()" class="space-y-6">

          <!-- Comments -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ 'requestDialog.additionalComments' | transloco }}</label>
            <textarea 
              [(ngModel)]="requestData.request"
              name="comment"
              rows="4"
              class="input-field"
              placeholder="{{ 'requestDialog.commentPlaceholder' | transloco }}"></textarea>
          </div>

          <div class="flex justify-end space-x-4 pt-4">
            <button type="button" class="btn-secondary" (click)="close.emit()">
              {{ 'requestDialog.cancelButton' | transloco }}
            </button>
            <button type="submit" class="btn-primary" [disabled]="!isValid()">
              {{ 'requestDialog.submitButton' | transloco }}
            </button>
          </div>
        </form>
      </div>
    </div>

  `
})
export class RequestDialogComponent {
  @Input() reservation!: Reservation;
  @Output() close = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<void>();

  
  requestData: any = {
    request: '',
    userId: null,
    roomId: null,
    staffId: null
  };
  assignedStaff:any;
  constructor(
    private hotelService: HotelService,
    private toastr: ToastrService,
    private requestService: RequestService,
    private staffService: StaffService,
    private t : TranslocoService
  ) {

  }

  ngOnInit(): void {
   
  }

ngOnChanges(changes: SimpleChanges): void {
  (this.reservation);

  this.staffService.getStaff().subscribe(staff => {
    const filteredStaff = staff.filter(s => s.hotelId == this.reservation.hotelId);

    if (filteredStaff.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredStaff.length);
      this.assignedStaff = filteredStaff[randomIndex];
    } else {
      this.assignedStaff = null;
    }

    // requestData'yı burada oluştur
    this.requestData = {
      request: '',
      userId: this.reservation.userId,
      roomId: this.reservation.roomId,
      staffId: this.assignedStaff?.staffId || null
    };
  });
}


  isValid(): boolean {
    return this.requestData.request.length > 5 
  }

  submitRequest() {
    if (!this.isValid()) return;
      this.requestService.createServiceRequest(this.requestData).subscribe({
        next: (res) => {
          this.toastr.success(this.t.translate('toastr.success'));
          this.submitted.emit();
          this.close.emit();
        }
          ,
        error: (err) => this.toastr.error(this.t.translate('toastr.error'))
      });
      
  }
}
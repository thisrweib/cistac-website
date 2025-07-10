import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Reservation, Feedback } from '../../models/user.model';
import { HotelService } from '../../services/hotel.service';
import { ToastrService } from 'ngx-toastr';
import { ReviewService } from '@app/services/review.service';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-feedback-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslocoModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">{{ 'feedbackDialog.title' | transloco }}</h2>
          <button (click)="close.emit()" class="text-gray-500 hover:text-gray-700" aria-label="Close">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <form (ngSubmit)="submitFeedback()" class="space-y-6">
          <!-- Overall Rating -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ 'feedbackDialog.overallRating' | transloco }}</label>
            <div class="flex space-x-2">
              <button 
                *ngFor="let star of [1,2,3,4,5]" 
                type="button"
                (click)="feedbackData.rating = star"
                class="focus:outline-none"
                [attr.aria-label]="'Rate ' + star + ' stars'">
                <svg 
                  [class]="'w-8 h-8 ' + (star <= feedbackData.rating ? 'text-yellow-400' : 'text-gray-300')"
                  fill="currentColor" 
                  viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Comments -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ 'feedbackDialog.additionalComments' | transloco }}</label>
            <textarea 
              [(ngModel)]="feedbackData.comment"
              name="comment"
              rows="4"
              class="input-field"
              placeholder="{{ 'feedbackDialog.commentPlaceholder' | transloco }}"></textarea>
          </div>

          <div class="flex justify-end space-x-4 pt-4">
            <button type="button" class="btn-secondary" (click)="close.emit()">
              {{ 'feedbackDialog.cancelButton' | transloco }}
            </button>
            <button type="submit" class="btn-primary" [disabled]="!isValid()">
              {{ 'feedbackDialog.submitButton' | transloco }}
            </button>
          </div>
        </form>
      </div>
    </div>

  `
})
export class FeedbackDialogComponent {
  @Input() reservation!: Reservation;
  @Output() close = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<void>();

  
  feedbackData: any;

  constructor(
    private hotelService: HotelService,
    private toastr: ToastrService,
    private reviewService: ReviewService,
    private t : TranslocoService
  ) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    this.feedbackData = {
      rating: 0,
      comment: '',
      userId:this.reservation.userId,
      roomId:this.reservation.roomId
    };
  }

  isValid(): boolean {
    return this.feedbackData.rating > 0 
  }

  submitFeedback() {
    if (!this.isValid()) return;
      this.reviewService.addReview(this.feedbackData).subscribe({
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
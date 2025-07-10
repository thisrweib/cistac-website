import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { ToastrModule, ToastrService } from 'ngx-toastr';
// import { AuthService } from '../../services/auth.service';
import { AccountService } from '@app/services/account.service';
import { StorageService } from '@app/services/storage/storage.service';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatTabsModule,
    ToastrModule,
    TranslocoModule,
  ],
  template: `
    <!-- Register Tab -->
<div class=" min-h-[calc(100vh-7rem)] bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center px-6 py-12 rounded-3xl">
  <div class="w-full max-w-2xl  bg-white shadow-2xl rounded-2xl p-10">
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-3xl font-bold text-gray-800">{{ isLoginMode ? ('auth.login.signIn' | transloco) : ('auth.login.signUp' | transloco) }}</h2>
      <button (click)="toggleMode()" class="text-blue-600 font-medium">
         {{ isLoginMode ? ('auth.login.needAccount' | transloco) : ('auth.login.haveAccount' | transloco) }}
      </button>
    </div>

    <form [formGroup]="isLoginMode ? loginForm : registerForm"
          (ngSubmit)="isLoginMode ? onLogin() : onRegister()"
          class="space-y-6">
      
      <!-- Name & Surname (Register only) -->
      <div *ngIf="!isLoginMode" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">{{'auth.login.firstName' | transloco}}</label>
          <input id="name" type="text" formControlName="name" class="input-field" />
          <p *ngIf="registerForm.get('name')?.touched && registerForm.get('name')?.invalid" class="text-red-500 text-sm">
            {{'auth.login.firstNameRequired' | transloco}}
          </p>
        </div>
        <div>
          <label for="surname" class="block text-sm font-medium text-gray-700">{{'auth.login.lastName' | transloco}}</label>
          <input id="surname" type="text" formControlName="surname" class="input-field" />
          <p *ngIf="registerForm.get('surname')?.touched && registerForm.get('surname')?.invalid" class="text-red-500 text-sm">
            {{'auth.login.lastNameRequired' | transloco}}
          </p>
        </div>
      </div>

      <!-- Email -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">{{'auth.login.email' | transloco}}</label>
        <input id="email" type="email"
               formControlName="email"
               class="input-field" />
        <p *ngIf="emailControl?.touched && emailControl?.invalid" class="text-red-500 text-sm">
          <span *ngIf="emailControl?.errors?.['required']">{{'auth.login.emailRequired' | transloco}}</span>
          <span *ngIf="emailControl?.errors?.['email']">{{'auth.login.emailInvalid' | transloco}}</span>
        </p>
      </div>

      <!-- Phone (Register only) -->
      <div *ngIf="!isLoginMode">
        <label for="phone" class="block text-sm font-medium text-gray-700">{{'auth.login.phone' | transloco}}</label>
        <input id="phone" type="tel" formControlName="Phone_Number" class="input-field" />
        <p *ngIf="registerForm.get('Phone_Number')?.touched && registerForm.get('Phone_Number')?.invalid"
           class="text-red-500 text-sm">
          {{'auth.login.phoneRequired' | transloco}}
        </p>
        <span class="text-red-500 text-sm" *ngIf="registerForm.get('Phone_Number')?.errors?.['minlength'] || registerForm.get('Phone_Number')?.errors?.['maxlength']">{{'auth.login.phoneLength' | transloco}}</span>
      </div>

      <!-- Password -->
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">{{'auth.login.password' | transloco}}</label>
        <input id="password" type="password"
               formControlName="password"
               class="input-field" />
        <p *ngIf="passwordControl?.touched && passwordControl?.invalid" class="text-red-500 text-sm">
          <span *ngIf="passwordControl?.errors?.['required']">{{'auth.login.passwordRequired' | transloco}}</span>
          <span *ngIf="passwordControl?.errors?.['minlength']">{{'auth.login.passwordMinLength' | transloco}}</span>
        </p>
      </div>

      <!-- Submit Button -->
      <button type="submit"
              [disabled]="(isLoginMode ? loginForm.invalid : registerForm.invalid) || isLoading"
              class="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-3 rounded-lg font-medium hover:opacity-90 transition">
        <span *ngIf="isLoading">{{'auth.login.loading' | transloco}}</span>
        <span *ngIf="!isLoading">{{ isLoginMode ? ('auth.login.signIn' | transloco) : ('auth.login.createAccount' | transloco) }}</span>
      </button>
    </form>
      <div *ngIf="loginFailed" class="flex mt-10 items-center bg-red-100 border  text-red-700 px-4 py-3 rounded relative" role="alert">
        <svg class="w-6 h-6 mr-2 text-red-500" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
            viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12" y2="16"></line>
        </svg>
        <strong class="font-bold">{{'auth.login.error' | transloco}} </strong>
        <span class="block sm:inline ml-2">{{'auth.login.errorMessage' | transloco}}</span>
      </div>


  </div>
</div>

  `
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  isLoading = false;
  isLoginMode = true;
  loginFailed = false;
  constructor(
    private fb: FormBuilder,
    // private auth: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private accountService: AccountService,
    private storageService: StorageService,
    private transloco: TranslocoService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      Phone_Number: ['', [Validators.required,Validators.minLength(11),Validators.maxLength(11)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      // role: ['user', Validators.required]
    });
  }

  ngOnInit() {
    // if (this.auth.isAuthenticated()) {
    //   this.router.navigate(['/']);
    // }
  }
    toggleMode() {
    this  .isLoginMode = !this.isLoginMode;
    }

    get emailControl() {
      return  this.isLoginMode ? this.loginForm.get('email') : this.registerForm.get('email');
    }

    get passwordControl() {
      return this.isLoginMode ? this.loginForm.get('password') : this.registerForm.get('password');
    }


  onLogin() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.accountService.login(this.loginForm).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.toastr.success(
            this.transloco.translate('toastr.login.success'),
            this.transloco.translate('toastr.login.welcome')
          );
          this.router.navigate([response.user.role === 'admin' ? '/admin' : '/']);
          StorageService.saveToken(response.token);
          StorageService.saveUser(response.user);
          this.loginFailed = false;
        },
        error: (err) => {
          this.isLoading = false;
          this.loginFailed = true;
          this.toastr.error(
            this.transloco.translate('toastr.login.error'),
            this.transloco.translate('toastr.login.errorTitle')
          );
        }
      });
    }
  }

  onRegister() {
    if (this.registerForm.invalid) return;

    const formData = {
      ...this.registerForm.value,
      Phone_Number: '9' + this.registerForm.value.Phone_Number
    };

    this.accountService.register(formData).subscribe({
      next: (res) => {
        this.isLoginMode = !this.isLoginMode;
        this.isLoading=false
       this.toastr.success(
          this.transloco.translate('toastr.register.success')
        );
      },
      error: (err) => {
       this.toastr.error(
          this.transloco.translate('toastr.register.error'),
          this.transloco.translate('toastr.register.errorTitle')
        );
      }
    });
    this.isLoading= true
  }
}
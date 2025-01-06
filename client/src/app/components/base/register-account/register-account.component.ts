import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { PagesService } from '../../../services/pages.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';
import { MessagesService } from '../../../services/messages.service';

@Component({
  selector: 'app-register-account',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    RouterModule
  ],
  templateUrl: './register-account.component.html',
  styleUrl: './register-account.component.css'
})
export class RegisterAccountComponent implements OnInit {
  registrationForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    public loginService: LoginService,
    private route: ActivatedRoute,
    private router: Router,
    private messagesService: MessagesService
  ) {
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (this.loginService.isAuthenticated) {
        this.router.navigate(['/']);
      }
    });
  }

  passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      g.get('confirmPassword')?.setErrors({ 'passwordMismatch': true });
    } else {
      g.get('confirmPassword')?.setErrors(null);
    }
    return null;
  }

  onSubmit() {
    if (!this.registrationForm.valid) {
      return;
    }
    this.isLoading = true;

    const account = {
      id: 0,
      userName: this.registrationForm.get("userName")!.value,
      userEmail: this.registrationForm.get("email")!.value,
      firstName: this.registrationForm.get("firstName")!.value,
      lastName: this.registrationForm.get("lastName")!.value,
      settings: this.registrationForm.get("password")!.value,
      pages: []
    }

    this.loginService.register(account)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: () => {
            this.router.navigate(['/login']);
        },
        error: (error) => {
          if (error.status === 401) {
            this.messagesService.showError('Invalid email or password');
          } else {
            this.messagesService.showError('Unknowm error. Please try again later.');
          }
        }
      });




  }
}
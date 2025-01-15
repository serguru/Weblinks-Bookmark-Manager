import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CommonModule, KeyValue } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { catchError, finalize, of, throwError } from 'rxjs';
import { LoginService } from '../../../services/login.service';
import { PagesService } from '../../../services/pages.service';
import { MessagesService } from '../../../services/messages.service';
import { ValidationErrorsComponent } from '../../base/validation-errors/validation-errors.component';
import { environment } from '../../../../environments/environment';
//import { environment } from '../environments/environment';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    RouterModule,
    ValidationErrorsComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    public loginService: LoginService,
    private route: ActivatedRoute,
    private router: Router,
    private pagesService: PagesService,
    private messagesService: MessagesService,


  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (environment.production) {
      return;
    }
    if (event.ctrlKey && event.shiftKey && event.key === 'L') {
      event.preventDefault(); // Prevent default browser behavior
      this.loginForm.get("email")?.setValue('john.doe@gmail.com');
      this.loginForm.get("password")?.setValue('JohnDoe');
    }
  }

  emailMessages: KeyValue<string, string>[] = [
    {
      key: "required",
      value: "Email is required"
    },
    {
      key: "email",
      value: "Please enter a valid email address"
    },
  ]

  passwordMessages: KeyValue<string, string>[] = [
    {
      key: "required",
      value: "Password is required"
    },
  ]


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (this.loginService.isAuthenticated) {
        this.router.navigate(['/']);
      }
    });
    
    // this.pagesService.checkAlive().subscribe(result => {
    //   const a = result;
    // })
  }

  onSubmit(): void {
    if (!this.loginForm.valid) {
      return;
    }
    this.isLoading = true;
    this.loginService.login(this.loginForm.get("email")!.value, this.loginForm.get("password")!.value)
      .pipe(
        catchError(error => {
          if (error.status === 401) {
            this.messagesService.showError('Invalid email or password');
            return of();
          };
          return throwError(() => error);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        () => {
          this.pagesService.getAccount()
            .subscribe(x => {
              this.router.navigate(['/']);
            });
        }
      );
  }
}
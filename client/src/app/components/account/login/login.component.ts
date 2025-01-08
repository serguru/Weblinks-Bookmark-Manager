import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CommonModule, KeyValue } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';
import { LoginService } from '../../../services/login.service';
import { PagesService } from '../../../services/pages.service';
import { MessagesService } from '../../../services/messages.service';
import { ValidationErrorsComponent } from '../../base/validation-errors/validation-errors.component';


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
      password: ['',[Validators.required]]
    });
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
  }

  onSubmit(): void {
    if (!this.loginForm.valid) {
      return;
    }
    this.isLoading = true;
    this.loginService.login(this.loginForm.get("email")!.value, this.loginForm.get("password")!.value)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: () => {
          this.pagesService.getAccount()
            .subscribe(x => {
              this.router.navigate(['/']);
            });

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
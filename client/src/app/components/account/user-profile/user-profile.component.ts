import { Component, OnInit } from '@angular/core';
import { CommonModule, KeyValue } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
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
import { MessagesService } from '../../../services/messages.service';
import { UpdateAccountComponent } from "./update-account/update-account.component";

@Component({
  selector: 'app-user-profile',
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
    RouterModule,
    UpdateAccountComponent
],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {

  constructor(
    private fb: FormBuilder,
    public loginService: LoginService,
    public pagesService: PagesService,
    private route: ActivatedRoute,
    private router: Router,
    private messagesService: MessagesService
  ) {
  }
}
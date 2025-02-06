import { Component, OnInit, HostListener, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
import { environment } from '../../../../environments/environment';
import { UserMessageModel } from '../../../models/UserMessageModel';

@Component({
  selector: 'app-contact-us',
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
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent implements OnInit, AfterViewInit {
  form: FormGroup;
  @ViewChild('focusInput', { static: false }) focusInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    public loginService: LoginService,
    private route: ActivatedRoute,
    private router: Router,
    private pagesService: PagesService,
    private messagesService: MessagesService,


  ) {
    this.form = this.fb.group({
      asubject: ['', [Validators.required]],
      amessage: ['', [Validators.required]]
    });
  }

  asubjectMessages: KeyValue<string, string>[] = [
    {
      key: "required",
      value: "Subject is required"
    },
  ]

  amessageMessages: KeyValue<string, string>[] = [
    {
      key: "required",
      value: "Message is required"
    },
  ]

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    if (!this.focusInput) {
      return;
    }
    setTimeout(() => {
      this.focusInput.nativeElement.focus();
    })
  }


  onSubmit(): void {
    if (!this.form.valid) {
      return;
    }

    const mess: UserMessageModel = {
      id: 0,
      asubject: this.form.get("asubject")!.value,
      amessage: this.form.get("amessage")!.value
    }

    this.loginService.sendUserMessage(mess)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(() => {
        this.messagesService.showSuccess('Message sent');
        this.router.navigate(["/page"]);
      });
  }


}
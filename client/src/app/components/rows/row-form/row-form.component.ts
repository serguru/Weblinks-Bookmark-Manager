import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { concatMap, finalize, of } from 'rxjs';
import { PagesService } from '../../../services/pages.service';
import { PAGE } from '../../../common/constants';
import { PageModel } from '../../../models/PageModel';
import { LrowModel } from '../../../models/LrowModel';
import { ActivatedRoute } from '@angular/router';
import { MessagesService } from '../../../services/messages.service';

@Component({
  selector: 'app-row-form',
  imports: [
    FormsModule,
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './row-form.component.html',
  styleUrl: './row-form.component.css'
})
export class RowFormComponent implements OnInit , AfterViewInit {
  form: FormGroup;

  pageModel: PageModel | null = null;
  rowModel: LrowModel | null = null;

  @ViewChild('focusInput', { static: false }) focusInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    public loginService: LoginService,
    private router: Router,
    private pagesService: PagesService,
    private route: ActivatedRoute,
    private messagesService: MessagesService,
  ) {
    this.form = this.fb.group({
      caption: ['']
    });
  }

  ngAfterViewInit() {
    if (!this.focusInput) { 
      return;
    }
    setTimeout(() => {
      this.focusInput.nativeElement.focus();
    })
  }

  ngOnInit(): void {
    this.pagesService.account$
      .pipe(
        concatMap(account => {
          if (account) {
            return this.route.params;
          }
          return of();
        })
      )
      .subscribe(params => {
        if (!params) {
          return;
        }
        
        // add row
        const pageId = params['pageId'];
        if (pageId) {
          const p = this.pagesService.getPageById(+pageId);
          if (!p) {
            this.router.navigate(['/not-found']);
            throw new Error('Page not found');
          }

          if (p.isReadOnly) {
            this.messagesService.showPageReadOnly(p);
            this.router.navigate(['/page/'+p.pagePath]);
            return;
          }
  
          this.pageModel = p;
          return;
        }

        // update row
        const rowId = params['rowId'];
        if (!rowId) {
          return;
        }
        const r = this.pagesService.getRowById(+rowId);
        if (!r) {
          this.router.navigate(['/not-found']);
          throw new Error('Row not found');
        }
        this.rowModel = r;

        const p = this.pagesService.getPageById(r!.pageId)!;

        if (p.isReadOnly) {
          this.messagesService.showPageReadOnly(p);
          this.router.navigate(['/page/'+p.pagePath]);
          return;
        }

        this.pageModel = p;
        this.form.get('caption')!.setValue(this.rowModel.caption);
      })
  }

  get formTitle(): string {
    return this.rowModel ? 'Update Row' : 'Add Row';
  }

  onSubmit(): void {
    if (!this.form.valid) {
      return;
    }
    const caption = this.form.get("caption")!.value;
    const id = this.rowModel?.id || 0;
    this.pagesService.addOrUpdateRow(this.pageModel!, id, caption)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(
        () => {
          this.router.navigate(['/page/'+this.pageModel!.pagePath]);
        }
      );
  }
}
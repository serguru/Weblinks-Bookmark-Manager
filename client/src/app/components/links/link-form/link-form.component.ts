import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
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
import { LrowModel } from '../../../models/LrowModel';
import { ActivatedRoute } from '@angular/router';
import { LcolumnModel } from '../../../models/LcolumnModel';
import { LinkModel } from '../../../models/LinkModel';
import { MessagesService } from '../../../services/messages.service';

@Component({
  selector: 'app-link-form',
  imports: [
    FormsModule,
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './link-form.component.html',
  styleUrl: './link-form.component.css'
})
export class LinkFormComponent implements OnInit, AfterViewInit {
  form: FormGroup;

  columnModel!: LcolumnModel;
  linkModel: LinkModel | null = null;

  constructor(
    private fb: FormBuilder,
    public loginService: LoginService,
    private router: Router,
    private pagesService: PagesService,
    private route: ActivatedRoute,
    private messagesService: MessagesService
  ) {
    this.form = this.fb.group({
      aUrl: ['', [Validators.required]],
      caption: ['', [
        Validators.required,
        Validators.maxLength(50),
      ]],
    });
  }

  @ViewChild('highlight') myInput!: ElementRef;

  ngAfterViewInit() {
    setTimeout(() => {
      this.myInput.nativeElement.focus();
      this.myInput.nativeElement.select();

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
        // row
        const rowId = params['rowId'];
        if (!rowId) {
          this.router.navigate(['not-found']);
          throw new Error('Row Id is required');
        }
        const r = this.pagesService.getRowById(+rowId);
        if (!r) {
          this.router.navigate(['not-found']);
          throw new Error('Active Page Row is required');
        }

        const p = this.pagesService.getPageByRowId(+rowId);
        if (!p) {
          this.router.navigate(['/not-found']);
          throw new Error('Page not found');
        }

        if (p.readOnly) {
          this.messagesService.showPageReadOnly(p);
          this.router.navigate(['/page/' + p.pagePath]);
          return;
        }

        // column
        const columnId = params['columnId'];
        if (!columnId) {
          this.router.navigate(['not-found']);
          throw new Error('Column Id is required');
        }
        const c = r.lcolumns?.find(x => x.id === +columnId);
        if (!c) {
          this.router.navigate(['not-found']);
          throw new Error('Column is required');
        }
        this.columnModel = c;
        // link
        const linkId = params['linkId'];
        if (!linkId) {
          this.form.get('aUrl')!.setValue("https://");
          return;
        }
        const l = c.links?.find(x => x.id === +linkId);
        if (!l) {
          this.router.navigate(['not-found']);
          throw new Error('Link is required');
        }
        this.linkModel = l;
        this.form.get('aUrl')!.setValue(l.aUrl);
        this.form.get('caption')!.setValue(l.caption);
      })
  }

  get formTitle(): string {
    return this.linkModel ? 'Update Link' : 'Add Link';
  }

  onSubmit(): void {
    if (!this.form.valid) {
      return;
    }
    const aUrl = this.form.get("aUrl")!.value;
    const caption = this.form.get("caption")!.value;
    const id = this.linkModel?.id || 0;
    this.pagesService.addOrUpdateLink(this.columnModel, id, aUrl, caption)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(
        () => {
          this.router.navigate(['/page']);
        }
      );
  }
}

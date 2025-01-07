import { Component, OnInit } from '@angular/core';
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
import { finalize } from 'rxjs';
import { PagesService } from '../../../services/pages.service';
import { LrowModel } from '../../../models/LrowModel';
import { ActivatedRoute } from '@angular/router';
import { LcolumnModel } from '../../../models/LcolumnModel';
import { LinkModel } from '../../../models/LinkModel';

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
export class LinkFormComponent implements OnInit {
  form: FormGroup;
  isLoading = false;

  columnModel!: LcolumnModel;
  linkModel: LinkModel | null = null;

  constructor(
    private fb: FormBuilder,
    public loginService: LoginService,
    private router: Router,
    private pagesService: PagesService,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      aUrl: ['', [Validators.required]],
      caption: ['', [
        Validators.required,
        Validators.maxLength(50),
      ]],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      // row
      const rowId = params['rowId'];
      if (!rowId) {
        this.router.navigate(['not-found']);
        throw new Error('Row Id is required');
      }
      const r = this.pagesService.getActivePageRow(+rowId);
      if (!r) {
        this.router.navigate(['not-found']);
        throw new Error('Active Page Row is required');
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
    });
  }

  get formTitle(): string {
    return this.linkModel ? 'Update Link' : 'Add Link';
  }

  onSubmit(): void {
    if (!this.form.valid) {
      return;
    }
    this.isLoading = true;
    const aUrl = this.form.get("aUrl")!.value;
    const caption = this.form.get("caption")!.value;
    const id = this.linkModel?.id || 0;
    this.pagesService.addOrUpdateLink(this.columnModel, id, aUrl, caption)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        () => {
          this.router.navigate(['/page']);
        }
      );
  }
}
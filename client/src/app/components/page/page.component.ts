import { Component, Input } from '@angular/core';
import { PageModel } from '../../models/PageModel';
import { PageMode } from '../../enums';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from "../not-found/not-found.component";
import { RowComponent } from '../row/row.component';

@Component({
  selector: 'app-page',
  imports: [
    CommonModule,
    NotFoundComponent,
    RowComponent
],
  templateUrl: './page.component.html',
  styleUrl: './page.component.css'
})
export class PageComponent {
  @Input() page: PageModel | null = null;
  @Input() pageMode: PageMode | null = null;
}

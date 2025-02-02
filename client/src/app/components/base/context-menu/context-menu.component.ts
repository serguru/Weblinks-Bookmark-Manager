import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { CdkMenu, CdkMenuItem } from '@angular/cdk/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PageModel } from '../../../models/PageModel';

@Component({
  selector: 'app-context-menu',
  imports: [
    CommonModule,
    MatMenuModule,
    MatButtonModule,
    RouterModule,
    CdkMenu,
    CdkMenuItem,
    MatIconModule,
    MatCheckboxModule
  ],
  templateUrl: './context-menu.component.html',
  styleUrl: './context-menu.component.css'
})
export class ContextMenuComponent {
  @Input() title!: string;
  @Input() addPath!: string;
  @Input() updatePath!: string;
  @Input() delete!: Function;

  @Input() addDisabled: boolean = false;
  @Input() updateDisabled: boolean = false;
  @Input() deleteDisabled: boolean = false;
  @Input() pageReadOnly: Function | null = null;
  @Input() page: PageModel | null = null;
}

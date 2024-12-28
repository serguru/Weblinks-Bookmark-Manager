import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LcolumnModel } from '../../models/LcolumnModel';
import { LinkComponent } from '../link/link.component';

@Component({
  selector: 'app-column',
  imports: [CommonModule, LinkComponent],
  templateUrl: './column.component.html',
  styleUrl: './column.component.css'
})
export class ColumnComponent {
  @Input() column: LcolumnModel | null = null;

}

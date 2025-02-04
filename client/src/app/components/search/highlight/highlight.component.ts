import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { HighlightPipe } from '../../../pipes/highlight.pipe';
import { VwAccountsDatumModel } from '../../../models/VwAccountsDatumModel';

@Component({
  selector: 'app-highlight',
  templateUrl: './highlight.component.html',
  styleUrl: './highlight.component.css',
  imports: [
    CommonModule,
    HighlightPipe
  ]
})
export class HighlightComponent implements ICellRendererAngularComp {
  params: any;

  get searchText() {
    return this.params?.searchText;
  }

  get value() {
    return this.params?.value || '';
  }

  get data(): VwAccountsDatumModel {
    return this.params?.data;
  }

  get isLink() {
    const field = this.params?.colDef?.field;
    const result = ["linkCaption", "linkAurl"].find(x => x === field);
    return !!result;  
  }

  get url() {
    return this.data?.linkAurl;
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams): boolean {
    this.params = params;
    return true;
  }

}
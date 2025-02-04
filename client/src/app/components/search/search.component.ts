import { AgGridAngular } from 'ag-grid-angular';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';
import { PagesService } from '../../services/pages.service';
import { VwAccountsDatumModel } from '../../models/VwAccountsDatumModel';
import { HighlightComponent } from './highlight/highlight.component';
import { of } from 'rxjs';

import {
  AllCommunityModule,
  ClientSideRowModelModule,
  ColDef,
  ColumnAutoSizeModule,
  GridReadyEvent,
  ModuleRegistry,
} from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule, ColumnAutoSizeModule, ClientSideRowModelModule]);

@Component({
  selector: 'app-search',
  imports: [
    AgGridAngular,
    FormsModule,
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {

  constructor(
    public pagesService: PagesService
  ) {
  }

  gridApi: any;
  gridHeight!: number;
  @ViewChild('agGrid') agGrid!: AgGridAngular;
  @ViewChild('agGrid', { read: ElementRef }) gridElementRef!: ElementRef;

  private resizeListener!: () => void;

  searchResult: VwAccountsDatumModel[] = [];

  searchControl = new FormControl();

  get searchText() {
    return this.searchControl.value;
  }

  get rowsCount() {
    return this.searchResult.length;
  }

  get rowString() {
    return this.rowsCount === 1 ? "row" : "rows";
  }

  get searchInfo() {
    if (!this.searchText) {
      return `No serch text provided`
    }
    return `Search for "${this.searchText}" result: ${this.rowsCount} ${this.rowString} found`
  }

  ngOnInit(): void {
    this.calculateGridHeight();

    this.resizeListener = this.calculateGridHeight.bind(this);
    window.addEventListener('resize', this.resizeListener);

    this.searchControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((searchTerm: any) => this.searchText ?
          this.pagesService.getVwAccountsDatum(searchTerm) : of([]))
      )
      .subscribe(
        data => {
          this.searchResult = data || [];
        });
  }

  ngOnDestroy() {
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  colDefs: ColDef<VwAccountsDatumModel>[] = [
    {
      field: "linkCaption",
      headerName: "Link Label",
    },
    {
      field: "linkAurl",
      headerName: "URL",
    },
    {
      field: "columnCaption",
      headerName: "Column Caption",
    },
    {
      field: "pageCaption",
      headerName: "Page Caption",
    },
    {
      field: "pagePath",
      headerName: "Page Path",
    },
    {
      field: "pageDescription",
      headerName: "Page Description",
      tooltipField: "pageDescription"
    },
  ];

  defaultColDef: ColDef = {
    flex: 1,
    cellRenderer: HighlightComponent,
    cellRendererParams: (params: any) => ({
      searchText: this.searchText
    }),
    cellStyle: { fontSize: 'large' }
  };

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

    this.gridApi.addEventListener('modelUpdated', () => {
      this.gridApi.sizeColumnsToFit();
    });

    this.calculateGridHeight();
  }

  calculateGridHeight() {
    if (this.gridElementRef) {
      const gridElement = this.gridElementRef.nativeElement;
      const offsetTop = this.getOffsetTop(gridElement);
      this.gridHeight = window.innerHeight - offsetTop - 10;
    }
  }

  getOffsetTop(element: HTMLElement): number {
    return element ? element.getBoundingClientRect().top : 0;
  }


}





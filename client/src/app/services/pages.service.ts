import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, filter, find, Observable, of, tap, throwError } from 'rxjs';
import { PageModel } from '../models/PageModel';
import { NavigationEnd, Router } from '@angular/router';
import { LOGIN, PAGE } from '../common/constants';
import { LoginService } from './login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LrowModel } from '../models/LrowModel';
import { LcolumnModel } from '../models/LcolumnModel';
import { LinkModel } from '../models/LinkModel';
import { MessagesService } from './messages.service';
import { AccountModel } from '../models/AccountModel';


@Injectable({
  providedIn: 'root'
})
export class PagesService {
  private apiUrl = `${environment.apiUrl}/pages`;

  constructor(
    private http: HttpClient, 
    private router: Router,
    public loginService: LoginService, 
    private snackBar: MatSnackBar,
    public messagesService: MessagesService, 

  ) {

  }

  getAccount(): Observable<AccountModel> {
    return this.http.get<AccountModel>(this.apiUrl).pipe(
      tap(account => {
        this.updatePages(account.pages || []);
      })
    );
  }



  findPage(pagePath: string): PageModel | null {
    return this.pages?.find(p => p.pagePath.toLowerCase() === pagePath.toLowerCase()) || null;
  }

  private _activePage: PageModel | null = null;
  get activePage(): PageModel | null {
    return this._activePage;
  }
  set activePage(value: PageModel | null) {
    this._activePage = value;
  }

  private pagesSubject = new BehaviorSubject<any>(null);
  public pages$ = this.pagesSubject.asObservable();
  updatePages(pages: PageModel[]) {
    this.pagesSubject.next(pages);
  }
  get pages(): PageModel[] {
    return this.pagesSubject.getValue();
  }

  getPages(): Observable<PageModel[]> {
    return this.http.get<PageModel[]>(this.apiUrl + '/all').pipe(
      tap((pages) => {
        this.updatePages(pages);
      })
    );
  }

  clearPages(): void {
    this.updatePages([]);
  }

  addOrUpdatePage(id: number, pagePath: string, caption: string): Observable<PageModel> {
    if (!this.loginService.isAuthenticated) {
      throw new Error('Unauthorized');
    }

    return this.http.post(this.apiUrl + '/add-update-page', { id: id, pagePath: pagePath, caption: caption })
      .pipe(
        tap((response: any) => {
          const pages = this.pages || [];
          if (id === 0) {
            pages.push(response);
          } else {
            const index = pages.findIndex((p: PageModel) => p.id === id);
            if (index === -1) {
              throw new Error('Page not found');
            }
            pages[index].pagePath = response.pagePath;
            pages[index].caption = response.caption;
          }
          this.updatePages(pages);
          this.messagesService.showSuccess(`Page ${id === 0 ? 'added' : 'updated'}`);
        }),
      );
  }

  deletePage(pageId: number): Observable<any> {
    if (!this.loginService.isAuthenticated) {
      throw new Error('Unauthorized');
    }
    if (!pageId) {
      throw new Error('No page id provided');
    }
    return this.http.delete(this.apiUrl + '/delete-page/' + pageId)
      .pipe(
        tap(() => {
          const pages = this.pages || [];
          const index = pages.findIndex((p: PageModel) => p.id === pageId);
          if (index !== -1) {
            pages.splice(index, 1);
            this.messagesService.showSuccess(`Page deleted`);
          }
        }),
      );
  }

  addOrUpdateRow(page: PageModel, id: number, caption: string): Observable<LrowModel> {
    if (!this.loginService.isAuthenticated) {
      throw new Error('Unauthorized');
    }

    return this.http.post(this.apiUrl + '/add-update-row', { id: id, pageId: page.id, caption: caption })
      .pipe(
        tap((response: any) => {
          if (!page.lrows) {
            page.lrows = [];
          }
          if (id === 0) {
            page.lrows.push(response);
          } else {
            const index = page.lrows.findIndex((x: LrowModel) => x.id === response.id);
            if (index === -1) {
              throw new Error('Row not found');
            }
            page.lrows[index].pageId = response.pageId;
            page.lrows[index].caption = response.caption;
          }
          this.messagesService.showSuccess(`Row ${id === 0 ? 'added' : 'updated'}`);
        }),
      );
  }

  deleteRow(row: LrowModel): Observable<any> {
    if (!this.loginService.isAuthenticated) {
      throw new Error('Unauthorized');
    }
    return this.http.delete(this.apiUrl + '/delete-row/' + row.id)
      .pipe(
        tap(() => {
          const page = this.getPageById(row.pageId);
          if (!page) {
            throw new Error('Page not found');
          }
          const index = page.lrows!.findIndex((p: LrowModel) => p.id === row.id);
          if (index === -1) {
            throw new Error('Row not found');
          }
          page.lrows!.splice(index, 1);
          this.messagesService.showSuccess(`Row deleted`);
        }),
      );
  }

  getPageById(pageId: number) {
    const pages = this.pages || [];
    return pages.find((p: PageModel) => p.id === pageId);
  }

  getActivePageRow(rowId: number) {
    if (!this.activePage) {
      return null;
    }
    rowId = +rowId;
    return this.activePage.lrows?.find((r: LrowModel) => r.id === rowId) || null;
  }

  addOrUpdateColumn(row: LrowModel, id: number, caption: string): Observable<LcolumnModel> {
    if (!this.loginService.isAuthenticated) {
      throw new Error('Unauthorized');
    }
    
    return this.http.post(this.apiUrl + '/add-update-column', { id: id, rowId: row.id, caption: caption })
      .pipe(
        tap((response: any) => {
          if (!row.lcolumns) {
            row.lcolumns = [];
          }
          if (id === 0) {
            row.lcolumns.push(response);
          } else {
            const index = row.lcolumns.findIndex((x: LcolumnModel) => x.id === response.id);
            if (index === -1) {
              throw new Error('Column not found');
            }
            row.lcolumns[index].rowId = response.rowId;
            row.lcolumns[index].caption = response.caption;
          }
          this.messagesService.showSuccess(`Column ${id === 0 ? 'added' : 'updated'}`);
        }),
      );
  }

  deleteColumn(row: LrowModel, column: LcolumnModel): Observable<any> {
    if (!this.loginService.isAuthenticated) {
      throw new Error('Unauthorized');
    }
    return this.http.delete(this.apiUrl + '/delete-column/' + column.id)
      .pipe(
        tap(() => {
          const index = row.lcolumns!.findIndex((p: LcolumnModel) => p.id === column.id);
          if (index === -1) {
            throw new Error('Column not found');
          }
          row.lcolumns!.splice(index, 1);
          this.messagesService.showSuccess(`Column deleted`);
        }),
      );
  }

  addOrUpdateLink(column: LcolumnModel, id: number, aUrl: string, caption: string): Observable<LinkModel> {
    if (!this.loginService.isAuthenticated) {
      throw new Error('Unauthorized');
    }
    
    return this.http.post(this.apiUrl + '/add-update-link', { id: id, columnId: column.id, aUrl: aUrl, caption: caption })
      .pipe(
        tap((response: any) => {
          if (!column.links) {
            column.links = [];
          }
          if (id === 0) {
            column.links.push(response);
          } else {
            const index = column.links.findIndex((x: LinkModel) => x.id === response.id);
            if (index === -1) {
              throw new Error('Link not found');
            }
            column.links[index].columnId = response.columnId;
            column.links[index].aUrl = response.aUrl;
            column.links[index].caption = response.caption;
          }
          this.messagesService.showSuccess(`Link ${id === 0 ? 'added' : 'updated'}`);
        }),
      );
  }

  deleteLink(column: LcolumnModel, link: LinkModel): Observable<any> {
    if (!this.loginService.isAuthenticated) {
      throw new Error('Unauthorized');
    }
    return this.http.delete(this.apiUrl + '/delete-link/' + link.id)
      .pipe(
        tap(() => {
          const index = column.links!.findIndex((p: LinkModel) => p.id === link.id);
          if (index === -1) {
            throw new Error('Link not found');
          }
          column.links!.splice(index, 1);
          this.messagesService.showSuccess(`Link deleted`);
        }),
      );
  }
}

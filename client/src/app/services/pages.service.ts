import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, filter, find, Observable, of, tap, throwError } from 'rxjs';
import { PageModel } from '../models/PageModel';
import { NavigationEnd, Router } from '@angular/router';
import { LOGIN, PAGE } from '../common/constants';
import { LoginService } from './login.service';
import { isPageRoute, isPage_Route } from '../common/utils';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LrowModel } from '../models/LrowModel';
import { LcolumnModel } from '../models/LcolumnModel';


@Injectable({
  providedIn: 'root'
})
export class PagesService {
  private apiUrl = `${environment.apiUrl}/pages`;
  public activeRoute: string | null = null;

  constructor(private http: HttpClient, private router: Router,
    public loginService: LoginService, private snackBar: MatSnackBar) {

    this.subscribeToNavigationEnd();
    // if (!this.loginService.isAuthenticated) {
    //   this.subscribeToNavigationEnd();
    //   return;
    // }
    this.getPages().subscribe(() => {
      this.router.navigate(["/"]);
    });
  }


  get isPageRoute(): boolean {
    return isPageRoute(this.activeRoute?.toLowerCase() || null);
  }

  findPage(pagePath: string): PageModel | null {
    return this.pages?.find(p => p.pagePath.toLowerCase() === pagePath.toLowerCase()) || null;
  }

  // get activePage(): PageModel | null {
  //   if (!this.pages || this.pages.length === 0) {
  //     return null;
  //   }

  //   if (!this.getParam(PAGE, this.activeRoute)) {
  //     return this.pages[0];
  //   }

  //   return this.pages?.find(p => p.pagePath.toLowerCase() === this.getParam(PAGE, this.activeRoute)) || null;
  // }
  private _activePage: PageModel | null = null;

  get activePage(): PageModel | null {
    return this._activePage;
  }

  subscribeToNavigationEnd() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const r = this.router.url;
      const ar = r?.toLowerCase();
      if (ar === LOGIN && this.loginService.isAuthenticated) {
        this.router.navigate(['/']);
        return;
      }
      if (ar?.startsWith("/update-page/")) {
        const path = this.getParam("/update-page/", ar);
        if (!this.findPage(path)) {
          this.router.navigate(['/not-found']);
          return;
        }
        this.activeRoute = r;
        return;
      }
      if (ar?.startsWith("/update-page")) {
        const ap = this.activePage;
        if (!ap) {
          this.router.navigate(['/not-found']);
          return;
        }
        this.router.navigate(['/update-page/' + ap.pagePath]);
        return;
      }
      const ap = this.activePage;
      if (ar?.startsWith("/add-row")) {
        if (!ap) {
          this.router.navigate(['/not-found']);
          return;
        }
        this.activeRoute = r;
        return;
      }
      if (ar?.startsWith("/update-row")) {
        if (!ap) {
          this.router.navigate(['/not-found']);
          return;
        }
        this.activeRoute = r;
        return;
      }
      if (!isPageRoute(ar) && !isPage_Route(ar)) {
        this.activeRoute = r;
        return;
      }
      if (isPage_Route(ar)) {
        if (ap) {
          this.router.navigate([PAGE + ap.pagePath]);
        } else if (this.pages?.length > 0) {
          this.router.navigate([PAGE + this.pages[0].pagePath]);
        }
        return;
      }
      const path = this.getParam(PAGE, ar);
      const page = this.findPage(path);
      if (!page) {
        this._activePage = null;
        this.router.navigate(['/not-found']);
        return;
      }
      this.activeRoute = r;
      this._activePage = page;
    });
  }


  getParam(root: string, route: string | null): string {
    const s = route?.toLowerCase() || '';
    return s.startsWith(root) ? s.substring(root.length) : '';
  }

  private pagesSubject = new BehaviorSubject<any>(null);
  public pages$ = this.pagesSubject.asObservable();
  updatePages(pages: PageModel[]) {
    this.pagesSubject.next(pages);
    if (!this.activePage) {
      this._activePage = null;
      return;
    }
    const page = this.getPageById(this.activePage.id);
    this._activePage = page || null;
  }
  get pages(): PageModel[] {
    return this.pagesSubject.getValue();
  }

  getPages(): Observable<PageModel[]> {
    return this.http.get<PageModel[]>(this.apiUrl).pipe(
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
          this.showSuccess(`Page ${id === 0 ? 'added' : 'updated'}`);
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
            this.showSuccess(`Page deleted`);
          }
        }),
      );
  }

  showError(error: string): void {
    this.snackBar.open(error, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  showSuccess(error: string): void {
    this.snackBar.open(error, 'Close', {
      duration: 5000,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
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
          this.showSuccess(`Row ${id === 0 ? 'added' : 'updated'}`);
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
          this.showSuccess(`Row deleted`);
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
          this.showSuccess(`Column ${id === 0 ? 'added' : 'updated'}`);
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
          this.showSuccess(`Column deleted`);
        }),
      );
  }



}

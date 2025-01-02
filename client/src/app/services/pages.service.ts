import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, filter, find, Observable, tap, throwError } from 'rxjs';
import { PageModel } from '../models/PageModel';
import { NavigationEnd, Router } from '@angular/router';
import { LOGIN, PAGE } from '../common/constants';
import { LoginService } from './login.service';
import { isPageRoute, isPage_Route } from '../common/utils';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root'
})
export class PagesService {
  private apiUrl = `${environment.apiUrl}/pages`;
  private activeRoute: string | null = null;

  constructor(private http: HttpClient, private router: Router,
    public loginService: LoginService, private snackBar: MatSnackBar) {
    if (!this.loginService.isAuthenticated) {
      this.subscribeToNavigationEnd();
      return;
    }
    this.getPages().subscribe(() => {
      this.subscribeToNavigationEnd();
    });
  }


  get isPageRoute(): boolean {
    return isPageRoute(this.activeRoute?.toLowerCase() || null);
  }

  findPage(pagePath: string): PageModel | null {
    return this.pages?.find(p => p.pagePath.toLowerCase() === pagePath.toLowerCase()) || null;
  }


  subscribeToNavigationEnd() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.activeRoute = this.router.url;
      const ar = this.activeRoute?.toLowerCase();
      if (ar === LOGIN && this.loginService.isAuthenticated) {
        this.router.navigate(['/']);
        return;
      }
      if (ar?.startsWith("/update-page/")) {
        const path = this.getParam("/update-page/");
        if (!this.findPage(path)) {
          this.router.navigate(['/not-found']);
        }
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
      if (!isPageRoute(ar) && !isPage_Route(ar)) {
        return;
      }
      const ap = this.activePage;
      if (isPage_Route(ar)) {
        if (ap) {
          this.router.navigate([PAGE + ap.pagePath]);
        } else {
          this.router.navigate(['/add-page']);
        }
        return;
      }
      if (!ap) {
        this.router.navigate(['/not-found']);
        return;
      }
    });
  }

  get activePage(): PageModel | null {
    if (!this.pages || this.pages.length === 0) {
      return null;
    }

    if (!this.getParam(PAGE)) {
      return this.pages[0];
    }

    return this.pages?.find(p => p.pagePath.toLowerCase() === this.getParam(PAGE)) || null;
  }

  getParam(root: string): string {
    const s = this.activeRoute?.toLowerCase() || '';
    return s.startsWith(root) ? s.substring(root.length) : '';
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
            if (index !== -1) {
              pages[index].pagePath = response.pagePath;
              pages[index].caption = response.caption;
            }
          }
          this.updatePages(pages);
          this.showSuccess(`Page ${id === 0 ? 'added' : 'updated'}`);
        }),
        catchError((error) => {
          this.showError(error.error);
          return throwError(() => error);
        })
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
        catchError((error) => {
          this.showError(error.error);
          return throwError(() => error);
        })
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

}

import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, filter, first, Observable, tap } from 'rxjs';
import { PageModel } from '../models/PageModel';
import { NavigationEnd, Router } from '@angular/router';
import { LOGIN, PAGE } from '../common/constants';
import { LoginService } from './login.service';
import { isPageRoute, isRootPath } from '../common/utils';

@Injectable({
  providedIn: 'root'
})
export class PagesService {
  private apiUrl = `${environment.apiUrl}/pages`;
  private activeRoute: string | null = null;

  constructor(private http: HttpClient, private router: Router, public loginService: LoginService) {
    if (!this.loginService.isAuthenticated) {
      this.subscribeToNavigationEnd();
      return;
    }
    this.getPages().subscribe(() => {
      this.subscribeToNavigationEnd();
    });
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
      if (isRootPath(ar) && this.activePage) {
        this.router.navigate([PAGE + this.activePage.pagePath]);
        return;
      }
      if (isPageRoute(ar) && !this.activePage) {
        this.router.navigate(['/not-found']);
        return;
      }
    });
  }

  get activePage(): PageModel | null {
    if (!this.pages || this.pages.length === 0) {
      return null;
    }

    if (isRootPath(this.activePagePath)) { 
      return this.pages[0];
    }

    return this.pages?.find(p => p.pagePath.toLowerCase() === this.activePagePath) || null;
  }

  get activePagePath(): string {
    const s = this.activeRoute?.toLowerCase() || '';
    return s.startsWith(PAGE) ? s.substring(PAGE.length) : '';
  }

  private pagesSubject = new BehaviorSubject<any>(null);
  public pages$ = this.pagesSubject.asObservable();
  updatePages(pages: PageModel[]) {
    this.pagesSubject.next(pages);
  }
  get pages(): PageModel[] {
    return this.pagesSubject.getValue();
  }


  // private selectedPageSubject = new BehaviorSubject<PageModel | null>(null);
  // public selectedPage$ = this.selectedPageSubject.asObservable();
  // updateSelectedPage(page: PageModel | null) {
  //   this.selectedPageSubject.next(page);
  // }
  // get selectedPage(): PageModel | null {
  //   return this.selectedPageSubject.getValue();
  // }

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



}

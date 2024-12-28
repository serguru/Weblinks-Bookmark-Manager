import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { PageModel } from '../models/PageModel';
import { PageMode } from '../enums';

@Injectable({
  providedIn: 'root'
})
export class PagesService {
  private apiUrl = `${environment.apiUrl}/pages`;

  constructor(private http: HttpClient) { }

  private pagesSubject = new BehaviorSubject<any>(null);
  public pages$ = this.pagesSubject.asObservable();

  private pageModeSubject = new BehaviorSubject<any>(null);
  public pageMode$ = this.pageModeSubject.asObservable();

  private selectedPageSubject = new BehaviorSubject<PageModel | null>(null);
  public selectedPage$ = this.selectedPageSubject.asObservable();

  updatePages(newPages: any) {
    this.pagesSubject.next(newPages);
  }

  updateSelectedPage(page: any) {
    this.selectedPageSubject.next(page);
  }

  updatePageMode(newMode: any) {
    this.pageModeSubject.next(newMode);
  }

  getPages(path: string) {
    this.http.get<PageModel[]>(`${this.apiUrl}`)
      .subscribe(pages => {
        this.updatePages(pages);
        if (!pages || pages.length === 0) {
          this.updateSelectedPage(null)
          this.updatePageMode(PageMode.Add);
          return;
        }
        if (!path) {
          this.updateSelectedPage(pages[0])
          this.updatePageMode(PageMode.Browse);
          return;
        }
        path = path.toLowerCase();
        let page = pages.find(x => x.pagePath && x.pagePath.toLowerCase() === path) || null;
        if (!page) {
          this.updateSelectedPage(null)
          this.updatePageMode(PageMode.NotFound);
          return;
        }
        this.updateSelectedPage(page)
        this.updatePageMode(PageMode.Browse);
      });
  }
}

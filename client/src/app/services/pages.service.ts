import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, filter, finalize, find, Observable, of, tap, throwError } from 'rxjs';
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
    this.loginService.userLoggedOut.subscribe(() => {
      this.updateAccount(null);
      this.router.navigate(["/login"]);
    })
  }

  loadingPages: boolean = false;

  private accountSubject = new BehaviorSubject<any>(null);
  public account$ = this.accountSubject.asObservable();
  updateAccount(account: AccountModel | null) {
    this.accountSubject.next(account);
  }
  get account(): AccountModel | null {
    return this.accountSubject.getValue();
  }

  checkAlive(): Observable<any> {
    return this.http.get<any>(this.apiUrl + "/alive");
  }

  getAccount(): Observable<AccountModel> {
    return this.http.get<AccountModel>(this.apiUrl).pipe(
      tap(account => {
        this.updateAccount(account);
      }),
      finalize(() => {
        this.loadingPages = false;
      }));
  }

  findPage(pagePath: string): PageModel | null {
    return this.pages?.find(p => p.pagePath.toLowerCase() === pagePath.toLowerCase()) || null;
  }

  private activePageSubject = new BehaviorSubject<any>(null);
  public activePage$ = this.activePageSubject.asObservable();
  updateActivePage(page: PageModel | null) {
    this.activePageSubject.next(page);
  }
  get activePage(): PageModel | null {
    return this.activePageSubject.getValue();
  }

  get pages(): PageModel[] {
    return this.account?.pages || [];
  }

  addOrUpdatePage(id: number, pagePath: string, caption: string): Observable<PageModel> {
    if (!this.loginService.isAuthenticated) {
      throw new Error('Unauthorized');
    }

    return this.http.post(this.apiUrl + '/add-update-page', { id: id, pagePath: pagePath, caption: caption })
      .pipe(
        tap((response: any) => {
          const pages = this.pages;
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
          this.account!.pages = pages;
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

  getRowById(rowId: number): LrowModel | null {
    if (!this.pages) {
      return null;
    }
    rowId = +rowId;
    const page = this.pages.find(x => x.lrows?.find(y => y.id === rowId));
    return page?.lrows?.find((r: LrowModel) => r.id === rowId) || null;
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

  generateConfigStr(): string {
    const a = this.account;
    if (!a) {
      throw new Error("Account does not exist");
    }
    let o: any = {
      id: a.id
    }
    // pages
    if (a.pages?.length) {
      o.pages = [];
      a.pages.forEach((x: any) => {
        const p: any = { id: x.id };
        // rows
        if (x.lrows?.length) {
          p.lrows = [];
          x.lrows.forEach((y: any) => {
            const r: any = { id: y.id };
            // columns
            if (y.lcolumns?.length) {
              r.lcolumns = [];
              y.lcolumns.forEach((z: any) => {
                const c: any = { id: z.id };
                //links
                if (z.links?.length) {
                  c.links = z.links.map((n: any) => ({ id: n.id }));
                }
                r.lcolumns.push(c);
              })
            }
            p.lrows.push(r);
          })
        }
        o.pages.push(p);
      });
    }

    const result = JSON.stringify(o);
    return result;
  }

  saveConfig() {
    if (!this.loginService.isAuthenticated) {
      throw new Error('Unauthorized');
    }
    const config = this.generateConfigStr();
    this.loginService.saveConfig(config).subscribe();
  }

  get rowIds(): string[] {

    const result: string[] = [];

    this.pages?.forEach(p => {
      p.lrows?.forEach(r => {
        result.push('r' + r.id);
      })
    })

    return result;
  }

  get columnIds(): string[] {

    const result: string[] = [];

    this.pages?.forEach(p => {
      p.lrows?.forEach(r => {
        r.lcolumns?.forEach(c => {
          result.push('c' + c.id);
        })
      })
    })

    return result;
  }
 
  moveLinkToColumn(link: LinkModel, column: LcolumnModel)  {
    if (!this.loginService.isAuthenticated) {
      throw new Error('Unauthorized');
    }
    return this.http.put<any>(this.apiUrl + "/move-link", {linkId: link.id, columnId: column.id});
  }

  moveColumnToRow(column: LcolumnModel, row: LrowModel)  {
    if (!this.loginService.isAuthenticated) {
      throw new Error('Unauthorized');
    }
    return this.http.put<any>(this.apiUrl + "/move-column", {columnId: column.id, rowId: row.id});
  }

}

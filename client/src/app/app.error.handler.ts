import { ErrorHandler, Injectable, Injector } from "@angular/core";
import { PagesService } from "./services/pages.service";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable()
export class AppErrorHandler implements ErrorHandler {
    constructor(private injector: Injector) {}
    handleError(error: any) {
        let errorMessage = 'An unexpected error occurred';
        if (typeof error === 'string') {
            errorMessage = error;
        } else if (typeof error?.error === 'string') {
            errorMessage = error.error;
        } else if (typeof error?.message === 'string') {
            errorMessage = error.message;
        }
        const pagesService: PagesService = this.injector.get(PagesService);
        pagesService.showError(errorMessage);
    }
  }



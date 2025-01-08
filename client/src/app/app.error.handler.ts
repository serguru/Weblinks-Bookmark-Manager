import { ErrorHandler, Injectable, Injector } from "@angular/core";
import { MessagesService } from "./services/messages.service";

@Injectable()
export class AppErrorHandler implements ErrorHandler {
    constructor(private injector: Injector) {}
    handleError(error: any) {
        if (error.status == 401) {
            console.error(error);
            return;
        }
        let errorMessage = 'An unexpected error occurred';
        if (typeof error === 'string') {
            errorMessage = error;
        } else if (typeof error?.error === 'string') {
            errorMessage = error.error;
        } else if (typeof error?.message === 'string') {
            errorMessage = error.message;
        }
        const messagesService: MessagesService = this.injector.get(MessagesService);
        messagesService.showError(errorMessage);
        console.error(errorMessage);
    }
  }



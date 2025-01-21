import { ErrorHandler, Injectable, Injector } from "@angular/core";
import { MessagesService } from "./services/messages.service";
import { throwError } from "rxjs";
import { LoginService } from "./services/login.service";

@Injectable()
export class AppErrorHandler implements ErrorHandler {
    constructor(private injector: Injector) { }
    maxLength = 300;
    handleError(error: any) {
        if (error.status === 401) {
            var loginService = this.injector.get(LoginService);
            loginService.logout();
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
        if (errorMessage.length > this.maxLength) {
            errorMessage = errorMessage.substring(0, this.maxLength - 3) + "...";
        }
        const messagesService: MessagesService = this.injector.get(MessagesService);
        messagesService.showError(errorMessage);
        throwError(() => error);
    }
}



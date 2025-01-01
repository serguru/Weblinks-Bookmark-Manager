import { PAGE } from "./constants";

export const isRootPath = (path: string | null): boolean => {
    return !path || path === '/';
}

export const isPageRoute = (route: string | null): boolean => {
    return !!route?.toLowerCase().startsWith(PAGE);
  }

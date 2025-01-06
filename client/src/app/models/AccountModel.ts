import { PageModel } from "./PageModel";


export interface AccountModel
{
   id: number;
   userName: string;
   userEmail: string;
   isAdmin: boolean;
   firstName: string | null;
   lastName: string | null;
   settings: string | null;
   pages: PageModel[] | null;
}

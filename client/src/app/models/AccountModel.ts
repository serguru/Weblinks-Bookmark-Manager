import { PageModel } from "./PageModel";


export interface AccountModel
{
   id: number;
   userName: string;
   userEmail: string;
   isAdmin?: boolean | null;
   firstName: string;
   lastName: string;
   settings?: string | null;
   pages?: PageModel[] | null;
}

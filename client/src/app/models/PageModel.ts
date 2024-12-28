import { LrowModel } from "./LrowModel";

export interface PageModel {
    id: number;
    accountId: number;
    pagePath: string;
    caption: string | null;
    lrows:LrowModel[] | null;
}

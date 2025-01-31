import { LrowModel } from "./LrowModel";

export interface PageModel {
    id: number;
    accountId: number;
    pagePath: string;
    caption: string | null;
    public: boolean;
    lrows:LrowModel[] | null;
}

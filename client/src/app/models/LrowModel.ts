import { LcolumnModel } from "./LcolumnModel";

export interface LrowModel {
    id: number;
    pageId: number;
    caption: string | null;
    lcolumns: LcolumnModel[] | null;
}

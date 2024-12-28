import { LinkModel } from "./LinkModel";

export interface LcolumnModel {
    id: number;
    rowId: number;
    caption: string | null;
    links: LinkModel[] | null;
}

import VNode from '../../../../../renders/artRender/node';
import ArtRender from '../../../../../renders/artRender';
export declare class TableMoreTool {
    moreDom: HTMLUListElement;
    tableDom: HTMLTableElement;
    tableNode: VNode;
    thtdDom: Node;
    thtdNode: VNode;
    pos: {
        column: number;
        row: number;
    };
    artRender: ArtRender;
    constructor();
    private createLi;
    createDom(): HTMLUListElement;
    private insertUpLine;
    private insertDownLine;
    private insertLeftColumn;
    private insertRightColumn;
    private deleteLine;
    private deleteColumn;
    open(artRender: ArtRender, detail: {
        xy: [number, number];
        table: HTMLTableElement;
    }): void;
    close(): void;
}

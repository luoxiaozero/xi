import VNode from '../../../../renders/artRender/node';
import Operation from '../../../../renders/artRender/node/operation';
import ArtRenderEvent from '../../artRenderEvent';
export default function createTableTool(root: HTMLElement, tableNode: VNode): TableTool;
export declare class TableTool {
    rootDom: HTMLElement;
    tableNode: VNode;
    constructor(root: HTMLElement, tableNode: VNode);
    private createAlignSpan;
    private createAdjustSpan;
    private createMoreButton;
    private createDelButton;
    openMore(e: MouseEvent): boolean;
    private align;
    static getTableSize(table: HTMLTableElement): [number, number];
    static setTableSize(operation: Operation, tableNode: VNode, newValues: [number, number]): void;
    sizeBoxAdjust(e: MouseEvent): void;
    delTable(e: MouseEvent): void;
}
export declare function installTableTool(artRenderEvent: ArtRenderEvent): void;

export declare class Position {
    inAnchorOffset: number;
    inFocusOffset: number;
    rowAnchorOffset: number;
    rowFocusOffset: number;
    rowNode: Node;
    rowNodeAnchorOffset: number;
    selection: Selection;
    constructor();
    setRowNode(node: Node, offset: number): boolean;
}
export default class Cursor {
    static sel: Selection;
    /**获取节点的具体节点及光标 */
    static getNodeAndOffset(node: Node, offset: number): [Node, number];
    /**设置光标 */
    static setCursor(node: Node, offset: number): boolean;
    /**挂载的DOM */
    mountDom: HTMLElement;
    /**光标位置 */
    pos: Position;
    constructor(mountDom: HTMLElement);
    /** 获取光标位置 */
    getSelection(): Position;
    private searchNode;
    private setTool;
    setSelection(pos?: Position): boolean;
    moveCursor(direcction: string): boolean;
}

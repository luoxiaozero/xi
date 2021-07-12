declare class NodeWalker {
    current: VNode;
    root: VNode;
    entering: boolean;
    selfFalg: boolean;
    constructor(root: VNode, selfFalg?: boolean);
    next(): {
        entering: boolean;
        node: VNode;
    };
    resumeAt(node: VNode, entering: boolean): void;
}
export default class VNode {
    private _type;
    _parent: VNode;
    private _firstChild;
    private _lastChild;
    _prev: VNode;
    _next: VNode;
    _lastLineChecked: boolean;
    private _sourcepos;
    _lastLineBlank: boolean;
    _open: boolean;
    _string_content: string;
    _literal: string;
    _listData: {
        type: string;
        tight: any;
        start: number;
        delimiter: any;
        markerOffset: any;
        padding: any;
        bulletChar: any;
    };
    _info: any;
    _destination: string;
    _title: string;
    _isFenced: boolean;
    _fenceChar: any;
    _fenceLength: number;
    _fenceOffset: any;
    _level: number;
    _onEnter: any;
    _onExit: any;
    _htmlBlockType: any;
    attrs: Map<string, string>;
    dom: HTMLElement | Text;
    constructor(nodeType: string, sourcepos?: any);
    get type(): string;
    get firstChild(): VNode;
    get lastChild(): VNode;
    get next(): VNode;
    get prev(): VNode;
    get parent(): VNode;
    get sourcepos(): any;
    get listType(): string;
    set listType(t: string);
    get listTight(): any;
    set listTight(t: any);
    get listStart(): number;
    set listStart(n: number);
    get listDelimiter(): any;
    set listDelimiter(delim: any);
    /**dom为空时, 新建 */
    setDom(): Function;
    /**新建dom值 */
    newDom(): Function;
    private setAttrs;
    static isBlock(node: VNode): boolean;
    static isContainer(node: VNode): boolean;
    /**向最后添加孩子节点 */
    appendChild(child: VNode): void;
    /**向最前添加孩子节点 */
    prependChild(child: VNode): void;
    /**拆开节点 */
    unlink(): void;
    /**替换该节点 */
    replace(sibling: VNode): void;
    /**插入之后 */
    insertAfter(sibling: VNode): void;
    /**插入之前 */
    insertBefore(sibling: VNode): void;
    walker(selfFalg?: boolean): NodeWalker;
    getMd(): string;
    getText(): string;
    isEqual(node: VNode): boolean;
}
export {};

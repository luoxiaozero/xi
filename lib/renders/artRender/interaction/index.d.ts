import ArtRender from "..";
import VNode from "../../../renders/artRender/node";
import Cursor from "../cursor";
import Operation from "../../../renders/artRender/node/operation";
import InteractionParser from "./interactionParser";
export default class Interaction {
    artRender: ArtRender;
    behavior: {
        key: string;
        type: string;
    };
    renderFlag: boolean;
    cursor: Cursor;
    operation: Operation;
    parser: InteractionParser;
    constructor(artRender: ArtRender);
    /**
     * 渲染
     * @param key 键值
     * @param type 摁键行为
     */
    render(key: string, type: string, event?: KeyboardEvent | any): boolean;
    updateNode(dom: HTMLElement, node: VNode): VNode;
    /**摁键抬起时渲染 */
    keyup(): boolean;
    keydown(): boolean;
    /**退格渲染 */
    backspace(): boolean;
    /**回车渲染 */
    enter(): boolean;
    paragraph(node: VNode, dom: HTMLElement): void;
    list(node: VNode, dom: HTMLElement): void;
    item(node: VNode, dom: HTMLElement): void;
    block_quote(node: VNode, dom: HTMLElement): void;
    table(node: VNode, dom: HTMLElement): void;
    code_block(node: VNode, dom: HTMLElement): void;
    math_block(node: VNode, dom: HTMLElement): void;
    html_block(node: VNode, dom: HTMLElement): void;
    diff(newNode: VNode, oldNode: VNode): void;
}

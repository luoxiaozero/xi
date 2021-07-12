import ArtRender from "../../../renders/artRender";
import VNode from ".";
export default class Operation {
    private first;
    private last;
    private current;
    private currentNodeHead;
    artRender: ArtRender;
    constructor(artRender: ArtRender);
    private addOperationVNode;
    execCommand(): void;
    insertBefore(newNode: VNode, refNode: VNode, renderFlag?: boolean): void;
    insertAfter(newNode: VNode, refNode: VNode, renderFlag?: boolean): void;
    remove(node: VNode, renderFlag?: boolean): void;
    replace(newNode: VNode, oldNode: VNode, renderFlag?: boolean): void;
    appendChild(parentNode: VNode, childNode: VNode, renderFlag?: boolean): void;
    update(flag?: boolean): void;
    /**重做 */
    redo(): void;
    undo(): void;
    undoNode(): void;
}

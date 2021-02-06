import ArtRender from "@/renders/artRender";
import { Location } from "@/renders/artRender/cursor";
import VNode from ".";
class OperationVNodeHead {
    prev: OperationVNodeHead;
    next: OperationVNodeHead;
    location: Location;

    first: OperationVNode;
    last: OperationVNode;
    constructor(operationVNode: OperationVNode) {
        this.first = operationVNode;
        this.last = this.first;
    }

    /**向最后添加孩子节点 */
    public append(operationVNode: OperationVNode) {
        this.last.next = operationVNode;
        operationVNode.prev = this.last;
        this.last = operationVNode;
    }
}

class OperationVNode {
    prev: OperationVNode;
    next: OperationVNode;

    command: string;
    beNode: VNode;
    node: VNode;
    renderFlag: boolean;
    constructor(command: string, node: VNode, beNode: VNode, renderFlag: boolean) {
        this.prev = null;
        this.next = null;
        this.command = command;
        this.beNode = beNode;
        this.node = node;
        this.renderFlag = renderFlag;
    }
}

export default class Operation {
    private first: OperationVNodeHead;
    private last: OperationVNodeHead;

    private currentNodeHead: OperationVNodeHead;
    artRender: ArtRender;
    constructor(artRender: ArtRender) {
        this.artRender = artRender;
        this.first = null;
        this.last = null;
        this.currentNodeHead = null;
    }

    private addOperationVNode(operationVNode: OperationVNode) {
        if (this.currentNodeHead) {
            this.currentNodeHead.append(operationVNode);
        } else {
            this.currentNodeHead = new OperationVNodeHead(operationVNode);
        }
    }

    execCommand() {

    }

    insertBefore(newNode: VNode, refNode: VNode, renderFlag: boolean = true) {
        this.addOperationVNode(new OperationVNode("insertBefore", newNode, refNode, renderFlag));
        refNode.insertBefore(newNode);
    }

    insertAfter(newNode: VNode, refNode: VNode, renderFlag: boolean = true) {
        this.addOperationVNode(new OperationVNode("insertAfter", newNode, refNode, renderFlag));
        refNode.insertAfter(newNode);
    }
    replace(newNode: VNode, oldNode: VNode, renderFlag: boolean = true) {
        this.addOperationVNode(new OperationVNode("replace", newNode, oldNode, renderFlag));
        oldNode.replace(newNode);
    }

    appendChild(parentNode: VNode, childNode: VNode, renderFlag: boolean = true) {
        this.addOperationVNode(new OperationVNode("appendChild", childNode, parentNode, renderFlag));
        parentNode.appendChild(childNode);
    }

    update(flag: boolean = true) {
        if (this.currentNodeHead) {
            if (this.last) {
                this.last.next = this.currentNodeHead;
                this.currentNodeHead.prev = this.last;
            } else {
                this.first = this.currentNodeHead;
            }
            this.last = this.currentNodeHead;
            this.currentNodeHead = null;

            if (flag) {
                let child = this.last.first, fun: Function;
                while (child) {
                    if (!child.renderFlag) {
                        child = child.next;
                        continue;
                    }
                    fun = null;
                    if (child.command == "appendChild") {
                        fun = child.node.newDom();
                        child.beNode.dom.appendChild(child.node.dom);
                    } else if (child.command == "replace") {
                        fun = child.node.newDom();
                        child.beNode.dom.parentElement.replaceChild(child.node.dom, child.beNode.dom);
                    } else if (child.command == "insertBefore") {
                        fun = child.node.newDom();
                        child.beNode.dom.parentElement.insertBefore(child.node.dom, child.beNode.dom);
                    } else if (child.command == "insertAfter") {
                        fun = child.node.newDom();
                        if (child.beNode.dom.nextElementSibling) {
                            child.beNode.dom.parentElement.insertBefore(child.node.dom, child.beNode.dom.nextElementSibling);
                        } else {
                            child.beNode.dom.parentElement.appendChild(child.node.dom);
                        }
                    }
                    if (fun)
                        fun();
                    child = child.next;
                }
            }
            this.last.location = this.artRender.cursor.location;
        }
    }

    redo() {

    }

    undo() {
        this.undoNode();
        if (this.last) {
            console.log(this.last);
            let nodeHead: OperationVNodeHead;
            nodeHead = this.last;

            let child = nodeHead.first;
            while (child) {
                console.log(child.beNode, "----------------------", child.beNode.dom, child.node.dom, child.beNode.dom == child.node.dom);
                if (["appendChild", "insertBefore", "insertAfter"].includes(child.command)) {
                    child.node.dom.removeChild(child.node.dom);
                    child.node.unlink();
                } else if (child.command == "replace") {
                    child.node.dom.parentElement.replaceChild(child.beNode.dom, child.node.dom);
                    child.node.replace(child.beNode);
                }
                child = child.next;
            }
            console.log(nodeHead.location, "----------------------")
            nodeHead.location.anchorInlineOffset--;
            nodeHead.location.focusInlineOffset--;
            this.artRender.cursor.setSelection(nodeHead.location);

            this.last = this.last.prev;
        }

    }

    undoNode() {
        if (this.currentNodeHead) {
            let child = this.currentNodeHead.first;
            while (child) {
                if (["appendChild", "insertBefore", "insertAfter"].includes(child.command))
                    child.node.unlink();
                else if (child.command == "replace")
                    child.node.replace(child.beNode);
                child = child.next;
            }
            this.currentNodeHead = null;
        }
    }
}
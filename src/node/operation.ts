import VNode from ".";
class OperationVNodeHead {
    prev: OperationVNodeHead;
    next: OperationVNodeHead;

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
    constructor(command: string, node: VNode, beNode: VNode) {
        this.prev = null;
        this.next = null;
        this.command = command;
        this.beNode = beNode;
        this.node = node;
    }
}

export default class Operation {
    private first: OperationVNodeHead;
    private last: OperationVNodeHead;

    private currentNodeHead: OperationVNodeHead;
    constructor() {
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

    insertBefore(newNode: VNode, refNode: VNode) {
        this.addOperationVNode(new OperationVNode("insertBefore", newNode, refNode));
        refNode.insertBefore(newNode);
    }

    insertAfter(newNode: VNode, refNode: VNode) {
        this.addOperationVNode(new OperationVNode("insertAfter", newNode, refNode));
        refNode.insertAfter(newNode);
    }
    replace(newNode: VNode, oldNode: VNode) {
        this.addOperationVNode(new OperationVNode("replace", newNode, oldNode));
        oldNode.replace(newNode);
    }

    appendChild(parentNode: VNode, childNode: VNode) {
        this.addOperationVNode(new OperationVNode("appendChild", childNode, parentNode));
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
                    if (child.command == "appendChild") {
                        fun = child.node.newDom();
                        child.beNode.dom.appendChild(child.node.dom);
                        if (fun)
                            fun();
                    } else if (child.command == "replace") {
                        fun = child.node.newDom();
                        child.beNode.dom.parentElement.replaceChild(child.node.dom, child.beNode.dom);
                        if (fun)
                            fun();
                    } else if (child.command == "insertBefore") {
                        fun = child.node.newDom();
                        child.beNode.dom.parentElement.insertBefore(child.node.dom, child.beNode.dom);
                        if (fun)
                            fun();
                    } else if (child.command == "insertAfter") {
                        fun = child.node.newDom();
                        if (child.beNode.dom.nextElementSibling) {
                            child.beNode.dom.parentElement.insertBefore(child.node.dom, child.beNode.dom.nextElementSibling);
                        } else {
                            child.beNode.dom.parentElement.appendChild(child.node.dom);
                        }
                        if (fun)
                            fun();
                    }
                    child = child.next;
                }
            }

        }
    }
}
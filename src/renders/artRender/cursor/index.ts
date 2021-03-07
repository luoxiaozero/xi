import Tool from '@/tool';
import ArtRender from '..';

export class Position {
    inAnchorOffset: number;
    inFocusOffset: number;
    rowAnchorOffset: number;
    rowFocusOffset: number;
    rowNode: Node;
    rowNodeAnchorOffset: number;
    selection: Selection;
    constructor() {
        this.rowNode = null;
        this.rowAnchorOffset = null;
    }

    setRowNode(node: Node, offset: number): boolean {
        if (this.rowNode === null) {
            switch (node.nodeName) {
                case "H1":
                case "H2":
                case "H3":
                case "H4":
                case "H5":
                case "H6":
                case "P":
                case "TH":
                case "TD":
                case "PRE":
                case "HR":
                    this.rowNode = node;
                    this.rowNodeAnchorOffset = offset;
                    return true;
                case "DIV":
                    if (Tool.hasClass(node as HTMLElement, "art-md-Hr")) {
                        this.rowNode = node.firstChild;
                        this.rowNodeAnchorOffset = 0;
                        return true;
                    }
                    break;
                case "LI":
                    if (offset === 0) {
                        if (node.firstChild.nodeName === "INPUT" && node.firstChild.nextSibling)
                            this.rowNode = node.firstChild.nextSibling;
                        else if (node.firstChild.nextSibling)
                            this.rowNode = node.firstChild.nextSibling;
                        else
                            this.rowNode = node;
                        this.rowNodeAnchorOffset = 0;
                        return true;
                    }
                    break;
            }
        }
        return false;
    }
}

export default class Cursor {
    static sel: Selection = window.getSelection();

    /**获取节点的具体节点及光标 */
    static getNodeAndOffset(node: Node, offset: number): [Node, number] {
        node = node.firstChild;
        while (node) {
            if (node instanceof Text) {
                if (offset > node.data.length) {
                    offset -= node.data.length;
                    console.log(offset, node.data.length);
                } else {
                    return [node, offset];
                }
            } else {
                let a = Cursor.getNodeAndOffset(node, offset);
                if (a[0]) {
                    return a;
                } else {
                    offset = a[1];
                }
            }
            node = node.nextSibling;
        }
        return [null, offset];
    }

    /**设置光标 */
    static setCursor(node: Node, offset: number): boolean {
        if (node == undefined && !node)
            return false;
        console.log(Cursor.sel)
        let range = Cursor.sel.getRangeAt(0).cloneRange();
        range.setStart(node, offset);
        range.collapse(true);
        Cursor.sel.removeAllRanges();
        Cursor.sel.addRange(range);
    }

    /**挂载的DOM */
    mountDom: HTMLElement;
    /**光标位置 */
    pos: Position;
    constructor(mountDom: HTMLElement) {
        this.mountDom = mountDom;
        this.pos = null;
    }

    /** 获取光标位置 */
    getSelection(): Position {
        let { anchorNode, anchorOffset, focusNode, focusOffset } = Cursor.sel;

        if (anchorNode && focusNode && anchorNode != this.mountDom) {
            this.pos = new Position();
            this.pos.selection = Cursor.sel;

            let node = anchorNode;
            let len = anchorOffset;
            if (node.parentNode === this.mountDom)
                this.pos.setRowNode(node, len);
            while (node.parentNode != this.mountDom) {
                if (Tool.hasClass(node as HTMLElement, 'art-shield')) {
                    this.pos = null;
                    return this.pos;
                }
                this.pos.setRowNode(node, len);
                while (node.previousSibling) {
                    node = node.previousSibling;
                    if (!Tool.hasClass(node as HTMLElement, 'art-shield'))
                        len += node.textContent.length;

                    this.pos.setRowNode(node, len);
                }
                node = node.parentNode;
                this.pos.setRowNode(node, len);
            }
            this.pos.inAnchorOffset = len;

            let rootNodeSub = -1;
            for (let i = 0; i < this.mountDom.childNodes.length; i++) {
                if (this.mountDom.childNodes[i] === node) {
                    rootNodeSub = i;
                    break;
                }
            }
            this.pos.rowAnchorOffset = rootNodeSub;

            let nodeF = focusNode;
            let lenF = focusOffset;
            while (nodeF.parentNode !== this.mountDom) {
                while (nodeF.previousSibling) {
                    nodeF = nodeF.previousSibling;
                    if (!Tool.hasClass(nodeF as HTMLElement, 'art-shield'))
                        lenF += nodeF.textContent.length;
                }
                nodeF = nodeF.parentNode;
            }
            this.pos.inFocusOffset = lenF;

            let rootNodeSubF = -1;
            for (let i = 0; i < this.mountDom.childNodes.length; i++) {
                if (this.mountDom.childNodes[i] === nodeF) {
                    rootNodeSubF = i;
                    break;
                }
            }
            this.pos.rowFocusOffset = rootNodeSubF;
        } else {
            this.pos = null;
        }
        return this.pos;
    }

    private searchNode(node: Node, len: number): [Node, number] {
        if (node.childNodes.length == 1 && node.childNodes[0].nodeName == '#text') {
            if (len < node.childNodes[0].textContent.length)
                return [node.childNodes[0], len];
            else if (len === node.childNodes[0].textContent.length) {
                if (this.pos.rowNodeAnchorOffset === 0) {
                    while (node) {
                        if (node.nextSibling) {
                            node = node.nextSibling;
                            break;
                        } else {
                            node = node.parentNode;
                        }
                    }
                    if (node.nodeName === "LI") {
                        if (node.firstChild.nodeName === "INPUT" && node.firstChild.nextSibling) {
                            node = node.firstChild.nextSibling;
                        } else {
                            node = node.firstChild;
                        }
                    }
                    return [node, 0];
                }
                return [node.childNodes[0], len];
            } else
                len -= node.textContent.length;
        } else {
            for (let i = 0; i < node.childNodes.length; i++) {
                if (Tool.hasClass(node.childNodes[i] as HTMLElement, 'art-shield'))
                    continue;
                if (node.childNodes[i].textContent.length < len) {
                    len -= node.childNodes[i].textContent.length;
                } else if (node.childNodes[i].nodeName === "#text") {
                    return [node.childNodes[i], len]
                } else {
                    return this.searchNode(node.childNodes[i], len)
                }
            }
        }

        if (len == 1 && node.nextSibling) {
            return [node.nextSibling, 0];
        }
        return null
    }

    private setTool(alineDom: HTMLElement): boolean {
        let tools = this.mountDom.getElementsByClassName('art-tocTool');
        for (let i = 0; i < tools.length; i++) {
            (<HTMLElement>tools[i]).style.visibility = 'hidden';
            (<HTMLElement>tools[i].nextSibling).style.borderColor = '#9990';
        }

        tools = this.mountDom.getElementsByClassName("art-display");
        for (let i = 0; i < tools.length; i++) {
            if (Tool.hasClass(tools[i] as HTMLElement, "art-md-html-block-main")) {
                if (alineDom !== (<HTMLElement>tools[i]).parentElement) {
                    ((<HTMLElement>tools[i]).nextSibling as HTMLElement).style.display = "block";
                    (<HTMLElement>tools[i]).classList.replace("art-display", "art-display-none");
                }
            } else if (Tool.hasClass(alineDom, "art-md-MathBlock")) {
                if (alineDom !== (<HTMLElement>tools[i]).parentElement) {
                    (<HTMLElement>tools[i]).classList.replace("art-display", "art-display-none");
                }
            } else {
                (<HTMLElement>tools[i]).classList.replace("art-display", "art-display-none");
            }
        }

        if (Tool.hasClass(alineDom, 'art-shield')) {
            if (Tool.hasClass(alineDom, 'art-toc')) {
                if (alineDom.previousSibling && Tool.hasClass(alineDom.previousSibling as HTMLElement, 'art-tocTool')) {
                    (<HTMLElement>alineDom.previousSibling).style.visibility = 'visible';
                    alineDom.style.borderColor = '#999';
                } else {
                    //alineDom.parentNode.insertBefore(tocTool(), alineDom);
                }
                return true;
            }
            return false;
        }
        tools = this.mountDom.getElementsByClassName('art-codeBlockTool');
        for (let i = 0; i < tools.length; i++) {
            (<HTMLElement>tools[i]).style.visibility = 'hidden';
        }

        tools = this.mountDom.getElementsByClassName('art-tableTool');
        for (let i = 0; i < tools.length; i++) {
            (<HTMLElement>tools[i]).style.visibility = 'hidden';
        }

        if (ArtRender.plugins.flowchart || ArtRender.plugins.mermaid) {
            tools = this.mountDom.getElementsByClassName('art-codeBlockBottomTool');
            for (let i = 0; i < tools.length; i++) {
                if (tools[i].innerHTML === "") {
                } else if (alineDom.lastChild == tools[i]) {
                    (<HTMLElement>tools[i]).style.border = "1px solid #999";
                    (<HTMLElement>tools[i].previousSibling).style.display = "inherit";
                } else {
                    (<HTMLElement>tools[i]).style.border = 'inherit';
                    (<HTMLElement>tools[i].previousSibling).style.display = 'none';
                }

            }
        }

        if (Tool.hasClass(alineDom, "art-md-CodeBlock")) {
            (<HTMLElement>alineDom.firstChild).style.visibility = "visible";
            return true;
        }
        if (Tool.hasClass(alineDom, "art-md-Table")) {
            (<HTMLElement>alineDom.firstChild).style.visibility = "visible";
            return true;
        }
        return false;
    }

    setSelection(pos: Position = undefined) {
        if (typeof pos == undefined || !pos) {
            pos = this.pos;
        }
        if (!pos) {
            return false;
        }

        // 隐藏所有的art-show Dom
        let showNodeList = this.mountDom.getElementsByClassName("art-show");
        for (let i = showNodeList.length - 1; i >= 0; i--) {
            let classVal = showNodeList[i].getAttribute("class");
            classVal = classVal.replace("art-show", "art-hide");
            showNodeList[i].setAttribute("class", classVal);
        }

        if (this.pos && this.pos.selection.isCollapsed) {
            let info: [Node, number] = null;
            let pNode = this.mountDom.childNodes[this.pos.rowFocusOffset] as HTMLElement;
            let pLen = this.pos.inAnchorOffset;
            this.setTool(pNode as HTMLElement)
            console.log(this.pos)
            if (Tool.hasClass(pNode, "art-shield")) {
                return null;
            }
            if (Tool.hasClass(pNode , "art-md-Hr")) {
                // 不可调优先度
                info = [pNode.firstChild, 0];
            } else {
                info = this.searchNode(pNode, pLen);
            }
            console.log(info);
            if (info === null)
                return null;
            let showNodeList = this.mountDom.getElementsByClassName("art-show-math");
            for (let i = showNodeList.length - 1; i >= 0; i--) {
                let classVal = showNodeList[i].getAttribute("class");
                classVal = classVal.replace("art-show-math", "");
                showNodeList[i].setAttribute("class", classVal);
            }
            if (info[0].nodeName == '#text' && Tool.hasClass(info[0].parentNode as HTMLElement, 'art-md-math') && info[0].parentNode.previousSibling.childNodes[0]) {
                let classVal = (<HTMLSpanElement>info[0].parentNode.previousSibling.childNodes[0]).getAttribute("class");
                if (classVal == null || classVal.indexOf('art-show-math') < 0) {
                    classVal += ' art-show-math';
                    (<HTMLSpanElement>info[0].parentNode.previousSibling.childNodes[0]).setAttribute("class", classVal);
                }
            }
            Cursor.setCursor(info[0], info[1])

            let art_text_double = info[0].parentNode as HTMLElement;

            if (art_text_double && Tool.hasClass(art_text_double, "art-hide")) {
                if (art_text_double.previousSibling && Tool.hasClass(art_text_double.previousSibling as HTMLElement, "art-text-double")) {
                    art_text_double = art_text_double.previousSibling as HTMLElement;
                } else if (art_text_double.nextSibling && Tool.hasClass(art_text_double.nextSibling as HTMLElement, "art-text-double")) {
                    art_text_double = art_text_double.nextSibling as HTMLElement;
                } else if (art_text_double && Tool.hasClass(art_text_double, "art-text-parent")) {
                    art_text_double = art_text_double.parentElement;
                }
            }

            if (art_text_double && Tool.hasClass(art_text_double, "art-text-double")) {
                let classVal = (art_text_double.nextSibling as HTMLElement).getAttribute("class");
                classVal = classVal.replace("art-hide", "art-show");
                (art_text_double.nextSibling as HTMLElement).setAttribute("class", classVal);

                classVal = (art_text_double.previousSibling as HTMLElement).getAttribute("class");
                classVal = classVal.replace("art-hide", "art-show");
                (art_text_double.previousSibling as HTMLElement).setAttribute("class", classVal);
            }

            if (info[0].nodeName === "#text" && Tool.hasClass(info[0].parentNode as HTMLElement, "art-hide")) {
                let classVal = info[0].parentElement.getAttribute("class");
                classVal = classVal.replace("art-hide", "art-show");
                info[0].parentElement.setAttribute("class", classVal);
            }
        }
    }

    moveCursor(direcction: string): boolean {
        switch (direcction) {
            case 'ArrowRight':
            // this.pos.inAnchorOffset++;
            // this.pos.inFocusOffset++;
            // break;
            default:
                return false;
        }
        this.setSelection();
        return true;
    }

}
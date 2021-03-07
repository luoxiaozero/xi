import EventCenter from "@/eventCenter";
import ArtRender from "..";
import VNode from "@/node";
import { domToNode } from "./conversion";
import Cursor from "../cursor";
import Operation from "@/node/operation";
import InteractionParser from "./interactionParser";
import Tool from "@/tool";

const reCodeFence = /^`{3,}(?!.*`)|^~{3,}/;
const reBulletListMarker = /^[*+-]/;
const reOrderedListMarker = /^(\d{1,9})([.)])/;
const reATXHeadingMarker = /^#{1,6}/;
const reThematicBreak = /^(?:(?:\*[ \t]*){3,}|(?:_[ \t]*){3,}|(?:-[ \t]*){3,})[ \t]*$/;
const reBlockQuote = /^>/;
const reClosingTable = /^\|(.*?\|)+/;

export default class Interaction {
    artRender: ArtRender;
    behavior: { key: string, type: string };
    renderFlag: boolean;
    cursor: Cursor;
    operation: Operation;
    parser: InteractionParser;
    constructor(artRender: ArtRender) {
        this.artRender = artRender;
        this.renderFlag = true;
        this.operation = this.artRender.operation;
        this.cursor = this.artRender.cursor;
        this.parser = this.artRender.parser;
    }

    /**
     * 渲染
     * @param key 键值 
     * @param type 摁键行为
     */
    public render(key: string, type: string): boolean {
        this.behavior = { key, type };
        let state: boolean = true;
        this.cursor.getSelection();
        console.log(this.behavior, this.cursor.pos)
        if (type == 'keydown') {
            switch (key) {
                case 'Backspace':
                    state = this.backspace();
                    break;
                case 'Enter':
                    state = this.enter();
                    break;
            }
        } else if (type == 'keyup') {
            switch (key) {
                case "Control":
                case "Shift":
                    break;
                case "Enter":

                default:
                    break;
                    this.domUpdateDoc();
                    state = this.keyup();
            }
        }

        this.cursor.setSelection();
        this.artRender.artText.get<EventCenter>('$eventCenter').emit('artRender-render')
        return state;
    }

    public domUpdateDoc() {
        if (!this.cursor.pos)
            return;

        let sub = this.cursor.pos.rowAnchorOffset;
        if (sub == -1)
            return false;

        let dom = this.artRender.dom.childNodes[sub] as HTMLElement;
        let node = this.artRender.doc.firstChild;
        while (--sub != -1) {
            node = node.next;
        }

        if (this.behavior.type == "keyup" && this.behavior.key === "Enter") {
            this.operation.replace(domToNode(dom.previousSibling as HTMLElement), node.prev, false);
            this.operation.insertBefore(domToNode(dom), node, false);
        } else {
            // this.operation.insertBefore(domToNode(dom), node, false);
            this.updateNode(dom, node);
        }
    }

    updateNode(dom: HTMLElement, node: VNode) {
        switch (dom.nodeName) {
            case "#text":
                if (node.type == "text") {
                    if (node._literal != dom.nodeValue) {
                        let newNode = new VNode("text");
                        newNode._literal = dom.nodeValue;
                        newNode.dom = node.dom;
                        node.dom = new Text(node._literal);

                        this.operation.replace(newNode, node, false);
                        this.operation.update();
                    }
                } else {
                    throw "class Interaction 的 updateNode 方法";
                }
                return;
        }

        let child = node.firstChild;
        for (let i = 0; i < dom.childNodes.length && child; i++) {
            this.updateNode(<HTMLElement>dom.childNodes[i], child);
            child = child.next;
        }
    }

    /**摁键抬起时渲染 */
    keyup(): boolean {
        if (!this.cursor.pos)
            return;
        let sub = this.cursor.pos.rowAnchorOffset;
        if (sub == -1)
            return false;

        let node = this.artRender.doc.firstChild, i = sub;
        while (--i != -1) {
            node = node.next;
        }

        if (this.behavior.key === "Enter") {
            this.process_keyup(node.prev);
            this.process_keyup(node);
        } else {
            this.process_keyup(node);
        }

        return false;
    }

    process_keyup(node: VNode) {
        if (node.type == "thematic_break") {
            return null;
        } else if (node.type == "code_block") {
            this.code_block(node);
        } else if (node.type === "paragraph" || node.type === "heading") {
            this.paragraph(node);
        } else if (node.type === "list") {
            this.list(node);
        } else if (node.type === "block_quote") {
            this.block_quote(node);
        }
    }

    /**退格渲染 */
    backspace(): boolean {
        let pos = this.cursor.pos;
        if (pos) {
            let sub = pos.rowAnchorOffset;
            if (sub == -1)
                return false;

            let node = this.artRender.doc.firstChild, i = sub, newNode: VNode;
            while (--i != -1) {
                node = node.next;
            }

            let dom = this.artRender.dom.childNodes[pos.rowAnchorOffset] as HTMLElement;
            if (Tool.hasClass(dom, "art-md-MathBlock")) {
                if ((pos.rowNode as HTMLElement).innerHTML == '\n') {
                    this.operation.remove(node);
                    this.operation.update();
                    return false;
                } else if (pos.rowNodeAnchorOffset === 0) {
                    return false;
                }
            } else if (Tool.hasClass(dom, "art-md-CodeBlock")) {
                if ((pos.rowNode as HTMLElement).innerText == '\n') {
                    this.operation.remove(node);
                    this.operation.update();
                    return false;
                } else if (pos.rowNodeAnchorOffset === 0) {
                    return false;
                }
            }
        }
        return true;
    }

    /**回车渲染 */
    enter(): boolean {
        let pos = this.cursor.pos;
        if (pos) {
            let sub = pos.rowAnchorOffset;
            if (sub == -1)
                return false;

            let node = this.artRender.doc.firstChild, i = sub, newNode: VNode;
            while (--i != -1) {
                node = node.next;
            }

            let md = node.getMd();
            if (md.length && md.charCodeAt(md.length - 1) === 10)
                md = md.substring(0, md.length - 1);

            let dom = this.artRender.dom.childNodes[pos.rowAnchorOffset] as HTMLElement;
            if (Tool.hasClass(dom, "art-md-hr")) {
                newNode = new VNode("paragraph");
                newNode.appendChild(new VNode("linebreak"));
                this.operation.replace(newNode, node);
                this.operation.update();
                Cursor.setCursor(newNode.dom, 0);
                return false;
            } else if (dom.nodeName === "P" && reThematicBreak.test(md)) {
                console.log("thematic_break")
                newNode = new VNode("thematic_break");
                newNode.attrs.set("art-marker", md);
                this.operation.replace(newNode, node);
                this.operation.update();
                this.cursor.pos.inFocusOffset = 0;
                this.cursor.pos.inAnchorOffset = 0;
                return false;
            } else if (dom.nodeName === "P" && reCodeFence.test(md)) {
                newNode = new VNode("code_block");
                newNode.attrs.set("art-marker", md.match(reCodeFence)[0]);
                newNode._literal = "\n";
                this.operation.replace(newNode, node);

                let art_tool = new VNode("art_tool");
                art_tool.attrs.set("--tool", "code_block");
                this.operation.insertBefore(art_tool, newNode);

                newNode._info = md.substring(md.match(reCodeFence)[0].length)

                let info_words = node._info ? node._info.split(/\s+/) : [];
                if (info_words.length > 0 && info_words[0].length > 0 && info_words[0] == "flow") {
                    let art_tool = new VNode("art_tool");
                    art_tool.attrs.set("--tool", "code_block_flow");
                    this.operation.insertAfter(art_tool, newNode);
                }
                this.operation.update();
                this.cursor.pos.inFocusOffset = 0;
                this.cursor.pos.inAnchorOffset = 0;
                return false;
            } else if (pos.rowNode && ["TD", "TH"].includes(pos.rowNode.nodeName)) {
                if (pos.rowNode.parentElement.nextSibling || pos.rowNode.nodeName === "TH") {
                    let subscript = 0, child = pos.rowNode.previousSibling;
                    while (child) {
                        subscript += 1;
                        child = child.previousSibling;
                    }
                    if (pos.rowNode.nodeName === "TH") {
                        Cursor.setCursor(pos.rowNode.parentElement.parentElement.nextSibling.firstChild.childNodes[subscript], 0);
                    } else{
                        Cursor.setCursor(pos.rowNode.parentElement.nextSibling.childNodes[subscript], 0);
                    }
                    
                } else {
                    Cursor.setCursor(node.next.dom, 0);
                }
                return false;
            } else if (dom.nodeName === "P" && reClosingTable.test(md)) {
                // 生成table
                let table = new VNode("table");
                let thead = new VNode("thead");
                let tbody = new VNode("tbody");
                table.appendChild(thead);
                table.appendChild(tbody);

                let tr1 = new VNode("tr");
                let tr2 = new VNode("tr");
                let arry = md.split('|');
                for (let i = 1, len = arry.length - 1; i < len; i++) {
                    let th = new VNode("th");
                    th._string_content = arry[i];
                    this.parser.inlineParse(th);
                    tr1.appendChild(th)

                    newNode = new VNode("td");
                    newNode.appendChild(new VNode("linebreak"));
                    tr2.appendChild(newNode);
                }
                thead.appendChild(tr1);
                tbody.appendChild(tr2);
                this.operation.insertAfter(table, node);
                this.operation.remove(node);
                this.operation.update();

                Cursor.setCursor(tr2.firstChild.dom, 0);
                return false;
            } else if (pos.rowNode && pos.rowNode.nodeName === "P" && pos.rowNode.parentNode.nodeName === "BLOCKQUOTE") {
                let walker = node.walker(),
                    event: { entering: boolean; node: VNode; }, rowVNode: VNode = null;

                while ((event = walker.next())) {
                    if (event.entering && event.node.dom === pos.rowNode) {
                        rowVNode = event.node;
                        break;
                    }
                }

                if (pos.rowNode.childNodes.length === 1 && pos.rowNode.childNodes[0].nodeName === "BR") {
                    /**blockquote 退出 */
                    if (rowVNode.parent.lastChild !== rowVNode) {
                        let newNode_1 = new VNode("block_quote");
                        let child = rowVNode.next;
                        while (child) {
                            this.operation.remove(child);
                            newNode_1.appendChild(child);
                            child = child.next;
                        }
                        this.operation.insertAfter(newNode_1, rowVNode.parent)
                    }

                    newNode = new VNode("paragraph");
                    newNode.appendChild(new VNode("linebreak"));
                    this.operation.insertAfter(newNode, rowVNode.parent)
                    this.operation.remove(rowVNode);
                    this.operation.update();

                    Cursor.setCursor(newNode.dom, 0);
                } else {
                    /**blockquote 换行 */
                    md = rowVNode.getMd();
                    if (md.length && md.charCodeAt(md.length - 1) === 10)
                        md = md.substring(0, md.length - 1);
                    node = rowVNode;
                    let newNode_1: VNode, before_str = md.substring(0, pos.rowNodeAnchorOffset), match;
                    if (before_str) {
                        newNode_1 = this.parser.inlineParse(before_str);
                        this.operation.replace(newNode_1, node);
                    } else {
                        newNode_1 = new VNode("paragraph");
                        newNode_1.appendChild(new VNode("linebreak"));
                        this.operation.insertBefore(newNode_1, node);
                    }

                    let newNode_2: VNode, after_str = md.substring(pos.rowNodeAnchorOffset);
                    if (after_str) {
                        newNode_2 = this.parser.inlineParse(after_str);
                    } else {
                        newNode_2 = new VNode("paragraph");
                        newNode_2.appendChild(new VNode("linebreak"));
                    }
                    this.operation.insertAfter(newNode_2, newNode_1);

                    this.operation.update();
                    Cursor.setCursor(newNode_2.dom, 0);
                }
                this.artRender.cursor.getSelection();
                return false;
            } else if (pos.rowNode && pos.rowNode.nodeName === "P" && pos.rowNode.parentNode.nodeName === "LI") {
                let walker = node.walker(),
                    event: { entering: boolean; node: VNode; }, rowVNode: VNode = null;

                while ((event = walker.next())) {
                    if (event.entering && event.node.dom === pos.rowNode) {
                        rowVNode = event.node;
                        break;
                    }
                }

                if (pos.rowNode.childNodes.length === 1 && pos.rowNode.childNodes[0].nodeName === "BR") {
                    /**li 退出 */
                    if (rowVNode.parent.parent.lastChild !== rowVNode.parent) {
                        let newNode_1 = new VNode("list");
                        newNode_1.listType = rowVNode.parent.parent.listType;
                        let child = rowVNode.parent.next, next: VNode;
                        while (child) {
                            next = child.next;
                            this.operation.remove(child);
                            newNode_1.appendChild(child);
                            child = next;
                        }
                        this.operation.insertAfter(newNode_1, rowVNode.parent.parent)
                    }

                    if (rowVNode.prev && rowVNode.prev.type !== "item_checkbox") {
                        newNode = new VNode("item");
                        newNode.appendChild(new VNode("paragraph"));
                        newNode.firstChild.appendChild(new VNode("linebreak"));
                        this.operation.insertAfter(newNode, rowVNode.parent)
                        this.operation.remove(rowVNode);
                        this.operation.update();
                        Cursor.setCursor(newNode.dom, 0);
                    } else {
                        switch (rowVNode.parent.parent.parent.type) {
                            case "document":
                            case "block_quote":
                            case "item":
                                newNode = new VNode("paragraph");
                                newNode.appendChild(new VNode("linebreak"));
                                this.operation.insertAfter(newNode, rowVNode.parent.parent)
                                this.operation.remove(rowVNode.parent);
                                this.operation.update();
                                Cursor.setCursor(newNode.dom, 0);
                                break;
                            default:
                                console.log("error", rowVNode.parent.parent.parent.type);
                        }
                    }

                    this.artRender.cursor.getSelection();
                } else if (rowVNode.prev && rowVNode.prev.type !== "item_checkbox") {
                    /**li 中的 p 换行 */
                    md = rowVNode.getMd();
                    if (md.length && md.charCodeAt(md.length - 1) === 10)
                        md = md.substring(0, md.length - 1);

                    let newNode_1: VNode, _str: string;
                    if (pos.rowNodeAnchorOffset === md.length) {
                        newNode_1 = new VNode("paragraph");
                        newNode_1.appendChild(new VNode("linebreak"));
                        this.operation.insertAfter(newNode_1, rowVNode);
                    } else if (pos.rowNodeAnchorOffset) {
                        _str = md.substring(pos.rowNodeAnchorOffset);
                        newNode_1 = this.parser.inlineParse(_str);
                        this.operation.insertAfter(newNode_1, rowVNode);

                        _str = md.substring(0, pos.rowNodeAnchorOffset)
                        newNode = this.parser.inlineParse(_str);
                        this.operation.replace(newNode, rowVNode);
                    } else {
                        newNode_1 = new VNode("paragraph");
                        newNode_1.appendChild(new VNode("linebreak"));
                        this.operation.insertBefore(newNode_1, rowVNode);
                        newNode_1 = rowVNode;
                    }

                    this.operation.update();
                    Cursor.setCursor(newNode_1.dom, 0);
                } else {
                    /**li 换行 */
                    let newNode_1: VNode, _str: string;

                    md = rowVNode.getMd();
                    if (md.length && md.charCodeAt(md.length - 1) === 10)
                        md = md.substring(0, md.length - 1);

                    newNode = new VNode("item");
                    if (rowVNode.prev && rowVNode.prev.type === "item_checkbox") {
                        newNode.attrs.set("class", "art-md-item-checkbox");
                        let item_checkbox = new VNode("item_checkbox");
                        item_checkbox.attrs.set("type", "checkbox");
                        if ((pos.rowNode.previousSibling as HTMLInputElement).checked) {
                            item_checkbox.attrs.set("checked", "checked");
                        }
                        newNode.appendChild(item_checkbox);
                    }
                    if (pos.rowNodeAnchorOffset === md.length) {
                        newNode_1 = new VNode("paragraph");
                        newNode_1.appendChild(new VNode("linebreak"));
                        newNode.appendChild(newNode_1);
                        this.operation.insertAfter(newNode, rowVNode.parent);
                        newNode = newNode_1;
                    } else if (pos.rowNodeAnchorOffset) {
                        _str = md.substring(pos.rowNodeAnchorOffset);
                        newNode_1 = this.parser.inlineParse(_str);
                        newNode.appendChild(newNode_1);
                        this.operation.insertAfter(newNode, rowVNode.parent);
                        newNode = newNode_1;

                        _str = md.substring(0, pos.rowNodeAnchorOffset)
                        newNode_1 = this.parser.inlineParse(_str);
                        this.operation.replace(newNode_1, rowVNode);
                    } else {
                        newNode_1 = new VNode("paragraph");
                        newNode_1.appendChild(new VNode("linebreak"));
                        newNode.appendChild(newNode_1);
                        this.operation.insertBefore(newNode, rowVNode);
                        newNode = newNode_1;
                    }

                    this.operation.update();
                    Cursor.setCursor(newNode.dom, 0);
                }
                return false;
            } else if (Tool.hasClass(dom, "art-md-CodeBlock")) {
                let data = (pos.rowNode as HTMLElement).innerText, anchorOffset = pos.rowNodeAnchorOffset;
                data = data.substring(0, anchorOffset) + "\n" + data.substring(anchorOffset)
                newNode = new VNode("code_block");
                newNode._info = node._info;
                newNode._literal = data;
                this.operation.replace(newNode, node);
                this.operation.update();

                anchorOffset += 1;
                Cursor.setCursor(...Cursor.getNodeAndOffset(newNode.dom.childNodes[1].firstChild, anchorOffset));
                this.artRender.cursor.getSelection();
                return false;
            } else if (Tool.hasClass(dom, "art-md-MathBlock")) {
                let data = (pos.rowNode as HTMLElement).innerText, anchorOffset = pos.rowNodeAnchorOffset;
                data = data.substring(0, anchorOffset) + "\n" + data.substring(anchorOffset)
                newNode = new VNode("math_block");
                newNode._literal = data;
                this.operation.replace(newNode, node);
                this.operation.update();

                anchorOffset += 1;
                (<HTMLElement>newNode.dom.firstChild).classList.replace("art-display-none", "art-display");
                Cursor.setCursor(...Cursor.getNodeAndOffset(newNode.dom.firstChild.childNodes[1], anchorOffset));
                this.artRender.cursor.getSelection();
                return false;
            } else if (Tool.hasClass(dom, "art-md-HtmlBlock")) {
                let data = (pos.rowNode as HTMLElement).innerText, anchorOffset = pos.rowNodeAnchorOffset;
                data = data.substring(0, anchorOffset) + "\n" + data.substring(anchorOffset)
                newNode = new VNode("html_block");
                newNode._literal = data;
                this.operation.replace(newNode, node);
                this.operation.update();

                anchorOffset += 1;
                (<HTMLElement>newNode.dom.firstChild).classList.replace("art-display-none", "art-display");
                Cursor.setCursor(...Cursor.getNodeAndOffset(newNode.dom.firstChild, anchorOffset));
                this.artRender.cursor.getSelection();
                return false;
            } else if (dom.nodeName === "P" || /^H[1-6]$/.test(dom.nodeName)) {
                let _str: string, match, newNode_1;
                if (pos.inAnchorOffset === md.length) {
                    newNode = new VNode("paragraph");
                    newNode.appendChild(new VNode("linebreak"));
                    this.operation.insertAfter(newNode, node);
                } else if (pos.inAnchorOffset) {
                    _str = md.substring(pos.inAnchorOffset);
                    newNode = this.parser.inlineParse(_str);
                    this.operation.insertAfter(newNode, node);

                    _str = md.substring(0, pos.inAnchorOffset);
                    if ((match = _str.match(reATXHeadingMarker)) && _str.charCodeAt(match[0].length) == 32) {
                        newNode_1 = new VNode("heading");
                        newNode_1._level = match[0].length;
                        newNode_1._string_content = _str.substring(match[0].length + 1);
                        this.parser.parser.inlineParser.parse(newNode_1);
                        this.parser.interactionParse(newNode_1);
                    } else {
                        newNode_1 = this.parser.inlineParse(_str);
                    }
                    this.operation.replace(newNode_1, node);
                } else {
                    newNode = new VNode("paragraph");
                    newNode.appendChild(new VNode("linebreak"));
                    this.operation.insertBefore(newNode, node);
                }

                this.operation.update();
                Cursor.setCursor(newNode.dom, 0);
                return false;
            } else {
                console.log("enter wu------------------", dom)
            }
        }

        return true;
    }

    public paragraph(node: VNode): void {
        let md = node.getMd(), match: RegExpMatchArray, newNode: VNode;
        console.log(md);
        if (md.length && md.charCodeAt(md.length - 1) === 10)
            md = md.substring(0, md.length - 1);
        if (md == "" || md == "\n" || reCodeFence.test(md) || reThematicBreak.test(md))
            return null;
        else if ((match = md.match(reBulletListMarker)) && md.charCodeAt(1) == 32) {
            newNode = new VNode("list");
            newNode.listType = "bullet";
            newNode.appendChild(new VNode("item"));
            newNode.firstChild.appendChild(new VNode("paragraph"));
            newNode.firstChild.firstChild.appendChild(new VNode("linebreak"));
            this.operation.replace(newNode, node);
            this.operation.update();

            this.cursor.pos.inFocusOffset -= 2;
            this.cursor.pos.inAnchorOffset -= 2;
        } else if ((match = md.match(reOrderedListMarker)) && md.charCodeAt(2) == 32) {
            newNode = new VNode("list");
            newNode.listType = "ordered";
            newNode.appendChild(new VNode("item"));
            newNode.firstChild.appendChild(new VNode("paragraph"));
            newNode.firstChild.firstChild.appendChild(new VNode("linebreak"));
            this.operation.replace(newNode, node);
            this.operation.update();

            this.cursor.pos.inFocusOffset -= 3;
            this.cursor.pos.inAnchorOffset -= 3;
        } else if ((match = md.match(reBlockQuote)) && md.charCodeAt(1) == 32) {
            newNode = new VNode("block_quote");
            newNode.appendChild(new VNode("paragraph"));
            newNode.firstChild.appendChild(new VNode("linebreak"));
            this.operation.replace(newNode, node);
            this.operation.update();

            this.cursor.pos.inFocusOffset -= 2;
            this.cursor.pos.inAnchorOffset -= 2;
        } else if ((match = md.match(reATXHeadingMarker)) && md.charCodeAt(match[0].length) == 32) {
            newNode = new VNode("heading");
            newNode._level = match[0].length;
            newNode._string_content = md.substring(match[0].length + 1);
            this.parser.parser.inlineParser.parse(newNode);
            this.parser.interactionParse(newNode);

            this.operation.replace(newNode, node);
            this.operation.update();
        } else {
            let newNode = this.parser.inlineParse(md);
            this.operation.replace(newNode, node);
            this.operation.update();
        }
    }

    public list(node: VNode): void {
        let child = node.firstChild, next: VNode;
        while (child) {
            next = child.next;
            this.item(child);
            child = next;
        }
    }

    public item(node: VNode) {
        let child = node.firstChild, next: VNode;
        while (child) {
            next = child.next;
            switch (child.type) {
                case "list":
                    this.list(child);
                    break;
                case "paragraph":
                    this.paragraph(child);
                    break;
                case "block_quote":
                    this.block_quote(child);
                    break;
                case "item_checkbox":
                    break;
                default:
                    console.error(child);
                    throw "Interction class: item 中不存在" + child.type + "类型";
            }
            child = next;
        }

        // } else if (vnode.nodeName == 'ul' && /^\[x|X\]\s/.test(li.getMd())) {
        //     let p = new VNode('p', {}, [new VNode('input', { type: 'checkbox', checked: 'checked' }), ...inline(li.getMd().substring(4))]);
        //     li.replaceAllChild([p]);
        // } else if (vnode.nodeName == 'ul' && /^\[\s\]\s/.test(li.getMd())) {
        //     let p = new VNode('p', {}, [new VNode('input', { type: 'checkbox' }), ...inline(li.getMd().substring(4))]);
        //     li.replaceAllChild([p]);
        // } else if (li.childNodes[0].nodeName == 'p' && (<VNode>li.childNodes[0]).childNodes[0].nodeName == 'input') {
        //     (<VNode>li.childNodes[0]).replaceAllChild([(<VNode>li.childNodes[0]).childNodes[0], ...inline(li.childNodes[0].getMd())]);
        // }
    }

    public block_quote(node: VNode) {
        let child = node.firstChild, next: VNode;
        while (child) {
            next = child.next;
            switch (child.type) {
                case "list":
                    this.list(child);
                    break;
                case "paragraph":
                    this.paragraph(child);
                    break;
                case "block_quote":
                    this.block_quote(child);
                    break;
                default:
                    throw "Interction class: block_quote 中不存在" + child.type + "类型";
            }
            child = next;
        }
    }

    public code_block(node: VNode) {
        let code = node.dom.firstChild as HTMLElement;

        let lang;
        let info_words = node._info ? node._info.split(/\s+/) : [];
        if (info_words.length > 0 && info_words[0].length > 0) {
            code.setAttribute("class", "lang-" + info_words[0]);
            lang = info_words[0].match(/lang-(.*?)(\s|$)/);
        }

        if (node.next.type == "art_tool") {
            let tool = node.next.attrs.get('--tool');
            if (tool == "code_block_flow" && ArtRender.plugins.flowchart) {
                ArtRender.plugins.flowchart(node.next.dom, node._literal);
            } else if (tool == "code_block_mermaid" && ArtRender.plugins.mermaid) {
                ArtRender.plugins.mermaid(node.next.dom, node._literal);
            }
        }

        if (ArtRender.plugins.hljs) {
            ArtRender.plugins.hljs(code, node._literal, lang);
        } else {
            code.innerHTML = node._literal;
        }
    }

    diff(newNode: VNode, oldNode: VNode) {
        if (!oldNode.isEqual(newNode)) {

        }
    }
}
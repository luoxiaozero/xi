import EventCenter from "@/eventCenter";
import ArtRender from "..";
import VNode from "@/node";
import { domToNode } from "./conversion";
import Cursor from "../cursor";
import Operation from "@/node/operation";
import InteractionParser from "./interactionParser";

const reCodeFence = /^`{3,}(?!.*`)|^~{3,}/;
const reBulletListMarker = /^[*+-]/;
const reOrderedListMarker = /^(\d{1,9})([.)])/;
const reATXHeadingMarker = /^#{1,6}/;
const reThematicBreak = /^(?:(?:\*[ \t]*){3,}|(?:_[ \t]*){3,}|(?:-[ \t]*){3,})[ \t]*$/;
const reBlockQuote = /^>/;

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
        console.log(key)
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
                    this.domUpdateDoc();
                    state = this.keyup();
            }
        }

        this.cursor.setSelection();
        this.artRender.artText.get<EventCenter>('$eventCenter').emit('artRender-render')
        return state;
    }

    public domUpdateDoc() {
        if (!this.cursor.location)
            return;

        let sub = this.cursor.location.anchorAlineOffset;
        if (sub == -1)
            return false;

        let dom = this.artRender.dom.childNodes[sub] as HTMLElement;
        let node = this.artRender.doc.firstChild;
        while (--sub != -1) {
            node = node.next;
        }
        console.log(node, domToNode(dom), this.artRender.cursor.location.anchorAlineOffset)
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
        if (!this.cursor.location)
            return;
        let sub = this.cursor.location.anchorAlineOffset;
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
        let location = this.artRender.cursor.getSelection();
        if (location) {
            let dom = this.artRender.dom.childNodes[location.anchorAlineOffset];
            if (dom.nodeName == 'PRE') {
                if (location.anchorNode.previousSibling == null && location.anchorInlineOffset == 0)
                    return false;
            } else {
                console.log("无执行", location)
            }
        }
        return true;
    }

    /**回车渲染 */
    enter(): boolean {
        let location = this.cursor.location;
        let { anchorNode, anchorOffset } = this.artRender.cursor.location;
        if (location) {
            let sub = this.cursor.location.anchorAlineOffset;
            if (sub == -1)
                return false;

            let node = this.artRender.doc.firstChild, i = sub, newNode: VNode;
            while (--i != -1) {
                node = node.next;
            }

            let md = node.getMd();
            if (md.length && md.charCodeAt(md.length - 1) === 10)
                md = md.substring(0, md.length - 1);

            let dom = this.artRender.dom.childNodes[location.anchorAlineOffset] as HTMLElement;
            if (reThematicBreak.test(md)) {
                console.log("thematic_break")
                newNode = new VNode("thematic_break");
                newNode.attrs.set("art-marker", md);
                this.operation.replace(newNode, node);
                this.operation.update();
                this.cursor.location.focusInlineOffset = 0;
                this.cursor.location.anchorInlineOffset = 0;
                return false;
            } else if (reCodeFence.test(md)) {
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
                this.cursor.location.focusInlineOffset = 0;
                this.cursor.location.anchorInlineOffset = 0;
                return false;
            } else if (anchorNode.parentNode.nodeName == 'BLOCKQUOTE' && anchorOffset == 0 && anchorNode.nodeName == 'P'
                && anchorNode.childNodes.length == 1 && anchorNode.childNodes[0].nodeName == 'BR') {
                // blockquote 退出
                let p = document.createElement('p');
                p.innerHTML = '<br/>';

                if (anchorNode.parentNode.nextSibling)
                    anchorNode.parentNode.parentNode.insertBefore(p, anchorNode.parentNode.nextSibling);
                else
                    anchorNode.parentNode.parentNode.appendChild(p);
                anchorNode.parentNode.removeChild(anchorNode);

                Cursor.setCursor(p, 0);
                this.artRender.cursor.getSelection();
                return false;
            } else if (anchorNode.parentNode.parentNode.nodeName == 'BLOCKQUOTE' && anchorNode.nextSibling == null
                && anchorOffset == (<Text>anchorNode).length) {
                // ul ol中的blockquote添加新行
                let p = document.createElement('p');
                p.innerHTML = '<br/>';

                if (anchorNode.parentNode.nextSibling)
                    anchorNode.parentNode.parentNode.insertBefore(p, anchorNode.parentNode.nextSibling);
                else
                    anchorNode.parentNode.parentNode.appendChild(p);

                Cursor.setCursor(p, 0);
                this.artRender.cursor.getSelection();
                return false;
            } else if (anchorOffset == 0 && anchorNode.nodeName == 'LI' && anchorNode.childNodes.length == 1
                && anchorNode.childNodes[0].nodeName == 'BR') {
                // li 退回到root
                let p = document.createElement('p');
                p.innerHTML = '<br/>';

                if (anchorNode.parentNode.nextSibling)
                    anchorNode.parentNode.parentNode.insertBefore(p, anchorNode.parentNode.nextSibling);
                else
                    anchorNode.parentNode.parentNode.appendChild(p);
                anchorNode.parentNode.removeChild(anchorNode);

                Cursor.setCursor(p, 0);
                this.artRender.cursor.getSelection();
                return false;
            } else if (anchorNode.nodeName == 'LI') {
                // li [ul, ol]返回到li 新建一行p
                let p = document.createElement('p');
                p.innerHTML = '<br/>';

                if (anchorNode.parentNode.nextSibling)
                    anchorNode.parentNode.parentNode.insertBefore(p, anchorNode);
                else
                    anchorNode.parentNode.parentNode.appendChild(p);
                anchorNode.parentNode.removeChild(anchorNode);

                Cursor.setCursor(p, 0);
                this.artRender.cursor.getSelection();
                return false;
            } else if (anchorNode.nodeName == 'P' && anchorNode.parentNode.nodeName == 'LI'
                && anchorNode.childNodes.length == 1 && anchorNode.childNodes[0].nodeName == 'BR') {
                // 从li中的p退到li中 
                let li = document.createElement('li');
                li.innerHTML = '<p><br/></p>';

                if (anchorNode.parentNode.nextSibling)
                    anchorNode.parentNode.parentNode.insertBefore(li, anchorNode.parentNode.nextSibling);
                else
                    anchorNode.parentNode.parentNode.appendChild(li);
                anchorNode.parentNode.removeChild(anchorNode);

                Cursor.setCursor(li, 0);
                this.artRender.cursor.getSelection();
                return false;
            } else if (dom.nodeName == 'PRE') {
                let text = '\n\r';
                let data = location.anchorNode.nodeValue;
                console.log(data);
                data = data.substring(0, location.anchorOffset) + text + data.substring(location.anchorOffset)
                location.anchorNode.nodeValue = data;
                Cursor.setCursor(location.anchorNode, location.anchorOffset + 1);
                this.artRender.cursor.getSelection();
                return false;
            } else {

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

            this.cursor.location.focusInlineOffset -= 2;
            this.cursor.location.anchorInlineOffset -= 2;
        } else if ((match = md.match(reOrderedListMarker)) && md.charCodeAt(2) == 32) {
            newNode = new VNode("list");
            newNode.listType = "ordered";
            newNode.appendChild(new VNode("item"));
            newNode.firstChild.appendChild(new VNode("paragraph"));
            newNode.firstChild.firstChild.appendChild(new VNode("linebreak"));
            this.operation.replace(newNode, node);
            this.operation.update();

            this.cursor.location.focusInlineOffset -= 3;
            this.cursor.location.anchorInlineOffset -= 3;
        } else if ((match = md.match(reBlockQuote)) && md.charCodeAt(1) == 32) {
            newNode = new VNode("block_quote");
            newNode.appendChild(new VNode("paragraph"));
            newNode.firstChild.appendChild(new VNode("linebreak"));
            this.operation.replace(newNode, node);
            this.operation.update();

            this.cursor.location.focusInlineOffset -= 2;
            this.cursor.location.anchorInlineOffset -= 2;
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
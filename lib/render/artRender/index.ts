import ArtText from "lib";
import Tool from "lib/tool";
import initTableTool from "lib/render/artRender/tool/tableTool";
import initTocTool from "./tool/tocTool";
import VTextNode from "./vNode/vTextNode";
import Render from "..";
import Cursor from "lib/render/artRender/cursor";
import VNode from "lib/render/artRender/vNode";
import { domToNode, textToNode } from "lib/render/artRender/toNode";
import initCodeTool from "./tool/codeTool";
import Editor from "lib/editor";
import inline from './inline';
import aline from "lib/render/artRender/aline";
import { TableMoreTool } from "./tool/tableTool/tableMoreTool";
import ArtRenderEvent from "./renderEvent";
import FloatAuxiliaryTool from "./tool/floatAuxiliaryTool";


export default class ArtRender implements Render {
    //static Plugins: {} = { OpenVersionHistory, SaveMdFile };

    abbrName: string;
    artText: ArtText;
    dom: HTMLDivElement;
    htmlNode: VNode;

    cursor: Cursor;
    tableMoreTool: TableMoreTool;
    floatAuxiliaryTool: FloatAuxiliaryTool;
    renderEvent: ArtRenderEvent;
    constructor(artText: ArtText) {
        this.artText = artText;
        this.htmlNode = new VNode('div', { __root__: true, class: 'art-editor-html'}, new VNode('p', {}, new VNode('br')));
        this.cursor = null;
        this.abbrName = ' MD ';

        this.tableMoreTool = new TableMoreTool();
        this.floatAuxiliaryTool = new FloatAuxiliaryTool();

        this.renderEvent = new ArtRenderEvent(this);
        ArtText.DEFAULT_CSS += '.art-editor-html{outline:none;white-space:pre-wrap;word-break:break-all}\n\
        .art-toc{padding: 6px 15px;margin: 0 0 15px;font-weight:500;border: 1px dashed #9990;}.art-toc p{margin-bottom: 2px}.art-toc a{border-bottom: none;color: #4183c4}.art-toc-h2{margin-left:2em}.art-toc-h3{margin-left:4em}.art-toc-h4{margin-left:6em}.art-toc-h5{margin-left:8em}.art-toc-h6{margin-left:10em}\n\
        .art-tocTool{width:100%;font-size:14px;position:relative;}\n\
        .art-buttonTool-hover{font-size:13px;font-weight:600;margin-left:4px;cursor:pointer;border: none;outline: none;padding: 0px 4px;border: 1px solid #9a9a9a00;background:#fff;}.art-buttonTool-hover:hover{border-color:#aaaa;background:#efefef;}\n\
        .art-flowTool{width:100%;text-align: center;}'
        
    }
    public createDom(): HTMLDivElement {
        this.artText.tool.addTool(this.tableMoreTool.createDom());
        this.artText.tool.addTool(this.floatAuxiliaryTool.createDom());

        this.dom = this.htmlNode.newDom();
        return this.dom;
    }

    init(): void {
        this.cursor = new Cursor(this.htmlNode.dom);
        const artRender = this;
        this.artText.eventCenter.on('DOM-click', () => {artRender.floatAuxiliaryTool.close();artRender.tableMoreTool.close()});
        this.artText.eventCenter.on('DOM-mousewheel', () => {artRender.floatAuxiliaryTool.close();artRender.tableMoreTool.close()});

        this.renderEvent.init();
    }

    public backRender(): boolean {
        let location = this.cursor.getSelection();
        if (location) {
            let dom = this.htmlNode.dom.childNodes[location.anchorAlineOffset];
            if (dom.nodeName == 'PRE') {
                if (location.anchorNode.previousSibling == null && location.anchorInlineOffset == 0)
                    return false;
            } else {
                console.log("无执行", location)
            }
        }
        return true;
    }

    public enterRender(): boolean {
        let location = this.cursor.getSelection();
        if (location) {
            this.htmlNode.replaceAllChild((domToNode(this.htmlNode.dom) as VNode).childNodes);

            let md = this.htmlNode.childNodes[location.anchorAlineOffset].getMd();
            let dom = this.htmlNode.dom.childNodes[location.anchorAlineOffset];
            if (/^(\*{3,}$|^\-{3,}$|^\_{3,}$)/.test(md)) {
                let hr = document.createElement('hr');
                this.htmlNode.dom.replaceChild(hr, dom);
                Cursor.setCursor(hr, 0);
                return false;
            } else if (/^\[(TOC)|(toc)\]$/.test(md)) {
                // @future vnodes.push(new VNode('div', {class: 'art-shield art-tocTool', contenteditable: 'false', __dom__: 'tocTool'}));
                // @future vnodes.push(new VNode('div', {class: 'art-shield art-toc', contenteditable: 'false', __dom__: 'toc'}));
                let toc = document.createElement('div');
                toc.setAttribute('class', 'art-shield art-toc');
                toc.setAttribute('contenteditable', 'false')

                let tocTool = document.createElement('div');
                tocTool.setAttribute('class', 'art-shield art-tocTool');
                tocTool.setAttribute('contenteditable', 'false')
                initTocTool(tocTool);

                let p = document.createElement('p');
                p.innerHTML = '<br/>';
                if (dom.nextSibling)
                    dom.parentNode.insertBefore(p, dom.nextSibling);
                else
                    dom.parentNode.appendChild(p);

                this.htmlNode.dom.replaceChild(toc, dom);
                this.htmlNode.dom.insertBefore(tocTool, toc);
                this.updateToc();
                Cursor.setCursor(p, 0);
                return false;
            } else if (/^\|.*\|/.test(md)) {
                // 生成table
                let table = document.createElement('table');
                let thead = document.createElement('thead');
                let tbody = document.createElement('tbody');
                table.appendChild(thead);
                table.appendChild(tbody);
                table.style.width = '100%';
                let tr1 = document.createElement('tr');
                let tr2 = document.createElement('tr');
                let arry = md.split('|');
                for (let i = 1, len = arry.length - 1; i < len; i++) {
                    let th = document.createElement('th');
                    th.innerHTML = arry[i];
                    tr1.appendChild(th)
                    tr2.appendChild(document.createElement('td'))
                }
                thead.appendChild(tr1);
                tbody.appendChild(tr2);

                let tool = document.createElement('div');
                tool.setAttribute('class', 'art-shield art-tableTool');
                tool.setAttribute('contenteditable', 'false')
                initTableTool(tool);

                this.htmlNode.dom.replaceChild(table, this.htmlNode.dom.childNodes[location.anchorAlineOffset]);
                this.htmlNode.dom.insertBefore(tool, table);
                Cursor.setCursor(tr2.childNodes[0], 0);
                return false;
            } else if (/^```/.test(md)) {
                // 生成code
                let pre = document.createElement('pre');
                let code = document.createElement('code');
                code.innerHTML = '\n';
                let lang = md.match(/^```\s*([^\s]*?)\s*$/)[1];

                let tool = document.createElement('div');
                tool.setAttribute('class', 'art-shield art-codeTool');
                tool.setAttribute('contenteditable', 'false')

                if (lang != undefined && lang != '') {
                    code.setAttribute('class', 'lang-' + lang);
                    pre.setAttribute('class', 'art-pre-' + lang)
                    if (lang == 'flow') {
                        let div = document.createElement('div')
                        div.setAttribute('class', 'art-shield art-flowTool');
                        div.setAttribute('art-flow', '')
                        div.setAttribute('contenteditable', 'false');
                        this.htmlNode.dom.insertBefore(div, this.htmlNode.dom.childNodes[location.anchorAlineOffset].nextSibling);
                    }
                    initCodeTool(tool, lang);
                } else {
                    initCodeTool(tool);
                }

                pre.appendChild(code);

                this.htmlNode.dom.replaceChild(pre, this.htmlNode.dom.childNodes[location.anchorAlineOffset]);
                this.htmlNode.dom.insertBefore(tool, pre);
                Cursor.setCursor(code, 0);
                return false;
            } else if (location.anchorNode.parentNode.nodeName == 'BLOCKQUOTE' && location.anchorOffset == 0 && location.anchorNode.nodeName == 'P'
                && location.anchorNode.childNodes.length == 1 && location.anchorNode.childNodes[0].nodeName == 'BR') {
                // blockquote 退出
                let dom = location.anchorNode;
                let p = document.createElement('p');
                p.innerHTML = '<br/>';
                if (dom.parentNode.nextSibling)
                    dom.parentNode.parentNode.insertBefore(p, dom.parentNode.nextSibling);
                else
                    dom.parentNode.parentNode.appendChild(p);
                dom.parentNode.removeChild(dom);

                Cursor.setCursor(p, 0)
                return false;
            } else if (location.anchorNode.parentNode.parentNode.nodeName == 'BLOCKQUOTE' && location.anchorNode.nextSibling == null
                && location.anchorOffset == (<Text>location.anchorNode).length) {
                // ul ol中的blockquote添加新行
                let dom = location.anchorNode;
                let p = document.createElement('p');
                p.innerHTML = '<br/>';

                if (dom.parentNode.nextSibling)
                    dom.parentNode.parentNode.insertBefore(p, dom.parentNode.nextSibling);
                else
                    dom.parentNode.parentNode.appendChild(p);

                Cursor.setCursor(p, 0)
                return false;
            } else if (location.anchorOffset == 0 && location.anchorNode.nodeName == 'LI' && location.anchorNode.childNodes.length == 1
                && location.anchorNode.childNodes[0].nodeName == 'BR') {
                // li 退出
                let dom = location.anchorNode;
                let p = document.createElement('p');
                p.innerHTML = '<br/>';
                if (dom.parentNode.nextSibling)
                    dom.parentNode.parentNode.insertBefore(p, dom.parentNode.nextSibling);
                else
                    dom.parentNode.parentNode.appendChild(p);
                dom.parentNode.removeChild(dom);

                Cursor.setCursor(p, 0);
                return false;
            } else if (location.anchorNode.parentNode.nodeName == 'P' && location.anchorNode.parentNode.parentNode.nodeName == 'LI') {
                // li 中新建一行
                let dom = location.anchorNode;
                let p = document.createElement('p');
                p.innerHTML = '<br/>';

                if (dom.parentNode.nextSibling)
                    dom.parentNode.parentNode.insertBefore(p, dom.parentNode.nextSibling);
                else
                    dom.parentNode.parentNode.appendChild(p);
                Cursor.setCursor(p, 0);
                return false;
            } else if (location.anchorNode.nodeName == 'P' && location.anchorNode.parentNode.nodeName == 'LI'
                && location.anchorNode.childNodes.length == 1 && location.anchorNode.childNodes[0].nodeName == 'BR') {
                // 从li中的p退到li中 
                let dom = location.anchorNode;
                let li = document.createElement('li');
                li.innerHTML = '<br/>';

                if (dom.parentNode.nextSibling)
                    dom.parentNode.parentNode.insertBefore(li, dom.parentNode.nextSibling);
                else
                    dom.parentNode.parentNode.appendChild(li);
                dom.parentNode.removeChild(dom);
                Cursor.setCursor(li, 0);
                return false;
            } else if (dom.nodeName == 'PRE') {
                let text = '\n\r';
                let data = location.anchorNode.nodeValue;
                console.log(data);
                data = data.substring(0, location.anchorOffset) + text + data.substring(location.anchorOffset)
                location.anchorNode.nodeValue = data;
                Cursor.setCursor(location.anchorNode, location.anchorOffset + 1);
                return false;
            } else {
                console.log("无执行", location)
            }
        }

        return true;
    }

    public nodeRender(dom: HTMLElement, vnode: VNode) {
        if (dom.nodeName.toLowerCase() == vnode.nodeName) {
            if (vnode.nodeName == "code") {
                if (dom.getAttribute('style') && (vnode.attr['style'] == undefined || !vnode.attr['class']))
                    dom.setAttribute('style', '');
                for (let key in vnode.attr) {
                    if (!(/^__[a-zA-Z\d]+__$/.test(key))) {
                        dom.setAttribute(key, vnode.attr[key]);
                    }
                }
                let md = vnode.getMd();
                if (Editor.plugins.hljs && vnode.parentNode.nodeName == 'pre') {
                    let className: string = vnode.attr['class'];
                    if (!className) {
                        className = '';
                    }
                    let lang = className.match(/lang-(.*?)(\s|$)/);
                    if (lang && Editor.plugins.hljs.getLanguage(lang[1]) != undefined) {
                        md = Editor.plugins.hljs.highlight(lang[1], md).value;
                    } else {
                        let code = Editor.plugins.hljs.highlightAuto(md);
                        md = code.value;
                        if (!dom.className.match(code.language))
                            dom.className += ' ' + code.language;
                    }
                }
                dom.innerHTML = md;
                return null
            } else if (Tool.hasClass(dom, "art-shield")) {
                let styleClean = true;
                if (vnode.hasClass('art-flowTool') && Editor.plugins.flowchart && Editor.plugins.Raphael) {
                    dom.innerHTML = ''
                    let md = (<HTMLPreElement>dom.previousSibling).innerText;
                    try {
                        let chart = Editor.plugins.flowchart.parse(md);
                        chart.drawSVG(dom);
                        (<HTMLPreElement>dom.previousSibling).style.display = 'none';
                        dom.onclick = function click() {
                            if (Tool.hasClass(this as HTMLDivElement, "art-flowTool")) {
                                (<HTMLPreElement>(<HTMLDivElement>this).previousSibling).style.display = 'inherit';
                            }
                            Cursor.setCursor((<HTMLPreElement>(<HTMLDivElement>this).previousSibling), 0);
                        }
                    } catch (error) {
                        console.error('flowchart发生错误')
                        console.error(error);
                    }
                } else if (vnode.attr['__dom__'] == 'math' && Editor.plugins.katex) {
                    let math = (<HTMLElement>dom.childNodes[0]).getAttribute("art-math")
                    if (math && (<VNode>vnode.childNodes[0]).attr["art-math"] != math) {
                        (<HTMLElement>dom.childNodes[0]).innerHTML = Editor.plugins.katex.renderToString((<VNode>vnode.childNodes[0]).attr["art-math"], { throwOnError: false });
                        (<HTMLElement>dom.childNodes[0]).setAttribute("art-math", (<VNode>vnode.childNodes[0]).attr["art-math"]);
                    }
                } else if (vnode.attr['__dom__'] == 'tocTool') {
                    initTocTool(dom);
                    styleClean = false;
                } else if (vnode.attr['__dom__'] == 'codeTool') {
                    initCodeTool(dom, vnode.attr['__dict__']['codeLang']);
                    styleClean = false;
                } else if (vnode.attr['__dom__'] == 'tableTool') {
                    initTableTool(dom);
                    styleClean = false;
                } else if (Tool.hasClass(dom, "art-toc")) {
                    for (let i = 0, j = 0; i < dom.childNodes.length || j < vnode.childNodes.length; i++, j++) {
                        if (i >= dom.childNodes.length) {
                            dom.appendChild(vnode.childNodes[j].newDom());
                        } else if (j >= vnode.childNodes.length) {
                            let len = dom.childNodes.length;
                            while (i < len) {
                                dom.removeChild(dom.lastChild);
                                i++;
                            }
                        } else {
                            this.nodeRender(<HTMLElement>dom.childNodes[i], <VNode>vnode.childNodes[j])
                        }
                    }
                }
                if (styleClean && dom.getAttribute('style') && (vnode.attr['style'] == undefined || !vnode.attr['class']))
                    dom.setAttribute('style', '');
                for (let key in vnode.attr) {
                    if (!(/^__[a-zA-Z\d]+__$/.test(key))) {
                        dom.setAttribute(key, vnode.attr[key]);
                    }
                }
            } else {
                if (dom.getAttribute('style') && (vnode.attr['style'] == undefined || !vnode.attr['class']))
                    dom.setAttribute('style', '');
                for (let key in vnode.attr) {
                    if (!(/^__[a-zA-Z\d]+__$/.test(key))) {
                        dom.setAttribute(key, vnode.attr[key]);
                    }
                }
                for (let i = 0, j = 0; i < dom.childNodes.length || j < vnode.childNodes.length; i++, j++) {
                    if (i >= dom.childNodes.length) {
                        dom.appendChild(vnode.childNodes[j].newDom());
                    } else if (j >= vnode.childNodes.length) {
                        let len = dom.childNodes.length;
                        while (i < len) {
                            dom.removeChild(dom.lastChild);
                            i++;
                        }
                    } else {
                        if (vnode.childNodes[j].nodeName == "#text") {
                            if (dom.childNodes[i].nodeName.toLowerCase() == "#text") {
                                if ((<VTextNode>vnode.childNodes[j]).text != dom.childNodes[i].nodeValue) {
                                    dom.childNodes[i].nodeValue = (<VTextNode>vnode.childNodes[j]).text;
                                }
                            } else {
                                dom.replaceChild(vnode.childNodes[j].newDom(), dom.childNodes[i]);
                            }
                        } else {
                            this.nodeRender(dom.childNodes[i] as HTMLElement, <VNode>vnode.childNodes[j]);
                        }

                    }
                }
            }
        } else {
            dom.parentNode.replaceChild(vnode.newDom(), dom);
        }
        return null;
    }

    public dispose(vnode: VNode, text: string = null): VNode[] {
        if (text != null) {
            vnode.replaceAllChild(textToNode(text));
            return null;
        } else if (vnode.attr['__root__'] == true) {
            for (let i = vnode.childNodes.length - 1; i >= 0; i--) {
                let nodes = this.dispose(<VNode>vnode.childNodes[i]);
                if (nodes && nodes.length > 0) {
                    vnode.removeChild(vnode.childNodes[i]);
                    let refChild = vnode.childNodes[i];
                    for (let v of nodes) {
                        // 插入失败时，说明参考节点不存在，直接在后面添加
                        if (!vnode.insertBefore(v, refChild))
                            vnode.appendChild(v);
                    }
                }
            }
        } else if (vnode.attr['class'] && vnode.attr['class'].match(/art-shield/)) {
            return null;
        } else if (vnode.nodeName == 'blockquote') {
            for (let i = 0; i < vnode.childNodes.length; i++) {
                if (vnode.childNodes[i].nodeName == "blockquote" || vnode.childNodes[i].nodeName == "ul" || vnode.childNodes[i].nodeName == "ol") {
                    this.dispose(<VNode>vnode.childNodes[i]);
                } else if (/^>\s/.test(vnode.childNodes[i].getMd())) {
                    vnode.replaceChild(new VNode('blockquote', {}, new VNode('p', {}, new VNode('br'))), vnode.childNodes[i])
                } else if (/^\*\s/.test(vnode.childNodes[i].getMd())) {
                    vnode.replaceChild(new VNode('ul', {}, new VNode('li', {}, new VNode('br'))), vnode.childNodes[i])
                } else if (/^\d\.\s/.test(vnode.childNodes[i].getMd())) {
                    vnode.replaceChild(new VNode('ol', {}, new VNode('li', {}, new VNode('br'))), vnode.childNodes[i])
                } else {
                    (<VNode>vnode.childNodes[i]).replaceAllChild(inline(vnode.childNodes[i].getMd()));
                }
            }
        } else if (vnode.nodeName === "ul" || vnode.nodeName === "ol") {
            for (let i = 0; i < vnode.childNodes.length; i++) {
                if ((<VNode>vnode.childNodes[i]).childNodes[0].nodeName == "blockquote" || (<VNode>vnode.childNodes[i]).childNodes[0].nodeName == "ul" || (<VNode>vnode.childNodes[i]).childNodes[0].nodeName == "ol") {
                    for (let j = 0; j < (<VNode>vnode.childNodes[i]).childNodes.length; j++) {
                        if ((<VNode>vnode.childNodes[i]).childNodes[j].nodeName == "p") {
                            (<VNode>(<VNode>vnode.childNodes[i]).childNodes[j]).replaceAllChild(inline((<VNode>vnode.childNodes[i]).childNodes[j].getMd()));
                        } else {
                            this.dispose(<VNode>(<VNode>vnode.childNodes[i]).childNodes[j]);
                        }
                    }
                } else if (/^>\s/.test(vnode.childNodes[i].getMd())) {
                    (<VNode>vnode.childNodes[i]).replaceAllChild([new VNode("blockquote", {}, new VNode('p', {}, new VNode('br')))]);
                } else if (/^\*\s/.test(vnode.childNodes[i].getMd())) {
                    (<VNode>vnode.childNodes[i]).replaceAllChild([new VNode("ul", {}, new VNode("li", {}, new VNode('br')))]);
                } else if (/^\d\.\s/.test(vnode.childNodes[i].getMd())) {
                    (<VNode>vnode.childNodes[i]).replaceAllChild([new VNode("ol", {}, new VNode("li", {}, new VNode('br')))]);
                } else if ((<VNode>vnode.childNodes[i]).childNodes[0].nodeName == 'input') {
                    (<VNode>vnode.childNodes[i]).replaceAllChild([(<VNode>vnode.childNodes[i]).childNodes[0], ...inline(vnode.childNodes[i].getMd())]);
                } else if (/^\[x|X\]\s/.test(vnode.childNodes[i].getMd())) {
                    (<VNode>vnode.childNodes[i]).replaceAllChild([new VNode('input', { type: "checkbox", checked: "checked" }), ...inline(vnode.childNodes[i].getMd().substring(4))]);
                } else if (/^\[\s\]\s/.test(vnode.childNodes[i].getMd())) {
                    (<VNode>vnode.childNodes[i]).replaceAllChild([new VNode('input', { type: "checkbox" }), ...inline(vnode.childNodes[i].getMd().substring(4))]);
                } else {
                    (<VNode>vnode.childNodes[i]).replaceAllChild(inline((<VNode>vnode.childNodes[i]).childNodes[0].getMd()));
                }
            }
        } else if (vnode.nodeName == "table") {
            // table
            for (let i = 0; i < vnode.childNodes.length; i++) {
                // thead tbody
                for (let j = 0; j < (<VNode>vnode.childNodes[i]).childNodes.length; j++) {
                    /**tr th */
                    let t = (<VNode>vnode.childNodes[i]).childNodes[j] as VNode;
                    for (let k = 0; k < t.childNodes.length; k++) {
                        (<VNode>t.childNodes[k]).replaceAllChild(inline(t.childNodes[k].getMd()));
                    }
                }
            }
        } else if (vnode.nodeName === "pre") {
            return null
        } else if (vnode.nodeName == "hr") {
            return null
        } else {
            let md = vnode.getMd();
            let vnodes = null;
            if (/^>\s/.test(md)) {
                (<VNode>vnode.parentNode).replaceChild(new VNode('blockquote', {}, new VNode('p', {}, inline(md.substring(2)))), vnode);
                this.cursor.location.focusInlineOffset -= 2;
                this.cursor.location.anchorInlineOffset -= 2;
            } else if (/^\*\s/.test(md)) {
                (<VNode>vnode.parentNode).replaceChild(new VNode('ul', {}, new VNode('li', {}, inline(md.substring(2)))), vnode);
                this.cursor.location.focusInlineOffset -= 2;
                this.cursor.location.anchorInlineOffset -= 2;
            } else if (/^\d\.\s/.test(md)) {
                (<VNode>vnode.parentNode).replaceChild(new VNode('ol', {}, new VNode('li', {}, inline(md.substring(3)))), vnode);
                this.cursor.location.focusInlineOffset -= 3;
                this.cursor.location.anchorInlineOffset -= 3;
            } else if (vnodes = aline(md)) {
                // let nodes = textToNode(this.getMd());
                return vnodes;
            } else {
                return [new VNode('p', {}, inline(md))];
            }
        }
        return null
    }

    public render(key: string, type: string): boolean {
        //return false;
        this.cursor.getSelection();
        if (key == 'Backspace' && type == 'keydown') {
            return this.backRender();
        } else if (key == 'Enter' && type == 'keydown') {
            return this.enterRender();
        } else if (type == 'keyup'){
            this.htmlNode.replaceAllChild((domToNode(this.htmlNode.dom) as VNode).childNodes);

            this.dispose(this.htmlNode);
            this.updateToc();

            this.nodeRender(this.htmlNode.dom, this.htmlNode);

            this.cursor.setSelection();
            return false;
        }
        return false;
    }

    public updateToc() {
        let tocs = [];
        let directory = [];
        for (let vnode of this.htmlNode.childNodes) {
            if (/^h\d$/.test(vnode.nodeName)) {
                let md = vnode.getMd();
                md = md.replace(/\s/g, '-').replace(/\\|\/|#|\:/g, '');
                let a = new VNode('a', { href: '#' + md }, new VTextNode(vnode.getText()))
                let d = new VNode('p', { class: 'art-toc-' + vnode.nodeName }, a)
                directory.push(d);
            } else if (vnode instanceof VNode && (<VNode>vnode).attr['class'] && /art-toc(\s|$)/.test((<VNode>vnode).attr['class'])) {
                tocs.push(vnode);
            }
        }
        for (let toc of tocs) {
            toc.childNodes = directory;
        }
    }

    public open(): void {
        this.dom.style.display = 'inherit';
        this.dom.setAttribute('contenteditable', 'true');
    }

    public close(): void {
        this.dom.style.display = 'none';
    }

    public getMd() {
        let md = '';
        for (let i = 0; i < this.htmlNode.childNodes.length; i++) {
            let lineMd = this.htmlNode.childNodes[i].getMd('read');
            if (lineMd)
                md += lineMd + '\n';
        }
        return md;
    }

    public setMd(md: string) {
        this.dispose(this.htmlNode, md);
        this.updateToc();
        this.nodeRender(this.htmlNode.dom, this.htmlNode);
    }
}
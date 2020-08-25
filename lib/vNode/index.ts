import tableTool from "../tool/tableTool"
import imgTool from "../tool/imgTool"
import codeTool from "../tool/codeTool"
import { textToNode } from "../editor/toNode/index"
import inline from "../editor/inline/index"
import VTextNode from "./text";
import Editor from "../editor"
import Tool from "../tool"

class VNode {
    nodeName: string;
    attr: {};
    childNodes: any[];
    constructor(nodeName: string, attr: {} = {}, childNodes: any[] | VTextNode | VNode = null) {
        this.nodeName = nodeName;
        this.attr = attr;
        if (childNodes instanceof Array) {
            this.childNodes = childNodes;
        } else if (childNodes == null) {
            this.childNodes = []
        } else {
            this.childNodes = [childNodes]
        }
    }

    newDom(): any {
        let dom = document.createElement(this.nodeName);
        for (let key in this.attr) {
            if (key === "__dom__") {
                if (this.attr[key] === "math" && Editor.katex) {
                    let html = Editor.katex.renderToString(this.attr["art-math"], { throwOnError: false });
                    dom.innerHTML = html;
                } else if (this.attr[key] === "tableTool") {
                    dom.appendChild(tableTool())
                } else if (this.attr[key] === "imgTool") {
                    dom.appendChild(imgTool())
                } else if (this.attr[key] === "codeTool") {
                    dom.appendChild(codeTool())
                }
            } else if (!(/^__[a-zA-Z\d]+__$/.test(key))) {
                dom.setAttribute(key, this.attr[key]);
            }
        }

        this.childNodes.forEach((element) => {
            dom.appendChild(element.newDom());
        })
        return dom;
    }
    render(dom: HTMLElement) {
        if (dom.nodeName.toLowerCase() == this.nodeName) {
            if (this.nodeName == "code") {
                return null
            } else if (Tool.hasClass(dom, "art-shield")) {
                let math = dom.getAttribute("art-math")
                if (math && this.attr["art-math"] != math && Editor.katex) {
                    dom.innerHTML = Editor.katex.renderToString(this.attr["art-math"], { throwOnError: false });
                }
                for (let key in this.attr) {
                    if (!(/^__[a-zA-Z\d]+__$/.test(key))) {
                        dom.setAttribute(key, this.attr[key]);
                    }
                }
            } else {
                for (let key in this.attr) {
                    if (!(/^__[a-zA-Z\d]+__$/.test(key))) {
                        dom.setAttribute(key, this.attr[key]);
                    }
                }
                for (let i = 0, j = 0; i < dom.childNodes.length || j < this.childNodes.length; i++, j++) {
                    if (i >= dom.childNodes.length) {
                        dom.appendChild(this.childNodes[j].newDom());
                    } else if (j >= this.childNodes.length) {
                        let len = dom.childNodes.length;
                        while (i < len) {
                            dom.removeChild(dom.lastChild);
                            i++;
                        }
                    } else {
                        this.childNodes[j].render(dom.childNodes[i])
                    }
                }
            }
        } else {
            dom.parentNode.replaceChild(this.newDom(), dom);
        }
        return null;
    }

    static domToNode(dom: HTMLElement): VTextNode | VNode {
        if (dom.nodeName == '#text') {
            return new VTextNode(dom.nodeValue);
        } else {
            let vnode = new VNode(dom.nodeName.toLowerCase(), {}, []);
            for (let i = 0; i < dom.attributes.length; i++) {
                let it = dom.attributes[i];
                vnode.attr[it.localName] = it.value;
            }
            for (let i = 0; i < dom.childNodes.length; i++) {
                vnode.childNodes.push(VNode.domToNode(dom.childNodes[i] as HTMLElement));
            }
            return vnode;
        }
    }

    appendChild(node) {
        this.childNodes.push(node);
    }
    replaceChild(newNode, oldNode) {
        let index = this.childNodes.indexOf(oldNode)
        if (index != -1) {
            this.childNodes[index] = newNode;
        }
    }

    getMd(model = 'editor') {
        let md = ""
        if (this.nodeName == "a") {
            md += this.childNodes[0].text;
        } else if (this.nodeName == "hr" && model == 'read') {
            md += '***\n';
        } else if (this.nodeName == 'input' && this.attr['type'] == "checkbox" && model == 'read') {
            if (this.attr['checked'] == "checked") {
                md += '[x] '
            } else {
                md += '[ ] '
            }
        } else if (this.nodeName == "blockquote" && model == 'read') {
            for (let i = 0; i < this.childNodes.length; i++) {
                md += '> ' + this.childNodes[i].getMd(model);
            }
        } else if (this.nodeName == "ul" && model == 'read') {
            for (let i = 0; i < this.childNodes.length; i++) {
                md += '* ' + this.childNodes[i].getMd(model) + '\n';
            }
        } else if (this.nodeName == "ol" && model == 'read') {
            for (let i = 0; i < this.childNodes.length; i++) {
                md += (i + 1).toString() + '. ' + this.childNodes[i].getMd(model) + '\n';
            }
        } else if(model == 'read' && this.nodeName == 'li'){
            if(this.childNodes.length > 0 && this.childNodes[0] == 'ul'){

            }
            for (let i = 0; i < this.childNodes.length; i++) {
                md += this.childNodes[i].getMd(model);
            }
        } else if (model == 'read' && ('h1 h2 h3 h4 h5 h6'.indexOf(this.nodeName) >= 0 || this.nodeName == 'p')) {
            for (let i = 0; i < this.childNodes.length; i++) {
                md += this.childNodes[i].getMd(model)
            }
            md += '\n';
        } else if (model == 'read' && this.nodeName == 'table') {
            console.log(this);
            for (let k = 0; k < this.childNodes.length; k++) {
                for (let i = 0; i < this.childNodes[k].childNodes.length; i++) {
                    md += '|';
                    let j;
                    for (j = 0; j < this.childNodes[k].childNodes[i].childNodes.length; j++) {
                        md += this.childNodes[k].childNodes[i].childNodes[j].getMd(model) + '|';
                    }
                    md += '\n';
                    if (k == 0) {
                        md += '|'
                        while (j--) {
                            md += '---|'
                        }
                        md += '\n';
                    }
                }
            }
        } else if (model == 'read' && this.nodeName == 'pre') {
            md += '```'

            let className = this.childNodes[0].attr['class'];
            if (className) {
                md += ' ' + className.substring(5).split(' ')[0];
            }
            md += '\n';
            for (let i = 0; i < this.childNodes.length; i++) {
                md += this.childNodes[i].getMd(model) + '\n';
            }
            md += '```\n'
        } else if (this.attr["class"] && this.attr["class"] == "art-shield") {
            return ""
        } else {
            for (let i = 0; i < this.childNodes.length; i++) {
                md += this.childNodes[i].getMd(model);
            }
        }
        return md;
    }
    dispose() {
        if (this.attr['__root__'] == true) {
            for (let i = 0; i < this.childNodes.length; i++) {
                let nodes = this.childNodes[i].dispose();
                if (nodes && nodes.length > 0) {
                    this.childNodes.splice(i, 1, ...nodes);
                }
            }
        } else if (this.attr["class"] && this.attr["class"].match(/art-shield/)) {
            return null;
        } else if (this.nodeName == "blockquote") {
            for (let i = 0; i < this.childNodes.length; i++) {
                if (this.childNodes[i].nodeName == "blockquote" || this.childNodes[i].nodeName == "ul" || this.childNodes[i].nodeName == "ol") {
                    this.childNodes[i].dispose();
                } else if (/^>\s/.test(this.childNodes[i].getMd())) {
                    this.childNodes[i] = new VNode("blockquote", {}, new VNode('p', {}, new VNode('br')));
                } else if (/^\*\s/.test(this.childNodes[i].getMd())) {
                    this.childNodes[i] = new VNode("ul", {}, new VNode('li', {}, new VNode('br')));
                } else if (/^\d\.\s/.test(this.childNodes[i].getMd())) {
                    this.childNodes[i] = new VNode("ol", {}, new VNode('li', {}, new VNode('br')));
                } else {
                    this.childNodes[i].childNodes = inline(this.childNodes[i].getMd());
                }
            }
        } else if (this.nodeName === "ul" || this.nodeName === "ol") {
            for (let i = 0; i < this.childNodes.length; i++) {
                if (this.childNodes[i].childNodes[0].nodeName == "blockquote" || this.childNodes[i].childNodes[0].nodeName == "ul" || this.childNodes[i].childNodes[0].nodeName == "ol") {
                    for (let j = 0; j < this.childNodes[i].childNodes.length; j++) {
                        if (this.childNodes[i].childNodes[j].nodeName == "p") {
                            this.childNodes[i].childNodes[j].childNodes = inline(this.childNodes[i].childNodes[j].getMd())
                        } else {
                            this.childNodes[i].childNodes[j].dispose();
                        }
                    }
                } else if (/^>\s/.test(this.childNodes[i].getMd())) {
                    this.childNodes[i].childNodes = [new VNode("blockquote", {}, new VNode('p', {}, new VNode('br')))];
                } else if (/^\*\s/.test(this.childNodes[i].getMd())) {
                    this.childNodes[i].childNodes = [new VNode("ul", {}, new VNode("li", {}, new VNode('br')))];
                } else if (/^\d\.\s/.test(this.childNodes[i].getMd())) {
                    this.childNodes[i].childNodes = [new VNode("ol", {}, new VNode("li", {}, new VNode('br')))];
                } else {
                    if (this.childNodes[i].childNodes[0].nodeName == 'input') {
                        this.childNodes[i].childNodes = [this.childNodes[i].childNodes[0], ...inline(this.childNodes[i].getMd())];
                    } else if (/^\[x\]\s/.test(this.childNodes[i].getMd())) {
                        this.childNodes[i].childNodes = [new VNode('input', { type: "checkbox", checked: "checked" }), ...inline(this.childNodes[i].getMd().substring(4))];
                    } else if (/^\[\s\]\s/.test(this.childNodes[i].getMd())) {
                        this.childNodes[i].childNodes = [new VNode('input', { type: "checkbox" }), ...inline(this.childNodes[i].getMd().substring(4))];
                    } else {
                        this.childNodes[i].childNodes = inline(this.childNodes[i].getMd());
                    }
                }
            }
        } else if (this.nodeName == "table") {
            // table
            for (let i = 0; i < this.childNodes.length; i++) {
                // thead tbody
                for (let j = 0; j < this.childNodes[i].childNodes.length; j++) {
                    // tr
                    for (let k = 0; k < this.childNodes[i].childNodes[j].childNodes.length; k++) {
                        let nodes = inline(this.childNodes[i].childNodes[j].childNodes[k].getMd());
                        this.childNodes[i].childNodes[j].childNodes[k].childNodes = nodes;
                    }
                }
            }
        } else if (this.nodeName === "pre") {
            return null
        } else if (this.nodeName == "hr") {
            return null
        } else {
            let nodes = textToNode(this.getMd());
            return nodes;
        }
        return null
    }
}
export default VNode
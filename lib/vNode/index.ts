import tableTool from "../tool/tableTool"
import imgTool from "../tool/imgTool"
import codeTool from "../tool/codeTool"
import inline from "../editor/inline/index"
import aline from '../editor/aline'
import VTextNode from "./vTextNode";
import Editor from "../editor"
import Tool from "../tool"

class VNode {
    nodeName: string;
    attr: {};
    childNodes: any[];
    dom: HTMLElement;
    parentNode: VNode;

    constructor(nodeName: string, attr: {} = {}, childNodes: any[] | VTextNode | VNode = null) {
        this.parentNode = null;
        this.dom = null;

        this.nodeName = nodeName;
        this.attr = attr;
        if (childNodes instanceof Array) {
            this.childNodes = childNodes;
        } else if (childNodes == null) {
            this.childNodes = []
        } else {
            this.childNodes = [childNodes]
        }
        for(let node of this.childNodes){
            node.parentNode = this;
        }
    }

    newDom(): any {
        this.dom = document.createElement(this.nodeName);
        for (let key in this.attr) {
            if (key === "__dom__") {
                if (this.attr[key] === "tableTool") {
                    this.dom.appendChild(tableTool())
                } else if (this.attr[key] === "imgTool") {
                    this.dom.appendChild(imgTool())
                } else if (this.attr[key] === "codeTool") {
                    this.dom.appendChild(codeTool())
                }
            } else if (key == "art-math") {
                if(Editor.plugins.katex){
                    this.dom.innerHTML = Editor.plugins.katex.renderToString(this.attr["art-math"], { throwOnError: false });
                    this.dom.setAttribute(key, this.attr[key]);
                }else{
                    this.dom.setAttribute(key, '\n@math:katex未加载出@\n');
                }
            } else if (!(/^__[a-zA-Z\d]+__$/.test(key))) {
                this.dom.setAttribute(key, this.attr[key]);
            }
        }

        this.childNodes.forEach((element) => {
            this.dom.appendChild(element.newDom());
        })
        return this.dom;
    }
    domToNode(): VNode {
        this.nodeName = this.dom.nodeName.toLowerCase(); 
        this.attr = {};
        for (let i = 0; i < this.dom.attributes.length; i++) {
            let it = this.dom.attributes[i];
            this.attr[it.localName] = it.value;
        }
            
        if(this.dom.nodeName == 'INPUT'){
            if((<HTMLInputElement>this.dom).checked){
                this.attr['checked'] = 'checked';
            }else if(this.attr['checked']){
                delete this.attr['checked'];
            }
        }
        for (let i = 0; i < this.dom.childNodes.length; i++) {
            if(i < this.childNodes.length)
                this.childNodes[i].domToNode();
        }
        return this;
    }
    render(dom: HTMLElement) {
        if (dom.nodeName.toLowerCase() == this.nodeName) {
            if (this.nodeName == "code") {
                return null
            } else if (Tool.hasClass(dom, "art-shield")) {
                if(Tool.hasClass(dom, "art-flowTool") && Editor.plugins.flowchart && Editor.plugins.Raphael){
                    dom.innerHTML = ''
                    let md = (<HTMLPreElement>dom.previousSibling).innerText;
                    try{
                        let chart = Editor.plugins.flowchart.parse(md);
                        chart.drawSVG(dom);
                        (<HTMLPreElement>dom.previousSibling).style.display = 'none';
                        dom.onclick = function click(){
                            if(Tool.hasClass(this as HTMLDivElement, "art-flowTool")){
                                (<HTMLPreElement>(<HTMLDivElement>this).previousSibling).style.display = 'inherit';
                            }}
                    }catch(error){
                        console.error('flowchart发生错误')
                        console.error(error);
                    }
                }else if(this.attr['__dom__'] == 'math' && Editor.plugins.katex){
                    let math = (<HTMLElement>dom.childNodes[0]).getAttribute("art-math")
                    if (math && this.childNodes[0].attr["art-math"] != math) {
                        (<HTMLElement>dom.childNodes[0]).innerHTML = Editor.plugins.katex.renderToString(this.childNodes[0].attr["art-math"], { throwOnError: false });
                        (<HTMLElement>dom.childNodes[0]).setAttribute("art-math", this.childNodes[0].attr["art-math"]);
                    }
                }else if(Tool.hasClass(dom, "art-toc")){
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

    appendChild(vnode: VNode | VTextNode) {
        vnode.parentNode = this;
        this.childNodes.push(vnode);
        this.childNodes[this.childNodes.length - 1].parentNode = this;
    }
    replaceChild(newNode: VNode | VTextNode, oldNode: VNode | VTextNode): boolean {
        let index = this.childNodes.indexOf(oldNode)
        if (index != -1) {
            newNode.parentNode = this;
            this.childNodes[index] = newNode;
            return true;
        }
        return false;
    }

    getMd(model='editor') {
        let md = ""
        if(/art-toc/.test(this.attr['class'])){
            return '[TOC]\n'
        }else if (this.nodeName == "a" && this.childNodes.length > 0) {
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
                md += this.childNodes[i].getMd(model);
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
    getText(): string{
        let text = '';
        for(let vnode of this.childNodes){
            if(vnode.nodeName == '#text'){
                text += vnode.getText();
            }else if(vnode.attr['class'] != undefined && !/(art\-shield)|(art\-hide)|(art\-show)/.test(vnode.attr['class'])){
                text += vnode.getText();
            }
        }
        return text
    }
    dispose() {
        if (this.attr['__root__'] == true) {
            for (let i = this.childNodes.length - 1; i >= 0 ; i--) {
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
                    } else if (/^\[x|X\]\s/.test(this.childNodes[i].getMd())) {
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
            // let nodes = textToNode(this.getMd());
            let nodes = aline(this.getMd());
            if(nodes)
                return nodes;
            else
                return [new VNode("p", {}, inline(this.getMd()))];
        }
        return null
    }
}
export default VNode
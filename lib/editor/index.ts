import {textToNode, domToNode} from "./toNode/index"
import VNode from '../vNode/index'
import ArtText from "../../lib"
import Tool from "../tool"
import Cursor from "./cursor"
import VTextNode from "../vNode/vTextNode"
import inline from "./inline"
import aline from "./aline"
let win = window;
class Editor{
    static plugins = {hljs: null, katex: null, flowchart: null, Raphael: null};
    static setPlugin(key: string, value: any): void{
        Editor.plugins[key] = value;
        ArtText.artTextsRender();
    }

    artText: ArtText;
    cursor: Cursor;
    htmlNode: VNode;
    mdDom: HTMLTextAreaElement;
    editorDom: HTMLDivElement;
    fileInfo: {name: string};
    
    constructor(artText: ArtText) {
        this.artText = artText; 

        this.editorDom = null;
        this.htmlNode = null;
        this.mdDom = null;

        this.fileInfo = {name: null};  
        this.cursor = null;
    } 

    public init(): void{
        this.createEditor();
        this.cursor = new Cursor(this.htmlNode.dom);  
        Tool.addCss(defauleCss.replace('${theme.backgroundColor}', this.artText.options.theme.backgroundColor));
        this.registerPlugin();
        this.setMd(this.artText.options.markdown)
    }

    private registerPlugin(): void{
        if(this.artText.options.code.jsFun){
            Editor.setPlugin('hljs', this.artText.options.code.jsFun);
        }else if(this.artText.options.code.js){
            Tool.loadScript(this.artText.options.code.js, () => {Editor.setPlugin('hljs', win['hljs'])});
        }

        if(this.artText.options.math.jsFun != undefined){
            Editor.setPlugin('katex', this.artText.options.math.jsFun);
        }else if(this.artText.options.math.js){
            Tool.loadScript(this.artText.options.math.js, ()=>{Editor.setPlugin('katex', win['katex'])})
        }

        if(this.artText.options.math.css){
            Tool.loadCss(this.artText.options.math.css)
        }

        if(this.artText.options.flowchart.jsFun){
            Editor.setPlugin('flowchart', this.artText.options.flowchart.jsFun);
        }else if(this.artText.options.flowchart.js){
            Tool.loadScript(this.artText.options.flowchart.js[0], ()=>{Editor.setPlugin('Raphael', win['Raphael'])})
            Tool.loadScript(this.artText.options.flowchart.js[1], ()=>{Editor.setPlugin('flowchart', win['flowchart'])})
        }
    }
    private createEditor(): void{
        this.editorDom = document.createElement('div');
        this.editorDom.setAttribute('class', 'art-editor');

        this.htmlNode = new VNode('div', 
                {__root__: true, contenteditable: 'true', class: 'art-editor-html', style: 'outline:none;white-space:pre-wrap;word-break:break-all'}, 
                new VNode('p', {}, new VNode('br')));

        this.htmlNode.dom = document.createElement('div');

        this.mdDom = document.createElement('textarea');
        this.mdDom.setAttribute('class', 'art-editor-md')
        this.mdDom.setAttribute('style', 'width:100%;min-height:200px;border:none;outline:none;resize:none;display:none')
        this.mdDom.addEventListener('input', function(e) {
            (<HTMLHtmlElement>e.target).style.height = this.scrollHeight + 'px';
        })

        this.editorDom.appendChild(this.htmlNode.dom)
        this.editorDom.appendChild(this.mdDom)
        this.artText.rootDom.appendChild(this.editorDom);
    }

    /**@deprecated */
    click(key='left'){
        this.cursor.getSelection();
        if(key == 'right'){
            this.artText.tool.setFloatAuxiliaryTool('show');
        }else{
            if(this.cursor.location && this.cursor.location.anchorInlineOffset != this.cursor.location.focusInlineOffset 
                && this.cursor.location.anchorAlineOffset == this.cursor.location.focusAlineOffset){
                this.artText.tool.setFloatToolbar('show');
            }else{
                this.artText.tool.setFloatToolbar('hide');
            }
            this.artText.tool.setFloatAuxiliaryTool('hide');
        }
        this.cursor.setSelection();
    }
    public backRender(): boolean{
        let location = this.cursor.getSelection();
        if(location){
            let dom = this.htmlNode.dom.childNodes[location.anchorAlineOffset];
            if(dom.nodeName == 'PRE'){
                if(location.anchorNode.previousSibling == null && location.anchorInlineOffset == 0)
                    return false;
            }else{
                console.log("无执行", location)
            }
        }
        return true;
    }
    public enterRender(){
        let location = this.cursor.getSelection();
        if(location){
            let vnodes = domToNode(this.htmlNode.dom) as VNode;
            this.htmlNode.childNodes = vnodes.childNodes;
            let md = this.htmlNode.childNodes[location.anchorAlineOffset].getMd();
            let dom = this.htmlNode.dom.childNodes[location.anchorAlineOffset];
            if(/^(\*{3,}$|^\-{3,}$|^\_{3,}$)/.test(md)){
                let hr = document.createElement('hr'); 
                this.htmlNode.dom.replaceChild(hr, dom); 
                Cursor.setCursor(hr, 0);
                return false;
            } else if(/^\[(TOC)|(toc)\]$/.test(md)){
                let div = document.createElement('div'); 
                div.setAttribute('class', 'art-shield art-toc');
                div.setAttribute('contenteditable', 'false')

                let p = document.createElement('p');
                p.innerHTML = '<br/>';
                if(dom.nextSibling)
                    dom.parentNode.insertBefore(p, dom.nextSibling);
                else
                    dom.parentNode.appendChild(p);

                this.htmlNode.dom.replaceChild(div, dom); 
                this.updateToc();
                Cursor.setCursor(p, 0);
                return false;
            }else if(/^\|.*\|/.test(md)){
                // 生成table
                let table = document.createElement('table');
                let thead = document.createElement('thead');
                let tbody = document.createElement('tbody');
                table.appendChild(thead);
                table.appendChild(tbody);
                table.style.width = '100%';
                table.style.marginTop = '35px';
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
                this.htmlNode.dom.replaceChild(table, this.htmlNode.dom.childNodes[location.anchorAlineOffset]); 
                Cursor.setCursor(tr2.childNodes[0], 0);
                return false;
            }else if(/^```/.test(md)){
                // 生成code
                let pre = document.createElement('pre');
                let code = document.createElement('code');
                code.innerHTML = '\n';
                let lang = md.match(/^```\s*([^\s]*?)\s*$/)[1];
                if(lang != undefined && lang != ''){
                    code.setAttribute('class', 'lang-' + lang);
                    pre.setAttribute('class', 'art-pre-' + lang)
                    if(lang == 'flow'){
                        let div = document.createElement('div')
                        div.setAttribute('class', 'art-shield art-flowTool');
                        div.setAttribute('art-flow', '')
                        div.setAttribute('contenteditable', 'false');
                        this.htmlNode.dom.insertBefore(div, this.htmlNode.dom.childNodes[location.anchorAlineOffset].nextSibling); 
                    }
                }
                pre.appendChild(code);

                this.htmlNode.dom.replaceChild(pre, this.htmlNode.dom.childNodes[location.anchorAlineOffset]); 
                Cursor.setCursor(code, 0);
                return false;
            }else if(location.anchorNode.parentNode.nodeName == 'BLOCKQUOTE' && location.anchorOffset == 0 && location.anchorNode.nodeName == 'P'
                        && location.anchorNode.childNodes.length == 1 && location.anchorNode.childNodes[0].nodeName == 'BR'){
                // blockquote 退出
                let dom = location.anchorNode;
                let p = document.createElement('p');
                p.innerHTML = '<br/>';
                if(dom.parentNode.nextSibling)
                    dom.parentNode.parentNode.insertBefore(p, dom.parentNode.nextSibling);
                else
                    dom.parentNode.parentNode.appendChild(p);
                dom.parentNode.removeChild(dom);

                Cursor.setCursor(p, 0)
                return false;
            }else if(location.anchorNode.parentNode.parentNode.nodeName == 'BLOCKQUOTE' && location.anchorNode.nextSibling == null 
                    && location.anchorOffset == (<Text>location.anchorNode).length)
            {
                // ul ol中的blockquote添加新行
                let dom = location.anchorNode;
                let p = document.createElement('p');
                p.innerHTML = '<br/>';

                if(dom.parentNode.nextSibling)
                    dom.parentNode.parentNode.insertBefore(p, dom.parentNode.nextSibling);
                else
                    dom.parentNode.parentNode.appendChild(p);
                
                Cursor.setCursor(p, 0)
                return false;
            }else if(location.anchorOffset == 0 && location.anchorNode.nodeName == 'LI' && location.anchorNode.childNodes.length == 1 
                && location.anchorNode.childNodes[0].nodeName == 'BR'){
                // li 退出
                let dom = location.anchorNode;
                let p = document.createElement('p');
                p.innerHTML = '<br/>';
                if(dom.parentNode.nextSibling)
                    dom.parentNode.parentNode.insertBefore(p, dom.parentNode.nextSibling);
                else
                    dom.parentNode.parentNode.appendChild(p);
                dom.parentNode.removeChild(dom);

                Cursor.setCursor(p, 0);
                return false;
            }else if(location.anchorNode.parentNode.nodeName == 'P' && location.anchorNode.parentNode.parentNode.nodeName == 'LI'){
                // li 中新建一行
                let dom = location.anchorNode;
                let p = document.createElement('p');
                p.innerHTML = '<br/>';
        
                if(dom.parentNode.nextSibling)
                    dom.parentNode.parentNode.insertBefore(p, dom.parentNode.nextSibling);
                else
                    dom.parentNode.parentNode.appendChild(p);
                Cursor.setCursor(p, 0);
                return false;
            }else if(location.anchorNode.nodeName == 'P' && location.anchorNode.parentNode.nodeName == 'LI' 
                    && location.anchorNode.childNodes.length == 1 && location.anchorNode.childNodes[0].nodeName == 'BR'){ 
                // 从li中的p退到li中 
                let dom = location.anchorNode;
                let li = document.createElement('li');
                li.innerHTML = '<br/>';
        
                if(dom.parentNode.nextSibling)
                    dom.parentNode.parentNode.insertBefore(li, dom.parentNode.nextSibling);
                else
                    dom.parentNode.parentNode.appendChild(li);
                dom.parentNode.removeChild(dom);
                Cursor.setCursor(li, 0);
                return false;
            }else if(dom.nodeName == 'PRE'){
                let text = '\n\r';
                let data = location.anchorNode.nodeValue;
                console.log(data);
                data = data.substring(0, location.anchorOffset) +text +  data.substring(location.anchorOffset)
                location.anchorNode.nodeValue = data;
                Cursor.setCursor(location.anchorNode, location.anchorOffset + 1);
                return false;
            }else{
                console.log("无执行", location)
            }
        }

        return true;
    }
    public nodeRender(dom: HTMLElement, vnode: VNode) {
        if (dom.nodeName.toLowerCase() == vnode.nodeName) {
            if (vnode.nodeName == "code") {
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
                }else if(vnode.attr['__dom__'] == 'math' && Editor.plugins.katex){
                    let math = (<HTMLElement>dom.childNodes[0]).getAttribute("art-math")
                    if (math && vnode.childNodes[0].attr["art-math"] != math) {
                        (<HTMLElement>dom.childNodes[0]).innerHTML = Editor.plugins.katex.renderToString(vnode.childNodes[0].attr["art-math"], { throwOnError: false });
                        (<HTMLElement>dom.childNodes[0]).setAttribute("art-math", vnode.childNodes[0].attr["art-math"]);
                    }
                }else if(Tool.hasClass(dom, "art-toc")){
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
                            vnode.childNodes[j].render(dom.childNodes[i])
                        }
                    }
                }
                
                for (let key in vnode.attr) {
                    if (!(/^__[a-zA-Z\d]+__$/.test(key))) {
                        dom.setAttribute(key, vnode.attr[key]);
                    }
                }
            } else {
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
                        if(vnode.childNodes[j].nodeName == "#text"){
                            if(dom.childNodes[i].nodeName.toLowerCase() == "#text"){
                                if(vnode.childNodes[j].text != dom.nodeValue){
                                    dom.nodeValue = vnode.childNodes[j].text;
                                }
                            }else{
                                dom.parentNode.replaceChild(vnode.newDom(), dom); 
                            }
                        }else {
                            this.nodeRender(dom.childNodes[i] as HTMLElement, vnode.childNodes[j]);
                        }
                        
                    }
                }
            }
        } else {
            dom.parentNode.replaceChild(vnode.newDom(), dom);
        }
        return null;
    }
    public dispose(vnode: VNode, text: string=null) {
        if(text != null){
            let childNodes = textToNode(text);
            if(childNodes){
                vnode.childNodes = childNodes;
                for(let i = 0; i < vnode.childNodes.length; i++){
                    vnode.childNodes[i].parentNode = vnode; 
                }
            }
            return true;
        } else if (vnode.attr['__root__'] == true) {
            for (let i = vnode.childNodes.length - 1; i >= 0 ; i--) {
                let nodes = vnode.childNodes[i].dispose();
                if (nodes && nodes.length > 0) {
                    vnode.childNodes.splice(i, 1, ...nodes);
                }
            }
        } else if (vnode.attr["class"] && vnode.attr["class"].match(/art-shield/)) {
            return null;
        } else if (vnode.nodeName == "blockquote") {
            for (let i = 0; i < vnode.childNodes.length; i++) {
                if (vnode.childNodes[i].nodeName == "blockquote" || vnode.childNodes[i].nodeName == "ul" || vnode.childNodes[i].nodeName == "ol") {
                    vnode.childNodes[i].dispose();
                } else if (/^>\s/.test(vnode.childNodes[i].getMd())) {
                    vnode.childNodes[i] = new VNode("blockquote", {}, new VNode('p', {}, new VNode('br')));
                } else if (/^\*\s/.test(vnode.childNodes[i].getMd())) {
                    vnode.childNodes[i] = new VNode("ul", {}, new VNode('li', {}, new VNode('br')));
                } else if (/^\d\.\s/.test(vnode.childNodes[i].getMd())) {
                    vnode.childNodes[i] = new VNode("ol", {}, new VNode('li', {}, new VNode('br')));
                } else {
                    vnode.childNodes[i].childNodes = inline(vnode.childNodes[i].getMd());
                }
            }
        } else if (vnode.nodeName === "ul" || vnode.nodeName === "ol") {
            for (let i = 0; i < vnode.childNodes.length; i++) {
                if (vnode.childNodes[i].childNodes[0].nodeName == "blockquote" || vnode.childNodes[i].childNodes[0].nodeName == "ul" || vnode.childNodes[i].childNodes[0].nodeName == "ol") {
                    for (let j = 0; j < vnode.childNodes[i].childNodes.length; j++) {
                        if (vnode.childNodes[i].childNodes[j].nodeName == "p") {
                            vnode.childNodes[i].childNodes[j].childNodes = inline(vnode.childNodes[i].childNodes[j].getMd())
                        } else {
                            vnode.childNodes[i].childNodes[j].dispose();
                        }
                    }
                } else if (/^>\s/.test(vnode.childNodes[i].getMd())) {
                    vnode.childNodes[i].childNodes = [new VNode("blockquote", {}, new VNode('p', {}, new VNode('br')))];
                } else if (/^\*\s/.test(vnode.childNodes[i].getMd())) {
                    vnode.childNodes[i].childNodes = [new VNode("ul", {}, new VNode("li", {}, new VNode('br')))];
                } else if (/^\d\.\s/.test(vnode.childNodes[i].getMd())) {
                    vnode.childNodes[i].childNodes = [new VNode("ol", {}, new VNode("li", {}, new VNode('br')))];
                } else {
                    if (vnode.childNodes[i].childNodes[0].nodeName == 'input') {
                        vnode.childNodes[i].childNodes = [vnode.childNodes[i].childNodes[0], ...inline(vnode.childNodes[i].getMd())];
                    } else if (/^\[x|X\]\s/.test(vnode.childNodes[i].getMd())) {
                        vnode.childNodes[i].childNodes = [new VNode('input', { type: "checkbox", checked: "checked" }), ...inline(vnode.childNodes[i].getMd().substring(4))];
                    } else if (/^\[\s\]\s/.test(vnode.childNodes[i].getMd())) {
                        vnode.childNodes[i].childNodes = [new VNode('input', { type: "checkbox" }), ...inline(vnode.childNodes[i].getMd().substring(4))];
                    } else {
                        vnode.childNodes[i].childNodes = inline(vnode.childNodes[i].getMd());
                    }
                }
            }
        } else if (vnode.nodeName == "table") {
            // table
            for (let i = 0; i < vnode.childNodes.length; i++) {
                // thead tbody
                for (let j = 0; j < vnode.childNodes[i].childNodes.length; j++) {
                    // tr
                    for (let k = 0; k < vnode.childNodes[i].childNodes[j].childNodes.length; k++) {
                        let nodes = inline(vnode.childNodes[i].childNodes[j].childNodes[k].getMd());
                        vnode.childNodes[i].childNodes[j].childNodes[k].childNodes = nodes;
                    }
                }
            }
        } else if (vnode.nodeName === "pre") {
            return null
        } else if (vnode.nodeName == "hr") {
            return null
        } else {
            // let nodes = textToNode(this.getMd());
            let nodes = aline(vnode.getMd());
            if(nodes)
                return nodes;
            else
                return [new VNode("p", {}, inline(this.getMd()))];
        }
        return null
    }
    public render(){
        let vnode = domToNode(this.htmlNode.dom) as VNode;
        if(vnode){
            this.htmlNode.childNodes = vnode.childNodes;
            for(let i = 0; i < this.htmlNode.childNodes.length; i++){
                this.htmlNode.childNodes[i].parentNode = this.htmlNode; 
            }
        }

        this.dispose(this.htmlNode);
        this.updateToc();

        this.nodeRender(this.htmlNode.dom, this.htmlNode);
        if(Editor.plugins.hljs && this.cursor.location && this.htmlNode.dom.childNodes[this.cursor.location.anchorAlineOffset].nodeName == 'PRE'){
            Editor.plugins.hljs.initHighlighting.called = false;
            Editor.plugins.hljs.initHighlighting(); 
        }
        this.cursor.setSelection();
    }
    public updateToc(){
        let tocs = [];
        let directory = [];
        for(let vnode of this.htmlNode.childNodes){
            if(/^h\d$/.test(vnode.nodeName)){
                let md = vnode.getMd();
                md = md.replace(/\s/g, '-').replace(/\\|\/|#|\:/g, '');
                let a = new VNode('a', {href: '#' + md}, new VTextNode(vnode.getText()))
                let d = new VNode('p', {class: 'art-toc-' + vnode.nodeName}, a)
                directory.push(d);
            }else if(vnode.constructor.name == 'VNode' && vnode.attr.class && /art-toc/.test(vnode.attr.class)){
                tocs.push(vnode);
            }
        }
        for(let toc of tocs){
            toc.childNodes = directory;
        }
    }
    public getMd(){
        let md = '';
        for(let i = 0; i < this.htmlNode.childNodes.length; i++){
            md += this.htmlNode.childNodes[i].getMd('read') + '\n';
        }
        return md;
    }
    public setMd(md: string){
        this.dispose(this.htmlNode, md);
        this.updateToc();
        this.nodeRender(this.htmlNode.dom, this.htmlNode);
        if(Editor.plugins.hljs){
            Editor.plugins.hljs.initHighlighting.called = false;
            Editor.plugins.hljs.initHighlighting(); 
        }
    }
    public openFile(md: string, name: string){
        console.log(`'${md}', '${name}'`);
        this.fileInfo.name = name;
        this.setMd(md);
    }
    public openTextarea(){
        this.htmlNode.dom.style.display = 'none';
        this.mdDom.style.display = 'inline';
        this.mdDom.value = this.getMd();
        this.mdDom.style.height = this.mdDom.scrollHeight + 5 + 'px';
    }
    public closeTextarea(){
        this.htmlNode.dom.style.display = 'inline';
        this.setMd(this.mdDom.value)
        this.mdDom.style.display = 'none';
    }
    public emptyEditor(){
        if(this.htmlNode.dom.style.display == 'none'){
            this.mdDom.value = '';
            this.mdDom.style.height = 'auto';
        }else{
            this.setMd('')
        }
    }
}
const defauleCss = '\n\
.art-hide{display: inline-block;width: 0;height: 0;overflow: hidden;vertical-align: middle;}\n\
.art-show{color: #ccc;}\n\
.art-editor-html pre code{white-space: pre-wrap;}\n\
.art-show-math{position: absolute;padding: 13px 25px;background: #fff;box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;}\n\
.art-editor{box-shadow:0 2px 12px 0 rgba(0, 0, 0, 0.1);padding:30px 25px;border-radius:4px;background-color:${theme.backgroundColor};'
export default Editor
import {textToNode} from "./toNode/index"
import VNode from '../vNode/index'
import ArtText from "../../lib"
import Config from "../config"
import Tool from "../tool"
import Cursor from "./cursor"
import VTextNode from "../vNode/text"
let win = window;
class Editor{
    static artTexts: ArtText[] = [];
    static updataArtTextRender(){
        for(let art of Editor.artTexts){
            art.editor.render()
        }
    }
    static _hljs = null;
    static get hljs(){
        return Editor._hljs;
    }
    static set hljs(value){
        Editor._hljs = value;
        Editor.updataArtTextRender();
    }

    static _katex = null;
    static get katex(){
        return Editor._katex;
    }
    static set katex(value){
        Editor._katex = value;
        Editor.updataArtTextRender();
    }

    static _flowchart = null;
    static get flowchart(){
        return Editor._flowchart;
    }
    static set flowchart(value){
        Editor._flowchart = value;
        Editor.updataArtTextRender();
    }

    static Raphael = null;
    artText: ArtText;
    container: HTMLHtmlElement;
    editorHtmlNode: VNode;
    editorHtmlDom: HTMLDivElement;
    editorMdDom: HTMLTextAreaElement;
    editorDom: HTMLDivElement;
    cursor: Cursor;
    mdFileName: String;
    directory: VNode[];
    
    constructor(artText: ArtText, container: HTMLHtmlElement) {
        this.artText = artText;   
        this.container = container;   
        
        this.editorHtmlNode = this.createRootNode();

        this.cursor = new Cursor(this.editorHtmlDom);  
        this.mdFileName = null;  
        this.directory = [];
        Editor.artTexts.push(artText);
    } 
    createRootNode(){
        let p = new VNode("p", {}, new VNode("br"))
        let text;
        if(this.artText.config.runModel == Config.RunModel.read){
            text = 'false';
        }else{
            text = 'true';
        }
        let root = new VNode('div', {"__root__": true, contenteditable: text, 'class': 'art-editor-html'}, p);

        this.editorDom = document.createElement('div');
        this.editorDom.setAttribute('class', 'art-editor')

        this.editorHtmlDom = document.createElement('div');
        this.editorHtmlDom.setAttribute('class', 'art-editor-html')

        this.editorMdDom = document.createElement('textarea');
        this.editorMdDom.setAttribute('class', 'art-editor-md')

        this.editorDom.appendChild(this.editorHtmlDom)
        this.editorDom.appendChild(this.editorMdDom)
        this.container.appendChild(this.editorDom);

        this.editorHtmlDom.style.outline = "none";
        this.editorHtmlDom.style.whiteSpace = "pre-wrap";
        this.editorHtmlDom.style.wordBreak = 'break-all';
        //this.container.style.wordBreak = "break-word";

        this.editorMdDom.style.width = '100%';
        this.editorMdDom.style.minHeight = '200px';
        this.editorMdDom.style.border = 'none';
        this.editorMdDom.style.outline = 'none';
        this.editorMdDom.style.resize = 'none'; 
        this.editorMdDom.style.display = 'none'; 
        this.editorMdDom.addEventListener('input', function(e) {
            let target = e.target as HTMLHtmlElement;
            //target.style.height = 'auto';
            target.style.height = this.scrollHeight + 'px';
            
        })

        this.editorDom.style.boxShadow = '0 2px 12px 0 rgba(0, 0, 0, 0.1)';
        this.editorDom.style.padding = '30px 25px';
        this.editorDom.style.backgroundColor = this.artText.config.theme.get('backgroundColor');;
        this.editorDom.style.borderRadius = '4px';
        return root
    }
   
    closure(fun: Function): Function{
        // 实现闭包
        let _this = this;
        function c(e){
            fun(e, _this);
        }
        return c;
    }
    init(){
        Tool.addCss(defauleCss);
        if(this.artText.config.hljs.jsFun){
            Editor.hljs = this.artText.config.hljs.jsFun;
        }else if(this.artText.config.hljs.js){
            Tool.loadScript(this.artText.config.hljs.js, () => { Editor.hljs = win['hljs'];Editor.hljs.initHighlighting.called = false;Editor.hljs.initHighlighting();})
        }

        if(this.artText.config.katex.jsFun){
            Editor.katex = this.artText.config.katex.jsFun;
        }else if(this.artText.config.katex.js){
            Tool.loadScript(this.artText.config.katex.js, ()=>{Editor.katex = win['katex']})
        }

        if(this.artText.config.katex.cssFun){

        }else if(this.artText.config.katex.css){
            Tool.loadCss(this.artText.config.katex.css)
        }

        if(this.artText.config.flowchart.jsFun){
            Editor.flowchart = this.artText.config.flowchart.jsFun;
        }else if(this.artText.config.flowchart.js){
            Tool.loadScript(this.artText.config.flowchart.js[0], ()=>{Editor.Raphael = win['Raphael']})
            Tool.loadScript(this.artText.config.flowchart.js[1], ()=>{Editor.flowchart = win['flowchart']})
        }
        this.setMd(this.artText.config.md)
    }
    click(key='left'){
        this.cursor.getSelection();
        if(key == 'right'){
            this.artText.tool.setFloatAuxiliaryTool('bu');
        }else{
            if(this.cursor.location && this.cursor.location.anchorInlineOffset != this.cursor.location.focusInlineOffset 
                && this.cursor.location.anchorAlineOffset == this.cursor.location.focusAlineOffset){
                this.artText.tool.setFloatToolbar('bu');
            }else{
                this.artText.tool.setFloatToolbar();
            }
            this.artText.tool.setFloatAuxiliaryTool();
        }
        this.cursor.setSelection();
    }
    backRender(): boolean{
        let location = this.cursor.getSelection();
        if(location){
            let dom = this.editorHtmlDom.childNodes[location.anchorAlineOffset];
            if(dom.nodeName == 'PRE'){
                if(location.anchorNode.previousSibling == null && location.anchorInlineOffset == 0)
                    return false;
            }else{
                console.log("无执行", location)
            }
        }
        return true;
    }
    enterRender(){
        let location = this.cursor.getSelection();
        if(location){
            let vnodes = VNode.domToNode(this.editorHtmlDom) as VNode;
            this.editorHtmlNode.childNodes = vnodes.childNodes;
            let md = this.editorHtmlNode.childNodes[location.anchorAlineOffset].getMd();
            let dom = this.editorHtmlDom.childNodes[location.anchorAlineOffset];
            if(/^(\*{3,}$|^\-{3,}$|^\_{3,}$)/.test(md)){
                let hr = document.createElement('hr'); 
                this.editorHtmlDom.replaceChild(hr, dom); 
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

                this.editorHtmlDom.replaceChild(div, dom); 
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
                this.editorHtmlDom.replaceChild(table, this.editorHtmlDom.childNodes[location.anchorAlineOffset]); 
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
                        this.editorHtmlDom.insertBefore(div, this.editorHtmlDom.childNodes[location.anchorAlineOffset].nextSibling); 
                    }
                }
                pre.appendChild(code);

                this.editorHtmlDom.replaceChild(pre, this.editorHtmlDom.childNodes[location.anchorAlineOffset]); 
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
    getDirectory(): VNode[]{
        this.directory = [];
        for(let i = 0; i < this.editorHtmlNode.childNodes.length; i++){
            if(/^h\d$/.test(this.editorHtmlNode.childNodes[i].nodeName)){
                this.directory.push(this.editorHtmlNode.childNodes[i]);
            }
        }
        return this.directory;
    }
    render(){
        this.cursor.getSelection();
        console.log(this.cursor.location)
        let vnodes = VNode.domToNode(this.editorHtmlDom) as VNode;
        this.editorHtmlNode.childNodes = vnodes.childNodes;
        this.editorHtmlNode.dispose();
        this.updateToc();
        // this.container.blur();
        if(this.artText.config.renderFlag){
            this.editorHtmlNode.render(this.editorHtmlDom)
            if(Editor.hljs && this.cursor.location && this.editorHtmlDom.childNodes[this.cursor.location.anchorAlineOffset].nodeName == 'PRE'){
                Editor.hljs.initHighlighting.called = false;
                Editor.hljs.initHighlighting(); 
            }
        }
        this.cursor.setSelection();
        
    }
    updateToc(){
        let tocs = [];
        let directory = [];
        for(let vnode of this.editorHtmlNode.childNodes){
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
        console.log(tocs, directory)
    }
    getMd(){
        let md = '';
        for(let i = 0; i < this.editorHtmlNode.childNodes.length; i++){
            md += this.editorHtmlNode.childNodes[i].getMd('read') + '\n';
        }
        return md;
    }
    setMd(md: string){
        let childNodes = textToNode(md);
        if(childNodes){
            this.editorHtmlNode.childNodes = childNodes;
        }
        this.updateToc();
        this.editorHtmlNode.render(this.editorHtmlDom);
        if(Editor.hljs){
            Editor.hljs.initHighlighting.called = false;
            Editor.hljs.initHighlighting(); 
        }
    }
    openFile(md: string, name: string){
        this.mdFileName = name;
        this.setMd(md);
    }
    openTextarea(){
        this.editorHtmlDom.style.display = 'none';
        this.editorMdDom.style.display = 'inline';
        this.editorMdDom.value = this.getMd();
        this.editorMdDom.style.height = this.editorMdDom.scrollHeight + 5 + 'px';
    }
    closeTextarea(){
        this.editorHtmlDom.style.display = 'inline';
        this.setMd(this.editorMdDom.value)
        this.editorMdDom.style.display = 'none';
    }
    emptyEditor(){
        if(this.editorHtmlDom.style.display == 'none'){
            this.editorMdDom.value = '';
            this.editorMdDom.style.height = 'auto';
        }else{
            this.setMd('')
        }
    }
}
const defauleCss = '\n\
.art-hide{display: inline-block;width: 0;height: 0;overflow: hidden;vertical-align: middle;}\n\
.art-show{color: #ccc;}\n\
.art-editor-html pre code{white-space: pre-wrap;}\n\
.art-show-math{position: absolute;padding: 13px 25px;background: #fff;box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;}'
export default Editor
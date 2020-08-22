import {textToNode} from "./toNode/index"
import codeTool from "../tool/codeTool"
import tableTool from "../tool/tableTool"
import VNode from '../vNode/index'
import ArtText from "../../lib"
import Config from "../config"
import Tool from "../tool"
let win = window;
class Editor{
    static hljs = null;
    static katex = null;
    artText: ArtText;
    container: HTMLHtmlElement;
    editorHtmlNode: VNode;
    editorHtmlDom: HTMLDivElement;
    editorMdDom: HTMLTextAreaElement;
    editorDom: HTMLDivElement;
    sel:Selection;
    location: any;
    
    constructor(artText: ArtText, container: HTMLHtmlElement) {
        this.artText = artText;   
        this.container = container;   
        
        this.sel = window.getSelection();
        this.editorHtmlNode = this.createRootNode();

        this.location = null;
        
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
        this.editorDom.setAttribute('class', 'art-editor-html')

        this.editorMdDom = document.createElement('textarea');
        this.editorDom.setAttribute('class', 'art-editor-md')
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
            target.style.height = 'auto';
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
        this.setMd(this.artText.config.md)
    }
    hasClass(element, cls) {
        return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
    }
    click(key='left'){
        this.location = this.getSelection();
        if(key == 'right'){
            this.artText.tool.setFloatAuxiliaryTool('bu');
        }else{
            if(this.location[0] != this.location[1] && this.location[2] == this.location[3]){
                this.artText.tool.setFloatToolbar('bu');
            }else{
                this.artText.tool.setFloatToolbar();
            }
            this.artText.tool.setFloatAuxiliaryTool();
        }
        this.setSelection();
    }
    enterRender(){
        let location = this.getSelection();
        if(location){
            let md = this.editorHtmlNode.childNodes[location[2]].getMd();
            let node = this.editorHtmlNode.childNodes[location[2]];
            console.log(location, node)
            if(/^(\*{3,}$|^\-{3,}$|^\_{3,}$)/.test(md)){
                let p = document.createElement('p');
                p.innerHTML = '<br/>';
                this.editorHtmlDom.replaceChild(document.createElement('hr'), this.editorHtmlDom.childNodes[location[2]]); 
                let range =  this.sel.getRangeAt(0).cloneRange();
                range.setStart(p, 0);
                range.collapse(true);
                this.sel.removeAllRanges();
                this.sel.addRange(range);
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
                this.editorHtmlDom.replaceChild(table, this.editorHtmlDom.childNodes[location[2]]); 
                let range =  this.sel.getRangeAt(0).cloneRange();
                range.setStart(tr2.childNodes[0], 0);
                range.collapse(true);
                this.sel.removeAllRanges();
                this.sel.addRange(range);
                return false;
            }else if(/^```\s?/.test(md) || /^```\s\S+/.test(md)){
                // 生成code
                let pre = document.createElement('pre');
                let code = document.createElement('code');
                code.innerHTML = '<br/>';
                if(/^```\s\S+/.test(md)){
                    let lang = md.substring(4);
                    code.setAttribute('class', 'lang-' + lang);
                }
                pre.appendChild(code);

                this.editorHtmlDom.replaceChild(pre, this.editorHtmlDom.childNodes[location[2]]); 
                let range =  this.sel.getRangeAt(0).cloneRange();
                range.setStart(code.childNodes[0], 0);
                range.collapse(true);
                this.sel.removeAllRanges();
                this.sel.addRange(range);
                return false;
            }else if(location[4][1].parentNode.nodeName == 'BLOCKQUOTE' && location[4][0] == 0 && location[4][1].nodeName == 'P'
                        && location[4][1].childNodes.length == 1 && location[4][1].childNodes[0].nodeName == 'BR'){
                // blockquote 退出
                let dom = location[4][1];
                let p = document.createElement('p');
                p.innerHTML = '<br/>';
                if(dom.parentNode.nextSibling)
                    dom.parentNode.parentNode.insertBefore(p, dom.parentNode.nextSibling);
                else
                    dom.parentNode.parentNode.appendChild(p);
                dom.parentNode.removeChild(dom);

                let range =  this.sel.getRangeAt(0).cloneRange();
                range.setStart(p, 0);
                range.collapse(true);
                this.sel.removeAllRanges();
                this.sel.addRange(range);
                console.log("无执行2221")
                return false;
            }else if(location[4][1].parentNode.parentNode.nodeName == 'BLOCKQUOTE' && location[4][1].nextSibling == null 
                    && location[4][0] == location[4][1].length)
            {
                // ul ol中的blockquote添加新行
                let dom = location[4][1];
                let p = document.createElement('p');
                p.innerHTML = '<br/>';

                if(dom.parentNode.nextSibling)
                    dom.parentNode.parentNode.insertBefore(p, dom.parentNode.nextSibling);
                else
                    dom.parentNode.parentNode.appendChild(p);
                let range =  this.sel.getRangeAt(0).cloneRange();
                range.setStart(p, 0);
                range.collapse(true);
                this.sel.removeAllRanges();
                this.sel.addRange(range);
                return false;
            }else if(location[4][0] == 0 && location[4][1].nodeName == 'LI' && location[4][1].childNodes.length == 1 && location[4][1].childNodes[0].nodeName == 'BR'){
                // li 退出
                let dom = location[4][1];
                let p = document.createElement('p');
                p.innerHTML = '<br/>';
                if(dom.parentNode.nextSibling)
                    dom.parentNode.parentNode.insertBefore(p, dom.parentNode.nextSibling);
                else
                    dom.parentNode.parentNode.appendChild(p);
                dom.parentNode.removeChild(dom);

                let range =  this.sel.getRangeAt(0).cloneRange();
                range.setStart(p, 0);
                range.collapse(true);
                this.sel.removeAllRanges();
                this.sel.addRange(range);
                return false;
            }else if(location[4][1].parentNode.nodeName == 'P' && location[4][1].parentNode.parentNode.nodeName == 'LI'){
                // li 中新建一行
                let dom = location[4][1];
                let p = document.createElement('p');
                p.innerHTML = '<br/>';
        
                if(dom.parentNode.nextSibling)
                    dom.parentNode.parentNode.insertBefore(p, dom.parentNode.nextSibling);
                else
                    dom.parentNode.parentNode.appendChild(p);
                
                let range =  this.sel.getRangeAt(0).cloneRange();
                range.setStart(p, 0);
                range.collapse(true);
                this.sel.removeAllRanges();
                this.sel.addRange(range);
                return false;
            }else if(location[4][1].nodeName == 'P' && location[4][1].parentNode.nodeName == 'LI' 
                    && location[4][1].childNodes.length == 1 && location[4][1].childNodes[0].nodeName == 'BR'){ 
                // 从li中的p退到li中 
                let dom = location[4][1];
                let li = document.createElement('li');
                li.innerHTML = '<br/>';
        
                if(dom.parentNode.nextSibling)
                    dom.parentNode.parentNode.insertBefore(li, dom.parentNode.nextSibling);
                else
                    dom.parentNode.parentNode.appendChild(li);
                dom.parentNode.removeChild(dom);
                let range =  this.sel.getRangeAt(0).cloneRange();
                range.setStart(li, 0);
                range.collapse(true);
                this.sel.removeAllRanges();
                this.sel.addRange(range);
                return false;
            }else if(node.nodeName == 'pre'){
                let text = '\n\r';
                let data = location[4][1].data;
                console.log(data);
                data = data.substring(0, location[4][0]) +text +  data.substring(location[4][0])
                location[4][1].data = data;
                let range =  this.sel.getRangeAt(0).cloneRange();
                range.setStart(location[4][1], location[4][0] + 1);
                range.collapse(true);
                this.sel.removeAllRanges();
                this.sel.addRange(range);
                return false;
            }else{
                console.log("无执行", node)
            }
        }

        return true;
    }
    render(){
        let location = this.getSelection();
        this.location = location;
        let vnodes = VNode.domToNode(this.editorHtmlDom) as VNode;
        this.editorHtmlNode.childNodes = vnodes.childNodes;
        this.editorHtmlNode.dispose();

        // this.container.blur();
        if(this.artText.config.renderFlag){
            this.editorHtmlNode.render(this.editorHtmlDom)
            if(Editor.hljs && this.location && this.editorHtmlDom.childNodes[this.location[2]].nodeName == 'PRE'){
                Editor.hljs.initHighlighting.called = false;
                Editor.hljs.initHighlighting(); 
            }
        }
        this.setSelection();
        
    }
    getSelection(): [number, number, number, number, [number, any]]{
        let {anchorNode, anchorOffset, focusNode, focusOffset} = this.sel;
        if(anchorNode && focusNode){
            let node = anchorNode;
            let len = anchorOffset;
            if(node == this.editorHtmlDom)
                return null;
            while(node.parentNode != this.editorHtmlDom){ 
                while(node.previousSibling){
                    node = node.previousSibling;
                    len += node.textContent.length;
                }
                node = node.parentNode;
            }

            let nodeF = focusNode;
            let lenF = focusOffset;

            while(nodeF.parentNode !== this.editorHtmlDom){
                while(nodeF.previousSibling){
                    nodeF = nodeF.previousSibling;
                    lenF += nodeF.textContent.length;
                }
                nodeF = nodeF.parentNode;
            }

            let rootNodeSub = -1;
            for(let i = 0; i < this.editorHtmlDom.childNodes.length; i++){
                if(this.editorHtmlDom.childNodes[i] === node){
                    rootNodeSub = i;
                    break;
                }
            }

            let rootNodeSubF = -1;
            for(let i = 0; i < this.editorHtmlDom.childNodes.length; i++){
                if(this.editorHtmlDom.childNodes[i] === nodeF){
                    rootNodeSubF = i;
                    break;
                }
            }
            let name = anchorNode.parentNode.nodeName;
            if(anchorOffset == 0 && anchorNode.previousSibling == null && 
                (name == 'LI' || name == 'P' || name == 'TH' || name == 'TD')){
                anchorNode = anchorNode.parentNode;
            }
            return [len, lenF, rootNodeSub, rootNodeSubF, [anchorOffset, anchorNode]]
            
        }else{
            return null;
        }
    }
    searchNode(node, len){
        if(node.childNodes.length === 1 && node.childNodes[0].nodeName === "#text")
            if(len <= node.childNodes[0].textContent.length)
                return [node.childNodes[0], len]
            else
                return [node.childNodes[0], len - node.textContent.length]
        for(let i = 0; i < node.childNodes.length; i++){
            if(node.childNodes[i].textContent.length < len){
                len -= node.childNodes[i].textContent.length;
            }else if(node.childNodes[i].nodeName === "#text"){
                return [node.childNodes[i], len]
            }else{
                return this.searchNode(node.childNodes[i], len)
            }
        }
        return null
    }
    setTool(selectedNode){
        if(selectedNode.nodeName == "PRE"){
            if(!this.hasClass(selectedNode.previousSibling, "art-codeTool")){
                selectedNode.parentNode.insertBefore(codeTool(), selectedNode);
            }
        }else if(selectedNode.nodeName == "TABLE"){
            if(!this.hasClass(selectedNode.previousSibling, "art-tableTool")){
                selectedNode.parentNode.insertBefore(tableTool(), selectedNode);
            }
        }

    }
    setSelection(){
        //console.log(this.location);
        let showNodeList = this.container.getElementsByClassName("art-show");
        for(let i = showNodeList.length - 1; i >= 0; i--){
            let classVal = showNodeList[i].getAttribute("class");
            classVal = classVal.replace("art-show", "art-hide");
            showNodeList[i].setAttribute("class", classVal);
        }
        if(this.location && this.location[2] >= 0 && this.location[0] == this.location[1] && this.location[2] == this.location[3]){
            let info = null;
            var pNode = this.editorHtmlDom.childNodes[this.location[2]];
            var pLen = this.location[0];
            this.setTool(pNode)
            if(!this.location[4]){
                info = this.searchNode(pNode, pLen);
            }else if(this.location[4] !== -1 && (this.location[4][1].nodeName === "LI" || this.location[4][1].nodeName === "TH"||
                                            this.location[4][1].nodeName === "P" || this.location[4][1].nodeName === "TD"||this.location[4][1].nodeName === "DIV")){
                info = [this.location[4][1], 0]
            }else if(this.location[4][0] == 0 && ((this.location[4][1].parentNode.nodeName == 'CODE' && this.location[4][1].parentNode.parentNode.nodeName == 'PRE') || this.location[4][1].nodeName == 'CODE' && this.location[4][1].parentNode.nodeName == 'PRE')){
                info = [this.location[4][1], 0]
            }else if(this.location[4] == -1 && this.location[0] == 0){
                info = [pNode, 0]
            }else{
                info = this.searchNode(pNode, pLen);
            }
            if(info === null)
                return null
            
            let range =  this.sel.getRangeAt(0).cloneRange();
            range.setStart(info[0], info[1]);
            // range.setStartAfter(childNodes[i], 0);
            
            range.collapse(true);
            this.sel.removeAllRanges();
            this.sel.addRange(range);

            let art_text_double = info[0].parentNode;
            if(art_text_double && this.hasClass(art_text_double, "art-hide")){
                if(art_text_double.previousSibling &&this.hasClass(art_text_double.previousSibling, "art-text-double")){
                    art_text_double = art_text_double.previousSibling;
                }else if(art_text_double.nextSibling  && this.hasClass(art_text_double.nextSibling, "art-text-double")){
                    art_text_double = art_text_double.nextSibling;
                }
            }

            if(art_text_double && this.hasClass(art_text_double, "art-text-double")){
                let classVal = art_text_double.nextSibling.getAttribute("class");
                classVal = classVal.replace("art-hide", "art-show");
                art_text_double.nextSibling.setAttribute("class", classVal);

                classVal = art_text_double.previousSibling.getAttribute("class");
                classVal = classVal.replace("art-hide", "art-show");
                art_text_double.previousSibling.setAttribute("class", classVal);
            }

            if(info[0].nodeName === "#text" && this.hasClass(info[0].parentNode, "art-hide")){
                let classVal = info[0].parentNode.getAttribute("class");
                classVal = classVal.replace("art-hide", "art-show");
                info[0].parentNode.setAttribute("class", classVal);
            }
        }
    }
    
    /*mdCollect(rootNodeSub){
        let md = "";
        let n = "\n";
        let pDom = this.editorHtmlDom.childNodes[rootNodeSub];
        let pNode = pDom;
        console.log(pDom);
        if(this.hasClass(pNode, "art-tool"))
            return null
        if(pNode.nodeName === "UL"){
            n = "\n"
            for(let j = 0; j < pNode.childNodes.length; j++){
                if(j + 1 == pNode.childNodes.length){
                    if(pNode.childNodes[j].innerText == "\n")
                        md += "* "
                    else
                        md += "* " + pNode.childNodes[j].innerText;
                }
                else
                    md += "* " + pNode.childNodes[j].innerText + n;
            }
        }else if(pNode.nodeName === "BLOCKQUOTE"){
            n = "\n";
            console.log(pNode.childNodes.length);
            for(let j = 0; j < pNode.childNodes.length; j++){
                if(j + 1 == pNode.childNodes.length)
                        n = ""
                if(pNode.childNodes[j].innerText == "\n"){
                    if(n != "" && pNode.childNodes[j + 1].innerText == "\n"){
                        if(j+ 2 == pNode.childNodes.length){
                            break;
                        }else{
                            md += "\n"
                            j++;
                        }
                    }else{
                        md += "> " + n;
                    }
                }else{
                    md += "> " + pNode.childNodes[j].innerText + n;
                }
            }
        }else if(pNode.nodeName === "OL"){
            n = "\n";
            for(let j = 0; j < pNode.childNodes.length; j++){
                if(j + 1 == pNode.childNodes.length){
                    if(pNode.childNodes[j].innerText == "\n")
                        md += (j + 1).toString() + ". "
                    else
                        md += (j + 1).toString() + ". " + pNode.childNodes[j].innerText
                }
                else
                    md += (j + 1).toString() + ". " + pNode.childNodes[j].innerText + n;
            }
        }else if(pNode.nodeName === "TABLE"){
            let table = "";
            for(let j = 0;j < pNode.childNodes.length; j++){
                    for(let k = 0; k < pNode.childNodes[j].childNodes.length; k++){
                        if(pNode.childNodes[j].childNodes[k].nodeName === "TH"){
                            table += "|" + pNode.childNodes[j].childNodes[k].innerText;
                        }else{
                            table += "|" + pNode.childNodes[j].childNodes[k].innerText;
                        }
                    }
                if(j + 1 == pNode.childNodes.length)
                    table += "|"
                else
                    table +=  "|\n"
            }
            md += table;
        }else if(pNode.nodeName === "PRE"){
            return null
        }else{
            md += this.mdNOShieldTextCollect(pDom);
        }
        return md
    }
    mdNOShieldTextCollect(dom){
        let text = "";
        if(dom.nodeName == "#text")
            return dom.data;
        if(this.hasClass(dom, "art-shield")){
            return "";
        }
        for(let i = 0; i< dom.childNodes.length; i++){
            text += this.mdNOShieldTextCollect(dom.childNodes[i]);
        }
        return text;
    }*/
    getMd(){
        let md = '';
        for(let i = 0; i < this.editorHtmlNode.childNodes.length; i++){
            md += this.editorHtmlNode.childNodes[i].getMd('read');
        }
        return md;
    }
    setMd(md: string){
        let childNodes = textToNode(md);
        if(childNodes){
            this.editorHtmlNode.childNodes = childNodes;
        }
        this.editorHtmlNode.render(this.editorHtmlDom);
        if(Editor.hljs){
            Editor.hljs.initHighlighting.called = false;
            Editor.hljs.initHighlighting(); 
        }
    }
    openTextarea(){
        this.editorHtmlDom.style.display = 'none';
        this.editorMdDom.style.display = 'inline';
        this.editorMdDom.value = this.getMd();
        this.editorMdDom.style.height = this.editorMdDom.scrollHeight + 'px';
    }
    closeTextarea(){
        this.editorHtmlDom.style.display = 'inline';
        this.setMd(this.editorMdDom.value)
        this.editorMdDom.style.display = 'none';
    }
}
const defauleCss = '\n\
.art-hide{display: inline-block;width: 0;height: 0;overflow: hidden;vertical-align: middle;}\n\
.art-show{color: #ccc;}\n\
.art-editor-html pre code{white-space: pre-wrap;}'
export default Editor
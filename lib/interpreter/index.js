import {textToNode} from "./toNode"
import codeTool from "../tool/codeTool"
import tableTool from "../tool/tableTool"
import {loadScript, loadCss, addCss} from "../tool"
import Node from '../node'
import {css} from "./css"

class Interpreter{
    constructor(container, artText) {
        this.artText = artText;   
        this.container = container;   
        this.location = null;
        this.rootNode = this.createRootNode();
        this.rootDom = this.container.childNodes[0].childNodes[0];
        this.sel = window.getSelection();
        this.hljs = null;
        this.katex = null;
        this.rootTextarea = this.container.childNodes[0].childNodes[1];
        this.editor = this.container.childNodes[0];
        this.textarea = null;
    } 
    createRootNode(){
        let br = new Node("br")
        let p = new Node("p", {}, br)
        let root = new Node('div', {"__root__": true, contenteditable:"true", 'class': 'art-editor-html'}, p);
        this.container.innerHTML =  '<div class="art-editor"><div class="art-editor-html"><p><br/></p></div><div class="art-editor-md"></div></div>'
        this.rootDom = this.container.childNodes[0].childNodes[0];
        this.rootTextarea = this.container.childNodes[0].childNodes[1];
        this.editor = this.container.childNodes[0];

        this.rootDom.style.outline = "none";
        this.rootDom.style.whiteSpace = "pre-wrap";
        //this.container.style.wordBreak = "break-word";
        this.rootDom.style.wordBreak = 'break-all';

        this.editor.style.boxShadow = '0 2px 12px 0 rgba(0, 0, 0, 0.1)';
        this.editor.style.padding = '30px 25px';
        this.editor.style.backgroundColor = this.artText.config.theme.backgroundColor;;
        this.editor.style.borderRadius = '4px';
        return root
    }
    init(model){
        if(model == 'read'){
            this.rootNode.attr['contenteditable'] = 'false';
            this.rootDom.setAttribute('contenteditable', false);
        }else{
            this.textarea = document.createElement('textarea');
            this.textarea.style.width = '100%';
            this.textarea.style.minHeight = '400px';
            this.textarea.style.border = 'none';
            this.textarea.style.outline = 'none';
            this.textarea.style.resize = 'none'; 
            this.textarea.style.display = 'none'; 
            this.textarea.addEventListener('input', function(e) {
                e.target.style.height = 'auto';
                e.target.style.height = this.scrollHeight + 'px';
                // this.style.height = 'auto';
                // this.style.height = this.scrollHeight + 'px';
              })
            this.rootTextarea.appendChild(this.textarea);
        }
        addCss(css);
        if(this.artText.config.hljs.jsFun){
            this.hljs = this.artText.config.hljs.jsFun;
        }else if(this.artText.config.hljs.js){
            loadScript(this.artText.config.hljs.js, 
                ()=>{ window.artText.interpreter.hljs = hljs;hljs.initHighlighting.called = false;hljs.initHighlighting();})
        }
        if(this.artText.config.katex.jsFun){
            this.katex = this.artText.config.katex.jsFun;
        }else if(this.artText.config.katex.js){
            loadScript(this.artText.config.katex.js, ()=>{ window.artText.interpreter.katex = katex;})
        }
        if(this.artText.config.katex.cssFun){

        }else if(this.artText.config.katex.css){
            loadCss(this.artText.config.katex.css)
        }
        this.setMd(window.artText.config.md)
    }
    hasClass(element, cls) {
        return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
    }
    onclick(key='left'){
        this.location = this.getSelection();
        if(this.location && this.location[2] == this.location[3] && this.location[0] != this.location[1] && key == 'right'){
            this.artText.tool.setFloatAuxiliaryTool(this.sel);
        }else{
            this.artText.tool.setFloatAuxiliaryTool();
        }
        this.setSelection();
    }
    enterRender(){
        let location = this.getSelection();
        if(location){
            let md = this.rootNode.childNodes[location[2]].getMd();
            let node = this.rootNode.childNodes[location[2]];
            if(/^(\*{3,}$|^\-{3,}$|^\_{3,}$)/.test(md)){
                let p = document.createElement('p');
                p.innerHTML = '<br/>';
                this.rootDom.replaceChild(document.createElement('hr'), this.rootDom.childNodes[location[2]]); 
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
                this.rootDom.replaceChild(table, this.rootDom.childNodes[location[2]]); 
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

                this.rootDom.replaceChild(pre, this.rootDom.childNodes[location[2]]); 
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
                console.log("无执行2226")
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
                console.log("无执行2226")
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
                console.log("无执行2225")
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
                console.log("无执行222")
                return false;
            }else{
                console.log("无执行")
                console.log(location[4][1].nodeName, location[4][1].parentNode, location[4][1].childNodes);
            }
        }

        return true;
    }
    render(){
        let location = this.getSelection();
        this.location = location;
        
        this.rootNode.domToNode(this.rootDom);
        this.rootNode.dispose();

        // this.container.blur();
        if(this.artText.config.renderFlag){
            this.rootNode.render(this.rootDom)
            if(this.hljs && this.location && this.rootDom.childNodes[this.location[2]].nodeName == 'PRE'){
                this.hljs.initHighlighting.called = false;
                this.hljs.initHighlighting(); 
            }
        }
        this.setSelection();
        
    }
    getSelection(){
        let {anchorNode, anchorOffset, focusNode, focusOffset} = this.sel;
        if(anchorNode && focusNode){
            let node = anchorNode;
            let len = anchorOffset;
            if(node == this.rootDom)
                return null;
            while(node.parentNode != this.rootDom){ 
                while(node.previousSibling){
                    node = node.previousSibling;
                    len += node.textContent.length;
                }
                node = node.parentNode;
            }

            let nodeF = focusNode;
            let lenF = focusOffset;

            while(nodeF.parentNode !== this.rootDom){
                while(nodeF.previousSibling){
                    nodeF = nodeF.previousSibling;
                    lenF += nodeF.textContent.length;
                }
                nodeF = nodeF.parentNode;
            }

            let rootNodeSub = -1;
            for(let i = 0; i < this.rootDom.childNodes.length; i++){
                if(this.rootDom.childNodes[i] === node){
                    rootNodeSub = i;
                    break;
                }
            }

            let rootNodeSubF = -1;
            for(let i = 0; i < this.rootDom.childNodes.length; i++){
                if(this.rootDom.childNodes[i] === nodeF){
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
        console.log(this.location);
        let showNodeList = this.container.getElementsByClassName("art-show");
        for(let i = 0; i < showNodeList.length; i++){
            let classVal = showNodeList[i].getAttribute("class");
            classVal = classVal.replace("art-show", "art-hide");
            showNodeList[i].setAttribute("class", classVal);
        }
        if(this.location && this.location[2] >= 0 && this.location[0] == this.location[1] && this.location[2] == this.location[3]){
            let info = null;
            var pNode = this.rootDom.childNodes[this.location[2]];
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
            console.log(info)
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
                console.log("ac node");
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
    
    mdCollect(rootNodeSub){
        let md = "";
        let n = "\n";
        let pDom = this.rootDom.childNodes[rootNodeSub];
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
    }
    getMd(){
        let md = '';
        for(let i = 0; i < this.rootNode.childNodes.length; i++){
            md += this.rootNode.childNodes[i].getMd('read');
        }
        return md;
    }
    setMd(md){
        let childNodes = textToNode(md);
        if(childNodes){
            this.rootNode.childNodes = childNodes;
        }
        this.rootNode.render(this.rootDom);
        if(this.hljs){
            this.hljs.initHighlighting.called = false;
            this.hljs.initHighlighting(); 
        }
    }
    openTextarea(){
        this.rootDom.style.display = 'none';
        this.textarea.style.display = 'inline';
        this.textarea.innerHTML = this.getMd();
        this.textarea.style.height = this.textarea.scrollHeight + 'px';
    }
    closeTextarea(){
        this.textarea.style.display = 'none';
        this.rootDom.style.display = 'inline';
        this.setMd(this.textarea.innerHTML)
    }
}
export default Interpreter
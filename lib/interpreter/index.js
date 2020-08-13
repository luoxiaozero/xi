import "./css/index.css"
//import "./css/katex.min.css"
//import hljs from "./js/highlight.min.js"
import {mdToNode, textToNode} from "./toNode"
import codeTool from "../tool/codeTool"
import tableTool from "../tool/tableTool"
import Node from '../node'

class Interpreter{
    constructor(container) {
        this.container = container;   
        this.location = null;
        this.rootNode = this.createRootNode();
        this.rootDom = this.container.childNodes[0];
        this.sel = window.getSelection();
    } 
    createRootNode(){
        let br = new Node("br")
        let p = new Node("p", {}, br)
        let root = new Node('div', {"__root__": true, contenteditable:"true"}, p);
        this.container.innerHTML =  "<div><p><br/></p></div>"
        this.rootDom = this.container.childNodes[0];

        this.rootDom.style.outline = "none";
        this.rootDom.style.whiteSpace = "pre-wrap";
        //this.container.style.wordBreak = "break-word";
        this.rootDom.style.wordBreak = 'break-all';
        return root
    }
    init(model){
        if(model == 'read'){
            this.rootNode.attr['contenteditable'] = 'false';
            this.rootDom.setAttribute('contenteditable', false);
        }
        let child = textToNode(window.artText.config.md);
        if(child){
            this.rootNode.child = child;
        }
        this.rootNode.render(this.rootDom);
        //hljs.initHighlightingOnLoad();
    }
    
    hasClass(element, cls) {
        return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
    }
    onclick(){
        let _this = window.artText.interpreter;
        _this.location = _this.getSelection();
        _this.setSelection();
    }
    enterRender(){
        let location = this.getSelection();
        if(location){
            let md = this.rootNode.child[location[2]].getMd();
            let node = this.rootNode.child[location[2]];
            if(/^\|.*\|/.test(md)){
                let table = document.createElement('table');
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
                table.appendChild(tr1);
                table.appendChild(tr2);
                this.rootDom.replaceChild(table, this.rootDom.childNodes[location[2]]); 
                let range =  this.sel.getRangeAt(0).cloneRange();
                range.setStart(tr2.childNodes[0], 0);
                range.collapse(true);
                this.sel.removeAllRanges();
                this.sel.addRange(range);
                return false;
            }else if(/^```\s?/.test(md) || /^```\s\S+/.test(md)){
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
            }else if(location[4][1].parentNode.parentNode.nodeName == 'BLOCKQUOTE' && location[4][1].nextSibling == null 
                    && location[4][0] == location[4][1].length)
            {
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
                        console.log('------------------');
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
        //if(window.artText.config.renderFlag)
            //this.rootNode.render(this.rootDom)
        // hljs.initHighlighting.called = false;
        // hljs.initHighlighting()   
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
        console.log("setSelection", this.location);
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
            }
            else if(this.location[4] !== -1 && (this.location[4][1].nodeName === "LI" || this.location[4][1].nodeName === "TH"||
                                            this.location[4][1].nodeName === "P" || this.location[4][1].nodeName === "TD"||this.location[4][1].nodeName === "DIV")){
                info = [this.location[4][1], 0]
            //else if(pNode.nodeName == "UL" && this.cursorLocation[2] === 0){
            ///    info = [this.cursorLocation[3], 0]
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
}
export default Interpreter
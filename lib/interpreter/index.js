import "./css/index.css"
import "./js/katex.min.js"
import "./css/katex.min.css"
import hljs from "./js/highlight.min.js"
import Config from "../config";
import {mdToNode} from "./toNode"
import {nodeRender} from "./render"

class Interpreter{
    constructor(container) {
        this.container = container;
        this.md = "";   
        this.nodes = [];
        this.location = null;
        this.sel = window.getSelection();
    } 
    init(){
        this.md = Config.md;
        hljs.initHighlightingOnLoad();
        this.nodes = mdToNode(this.md);
        nodeRender(this.container, -1, this.nodes);
    }
    
    hasClass(element, cls) {
        return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
    }
    onclick(){
        let _this = window.artText.interpreter;
        _this.location = _this.getSelection();
        _this.setSelection();
    }
    render(){
        let location = this.getSelection();
        this.location = location;
        console.log(this.location);
        let md = this.mdCollect(location[2]);
        console.log(md)
        let nodes = mdToNode(md);
        nodeRender(this.container, location[2], nodes);
        //hljs.initHighlighting.called = false;
        //hljs.initHighlighting();
        this.setSelection();
    }
    getSelection(){
        console.log(this.sel);
        let {anchorNode, anchorOffset, focusNode, focusOffset} = this.sel;
        if(anchorNode && focusNode){
            let node = anchorNode;
            let len = anchorOffset;

            while(node.parentNode !== this.container){
                while(node.previousSibling){
                    node = node.previousSibling;
                    len += node.textContent.length;
                }
                node = node.parentNode;
            }

            let nodeF = focusNode;
            let lenF = focusOffset;

            while(nodeF.parentNode !== this.container){
                while(nodeF.previousSibling){
                    nodeF = nodeF.previousSibling;
                    lenF += nodeF.textContent.length;
                }
                nodeF = nodeF.parentNode;
            }

            let rootNodeSub = -1;
            for(let i = 0; i < this.container.childNodes.length; i++){
                if(this.container.childNodes[i] === node){
                    rootNodeSub = i;
                    break;
                }
            }

            let rootNodeSubF = -1;
            for(let i = 0; i < this.container.childNodes.length; i++){
                if(this.container.childNodes[i] === nodeF){
                    rootNodeSubF = i;
                    break;
                }
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
            var pNode = this.container.childNodes[this.location[2]];
            var pLen = this.location[0];
            if(this.location[4] !== -1 && (this.location[4][1].nodeName === "LI" || 
                                            this.location[4][1].nodeName === "P" || this.location[4][1].nodeName === "TD")){
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

            if(this.hasClass(art_text_double, "art-text-double")){
                console.log("ac node");
                let classVal = art_text_double.nextSibling.getAttribute("class");
                classVal = classVal.replace("art-hide", "art-show");
                art_text_double.nextSibling.setAttribute("class", classVal);

                classVal = art_text_double.previousSibling.getAttribute("class");
                classVal = classVal.replace("art-hide", "art-show");
                art_text_double.previousSibling.setAttribute("class", classVal);
            }

            if(info[0].nodeName === "#text" && this.hasClass(info[0].parentNode, "art-hide")){
                console.log("a text");
                let classVal = info[0].parentNode.getAttribute("class");
                classVal = classVal.replace("art-hide", "art-show");
                info[0].parentNode.setAttribute("class", classVal);
            }
        }
    }
    
    mdCollect(rootNodeSub){
        let md = "";
        let n = "\n";
        let pNode = this.container.childNodes[rootNodeSub];
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
            md += this.mdNOShieldTextCollect(pNode);
            console.log("else")
        }
        return md
    }
    mdNOShieldTextCollect(node){
        let text = "";
        if(node.nodeName == "#text")
            return node.data;
        if(this.hasClass(node, "art-shield")){
            return "";
        }
        for(let i = 0; i< node.childNodes.length; i++){
            
            text += this.mdNOShieldTextCollect(node.childNodes[i]);
        }
        return text;
    }
}
export default Interpreter
//import katex from "../interpreter/js/katex.min.js"
import tableTool from "../tool/tableTool"
import imgTool from "../tool/imgTool"
import codeTool from "../tool/codeTool"
import {textToNode} from "../interpreter/toNode"
import inline from "../interpreter/toNode/inline"
import Config from "../config/index.js";
import TextNode from "./text/index.js";
//import hljs from "../interpreter/js/highlight.min.js"

class Node{
    constructor(nodeName, attr={}, child=[]){
        this.nodeName = nodeName;
        this.attr = attr;
        if(child instanceof Array){
            this.child = child;
        }else if(typeof child == "string"){
            this.child = child;
        }else if(child == null){
            this.child = []
        }else{
            this.child = [child]
        }
    }

    getDom(){
        if(this.nodeName === "#text"){
            return document.createTextNode(this.child);
        }
        let dom = document.createElement(this.nodeName);
        for (let key in this.attr){
            if(key === "__dom__"){
                if(this.attr[key] === "math"){
                    //let html = katex.renderToString(this.attr["art-math"], {
                     //               throwOnError: false
                     //           });
                    //dom.innerHTML = html;
                }else if(this.attr[key] === "tableTool"){
                    dom.appendChild(tableTool())
                }else if(this.attr[key] === "imgTool"){
                    dom.appendChild(imgTool())
                }else if(this.attr[key] === "codeTool"){
                    dom.appendChild(codeTool())
                }
            }else if(!(/^__[a-zA-Z\d]+__$/.test(key))){
                dom.setAttribute(key, this.attr[key]);
            }
        }
        if (this.child.length > 0){
            this.child.forEach((element) => {
                dom.appendChild(element.getDom());
            })
        }
        return dom;
    }
    hasClass(element, cls) {
        return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
    }
    render(dom){
        if(dom.nodeName.toLowerCase() === this.nodeName){
            if(dom.nodeName === "#text"){
                if(this.child == dom.nodeValue){
                    return null;
                }else{
                    dom.nodeValue = this.child;
                    return false;
                }
            }else if(this.nodeName == "code"){
                return null 
            }else if(this.hasClass(dom, "art-shield") ){
                let math = dom.getAttribute("art-math")
                if(math && this.attr["art-math"] !== math){
                //let html = katex.renderToString(this.attr["art-math"], {
                //        throwOnError: false
                //        });
                //dom.innerHTML = html;
                }
                for (let key in this.attr){
                    if(!(/^__[a-zA-Z\d]+__$/.test(key))){
                        dom.setAttribute(key, this.attr[key]);
                    }
                }
            }else{
                for (let key in this.attr){
                    if(!(/^__[a-zA-Z\d]+__$/.test(key))){
                        dom.setAttribute(key, this.attr[key]);
                    }
                }
                if(this.nodeName == "blockquote"){
                    console.log(dom.childNodes, this.child)
                }
                for(let i = 0, j = 0;i < dom.childNodes.length || j < this.child.length; i++, j++){
                    
                    let _dom = null, _node = null;
                    if(i < dom.childNodes.length){
                        _dom = dom.childNodes[i];
                    }
                    if(j < this.child.length){
                        _node = this.child[j];
                    } 
                    if(_dom == null){
                        dom.appendChild(_node.getDom());
                        if(_node.nodeName === 'pre'){
                            //hljs.initHighlighting.called = false;
                            //hljs.initHighlighting()  
                        }
                    }else if(_node == null){
                        if(this.nodeName == "blockquote"){
                        }
                        let len = dom.childNodes.length;
                        while(i < len){
                            dom.removeChild(dom.lastChild);
                            i++;
                        }
                        // dom.removeChild(_dom);
                        if(this.nodeName == "blockquote"){
                            console.log('adasd2', dom)
                        }
                    }else{
                        this.child[j].render(_dom)
                    }
                }
            }
        }else{
            let newDom = this.getDom();
            dom.parentNode.replaceChild(newDom, dom); 
            if(this.nodeName === 'pre'){
                //hljs.initHighlighting.called = false;
                //hljs.initHighlighting()  
            }
        }
        return null;
    }

    getText(){
        if('class' in this.attr && (this.attr['class'] == "art-shield" || this.attr['class']['art-hide']))
            return ''
        let text = "";
        for(let i = 0; i < this.child.lenght; i++){
            text += this.child[i].getText();
        }
    }

    newNode(dom){
        if(dom.nodeName == "#text")
            return new TextNode(dom.nodeValue)
        let name = dom.nodeName.toLowerCase();
        let node = new Node(name, {}, []);
        for(let i = 0;i < dom.attributes.length;i++){
            let it = dom.attributes[i];
            node.attr[it.localName] = it.value;
        }
        for(let i = 0; i < dom.childNodes.length; i++){
            node.child.push(this.newNode(dom.childNodes[i]))
        }
        return node;
    }
    domToNode(dom){
        if(dom.nodeName != this.nodeName){
            if(dom.nodeName == "#text" || this.nodeName == "#text"){
                return this.newNode(dom)
            }else{
                let name = dom.nodeName.toLowerCase();
                if(name == 'div'&& !this.attr['__root__']){
                    let location = window.artText.interpreter.location;
                    if(location && location[4][1] != dom){
                        name = 'p';
                    }
                }
                    
                this.nodeName = name;
            }
            
        }
            
        if(this.nodeName == "#text"){
            this.child = dom.nodeValue;
            return false;
        }
        let i;
        if(this.attr['__root__'] && this.attr['__root__'] == true){
             
        }else{
            this.attr = {};  
            for(i = 0;i < dom.attributes.length;i++){
                let it = dom.attributes[i];
                this.attr[it.localName] = it.value;
            }
        }
        for(i = 0; i < dom.childNodes.length; i++){
            if(i < this.child.length){
                let node = this.child[i].domToNode(dom.childNodes[i]);
                if(node)
                    this.child[i] = node;
            }else
                this.child.push(this.newNode(dom.childNodes[i]))
        }
        if(i < this.child.length)
            this.child.splice(i, this.child.length - i);
        return null;
    }

    appendChild(node){
        this.child.push(node);
    }
    replaceChild(newNode, oldNode){
        let index = this.child.indexOf(oldNode)
        if(index != -1){
            this.child[index] = newNode;
        }
    }

    getMd(){
        let md = ""
        if(this.nodeName == "a"){
            md += this.child[0].child;
        }else if(this.attr["class"] && this.attr["class"] == "art-shield"){
            return ""
        }else{
            for(let i = 0; i < this.child.length; i++){
                md += this.child[i].getMd();
            }
        }
        return md;
    }
    dispose(){
        if(this.nodeName == "div"){
            if(this.attr["class"] && this.attr["class"].search(/art-shield/)){
                return null
            }
            for(let i = 0; i < this.child.length; i++){
                let nodes = this.child[i].dispose();
                if(nodes && nodes.length > 0){      
                    this.child.splice(i, 1, ...nodes);
                }
            }
            if(this.attr['__root__'] != true)
                return this.child;
        }else if(this.nodeName === "ul" || this.nodeName === "ol" || this.nodeName == "blockquote"){
            for(let i = 0; i < this.child.length; i++){
                if(this.child[i].nodeName == "blockquote"){
                    this.child[i].dispose();
                }else if(this.child[i].nodeName == 'li' && this.child[i].child[0].nodeName == "blockquote"){
                    this.child[i].child[0].dispose();
                
                }else if(this.child[i].nodeName == "ul"){
                    this.child[i].dispose();
                }else if(this.child[i].nodeName == "ol"){
                    this.child[i].dispose();
                }else if(/^>\s/.test(this.child[i].getMd())){
                    console.log(this.child[i].getMd())
                    let child = [];
                    while (i < this.child.length && this.child[i].getMd().match(/^>\s/)) {
                        if(this.child[i].getMd().substring(2) == ""){
                            child.push(new Node("p", {}, new Node("br")));
                        }else{
                            child.push(new Node("p", {}, new TextNode(this.child[i].getMd().substring(2))));
                        }
                        i++;
                    }
                    i--;
                    if(this.nodeName === "ul" || this.nodeName === "ol")
                        this.child[i] = new Node('li', {}, new Node("blockquote", {}, child));
                    else
                        this.child[i] = new Node("blockquote", {}, child);
                }else if(/^\*\s/.test(this.child[i].getMd())){
                    let child = [];
                    while (i < this.child.length && this.child[i].getMd().match(/^\*\s/)) {
                        child.push(new Node("li", {}, inline(this.child[i].getMd().substring(2))));
                        i++;
                    } 
                    i--;
                    this.child[i] = new Node("ul", {}, child);
                }else if(/^\d\.\s/.test(this.child[i].getMd())){
                    //rows[i].match(/^\d\.\s/) && rows[i].match(/^\d\.\s/)[0]:
                    let  child = [];
                    while (i < this.child.length && this.child[i].getMd().match(/^\d\.\s/)) {
                        child.push(new Node("li", {}, inline(this.child[i].getMd().substring(3))));
                        i++;
                    } 
                    i--;
                    this.child[i] = new Node("ol", {}, child);
                }else if(this.child[i].nodeName == "li"){
                    if(this.child[i].child[0].nodeName == 'input'){
                        this.child[i].child = [this.child[i].child[0], ...inline(this.child[i].getMd())];
                    }else if(/^\[x\]\s/.test(this.child[i].getMd())){
                        this.child[i].child = [new Node('input', {type: "checkbox", checked:"checked"}), ...inline(this.child[i].getMd().substring(4))];
                    }else if(/^\[\s\]\s/.test(this.child[i].getMd())){
                        this.child[i].child = [new Node('input', {type: "checkbox"}), ...inline(this.child[i].getMd().substring(4))];
                    }else{
                        this.child[i].child = inline(this.child[i].getMd());
                    }
                
                }else{
                    let nodes = inline(this.child[i].getMd());
                    this.child[i].child = nodes
                }
            }
        }else if(this.nodeName == "table"){
            for(let i = 0; i < this.child.length; i++){
                for(let j = 0; j < this.child.length; j++){
                    let nodes = inline(this.child[i].child[j].getMd());
                    this.child[i].child[j].child = nodes
                }
            }
        }else if(this.nodeName === "pre"){
            return null
        }else if(this.nodeName == "hr"){
            return null
        }else{
            let nodes = textToNode(this.getMd());
            return nodes;
        }
        return null
    }
}
export default Node
import tableTool from "../tool/tableTool"
import imgTool from "../tool/imgTool"
import codeTool from "../tool/codeTool"
import {textToNode} from "../editor/toNode/index"
import inline from "../editor/inline/index"
import VTextNode from "./text";
import Editor from "../editor"

class  VNode{
    nodeName: string;
    attr: {};
    childNodes:  any[];
    constructor(nodeName: string, attr: {}={}, childNodes: any=null){
        this.nodeName = nodeName;
        this.attr = attr;
        if(childNodes instanceof Array){
            this.childNodes = childNodes;
        }else if(childNodes == null){
            this.childNodes = []
        }else{
            this.childNodes = [childNodes]
        }
    }

    getDom(): any{
        let dom = document.createElement(this.nodeName);
        for (let key in this.attr){
            if(key === "__dom__"){
                if(this.attr[key] === "math" && Editor.katex){
                    let html = Editor.katex.renderToString(this.attr["art-math"], {throwOnError: false});
                    dom.innerHTML = html;
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
        if (this.childNodes.length > 0){
            this.childNodes.forEach((element) => {
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
                if(this.childNodes == dom.nodeValue){
                    return null;
                }else{
                    dom.nodeValue = this.childNodes;
                    return false;
                }
            }else if(this.nodeName == "code"){
                return null 
            }else if(this.hasClass(dom, "art-shield") ){
                let math = dom.getAttribute("art-math")
                if(math && this.attr["art-math"] !== math && Editor.katex){
                    let html = Editor.katex.renderToString(this.attr["art-math"], {throwOnError: false});
                    dom.innerHTML = html;
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
                for(let i = 0, j = 0;i < dom.childNodes.length || j < this.childNodes.length; i++, j++){
                    
                    let _dom = null, _node = null;
                    if(i < dom.childNodes.length){
                        _dom = dom.childNodes[i];
                    }
                    if(j < this.childNodes.length){
                        _node = this.childNodes[j];
                    } 
                    if(_dom == null){
                        dom.appendChild(_node.getDom());
                    }else if(_node == null){
                        let len = dom.childNodes.length;
                        while(i < len){
                            dom.removeChild(dom.lastChild);
                            i++;
                        }
                    }else{
                        this.childNodes[j].render(_dom)
                    }
                }
            }
        }else{
            let newDom = this.getDom();
            dom.parentNode.replaceChild(newDom, dom); 
        }
        return null;
    }

    newNode(dom){
        if(dom.nodeName == "#text")
            return new VTextNode(dom.nodeValue)
        let name = dom.nodeName.toLowerCase();
        let node = new VNode(name, {}, []);
        for(let i = 0;i < dom.attributes.length;i++){
            let it = dom.attributes[i];
            node.attr[it.localName] = it.value;
        }
        for(let i = 0; i < dom.childNodes.length; i++){
            node.childNodes.push(this.newNode(dom.childNodes[i]))
        }
        return node;
    }
    domToNode(dom){
        if(dom.nodeName != this.nodeName){
            if(dom.nodeName == "#text" || this.nodeName == "#text"){
                return this.newNode(dom)
            }else{
                let name = dom.nodeName.toLowerCase();
                /*if(name == 'div'&& !this.attr['__root__']){
                    let location = window.artText.interpreter.location;
                    if(location && location[4][1] != dom && ){
                        name = 'p';
                    }
                }*/
                    
                this.nodeName = name;
            }
            
        }
            
        if(this.nodeName == "#text"){
            this.childNodes = dom.nodeValue;
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
            if(i < this.childNodes.length){
                let node = this.childNodes[i].domToNode(dom.childNodes[i]);
                if(node)
                    this.childNodes[i] = node;
            }else{
                this.childNodes.push(this.newNode(dom.childNodes[i]))
            }
                
        }
        if(i < this.childNodes.length)
            this.childNodes.splice(i, this.childNodes.length - i);
        return null;
    }

    appendChild(node){
        this.childNodes.push(node);
    }
    replaceChild(newNode, oldNode){
        let index = this.childNodes.indexOf(oldNode)
        if(index != -1){
            this.childNodes[index] = newNode;
        }
    }

    getMd(model='editor'){
        let md = ""
        if(this.nodeName == "a"){
            md += this.childNodes[0].childNodes;
        }else if(this.nodeName == "hr" && model == 'read'){
                md += '***\n';
        }else if(this.nodeName == 'input' && this.attr['type'] == "checkbox" && model == 'read'){
            if(this.attr['checked'] == "checked"){
                md += '[x] '
            }else{
                md += '[ ] '
            }
        }else if(this.nodeName == "blockquote" && model == 'read'){
            for(let i = 0; i < this.childNodes.length; i++){
                md += '> ' + this.childNodes[i].getMd(model);
            }
        }else if(this.nodeName == "ul" && model == 'read'){
            for(let i = 0; i < this.childNodes.length; i++){
                md += '* ' + this.childNodes[i].getMd(model) + '\n';
            }
        }else if(this.nodeName == "ol" && model == 'read'){
            for(let i = 0; i < this.childNodes.length; i++){
                md += (i+1).toString() + '. ' + this.childNodes[i].getMd(model) + '\n';
            }
        }else if(model == 'read' && ('h1 h2 h3 h4 h5 h6'.indexOf(this.nodeName) >= 0 || this.nodeName == 'p')){
            for(let i = 0; i < this.childNodes.length; i++){
                md += this.childNodes[i].getMd(model) 
            }
            md += '\n';
        }else if(model == 'read' && this.nodeName == 'table'){
            for(let i = 0; i < this.childNodes.length; i++){
                md += '|';
                let j;
                for(j = 0; j < this.childNodes[i].childNodes.length; j++){
                    md += this.childNodes[i].childNodes[j].getMd(model) + '|';
                }
                md += '\n';
                if(i == 0){
                    md += '|'
                    while(j--){
                        md += '---|'
                    }
                    md += '\n';
                }
            }
        }else if(model == 'read' && this.nodeName == 'pre'){
            md += '```'
            
            let className = this.childNodes[0].attr['class'];
            if(className){
                md += ' ' + className.substring(5).split(' ')[0];
            }
            md += '\n';
            for(let i = 0; i < this.childNodes.length; i++){
                md += this.childNodes[i].getMd(model) + '\n';
            }
            md += '```\n'
        }else if(this.attr["class"] && this.attr["class"] == "art-shield"){
            return ""
        }else{
            for(let i = 0; i < this.childNodes.length; i++){
                md += this.childNodes[i].getMd(model);
            }
        }
        return md;
    }
    dispose(){
        //if(this.attr["class"] && this.attr["class"].search(/art-shield/)){
        if(this.attr['__root__'] == true){
            for(let i = 0; i < this.childNodes.length; i++){
                if(this.childNodes[i].attr["class"] && this.childNodes[i].attr["class"].match(/art-shield/)){
                    continue;
                }
                let nodes = this.childNodes[i].dispose();
                if(nodes && nodes.length > 0){      
                    this.childNodes.splice(i, 1, ...nodes);
                }
            }
            if(this.attr['__root__'] != true)
                return this.childNodes;
        }else if(this.nodeName == "blockquote"){
            for(let i = 0; i < this.childNodes.length; i++){
                if(this.childNodes[i].nodeName == "blockquote" || this.childNodes[i].nodeName == "ul" || this.childNodes[i].nodeName == "ol"){
                    this.childNodes[i].dispose();
                }else if(/^>\s/.test(this.childNodes[i].getMd())){
                    this.childNodes[i] = new  VNode("blockquote", {}, new VNode('p', {}, new VNode('br')));
                }else if(/^\*\s/.test(this.childNodes[i].getMd())){
                    this.childNodes[i] = new  VNode("ul", {}, new VNode('li', {}, new VNode('br')));
                }else if(/^\d\.\s/.test(this.childNodes[i].getMd())){
                    this.childNodes[i] = new  VNode("ol", {}, new VNode('li', {}, new VNode('br')));
                }else{
                    this.childNodes[i].childNodes = inline(this.childNodes[i].getMd());
                }
            }
        }else if(this.nodeName === "ul" || this.nodeName === "ol"){
            for(let i = 0; i < this.childNodes.length; i++){
                if(this.childNodes[i].childNodes[0].nodeName == "blockquote" || this.childNodes[i].childNodes[0].nodeName == "ul" || this.childNodes[i].childNodes[0].nodeName == "ol"){
                    for(let j = 0; j < this.childNodes[i].childNodes.length; j++){
                        if(this.childNodes[i].childNodes[j].nodeName == "p"){
                            this.childNodes[i].childNodes[j].childNodes = inline(this.childNodes[i].childNodes[j].getMd())
                        }else{
                            this.childNodes[i].childNodes[j].dispose();
                        }
                    }
                }else if(/^>\s/.test(this.childNodes[i].getMd())){
                    this.childNodes[i].childNodes = [new VNode("blockquote", {}, new VNode('p', {}, new VNode('br')))];
                }else if(/^\*\s/.test(this.childNodes[i].getMd())){
                    this.childNodes[i].childNodes = [new VNode("ul", {}, new VNode("li", {}, new VNode('br')))];
                }else if(/^\d\.\s/.test(this.childNodes[i].getMd())){
                    this.childNodes[i].childNodes = [new VNode("ol", {}, new VNode("li", {}, new VNode('br')))];
                }else{
                    if(this.childNodes[i].childNodes[0].nodeName == 'input'){
                        this.childNodes[i].childNodes = [this.childNodes[i].childNodes[0], ...inline(this.childNodes[i].getMd())];
                    }else if(/^\[x\]\s/.test(this.childNodes[i].getMd())){
                        this.childNodes[i].childNodes = [new VNode('input', {type: "checkbox", checked:"checked"}), ...inline(this.childNodes[i].getMd().substring(4))];
                    }else if(/^\[\s\]\s/.test(this.childNodes[i].getMd())){
                        this.childNodes[i].childNodes = [new VNode('input', {type: "checkbox"}), ...inline(this.childNodes[i].getMd().substring(4))];
                    }else{
                        this.childNodes[i].childNodes = inline(this.childNodes[i].getMd());
                    }
                }
            }
        }else if(this.nodeName == "table"){
            // table
            for(let i = 0; i < this.childNodes.length; i++){
                // thead tbody
                for(let j = 0; j < this.childNodes[i].childNodes.length; j++){
                    // tr
                    for(let k = 0; k < this.childNodes[i].childNodes[j].childNodes.length; k++){
                        let nodes = inline(this.childNodes[i].childNodes[j].childNodes[k].getMd());
                        this.childNodes[i].childNodes[j].childNodes[k].childNodes = nodes;
                    }
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
export default  VNode
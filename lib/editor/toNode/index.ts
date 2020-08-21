import inline from "../inline/index"
import aline from "../aline/index"
import Node from "../../vNode"
import TextNode from "../../vNode/text"
import {inlineRule} from '../rules/index'
function uoDispose(text, nodeName){
    // 处理
    let num = 2;
    if(nodeName == 'ol'){
        num = 3;
    }
    if(text.substring(num) == ""){
        return new Node("li", {}, new Node("br"));
    }else if(nodeName == 'ul' && /^\[x\]\s/.test(text.substring(2))){
        return new Node("li", {}, [new Node('input', {type: "checkbox", checked:"checked"}), ...inline(text.substring(6))]);
    }else if(nodeName == 'ul' && /^\[\s\]\s/.test(text.substring(2))){
        return new Node("li", {}, [new Node('input', {type: "checkbox"}), ...inline(text.substring(6))]);   
    }else if(/^\*\s/.test(text.substring(num))){
        return new Node("li", {}, new Node(nodeName, {}, uoDispose(text.substring(num), nodeName)));
    }else if(/^\d\.\s/.test(text.substring(num))){
        return new Node("li", {}, new Node(nodeName, {}, uoDispose(text.substring(num), nodeName)));
    }else if(/^>\s/.test(text.substring(2))){
        return new Node("li", {}, new Node('blockquote', {}, bDispose(text.substring(2))));
    }else{
        return new Node("li", {}, inline(text.substring(num)));
    }
}

function bDispose(text){
    // 处理
    if(text.substring(2) == ""){
        return new Node("p", {}, new Node("br"));
    }else if(/^>\s/.test(text.substring(2))){
        return new Node('blockquote', {}, bDispose(text.substring(2)));
    }else if(/^\*\s/.test(text.substring(2))){
        return new Node('ul', {}, uoDispose(text.substring(2), 'ul'));
    }else if(/^\d\.\s/.test(text.substring(2))){
        return new Node('ol', {}, uoDispose(text.substring(3), 'ol'));
    }else{
        return new Node("p", {}, inline(text.substring(2)));
    } 
}
function buo(node){
    // 整合
    let child = node.childNodes;
    let newChild  = [];
    for(let i = 0; i < child.length; i++){
        if(child[i].nodeName == 'blockquote' && newChild.length > 0 && newChild[newChild.length - 1].nodeName == 'blockquote'){
            newChild[newChild.length - 1].childNodes.push(child[i].childNodes[0]);
        }else if(child[i].nodeName == 'ul' && newChild.length > 0 && newChild[newChild.length - 1].nodeName == 'ul'){
            newChild[newChild.length - 1].childNodes.push(child[i].childNodes[0]);
        }else if(child[i].nodeName == 'ol' && newChild.length > 0 && newChild[newChild.length - 1].nodeName == 'ol'){
            newChild[newChild.length - 1].childNodes.push(child[i].childNodes[0]);
        }else if(child[i].childNodes[0].nodeName == 'ul' && newChild.length > 0 && newChild[newChild.length - 1].childNodes[0].nodeName == 'ul'){
            newChild[newChild.length - 1].childNodes[0].childNodes.push(child[i].childNodes[0].childNodes[0]);
        }else if(child[i].childNodes[0].nodeName == 'ol' && newChild.length > 0 && newChild[newChild.length - 1].childNodes[0].nodeName == 'ol'){
            newChild[newChild.length - 1].childNodes[0].childNodes.push(child[i].childNodes[0].childNodes[0]);
        }else{
            if(newChild.length > 0){
                if(newChild[newChild.length - 1].nodeName == 'blockquote'){
                    newChild[newChild.length - 1] = buo(newChild[newChild.length - 1]);
                }else if('ul ol'.indexOf(newChild[newChild.length - 1].childNodes[0].nodeName) >= 0){
                    newChild[newChild.length - 1].childNodes[0] = buo(newChild[newChild.length - 1].childNodes[0]);
                }else if('ul ol'.indexOf(newChild[newChild.length - 1].nodeName) >= 0){
                    newChild[newChild.length - 1] = buo(newChild[newChild.length - 1]);
                }
            }
            newChild.push(child[i]);
        }
    }
    if(newChild.length > 0){
        if(newChild[newChild.length - 1].nodeName == 'blockquote'){
            newChild[newChild.length - 1] = buo(newChild[newChild.length - 1]);
        }else if('ul ol'.indexOf(newChild[newChild.length - 1].childNodes[0].nodeName) >= 0){
            newChild[newChild.length - 1].childNodes[0] = buo(newChild[newChild.length - 1].childNodes[0]);
        }else if('ul ol'.indexOf(newChild[newChild.length - 1].nodeName) >= 0){
            newChild[newChild.length - 1] = buo(newChild[newChild.length - 1]);
        }
    }
    node.childNodes = newChild;
    return node;
}


function textToNode(text){
    if(text == null)
        return null
    let rows = text.split("\n");
    let nodes = []
    let child;
    for (let i = 0, len = rows.length; i < len; i++) {        
        if(/^>\s/.test(rows[i])){
            child = [];
            while (i < len && /^>\s/.test(rows[i])) {
                child.push(bDispose(rows[i]));
                i++;
            }
            i--;
            nodes.push(buo(new Node("blockquote", {}, child)))
        }else if(/^\*\s/.test(rows[i])){
            child = [];
            while (i < len && /^\*\s/.test(rows[i])) {
                child.push(uoDispose(rows[i], 'ul'));  
                i++;
            } 
            i--;
            nodes.push(buo(new Node("ul", {}, child)));
        }else if(/^\d\.\s/.test(rows[i])){
            child = [];
            while (i < len && /^\d\.\s/.test(rows[i])) {
                child.push(uoDispose(rows[i], 'ol'));  
                i++;
            } 
            i--;
            nodes.push(buo(new Node("ol", {}, child)));
        }else if(/^```\s/.test(rows[i])){
            let lang = rows[i].substring(4);
            let j, _is = false, temp='';
            child = [];
            for(j = i + 1;j < len; j++){                     
                if(/^```$/.test(rows[j])){
                    _is = true;
                    break;
                }
                temp += rows[j] + '\n';
                if(lang){
                    child.push(new Node("code", {"class": "lang-" + lang}, new TextNode(rows[j])));
                }else{
                    child.push(new Node("code", {}, new TextNode(rows[j])));
                }
            }
            if(_is){
                i = j;
                let code;
                if(lang){
                    code = new Node("code", {"class": "lang-" + lang}, new TextNode(temp));
                }else{
                    code = new Node("code", {}, new TextNode(temp));
                }
                nodes.push(new Node("pre", {'style': ' margin-top:35px'}, code));
            }else{
                nodes.push(new Node("p", {}, new TextNode(rows[i])));
            }       
        }else if(/^\|.*\|/.test(rows[i])){
            let arry, j, jlen;
            let _val = [], tbodyChild;
            if(i + 1 < len && /^\|(\s*-{3,}\s*\|)+/.test(rows[i+1])){
                child = []
                arry = rows[i].split('|');
                for (j = 1, jlen = arry.length - 1; j < jlen; j++) {
                    _val.push(new Node("th", {}, inline(arry[j])));
                }
                child.push(new Node('thead', {}, new Node("tr",{}, _val)));
                i += 2;
                tbodyChild = []
                while (i < len && /^\|.*\|/.test(rows[i])) {
                    arry = rows[i].split('|');
                    _val = []
                    for (j = 1, jlen = arry.length - 1; j < jlen; j++) {
                        _val.push(new Node("td", {}, inline(arry[j])));
                    }
                    tbodyChild.push(new Node("tr",{}, _val));
                    i++;
                }
                i--;
                child.push(new Node('tbody', {}, tbodyChild))
                nodes.push(new Node("table", {"style": "width:100%; margin-top:35px"}, child));
            }else{
                nodes.push(new Node("p", {}, inline(rows[i])));
            }
        }else if(/^(\*{3,}$|^\-{3,}$|^\_{3,}$)/.test(rows[i])){
            nodes.push(new Node("hr"))            
        }else if(child = aline(rows[i])){
            // 单行成功
            child.forEach(element => {
                nodes.push(element);
            })
        }else {
            // 无 单、多行
            child = inline(rows[i])
            nodes.push(new Node("p", {}, child));
        }
    }
    return nodes;
}

function htmlToMd(html){
    let md = '';
    if(html.nodeName == 'DIV' || html.nodeName == 'P'){
        for(let i = 0; i < html.childNodes.length; i++){
            md += htmlToMd(html.childNodes[i]);
        }
        md += '\n';
    }else if(html.nodeName == 'UL'){
        for(let i = 0; i < html.childNodes.length; i++){
            md += '* ' + htmlToMd(html.childNodes[i]) + '\n';
        }
    }else if(html.nodeName == 'OL'){
        for(let i = 0; i < html.childNodes.length; i++){
            md += (i + 1).toString() + '. ' + htmlToMd(html.childNodes[i]) + '\n';
        }
    }else if(html.nodeName == 'BLOCKQUOTE'){
        for(let i = 0; i < html.childNodes.length; i++){
            md += '> ' + htmlToMd(html.childNodes[i]) + '\n';
        }
    }else if(html.nodeName == 'TABLE'){
        for(let i = 0; i < html.childNodes.length; i++){
            md += '> ' + htmlToMd(html.childNodes[i]) + '\n';
        }
    }else if(/^H\d$/.test(html.nodeName)){
        md += '#'.repeat(html.nodeName[1]) + ' ';
        for(let i = 0; i < html.childNodes.length; i++){
            md += htmlToMd(html.childNodes[i]);
        }
        md += '\n';
    }else if(html.nodeName == 'A'){
        md += '[' + htmlToMd(html.childNodes[0]) + '](' +  html.href + ')';
    }else if(html.nodeName == 'IMG'){
        md += '![' + html.alt + '](' +  html.src + ')';
    }else if(html.nodeName == '#text'){
        md += html.data;
    }else{
        let _is = true;
        for(let i = 0; i < inlineRule.length; i++){
            if(html.nodeName.toLowerCase() == inlineRule[i].tag){
                md += inlineRule[i].left;
                for(let i = 0; i < html.childNodes.length; i++){
                    md += htmlToMd(html.childNodes[i]);
                }
                md += inlineRule[i].right;
                _is = false;
                break;
            }
        }
        for(let i = 0; _is && i < html.childNodes.length; i++){
            md += htmlToMd(html.childNodes[i]);
        }
    }
    return md;
}
export {textToNode, htmlToMd};
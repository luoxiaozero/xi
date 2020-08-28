import inline from "../inline/index"
import aline from "../aline/index"
import VNode from "../../vNode"
import VTextNode from "../../vNode/text"
import {inlineRules} from '../rules/index'
function uoDispose(text, nodeName){
    // 处理
    let num = 2;
    if(nodeName == 'ol'){
        num = 3;
    }
    if(text.substring(num) == ""){
        return new VNode("li", {}, new VNode("br"));
    }else if(nodeName == 'ul' && /^\[x|X\]\s/.test(text.substring(2))){
        return new VNode("li", {}, [new VNode('input', {type: "checkbox", checked:"checked"}), ...inline(text.substring(6))]);
    }else if(nodeName == 'ul' && /^\[\s\]\s/.test(text.substring(2))){
        return new VNode("li", {}, [new VNode('input', {type: "checkbox"}), ...inline(text.substring(6))]);   
    }else if(/^\*\s/.test(text.substring(num))){
        return new VNode("li", {}, new VNode(nodeName, {}, uoDispose(text.substring(num), nodeName)));
    }else if(/^\d\.\s/.test(text.substring(num))){
        return new VNode("li", {}, new VNode(nodeName, {}, uoDispose(text.substring(num), nodeName)));
    }else if(/^>\s/.test(text.substring(2))){
        return new VNode("li", {}, new VNode('blockquote', {}, bDispose(text.substring(2))));
    }else{
        return new VNode("li", {}, inline(text.substring(num)));
    }
}

function bDispose(text){
    // 处理
    if(text.substring(2) == ""){
        return new VNode("p", {}, new VNode("br"));
    }else if(/^>\s/.test(text.substring(2))){
        return new VNode('blockquote', {}, bDispose(text.substring(2)));
    }else if(/^\*\s/.test(text.substring(2))){
        return new VNode('ul', {}, uoDispose(text.substring(2), 'ul'));
    }else if(/^\d\.\s/.test(text.substring(2))){
        return new VNode('ol', {}, uoDispose(text.substring(2), 'ol'));
    }else{
        return new VNode("p", {}, inline(text.substring(2)));
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


function textToNode(text: string){
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
            if(!(i < len && rows[i] == ''))
                i--;
            console.log(child)
            nodes.push(buo(new VNode("blockquote", {}, child)))
        }else if(/^\*\s/.test(rows[i])){
            child = [];
            while (i < len && /^\*\s/.test(rows[i])) {
                child.push(uoDispose(rows[i], 'ul'));  
                i++;
            } 
            if(!(i < len && rows[i] == ''))
                i--;
            nodes.push(buo(new VNode("ul", {}, child)));
        }else if(/^\d\.\s/.test(rows[i])){
            child = [];
            while (i < len && /^\d\.\s/.test(rows[i])) {
                child.push(uoDispose(rows[i], 'ol'));  
                i++;
            } 
            if(!(i < len && rows[i] == ''))
                i--;
            nodes.push(buo(new VNode("ol", {}, child)));
        }else if(/^```/.test(rows[i])){
            let lang = rows[i].match(/^```\s*([^\s]*?)\s*$/)[1];
            let j, _is = false, temp='';
            for(j = i + 1;j < len; j++){                     
                if(/^```$/.test(rows[j])){
                    _is = true;
                    break;
                }
                temp += rows[j] + '\n';
            }
            if(_is){
                i = j;
                let code;
                if(lang != undefined && lang != ''){
                    code = new VNode("code", {"class": "lang-" + lang}, new VTextNode(temp));
                }else{
                    code = new VNode("code", {}, new VTextNode(temp));
                }    
                nodes.push(new VNode("pre", {'style': ' margin-top:35px'}, code));
                if(i + 1 < len && rows[i + 1] == '')
                    i++;
            }else{
                nodes.push(new VNode("p", {}, new VTextNode(rows[i])));
                if(i + 1 < len && rows[i + 1] == '')
                    i++;
            }       
        }else if(/^\|.*\|/.test(rows[i])){
            let arry, j, jlen;
            let _val = [], tbodyChild;
            if(i + 1 < len && /^\|(\s*-{3,}\s*\|)+/.test(rows[i+1])){
                child = []
                arry = rows[i].split('|');
                for (j = 1, jlen = arry.length - 1; j < jlen; j++) {
                    _val.push(new VNode("th", {}, inline(arry[j])));
                }
                child.push(new VNode('thead', {}, new VNode("tr",{}, _val)));
                i += 2;
                tbodyChild = []
                while (i < len && /^\|.*\|/.test(rows[i])) {
                    arry = rows[i].split('|');
                    _val = []
                    for (j = 1, jlen = arry.length - 1; j < jlen; j++) {
                        _val.push(new VNode("td", {}, inline(arry[j])));
                    }
                    tbodyChild.push(new VNode("tr",{}, _val));
                    i++;
                }
                if(!(i < len && rows[i] == ''))
                    i--;
                child.push(new VNode('tbody', {}, tbodyChild))
                nodes.push(new VNode("table", {"style": "width:100%; margin-top:35px"}, child));
            }else{
                nodes.push(new VNode("p", {}, inline(rows[i])));
                if(i + 1 < len && rows[i + 1] == '')
                    i++;
            }
        }else if(/^(\*{3,}$|^\-{3,}$|^\_{3,}$)/.test(rows[i])){
            nodes.push(new VNode("hr"));
            if(i + 1 < len && rows[i + 1] == '')
                i++;            
        }else if(child = aline(rows[i])){
            // 单行成功
            child.forEach(element => {
                nodes.push(element);
            })
            if(i + 1 < len && rows[i + 1] == '')
                i++;
        }else {
            // 无 单、多行
            nodes.push(new VNode("p", {}, inline(rows[i])));
            if(i + 1 < len && rows[i + 1] == '')
                i++;
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
        for(let i = 0; i < inlineRules.length; i++){
            if(html.nodeName.toLowerCase() == inlineRules[i].tag){
                md += inlineRules[i].left;
                for(let i = 0; i < html.childNodes.length; i++){
                    md += htmlToMd(html.childNodes[i]);
                }
                md += inlineRules[i].right;
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
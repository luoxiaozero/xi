import { VNode, VText } from '../../vObject';
import ArtRender from '../../..';

function inline(text: string): VNode[]{
    if (text === '') {
        return [new VNode('br')]
    }
    let nodes = [], reMatch: RegExpMatchArray, reTrue;
    while(text){
        reTrue = null;
        // 匹配那个规则最符合
        for (let i = 0; i < inlineRules.length; i++) {
            if(reMatch = text.match(inlineRules[i].re)){
                if(reMatch.index == 0){
                    reTrue = [reMatch, inlineRules[i]];
                    break;
                }
                if(reTrue){
                    if(reTrue[0].index > reMatch.index){
                        reTrue = [reMatch, inlineRules[i]];
                    }
                }else{
                    reTrue = [reMatch, inlineRules[i]];
                }
            }
        }
        if(reTrue){
            if (reTrue[0].index != 0) {
                nodes.push(new VText(text.substring(0, reTrue[0].index)));
            }
            reTrue[1]["fun"](reTrue[0][0]).forEach(ele => {
                nodes.push(ele);
            });
            
            text = text.substring(reTrue[0].index + reTrue[0][0].length)
        }else{
            nodes.push(new VText(text));
            break;
        }
    }
    return nodes;
}
const bold = {tag: 'b', "left": "**", "right": "**", "re": /(\*{2})([^\*].*?)(\*{2})/, "fun": blodFun}
const italic = {tag: 'i', "left": "*", "right": "*", "re": /(\*)([^\*].*?)(\*)/, "fun":italicFun}
const bi = {tag: 'bi', "left": "***", "right": "***", "re": /(\*{3})([^\*].*?)(\*{3})/, "fun":biFun}
const inline_code = {tag: 'code', "left": "`", "right": "`", "re": /`[^`]+`/, "fun": inlineCodeFun}
const img = {tag: 'img', "left": "![", "centre": "](", "right": ")","re": /!\[.*?\]\(.*?\)/, "fun": imgFun}
const a = {tag: 'a', "left": "[", "centre": "](", "right": ")", "re": /\[.*?\]\(.*?\)/, "fun": aFun}
const math = {tag: 'math', "left": "$", "right": "$", "re": /\$.*?\$/, "fun": mathFun}
const mark = {tag: 'mark', "left": "==", "right": "==", "re": /\={2}[^\=].*?\={2}/, "fun":markFun}
const del = {tag: 'del', "left": "~~", "right": "~~", "re": /~{2}.*?~{2}/, "fun":delFun}
const ins = {tag: 'ins', "left": "__", "right": "__", "re": /_{2}.*?_{2}/, "fun":insFun}
const sup = {tag: 'sup', "left": "^", "right": "^", "re": /\^[^\^]+\^/, "fun":supFun}
const sub = {tag: 'sub', "left": "~", "right": "~", "re": /~[^~\s]+~/, "fun":subFun}
const escape = {tag: 'escape', left: '\\', right: 'null', re: /\\(\S{1})/, fun: escapeFun}
const html_tag = {tag: 'html_tag', left: 'null', right: 'null', 're': /(<!--[\s\S]*?-->|(<([a-zA-Z]{1}[a-zA-Z\d-]*) *[^\n<>]* *(?:\/)?>)(?:([\s\S]*?)(<\/\3 *>))?)/, fun: htmlTagFun}
export const inlineRules = [escape, bi, bold, mark, inline_code, italic, img, a, math, del, ins, sup, sub, html_tag]

function escapeFun(text: string): (VNode| VText)[] {
  let lSpan = new VNode('span', { class: 'art-hide'}, new VText('\\'))
  return [lSpan, new VText(text.substring(1))];
}

function htmlTagFun(text: string){
  let re1 = /^<([a-zA-Z]+)( .*?)?>([\s\S]*?)<\/\1+>/
  let reAttr = /\s([a-z]+)="(.*?)"/g
  let reattr = /\s([a-z]+)="(.*?)"/
  let tag = text.match(re1);
  if(tag == null){
    return [new VText(text)];
  }
  let attr = {class: 'art-text-double'};
  if(tag[2]){
    let a = tag[2].match(reAttr);
    for(let i = 0; i < a.length; i++){
      let b = a[i].match(reattr);
      attr[b[1]] = b[2];
    }
  }
  if(attr.class != 'art-text-double') {
    attr.class += " art-text-double";
  }

  if(tag[2] == undefined){
    tag[2] = '';
  }
  let lSpan = new VNode("span", {"class": "art-hide"}, new VText('<' + tag[1] + tag[2] + '>'))
  let cSpan = new VNode(tag[1], attr, inline(tag[3]))
  let rSpan = new VNode("span", {"class": "art-hide"}, new VText('</' + tag[1] + '>'))
  return [lSpan, cSpan, rSpan];
}
function modelFun_1(model){
    let lSpan = new VNode("span", {"class": "art-hide"}, new VText(model[0]))
    let cSpan = new VNode(model[4], {"class": "art-text-double"}, inline(model[2].substring(model[1], model[2].length - model[1])))
    let rSpan = new VNode("span", {"class": "art-hide"}, new VText(model[3]))
    return [lSpan, cSpan, rSpan]
}
function modelFun_2(model){
  let lSpan = new VNode("span", {"class": "art-hide"}, new VText(model[0]))
  let cSpan = new VNode('span', {"class": "art-text-double"}, inline(model[2].substring(model[1], model[2].length - model[1])))
  let rSpan = new VNode("span", {"class": "art-hide"}, new VText(model[3]))
  let span = new VNode(model[4], {}, [lSpan, cSpan, rSpan]);
  return [span];
}
function aFun(text: string){
    let re1 = /\(.*\)/;
    let re2 = /\[.*\]/;
    let url = text.match(re1)[0];
    let title = text.match(re2)[0];

    let lSpan = new VNode("span", {"class": "art-hide"}, new VText("["))
    let cA = new VNode("a", {"href": url.substring(1, url.length - 1), "class": "art-text-double", "title": "alt+点击", style: 'cursor: pointer;'}, 
                        new VText(title.substring(1, title.length -1)));
    let rSpan = new VNode("span", {"class": "art-hide"}, new VText("]" + url))
    
    return [lSpan, cA, rSpan];
}
function imgFun(text: string){
    let re1 = /\(.*\)/;
    let re2 = /\[.*\]/;
    let url = text.match(re1)[0];
    let title = text.match(re2)[0];
    let lSpan = new VNode("span", {"class": "art-hide"}, [new VNode("span", {"class": "art-shield", "__dom__": "imgTool"}, []), new VText(text)]);
    let cImg = new VNode("img", {"src": url.substring(1, url.length - 1), "alt": title.substring(1, title.length -1),
                                "contenteditable": "false", "style": "margin: 0 auto;display: block;"}, null); 
    return [lSpan, cImg];
}
function mathFun(text: string){
  if(ArtRender.plugins.katex){
    let rSpan = new VNode("span", {"class": "art-hide art-math"}, new VText(text));
    let lSpan = new VNode("span", {"class": "art-shield", style: 'position: relative;', "contenteditable": "false", "__dom__": "math"}, 
                            new VNode("span", {style: 'top: 35px;display: inline-table;', "art-math":text.substring(1, text.length - 1)}, null));
                            return [lSpan, rSpan]
  }else{
    return [new VNode("span", {style: 'color: #777'}, new VText(text))];
  }
  
}
function inlineCodeFun(text: string){
    return modelFun_1(["`", 1, text, "`", "code"])
}
function italicFun(text: string){
    return modelFun_1(["*", 1, text, "*", "i"])
}
function markFun(text: string){
    return modelFun_1(["==", 2, text, "==", "mark"])
}
function blodFun(text: string){
    return modelFun_1(["**", 2, text, "**", "b"])
}
function delFun(text: string){
  return modelFun_1(["~~", 2, text, "~~", "del"])
}
function insFun(text: string){
  return modelFun_1(["__", 2, text, "__", "ins"])
}
function supFun(text: string){
  return modelFun_2(["^", 1, text, "^", "sup"])
}
function subFun(text: string){
  return modelFun_2(["~", 1, text, "~", "sub"])
}
function biFun(text: string){
  let lSpan = new VNode("span", {"class": "art-hide"}, new VText('***'))
  let cSpan = new VNode('span', {"class": "art-text-double"}, new VText(text.substring(3, text.length - 3)))
  let rSpan = new VNode("span", {"class": "art-hide"}, new VText('***'))
  let span = new VNode('i', {}, new VNode('b', {}, [lSpan, cSpan, rSpan]));
  return [span];
}
export default inline;
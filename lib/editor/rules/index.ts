import VTextNode from "../../vNode/vTextNode"
import VNode from "../../vNode"
import inline from "../inline"
import Editor from "../"

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
const sub = {tag: 'sub', "left": "~", "right": "~", "re": /~[^~]+~/, "fun":subFun}
const html_tag = {tag: 'html_tag', left: 'null', right: 'null', 're': /(<!--[\s\S]*?-->|(<([a-zA-Z]{1}[a-zA-Z\d-]*) *[^\n<>]* *(?:\/)?>)(?:([\s\S]*?)(<\/\3 *>))?)/, fun: htmlTagFun}
export const inlineRules = [bi, bold, mark, inline_code, italic, img, a, math, del, ins, sup, sub, html_tag]

function htmlTagFun(text: string){
  let re1 = /^<([a-zA-Z]+)( .*?)?>([\s\S]*?)<\/\1+>/
  let reAttr = /\s([a-z]+)="(.*?)"/g
  let reattr = /\s([a-z]+)="(.*?)"/
  let tag = text.match(re1);
  if(tag == null){
    return [new VTextNode(text)];
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
  let lSpan = new VNode("span", {"class": "art-hide"}, new VTextNode('<' + tag[1] + tag[2] + '>'))
  let cSpan = new VNode(tag[1], attr, inline(tag[3]))
  let rSpan = new VNode("span", {"class": "art-hide"}, new VTextNode('</' + tag[1] + '>'))
  return [lSpan, cSpan, rSpan];
}
function modelFun_1(model){
    let lSpan = new VNode("span", {"class": "art-hide"}, new VTextNode(model[0]))
    let cSpan = new VNode(model[4], {"class": "art-text-double"}, inline(model[2].substring(model[1], model[2].length - model[1])))
    let rSpan = new VNode("span", {"class": "art-hide"}, new VTextNode(model[3]))
    return [lSpan, cSpan, rSpan]
}
function modelFun_2(model){
  let lSpan = new VNode("span", {"class": "art-hide"}, new VTextNode(model[0]))
  let cSpan = new VNode('span', {"class": "art-text-double"}, inline(model[2].substring(model[1], model[2].length - model[1])))
  let rSpan = new VNode("span", {"class": "art-hide"}, new VTextNode(model[3]))
  let span = new VNode(model[4], {}, [lSpan, cSpan, rSpan]);
  return [span];
}
function aFun(text: string){
    let re1 = /\(.*\)/;
    let re2 = /\[.*\]/;
    let url = text.match(re1)[0];
    let title = text.match(re2)[0];

    let lSpan = new VNode("span", {"class": "art-hide"}, new VTextNode("["))
    let cA = new VNode("a", {"href": url.substring(1, url.length - 1), "class": "art-text-double", "title": "alt+点击", style: 'cursor: pointer;'}, 
                        new VTextNode(title.substring(1, title.length -1)));
    let rSpan = new VNode("span", {"class": "art-hide"}, new VTextNode("]" + url))
    
    return [lSpan, cA, rSpan];
}
function imgFun(text: string){
    let re1 = /\(.*\)/;
    let re2 = /\[.*\]/;
    let url = text.match(re1)[0];
    let title = text.match(re2)[0];
    let lSpan = new VNode("span", {"class": "art-hide"}, [new VNode("span", {"class": "art-shield", "__dom__": "imgTool"}, []), new VTextNode(text)]);
    let cImg = new VNode("img", {"src": url.substring(1, url.length - 1), "alt": title.substring(1, title.length -1),
                                "contenteditable": "false", "style": "margin: 0 auto;display: block;"}, null); 
    return [lSpan, cImg];
}
function mathFun(text: string){
  if(Editor.katex){
    let rSpan = new VNode("span", {"class": "art-hide art-math"}, new VTextNode(text));
    let lSpan = new VNode("span", {"class": "art-shield", style: 'position: relative;', "contenteditable": "false", "__dom__": "math"}, 
                            new VNode("span", {style: 'top: 35px;display: inline-table;', "art-math":text.substring(1, text.length - 1)}, null));
                            return [lSpan, rSpan]
  }else{
    return [new VNode("span", {style: 'color: #777'}, new VTextNode(text))];
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
  let lSpan = new VNode("span", {"class": "art-hide"}, new VTextNode('***'))
  let cSpan = new VNode('span', {"class": "art-text-double"}, new VTextNode(text.substring(3, text.length - 3)))
  let rSpan = new VNode("span", {"class": "art-hide"}, new VTextNode('***'))
  let span = new VNode('i', {}, new VNode('b', {}, [lSpan, cSpan, rSpan]));
  return [span];
}

const h1 = {"first": "#", "last" : "", "re": /^#\s/, "fun": h1Fun}
const h2 = {"first": "##", "last" : "", "re": /^##\s/, "fun": h2Fun}
const h3 = {"first": "###", "last" : "", "re": /^###\s/, "fun": h3Fun}
const h4 = {"first": "####", "last" : "", "re": /^####\s/, "fun": h4Fun}
const h5 = {"first": "#####", "last" : "", "re": /^#####\s/, "fun": h5Fun}
const h6 = {"first": "######", "last" : "", "re": /^######\s/, "fun": h6Fun}
// const hr = {"re": /^(\*{3,}$|^\-{3,}$|^\_{3,}$)/, "fun": hrFun}
export const alineRule = [h1, h2, h3, h4, h5, h6]

function h1Fun(text: string){
  let child = [new VNode("span", {"class": "art-hide"}, new VTextNode("# ")), ...inline(text.substring(2))];
  let h1 = new VNode("h1", {}, child);
  let md = h1.getMd();
  md = md.replace(/\s/g, '-').replace(/\\|\/|#|\:/g, '');
  h1.childNodes.unshift(new VNode('a', {class: 'art-shield', name: md}, null));
  return [h1]
}
function h2Fun(text: string){
  let child = [new VNode("span", {"class": "art-hide"}, new VTextNode("## ")), ...inline(text.substring(3))];
  let h2 = new VNode("h2", {}, child);
  let md = h2.getMd();
  md = md.replace(/\s/g, '-').replace(/\\|\/|#|\:/g, '');
  h2.childNodes.unshift(new VNode('a', {class: 'art-shield', name: md}, null));
  return [h2]
}
function h3Fun(text: string){
  let child = [new VNode("span", {"class": "art-hide"}, new VTextNode("### ")), ...inline(text.substring(4))];
  let h3 = new VNode("h3", {}, child);
  let md = h3.getMd();
  md = md.replace(/\s/g, '-').replace(/\\|\/|#|\:/g, '');
  h3.childNodes.unshift(new VNode('a', {class: 'art-shield', name: md}, null));
  return [h3]
}
function h4Fun(text: string){
  let child = [new VNode("span", {"class": "art-hide"}, new VTextNode("#### ")), ...inline(text.substring(5))];
  let h4 = new VNode("h4", {}, child);
  let md = h4.getMd();
  md = md.replace(/\s/g, '-').replace(/\\|\/|#|\:/g, '');
  h4.childNodes.unshift(new VNode('a', {class: 'art-shield', name: md}, null));
  return [h4]
}
function h5Fun(text: string){
  let child = [new VNode("span", {"class": "art-hide"}, new VTextNode("##### ")), ...inline(text.substring(6))];
  let h5 = new VNode("h5", {}, child);
  let md = h5.getMd();
  md = md.replace(/\s/g, '-').replace(/\\|\/|#|\:/g, '');
  h5.childNodes.unshift(new VNode('a', {class: 'art-shield', name: md}, null));
  return [h5]
}
function h6Fun(text: string){
  let child = [new VNode("span", {"class": "art-hide"}, new VTextNode("###### ")), ...inline(text.substring(7))];
  let h6 = new VNode("h6", {}, child);
  let md = h6.getMd();
  md = md.replace(/\s/g, '-').replace(/\\|\/|#|\:/g, '');
  h6.childNodes.unshift(new VNode('a', {class: 'art-shield', name: md}, null));
  return [h6]
}

/* 
const beginRules = {
  code_fense: /^(`{3,})([^`]*)$/,
  header: /(^ {0,3}#{1,6}(\s{1,}|$))/,
  reference_definition: /^( {0,3}\[)([^\]]+?)(\\*)(\]: *)(<?)([^\s>]+)(>?)(?:( +)(["'(]?)([^\n"'\(\)]+)\9)?( *)$/,

  // extra syntax (not belogs to GFM)
  multiple_math: /^(\$\$)$/
}

const endRules = {
  tail_header: /^(\s{1,}#{1,})(\s*)$/
}

const commonMarkRules = {
  strong: /^(\*\*|__)(?=\S)([\s\S]*?[^\s\\])(\\*)\1(?!(\*|_))/, // can nest
  em: /^(\*|_)(?=\S)([\s\S]*?[^\s\*\\])(\\*)\1(?!\1)/, // can nest
  inline_code: /^(`{1,3})([^`]+?|.{2,})\1/,
  image: /^(\!\[)(.*?)(\\*)\]\((.*)(\\*)\)/,
  link: /^(\[)((?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*?)(\\*)\]\((.*)(\\*)\)/, // can nest
  reference_link: /^\[([^\]]+?)(\\*)\](?:\[([^\]]*?)(\\*)\])?/,
  reference_image: /^\!\[([^\]]+?)(\\*)\](?:\[([^\]]*?)(\\*)\])?/,
  html_tag: /^(<!--[\s\S]*?-->|(<([a-zA-Z]{1}[a-zA-Z\d-]*) *[^\n<>]* *(?:\/)?>)(?:([\s\S]*?)(<\/\3 *>))?)/, // raw html
  //html_escape: new RegExp(`^(${escapeCharacters.join('|')})`, 'i'),
  soft_line_break: /^(\n)(?!\n)/,
  hard_line_break: /^( {2,})(\n)(?!\n)/,

  // patched math marker `$`
  backlash: /^(\\)([\\`*{}\[\]()#+\-.!_>~:\|\<\>$]{1})/
}

const gfmRules = {
  emoji: /^(:)([a-z_\d+-]+?)\1/,
  del: /^(~{2})(?=\S)([\s\S]*?\S)(\\*)\1/, // can nest
  auto_link: /^<(?:([a-zA-Z]{1}[a-zA-Z\d\+\.\-]{1,31}:[^ <>]*)|([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*))>/,
  // (extended www autolink|extended url autolink|extended email autolink) the email regexp is the same as auto_link.
  auto_link_extension: /^(?:(www\.[a-z_-]+\.[a-z]{2,}(?::[0-9]{1,5})?(?:\/[\S]+)?)|(http(?:s)?:\/\/(?:[a-z0-9\-._~]+\.[a-z]{2,}|[0-9.]+|localhost|\[[a-f0-9.:]+\])(?::[0-9]{1,5})?(?:\/[\S]+)?)|([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*))(?=\s|$)/
}

// Markdown extensions (not belongs to GFM and Commonmark)
const inlineExtensionRules = {
  inline_math: /^(\$)([^\$]*?[^\$\\])(\\*)\1(?!\1)/,
  // This is not the best regexp, because it not support `2^2\\^`.
  superscript: /^(\^)((?:[^\^\s]|(?<=\\)\1|(?<=\\) )+?)(?<!\\)\1(?!\1)/,
  subscript: /^(~)((?:[^~\s]|(?<=\\)\1|(?<=\\) )+?)(?<!\\)\1(?!\1)/,
  footnote_identifier: /^(\[\^)([^\^\[\]\s]+?)(?<!\\)\]/
}*/
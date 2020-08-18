import TextNode from "../node/text"
import Node from "../node"
import inline from "./inline"

const bold = {"re": /(\*{2})([^\*].*?)(\*{2})/g, "fun": blodFun}
const italic = {"re": /(\*)([^\*].*?)(\*)/g, "fun":italicFun}
const inline_code = {"left": "`", "right": "`", "re": /`[^`]+`/g, "fun": inlineCodeFun}
const img = {"left": "![", "centre": "](", "right": ")","re": /!\[.*\]\(.*\)/g, "fun": imgFun}
const a = {"left": "[", "centre": "](", "right": ")", "re": /\[.*\]\(.*\)/g, "fun": aFun}
const math = {"left": "$", "right": "$", "re": /\$.*?\$/g, "fun": mathFun}
const mark = {"left": "==", "right": "==", "re": /\={2}[^\=].*?\={2}/g, "fun":markFun}
const del = {"left": "~~", "right": "~~", "re": /~{2}.*?~{2}/g, "fun":delFun}
const ins = {"left": "__", "right": "__", "re": /_{2}.*?_{2}/g, "fun":insFun}
const sup = {"left": "^", "right": "^", "re": /\^[^\^]+\^/g, "fun":supFun}
const sub = {"left": "~", "right": "~", "re": /~[^~]+~/g, "fun":subFun}
export const inlineRule = [bold, mark, inline_code, italic, img, a, math, del, ins, sup, sub,]

function modelFun_1(model){
    let lSpan = new Node("span", {"class": "art-hide"}, new TextNode(model[0]))
    let cSpan = new Node("span", {"class": "art-text-double"}, new TextNode(model[2].substring(model[1], model[2].length - model[1])))
    let rSpan = new Node("span", {"class": "art-hide"}, new TextNode(model[3]))
    let b = new Node(model[4], {}, [lSpan, cSpan, rSpan]);
    return [b]
}
function aFun(text){
    let re1 = /\(.*\)/;
    let re2 = /\[.*\]/;
    let url = text.match(re1)[0];
    let title = text.match(re2)[0];

    let lSpan = new Node("span", {"class": "art-hide"}, new TextNode("["))
    let cA = new Node("a", {"href": url.substring(1, url.length - 1), "class": "art-text-double", "title": "alt+点击", style: 'cursor: pointer;'}, 
                        new TextNode(title.substring(1, title.length -1)));
    let rSpan = new Node("span", {"class": "art-hide"}, new TextNode("]" + url))
    
    return [lSpan, cA, rSpan];
}
function imgFun(text){
    let re1 = /\(.*\)/;
    let re2 = /\[.*\]/;
    let url = text.match(re1)[0];
    let title = text.match(re2)[0];
    let lSpan = new Node("span", {"class": "art-hide"}, [new Node("span", {"class": "art-shield", "__dom__": "imgTool"}, []), new TextNode(text)]);
    let cImg = new Node("img", {"src": url.substring(1, url.length - 1), "alt": title.substring(1, title.length -1),
                                "contenteditable": "false", "style": "margin: 0 auto;display: block;"}, null); 
    return [lSpan, cImg];
}
function mathFun(text){
    let lSpan = new Node("span", {"class": "art-hide"}, new TextNode("$" + text.substring(1, text.length - 1)));
    let cSpan = new Node("span", {"class": "art-text-double"}, 
                            new Node("span", 
        {"class": "art-shield", "contenteditable": "false", "__dom__": "math", "art-math":text.substring(1, text.length - 1)}, null));
    let rSpan = new Node("span", {"class": "art-hide"}, new TextNode("$"))
    return [lSpan, cSpan, rSpan]
}
function inlineCodeFun(text){
    return modelFun_1(["`", 1, text, "`", "code"])
}
function italicFun(text){
    return modelFun_1(["*", 1, text, "*", "i"])
}
function markFun(text){
    return modelFun_1(["==", 2, text, "==", "mark"])
}
function blodFun(text){
    let lSpan = new Node("span", {"class": "art-hide"}, new TextNode("**"))
    let cSpan = new Node("span", {"class": "art-text-double"}, new TextNode(text.substring(2, text.length - 2)))
    let rSpan = new Node("span", {"class": "art-hide"}, new TextNode("**"))
    let b = new Node("b", {}, [lSpan, cSpan, rSpan]);
    return [b]
}
function delFun(text){
  return modelFun_1(["~~", 2, text, "~~", "del"])
}
function insFun(text){
  return modelFun_1(["__", 2, text, "__", "ins"])
}
function supFun(text){
  return modelFun_1(["^", 1, text, "^", "sup"])
}
function subFun(text){
  return modelFun_1(["~", 1, text, "~", "sub"])
}

const h1 = {"first": "#", "last" : "", "re": /^#\s/, "fun": h1Fun}
const h2 = {"first": "##", "last" : "", "re": /^##\s/, "fun": h2Fun}
const h3 = {"first": "###", "last" : "", "re": /^###\s/, "fun": h3Fun}
const h4 = {"first": "####", "last" : "", "re": /^####\s/, "fun": h4Fun}
const h5 = {"first": "#####", "last" : "", "re": /^#####\s/, "fun": h5Fun}
const h6 = {"first": "######", "last" : "", "re": /^######\s/, "fun": h6Fun}
const hr = {"re": /^(\*{3,}$|^\-{3,}$|^\_{3,}$)/, "fun": hrFun}
export const alineRule = [h1, h2, h3, h4, h5, h6]

function hrFun(text){
  return [new Node("hr")]
}
function h1Fun(text){
  let child = [new Node("span", {"class": "art-hide"}, new TextNode("# ")), ...inline(text.substring(2))];
  return [new Node("h1", {}, child)]
}
function h2Fun(text){
  let child = [new Node("span", {"class": "art-hide"}, new TextNode("## ")), ...inline(text.substring(3))];
  return [new Node("h2", {}, child)]
}
function h3Fun(text){
  let child = [new Node("span", {"class": "art-hide"}, new TextNode("### ")), ...inline(text.substring(4))];
  return [new Node("h3", {}, child)]
}
function h4Fun(text){
  let child = [new Node("span", {"class": "art-hide"}, new TextNode("#### ")), ...inline(text.substring(5))];
  return [new Node("h4", {}, child)]
}
function h5Fun(text){
  let child = [new Node("span", {"class": "art-hide"}, new TextNode("##### ")), ...inline(text.substring(6))];
  return [new Node("h5", {}, child)]
}
function h6Fun(text){
  let child = [new Node("span", {"class": "art-hide"}, new TextNode("###### ")), ...inline(text.substring(7))];
  return [new Node("h6", {}, child)]
}

/* eslint-disable no-useless-escape */
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
}
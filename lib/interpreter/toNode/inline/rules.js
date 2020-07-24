const bold = {"left": "**", "right": "**", "re": /\*{2}[^*].*?\*{2}/g, "fun": markFun}
const italic = {"left": "*", "right": "*"}
const code = {"left": "`", "right": "`"}
const img = {"left": "![", "centre": "](", "right": ")"}
const a = {"left": "[", "centre": "](", "right": ")"}
const math = {"left": "$", "right": "$"}
const mark = {"left": "==", "right": "==", "re": /\={2}[^*].*?\={2}/g}
const inlineRule = [bold, italic, code, img, a, math, mark]

const h1 = {"first": "#", "last" : "", }
const h2 = {"first": "[", "last" : "", }
const h3 = {"first": "[", "last" : "", }
const h4 = {"first": "[", "last" : "", }
const h5 = {"first": "[", "last" : "", }
const h6 = {"first": "[", "last" : "", }
const table = {"first": "|", "last" : "|", }
function markFun(param){
    return ["mark", {}, [["span", {"class": "art-hide"}, [["#text", {}, mark["left"]]]],
                        ["span", {"class": "art-text-double"}, [["#text", {}, param[0]]]],
                        ["span", {"class": "art-hide"}, [["#text", {}, mark["right"]]]]]]
}
function textNode(nodes){
    let _nodes;
    for(let i = 0; i < inlineRule.length; i++){
        _nodes = []
        for( j = 0; j < nodes.jlejngth; jj++){
            if(nodes[j][0] === "#text"){
                let re = _nodes[i][2].match(inlineRule[i]["re"]);
                if (re) {
                    let textLen = nodes[j][2].length;
                    for (let k = 0; k < bold.length; k++) {
                        let index = _nodes[i][2].indexOf(bold[j]);
                            if(index !== 0){
                                _newNodes.push(["#text", {}, _nodes[i][2].substring(0, index)])
                            } 
                        _newNodes.push();
                    
                    if(j === (bold.length - 1) && index + bold[j].length < textLen){
                        _newNodes.push(["#text", {}, _nodes[i][2].substring(index + bold[j].length)])
                    }else if(index + bold[j].length < textLen){
                        _nodes[i][2] = _nodes[i][2].substring(index + bold[j].length);
                    }
                }
                    }else{
                _nodes.push(_nodes[i]);
            }

                }
                else{
                    _nodes.push(_nodes[i]);
            }
        }
        nodes = _nodes;
    }
}
/* eslint-disable no-useless-escape */
export const beginRules = {
  hr: /^(\*{3,}$|^\-{3,}$|^\_{3,}$)/,
  code_fense: /^(`{3,})([^`]*)$/,
  header: /(^ {0,3}#{1,6}(\s{1,}|$))/,
  reference_definition: /^( {0,3}\[)([^\]]+?)(\\*)(\]: *)(<?)([^\s>]+)(>?)(?:( +)(["'(]?)([^\n"'\(\)]+)\9)?( *)$/,

  // extra syntax (not belogs to GFM)
  multiple_math: /^(\$\$)$/
}

export const endRules = {
  tail_header: /^(\s{1,}#{1,})(\s*)$/
}

export const commonMarkRules = {
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

export const gfmRules = {
  emoji: /^(:)([a-z_\d+-]+?)\1/,
  del: /^(~{2})(?=\S)([\s\S]*?\S)(\\*)\1/, // can nest
  auto_link: /^<(?:([a-zA-Z]{1}[a-zA-Z\d\+\.\-]{1,31}:[^ <>]*)|([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*))>/,
  // (extended www autolink|extended url autolink|extended email autolink) the email regexp is the same as auto_link.
  auto_link_extension: /^(?:(www\.[a-z_-]+\.[a-z]{2,}(?::[0-9]{1,5})?(?:\/[\S]+)?)|(http(?:s)?:\/\/(?:[a-z0-9\-._~]+\.[a-z]{2,}|[0-9.]+|localhost|\[[a-f0-9.:]+\])(?::[0-9]{1,5})?(?:\/[\S]+)?)|([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*))(?=\s|$)/
}

// Markdown extensions (not belongs to GFM and Commonmark)
export const inlineExtensionRules = {
  inline_math: /^(\$)([^\$]*?[^\$\\])(\\*)\1(?!\1)/,
  // This is not the best regexp, because it not support `2^2\\^`.
  superscript: /^(\^)((?:[^\^\s]|(?<=\\)\1|(?<=\\) )+?)(?<!\\)\1(?!\1)/,
  subscript: /^(~)((?:[^~\s]|(?<=\\)\1|(?<=\\) )+?)(?<!\\)\1(?!\1)/,
  footnote_identifier: /^(\[\^)([^\^\[\]\s]+?)(?<!\\)\]/
}
/* eslint-enable no-useless-escape */

export const inlineRules = {
  ...endRules,
  ...commonMarkRules,
  ...gfmRules,
  ...inlineExtensionRules
}

const rawValidateRules = Object.assign({}, inlineRules)
delete rawValidateRules.em
delete rawValidateRules.strong
delete rawValidateRules.tail_header
delete rawValidateRules.backlash
delete rawValidateRules.superscript
delete rawValidateRules.subscript
delete rawValidateRules.footnote_identifier

export const validateRules = rawValidateRules
const preCode = {"start": "```", "end" : "```", }
export {inlineRule, mark}
import inline from "./inline"
import {morelineRule} from "./rules"
import aline from "./aline"
import Node from "../../node"
import TextNode from "../../node/text"
function mdToNode(md) {  
        //let initRows = text.split('\n');
        if(md == null)
            return null
        let rows = md.split("\n");
        console.log("文本列表")
        console.log(rows)

        let re;
        let matchArry;
        let _nodes = []
        let _childNodes;
        let _value;
        for (let i = 0, len = rows.length; i < len; i++) {     
            matchArry = rows[i].match(/^#\s/)
                         || rows[i].match(/^##\s/)
                         || rows[i].match(/^###\s/)
                         || rows[i].match(/^####\s/)
                         || rows[i].match(/^#####\s/)
                         || rows[i].match(/^######\s/)
                         || rows[i].match(/^\*{3,}/)
                         || rows[i].match(/^>\s/)
                         || rows[i].match(/^\*\s/)
                         || rows[i].match(/^\d\.\s/)
                         || rows[i].match(/^```\s/)
                         //|| rows[i].match(/^```$/)
                         || rows[i].match(/^\|.*\|/);
            if (matchArry) {
                switch(matchArry[0]) {
                        case '# ':
                            _childNodes = inline(rows[i].substring(2))
                            _value = [["span", {"class": "art-hide"}, [["#text", {}, "# "]]]];
                            _childNodes.forEach(element => {
                                _value.push(element);
                            });
                            _nodes.push(["h1", {}, _value]);
                            break;
                        case '## ':
                            _childNodes = inline(rows[i].substring(3))
                            _value = [["span", {"class": "art-hide"}, [["#text", {}, "## "]]]];
                            _childNodes.forEach(element => {
                                _value.push(element);
                            });
                            _nodes.push(["h2", {}, _value]);
                            break;
                        case '### ':
                            _childNodes = inline(rows[i].substring(4))
                            _value = [["span", {"class": "art-hide"}, [["#text", {}, "### "]]]];
                            _childNodes.forEach(element => {
                                _value.push(element);
                            });
                            _nodes.push(["h3", {}, _value]);
                            break;
                        case '#### ':
                            _childNodes = inline(rows[i].substring(5))
                            _value = [["span", {"class": "art-hide"}, [["#text", {}, "#### "]]]];
                            _childNodes.forEach(element => {
                                _value.push(element);
                            });
                            _nodes.push(["h4", {}, _value]);
                            break;
                        case '##### ':
                            _childNodes = inline(rows[i].substring(6))
                            _value = [["span", {"class": "art-hide"}, [["#text", {}, "##### "]]]];
                            _childNodes.forEach(element => {
                                _value.push(element);
                            });
                            _nodes.push(["h5", {}, _value]);
                            break;
                        case '###### ':
                            _childNodes = inline(rows[i].substring(7))
                            _value = [["span", {"class": "art-hide"}, [["#text", {}, "###### "]]]];
                            _childNodes.forEach(element => {
                                _value.push(element);
                            });
                            _nodes.push(["h6", {}, _value]);
                            break;
                        case rows[i].match(/^\*{3,}/) && rows[i].match(/^\*{3,}/)[0]:
                            let hr = "***";
                            if(rows[i].match(/^\*{3,}/)[0]){
                                hr = rows[i].match(/^\*{3,}/)[0];
                            }else{
                                hr = rows[i].match(/^\*{3,}/);
                            }
                            _value = [["span", {"class": "art-hide"}, [["#text", {}, hr]]]]
                            _value.push(["hr", {"contenteditable": "false"}, []]);
                            _nodes.push(["p", {}, _value]);
                            break;
                        case '> ':
                            re = /^>\s/;
                            _value = [];
                            while (i < len && rows[i].match(re)) {
                                if(rows[i].substring(2, rows[i].length) == ""){
                                    _value.push(["p", {}, [["br", {}, null]]]);
                                }else{
                                    _value.push(["p", {}, [["#text", {}, rows[i].substring(2, rows[i].length)]]]);
                                }
                                i++;
                            }
                            i--;
                            let location =  window.artText.interpreter.location;
                            if(len >  i + 1 && location)
                                window.artText.interpreter.location = [0, 0, location[2] + 1, location[3] + 1, -1];
                               
                            _nodes.push(["blockquote", {}, _value]);
                            break;
                        case '* ':
                            re = /^\*\s/;
                            _value = [];
                            while (i < len && rows[i].match(re)) {
                                _value.push(["li", {}, inline(rows[i].substring(2, rows[i].length))]);
                                i++;
                            } 
                            i--;
                            _nodes.push(["ul", {}, _value]);
                            break;
                        case rows[i].match(/^\d\.\s/) && rows[i].match(/^\d\.\s/)[0]:
                            re = /^\d\.\s/;
                            _value = [];
                            while (i < len && rows[i].match(re)) {
                                _value.push(["li", {}, [["#text", {}, rows[i].substring(3, rows[i].length)]]]);
                                i++;
                            } 
                            i--;
                            _nodes.push(["ol", {}, _value]);
                            break;
                        case '``` ':
                            let lang = rows[i].substring(4);
                            console.log("lang", lang);
                            if(lang){
                                let temp = '';
                                re = /^```$/;
                                let j, _is = false;
                                for(j = i + 1;j < len; j++){
                                    if(re.test(rows[j])){
                                        _is = true;
                                        break;
                                    }
                                    temp += rows[j] + '\n';
                                }
                                _nodes.push(["p", {"class": "art-hide"}, [["#text", {}, rows[i]]]]);
                                if(_is){
                                    i = j;
                                    temp = temp.substring(0, temp.length - 1)
                                    _nodes.push(["pre", {}, [["code", {"class": "lang-" + lang}, [["#text", {}, temp]]]]]);
                                }else{
                                    _nodes.push(["pre", {}, [["code", {"class": "lang-" + lang}, [["br", {}, null]]]]]);
                                }
                                _nodes.push(["p", {"class": "art-hide", "contenteditable": "false"}, [["#text", {}, "```"]]]);
                            }else{
                                _nodes.push(["p", {}, [["#text", {}, rows[i]]]]);
                            }
                            
                            break;   
                        case '```':
                            //_nodes.push(["p", {"class": "art-hide"}, [["#text", {}, "```"]]]);
                            //_nodes.push(["pre", {}, []]);
                            //_nodes.push(["p", {"class": "art-hide"}, [["#text", {}, "```"]]]);
                            break;
                        case rows[i].match(/^\|.*\|/) && rows[i].match(/^\|.*\|/)[0]:
                            let temp = '';
                            re = /^\|.*\|/;
                            let thRe = /^\[th\]/;
                            let arry, j, jlen;
                            _value = []
                            let _val = []
                            while (i < len && re.test(rows[i])) {
                                arry = rows[i].split('|');
                                temp += '<tr>';
                                _val = []
                                for (j = 1, jlen = arry.length - 1; j < jlen; j++) {
                                    if (thRe.test(arry[1])) {
                                        temp += '<th>' + arry[j] + '</th>';
                                        _val.push(["th", {}, [["#text", {}, arry[j]]]])
                                    } else {
                                        temp += '<td>' + arry[j] + '</td>';
                                        _val.push(["td", {}, [["#text", {}, arry[j]]]])
                                    }
                                }
                                temp += '</tr>';
                                _value.push(["tr",{}, _val]);
                                temp = temp.replace('[th]', '');
                                i++;
                            }
                            if(!window.artText.interpreter.location)
                                _nodes.push(["p", {"class": "art-shield", "__dom__": "tableTool"}, null]);
                            _nodes.push(["table", {"style": "width:100%"}, _value]);
                            break;
                    default:
                        console.log("wu", matchArry[0])
                        _childNodes = inline(rows[i])
                        _value = [];
                        _childNodes.forEach(element => {
                            _value.push(element);
                        });
                        _nodes.push(["p", {}, _value]);
                        
                        break;
                }
            } else {
                _childNodes = inline(rows[i])
                    _value = [];
                    _childNodes.forEach(element => {
                        _value.push(element);
                    });
                    _nodes.push(["p", {}, _value]);
            }
        }
        console.log("节点")
        console.log(_nodes);
        return _nodes;
    }
function textToNode(text){
    if(text == null)
        return null
    let rows = text.split("\n");
    let re;
    let matchArry;
    let nodes = []
    let child;
    for (let i = 0, len = rows.length; i < len; i++) {
        matchArry =  rows[i].match(/^>\s/)
                        || rows[i].match(/^\*\s/)
                        || rows[i].match(/^\d\.\s/)
                        || rows[i].match(/^```\s/)
                        || rows[i].match(/^\|.*\|/);
        if (matchArry) { 
            // 多行成功
            switch(matchArry[0]) {
                case '> ':
                    re = /^>\s/;
                    child = [];
                    while (i < len && rows[i].match(re)) {
                        if(rows[i].substring(2, rows[i].length) == ""){
                            child.push(new Node("p", {}, new Node("br")));
                        }else{
                            child.push(new Node("p", {}, new TextNode(rows[i].substring(2, rows[i].length))));
                        }
                        i++;
                    }
                    i--;
                    nodes.push(new Node("blockquote", {}, child))
                    break;
                case '* ':
                    re = /^\*\s/;
                    child = [];
                    while (i < len && rows[i].match(re)) {
                        if(/^\[x\]\s/.test(rows[i].substring(2))){
                            child.push(new Node("li", {}, [new Node('input', {type: "checkbox", checked:"checked"}), ...inline(rows[i].substring(6, rows[i].length))]));
                        }else if(/^\[\s\]\s/.test(rows[i].substring(2))){
                            child.push(new Node("li", {}, [new Node('input', {type: "checkbox"}), ...inline(rows[i].substring(6, rows[i].length))]));
                        }else{
                            child.push(new Node("li", {}, inline(rows[i].substring(2, rows[i].length))));
                        }
                        
                        i++;
                    } 
                    i--;
                    nodes.push(new Node("ul", {}, child));
                    break;
                case rows[i].match(/^\d\.\s/) && rows[i].match(/^\d\.\s/)[0]:
                    re = /^\d\.\s/;
                    child = [];
                    while (i < len && rows[i].match(re)) {
                        child.push(new Node("li", {}, inline(rows[i].substring(3, rows[i].length))));
                        i++;
                    } 
                    i--;
                    nodes.push(new Node("ol", {}, child));
                    break;
                case '``` ':
                    let lang = rows[i].substring(4);
                    if(lang){
                        let temp = '';
                        re = /^```$/;
                        let j, _is = false;
                        for(j = i + 1;j < len; j++){                     
                            if(re.test(rows[j])){
                                _is = true;
                                break;
                            }
                            temp += rows[j] + '\n';
                        }
                        if(_is){
                            i = j;
                            temp = temp.substring(0, temp.length - 1)
                            nodes.push(new Node("pre", {}, new Node("code", {"class": "lang-" + lang}, new TextNode(temp))));
                        }else{
                            // nodes.push(new Node("pre", {}, new Node("code", {"class": "lang-" + lang}, new Node("br"))));
                        }
                    }else{
                        nodes.push(new Node("p", {}, new TextNode(rows[i])));
                    }
                        
                    break;   
                case rows[i].match(/^\|.*\|/) && rows[i].match(/^\|.*\|/)[0]:
                    re = /^\|.*\|/;
                    let thRe = /^\[th\]/;
                    let arry, j, jlen;
                    child = []
                    let _val = []
                    if(i + 1 < len && /^\|(\s*-{3,}\s*\|)+/.test(rows[i+1])){
                        arry = rows[i].split('|');
                        for (j = 1, jlen = arry.length - 1; j < jlen; j++) {
                            _val.push(new Node("th", {}, new TextNode(arry[j])));
                        }
                        child.push(new Node("tr",{}, _val));
                        i += 2;
                        while (i < len && re.test(rows[i])) {
                            arry = rows[i].split('|');
                            _val = []
                            for (j = 1, jlen = arry.length - 1; j < jlen; j++) {
                                if (thRe.test(arry[1])) {
                                    _val.push(new Node("th", {}, new TextNode(arry[j])));
                                } else {
                                    _val.push(new Node("td", {}, new TextNode(arry[j])));
                                }
                            }
                            child.push(new Node("tr",{}, _val));
                            i++;
                        }
                        nodes.push(new Node("table", {"style": "width:100%"}, child));
                    }else{
                        child = inline(rows[i])
                        nodes.push(new Node("p", {}, child));
                    }
                    
                    break;
                default:
                    child = inline(rows[i])
                    nodes.push(new Node("p", {}, child));
                    break;
            }
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
export {mdToNode, textToNode};
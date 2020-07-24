import {inlineRule, mark} from "./rules"
function  inline(str) { 
    // str = str.replace(/\s/g, '&nbsp;'); 
    let _nodes = [["#text", {}, str]];
    if(str === ""){
        _nodes = [["br", {}, []]]
        return _nodes;
    }
    let i;
    let _newNodes = []
    for( i = 0; i < _nodes.length; i++){
        if(_nodes[i][0] === "#text"){
            let bold = _nodes[i][2].match(/\*{2}[^*].*?\*{2}/g);
            
            if (bold) {
                let textLen = _nodes[i][2].length;
                for (let j = 0; j < bold.length; j++) {
                    let index = _nodes[i][2].indexOf(bold[j]);
                    if(index !== 0){
                        _newNodes.push(["#text", {}, _nodes[i][2].substring(0, index)])
                    } 
                    _newNodes.push(["b", {}, [["span", {"class": "art-hide"}, [["#text", {}, "**"]]],
                                            ["span", {"class": "art-text-double"}, [["#text", {}, bold[j].substring(2, bold[j].length - 2)]]],
                                            ["span", {"class": "art-hide"}, [["#text", {}, "**"]]]]]);
                    
                    if(j === (bold.length - 1) && index + bold[j].length < textLen){
                        _newNodes.push(["#text", {}, _nodes[i][2].substring(index + bold[j].length)])
                    }else if(index + bold[j].length < textLen){
                        _nodes[i][2] = _nodes[i][2].substring(index + bold[j].length);
                    }
                }
            }else{
                _newNodes.push(_nodes[i]);
            }

        }
        else{
            _newNodes.push(_nodes[i]);
        }
    }
    _nodes = _newNodes;
    
    _newNodes = []
    for( i = 0; i < _nodes.length; i++){
        if(_nodes[i][0] === "#text"){
            let bold = _nodes[i][2].match(/\={2}[^*].*?\={2}/g);
            
            if (bold) {
                let textLen = _nodes[i][2].length;
                for (let j = 0; j < bold.length; j++) {
                    let index = _nodes[i][2].indexOf(bold[j]);
                    if(index !== 0){
                        _newNodes.push(["#text", {}, _nodes[i][2].substring(0, index)])
                    } 
                    _newNodes.push(["mark", {}, [["span", {"class": "art-hide"}, [["#text", {}, "=="]]],
                                            ["span", {"class": "art-text-double"}, [["#text", {}, bold[j].substring(2, bold[j].length - 2)]]],
                                            ["span", {"class": "art-hide"}, [["#text", {}, "=="]]]]]);
                    
                    if(j === (bold.length - 1) && index + bold[j].length < textLen){
                        _newNodes.push(["#text", {}, _nodes[i][2].substring(index + bold[j].length)])
                    }else if(index + bold[j].length < textLen){
                        _nodes[i][2] = _nodes[i][2].substring(index + bold[j].length);
                    }
                }
            }else{
                _newNodes.push(_nodes[i]);
            }

        }
        else{
            _newNodes.push(_nodes[i]);
        }
    }
    _nodes = _newNodes;

    _newNodes = []
    for( i = 0; i < _nodes.length; i++){
        if(_nodes[i][0] === "#text"){
            let bold = _nodes[i][2].match(/\*[^*].*?\*/g);
            
            if (bold) {
                let textLen = _nodes[i][2].length;
                for (let j = 0; j < bold.length; j++) {
                    let index = _nodes[i][2].indexOf(bold[j]);
                    if(index !== 0){
                        _newNodes.push(["#text", {}, _nodes[i][2].substring(0, index)])
                    }
                    _newNodes.push(["i", {}, [["span", {"class": "art-hide"}, [["#text", {}, "*"]]],
                                            ["span", {"class": "art-text-double"}, [["#text", {}, bold[j].substring(1, bold[j].length - 1)]]],
                                            ["span", {"class": "art-hide"}, [["#text", {}, "*"]]]]]);
                    if(j === (bold.length - 1) && index + bold[j].length < textLen){
                        _newNodes.push(["#text", {}, _nodes[i][2].substring(index + bold[j].length)])
                    }else if(index + bold[j].length < textLen){
                        _nodes[i][2] = _nodes[i][2].substring(index + bold[j].length);
                    }
                }
            }else{
                _newNodes.push(_nodes[i]);
            }

        }
        else{
            _newNodes.push(_nodes[i]);
        }
    }
    _nodes = _newNodes;

    _newNodes = []
    for( i = 0; i < _nodes.length; i++){
        if(_nodes[i][0] === "#text"){
            let bold = _nodes[i][2].match(/\$[^$].*?\$/g);
            
            if (bold) {
                let textLen = _nodes[i][2].length;
                for (let j = 0; j < bold.length; j++) {
                    let index = _nodes[i][2].indexOf(bold[j]);
                    if(index !== 0){
                        _newNodes.push(["#text", {}, _nodes[i][2].substring(0, index)])
                    }
                    _newNodes.push(["span", {"class": "art-hide"}, [["#text", {}, "$" + bold[j].substring(1, bold[j].length - 1)]]]);
                    _newNodes.push(["span", {"class": "art-text-double"}, [ 
                                                ["span", {"class": "art-shield", "contenteditable": "false", "__dom__": "math", "art-math":bold[j].substring(1, bold[j].length - 1)}, null]]]);
                    _newNodes.push(["span", {"class": "art-hide"}, [["#text", {}, "$"]]]);
                    if(j === (bold.length - 1) && index + bold[j].length < textLen){
                        _newNodes.push(["#text", {}, _nodes[i][2].substring(index + bold[j].length)])
                    }else if(index + bold[j].length < textLen){
                        _nodes[i][2] = _nodes[i][2].substring(index + bold[j].length);
                    }
                }
            }else{
                _newNodes.push(_nodes[i]);
            }

        }
        else{
            _newNodes.push(_nodes[i]);
        }
    }
    _nodes = _newNodes;

    _newNodes = []
    for( i = 0; i < _nodes.length; i++){
        if(_nodes[i][0] === "#text"){
            let bold = _nodes[i][2].match(/`.+`/g);
            
            if (bold) {
                let textLen = _nodes[i][2].length;
                for (let j = 0; j < bold.length; j++) {
                    let index = _nodes[i][2].indexOf(bold[j]);
                    if(index !== 0){
                        _newNodes.push(["#text", {}, _nodes[i][2].substring(0, index)])
                    }
                    _newNodes.push(["code", {}, [["span", {"class": "art-hide"}, [["#text", {}, "`"]]],
                                                ["span", {"class": "art-text-double"}, [["#text", {}, bold[j].substring(1, bold[j].length - 1)]]],
                                                ["span", {"class": "art-hide"}, [["#text", {}, "`"]]]]]);
                    if(j === (bold.length - 1) && index + bold[j].length < textLen){
                        _newNodes.push(["#text", {}, _nodes[i][2].substring(index + bold[j].length)])
                    }else if(index + bold[j].length < textLen){
                        _nodes[i][2] = _nodes[i][2].substring(index + bold[j].length);
                    }
                }
            }else{
                _newNodes.push(_nodes[i]);
            }

        }
        else{
            _newNodes.push(_nodes[i]);
        }
    }
    _nodes = _newNodes;
    
    _newNodes = []
    for( i = 0; i < _nodes.length; i++){
        if(_nodes[i][0] === "#text"){
            let bold = _nodes[i][2].match(/!\[.*\]\(.*\)/g);
            
            if (bold) {
                let re1 = /\(.*\)/;
                let re2 = /\[.*\]/;
                let textLen = _nodes[i][2].length;
                for (let j = 0; j < bold.length; j++) {
                    let index = _nodes[i][2].indexOf(bold[j]);
                    if(index !== 0){
                        _newNodes.push(["#text", {}, _nodes[i][2].substring(0, index)]);
                    }
                    let url = bold[j].match(re1)[0];
                    let title = bold[j].match(re2)[0];
                    _newNodes.push(["span", {"class": "art-hide"}, [["span", {"class": "art-shield", "__dom__": "imgTool"}, null], ["#text", {}, bold[j]]]]);
                    _newNodes.push(["img", {"src": url.substring(1, url.length - 1), "alt": title.substring(1, title.length -1),
                                                "contenteditable": "false", "style": "margin: 0 auto;display: block;"}, 
                                        null]);
                    if(j === (bold.length - 1) && index + bold[j].length < textLen){
                        _newNodes.push(["#text", {}, _nodes[i][2].substring(index + bold[j].length)])
                    }else if(index + bold[j].length < textLen){
                        _nodes[i][2] = _nodes[i][2].substring(index + bold[j].length);
                    }
                }
            }else{
                _newNodes.push(_nodes[i]);
            }

        }
        else{
            _newNodes.push(_nodes[i]);
        }
    }
    _nodes = _newNodes;

    _newNodes = []
    for( i = 0; i < _nodes.length; i++){
        if(_nodes[i][0] === "#text"){
            let bold = _nodes[i][2].match(/\[.*\]\(.*\)/g);
            
            if (bold) {
                let re1 = /\(.*\)/;
                let re2 = /\[.*\]/;
                let textLen = _nodes[i][2].length;
                for (let j = 0; j < bold.length; j++) {
                    let index = _nodes[i][2].indexOf(bold[j]);
                    if(index !== 0){
                        _newNodes.push(["#text", {}, _nodes[i][2].substring(0, index)]);
                    }
                    let url = bold[j].match(re1)[0];
                    let title = bold[j].match(re2)[0];
                    _newNodes.push(["span", {"class": "art-hide"}, [["#text", {}, "["]]]);
                    
                    _newNodes.push(["a", {"href": url.substring(1, url.length - 1), "class": "art-text-double", "title": "alt+点击"}, 
                                        [["#text", {}, title.substring(1, title.length -1)]]]);
                    _newNodes.push(["span", {"class": "art-hide"}, [["#text", {}, "]" + url]]]);
                    //_newNodes.push(["span", {"class": "art-hide"}, [["#text", {},  url]]]);
                    if(j === (bold.length - 1) && index + bold[j].length < textLen){
                        _newNodes.push(["#text", {}, _nodes[i][2].substring(index + bold[j].length)])
                    }else if(index + bold[j].length < textLen){
                        _nodes[i][2] = _nodes[i][2].substring(index + bold[j].length);
                    }
                }
            }else{
                _newNodes.push(_nodes[i]);
            }

        }
        else{
            _newNodes.push(_nodes[i]);
        }
    }
    _nodes = _newNodes;

    return _nodes;
}
export {inline};
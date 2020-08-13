import {alineRule} from "../rules.js"
import inline from "../inline"
import TextNode from "../../../node/text"
import Node from "../../../node"
function  aline(text) { 
    // str = str.replace(/\s/g, '&nbsp;'); 
    if(text === ""){
        return [new Node("p", {}, new Node("br"))]
    }
    for(let k = 0; k < alineRule.length; k++){
        if(text.match(alineRule[k]["re"])){
            return alineRule[k]["fun"](text);
        }   
    }
    let child = inline(text)
    return [new Node("p", {}, child)];
}
export default aline;
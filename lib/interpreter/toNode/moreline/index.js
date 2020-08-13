import {morelineRule} from "../rules.js"
import inline from "../inline"
import Node from "../../../node"
function  moreline(text) { 
    // str = str.replace(/\s/g, '&nbsp;'); 
    if(text === ""){
        return [new Node("p", {}, new Node("br"))]
    }
    for(let k = 0; k < morelineRule.length; k++){
        if(text.match(morelineRule[k]["startRe"])){
            return morelineRule[k]["fun"](text);
        }   
    }
    let child = inline(text)
    return [new Node("p", {}, child)];
}
export default moreline;
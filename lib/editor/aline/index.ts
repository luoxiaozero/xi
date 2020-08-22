import {alineRule} from "../rules"
import VNode from "../../vNode"
function aline(text: string): any[]{ 
    // str = str.replace(/\s/g, '&nbsp;'); 
    if(text === ""){
        return [new VNode("p", {}, new VNode("br"))]
    }
    for(let k = 0; k < alineRule.length; k++){
        if(text.match(alineRule[k]["re"])){
            return alineRule[k]["fun"](text);
        }   
    }
    return null;
}
export default aline;
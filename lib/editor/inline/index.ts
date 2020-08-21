import {inlineRule} from "../rules/index"
import VTextNode from "../../vNode/text"
import VNode from "../../vNode"
function inline(str: string) { 
    // str = str.replace(/\s/g, '&nbsp;'); 
    if(str === ""){
        return [new VNode("br")]
    }
    let nodes = [new VTextNode(str)]
    let newNodes = [];
    for(let k = 0; k < inlineRule.length; k++){
        newNodes = [];
        for(let i = 0; i < nodes.length; i++){
            if(nodes[i].nodeName == "#text"){
                let bold = nodes[i].text.match(inlineRule[k]["re"]);
                if (bold) {
                    let textLen = nodes[i].childNodes.length;
                    for (let j = 0; j < bold.length; j++) {
                        let index = nodes[i].childNodes.indexOf(bold[j]);
                        if(index !== 0){
                            newNodes.push(new VTextNode(nodes[i].text.substring(0, index)));
                        }       
                        let n = inlineRule[k]["fun"](bold[j]);
                        n.forEach(ele => {
                            newNodes.push(ele);
                        });
                        if(j === (bold.length - 1) && index + bold[j].length < textLen){
                            newNodes.push(new VTextNode(nodes[i].text.substring(index + bold[j].length)));
                        }else if(index + bold[j].length < textLen){
                            nodes[i].text = nodes[i].text.substring(index + bold[j].length);
                        }
                    }
                }else{
                    newNodes.push(nodes[i]);
                }

            }else{
                newNodes.push(nodes[i]);
            }
        }
        nodes = newNodes;
    }
    return nodes;
}
export default inline;
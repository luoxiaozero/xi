import {inlineRule} from "../rules.js"
import TextNode from "../../../node/text"
import Node from "../../../node"
function  inline(str) { 
    // str = str.replace(/\s/g, '&nbsp;'); 
    if(str === ""){
        return [new Node("br")]
    }
    let nodes = [new TextNode(str)]
    let newNodes = [];
    for(let k = 0; k < inlineRule.length; k++){
        newNodes = [];
        for(let i = 0; i < nodes.length; i++){
            if(nodes[i].nodeName == "#text"){
                let bold = nodes[i].child.match(inlineRule[k]["re"]);
                if (bold) {
                    let textLen = nodes[i].child.length;
                    for (let j = 0; j < bold.length; j++) {
                        let index = nodes[i].child.indexOf(bold[j]);
                        if(index !== 0){
                            newNodes.push(new TextNode(nodes[i].child.substring(0, index)));
                        }       
                        let n = inlineRule[k]["fun"](bold[j]);
                        n.forEach(ele => {
                            newNodes.push(ele);
                        });
                        if(j === (bold.length - 1) && index + bold[j].length < textLen){
                            newNodes.push(new TextNode(nodes[i].child.substring(index + bold[j].length)));
                        }else if(index + bold[j].length < textLen){
                            nodes[i].child = nodes[i].child.substring(index + bold[j].length);
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
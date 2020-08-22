import { inlineRules } from "../rules/index"
import VTextNode from "../../vNode/text"
import VNode from "../../vNode"
function inline(text: string) {
    if (text === "") {
        return [new VNode("br")]
    }
    let nodes = [new VTextNode(text)]
    for (let i = 0; i < inlineRules.length; i++) {
        nodes = _inline(nodes, inlineRules[i])
    }
    return nodes;
}
function _inline(nodes: any[], inlineRule) {
    let newNodes = [];
    for (let i = 0; i < nodes.length; i++) {
        let reMatch;
        if (nodes[i] instanceof VTextNode && (reMatch = nodes[i].text.match(inlineRule["re"]))) {
            for (let j = 0; j < reMatch.length; j++) {
                let index = nodes[i].text.indexOf(reMatch[j]);
                if (index != 0) {
                    newNodes.push(new VTextNode(nodes[i].text.substring(0, index)));
                }
                inlineRule["fun"](reMatch[j]).forEach(ele => {
                    newNodes.push(ele);
                });
                if (j == (reMatch.length - 1) && index + reMatch[j].length < nodes[i].text.length) {
                    newNodes.push(new VTextNode(nodes[i].text.substring(index + reMatch[j].length)));
                }else {
                    nodes[i].text = nodes[i].text.substring(index + reMatch[j].length);
                }
            }
        } else {
            newNodes.push(nodes[i]);
        }
    }
    return newNodes;
}
export default inline;
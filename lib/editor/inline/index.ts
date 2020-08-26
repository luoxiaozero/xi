import { inlineRules } from "../rules/index"
import VTextNode from "../../vNode/text"
import VNode from "../../vNode"
function inline(text: string) {
    if (text === "") {
        return [new VNode("br")]
    }
    let nodes = [], reMatch: RegExpMatchArray, reTrue;
    while(text){
        reTrue = null;
        // 匹配那个规则最符合
        for (let i = 0; i < inlineRules.length; i++) {
            if(reMatch = text.match(inlineRules[i]["re"])){
                if(reMatch.index == 0){
                    reTrue = [reMatch, inlineRules[i]];
                    break;
                }
                if(reTrue){
                    if(reTrue.index > reMatch.index){
                        reTrue = [reMatch, inlineRules[i]];
                    }
                }else{
                    reTrue = [reMatch, inlineRules[i]];
                }
            }
        }
        if(reTrue){
            if (reTrue[0].index != 0) {
                nodes.push(new VTextNode(text.substring(0, reTrue[0].index)));
            }
            reTrue[1]["fun"](reTrue[0][0]).forEach(ele => {
                nodes.push(ele);
            });
            
            text = text.substring(reTrue[0].index + reTrue[0][0].length)
        }else{
            nodes.push(new VTextNode(text));
            break;
        }
    }
    return nodes;
}
export default inline;
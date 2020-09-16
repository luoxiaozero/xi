import VNode from "../../lib/vNode"
import {textToNode} from "../../lib/editor/toNode"

test("getMd", () =>{
    let text = '* 无序列表\n\
* 无序列表\n\
* * 给岁月以文明，而不是给文明以岁月。\n\
* * 无序列表\n\
* * * 无序列表\n\
* * * 无序列表\n';
    let vnodes = textToNode(text);
    
    let v = new VNode('div', {}, vnodes);
    console.log(v.childNodes);
    console.log(v.getMd('read'));
})
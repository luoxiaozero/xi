import VNode from "../lib/vNode"
import VTextNode from "../lib/vNode/vTextNode"

test("node", () =>{
    let textNode = new VTextNode("123");
    let node = new VNode("span", {}, textNode);
    
    console.log(node.childNodes)
    console.log(textNode)
})
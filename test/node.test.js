import VNode from "../lib/vNode"
import VTextNode from "../lib/vNode/vTextNode"

test("node", () =>{
    let textNode = new TextNode("123");
    let node = new Node("span", {}, textNode);
    
    console.log(node.childNodes)
    console.log(textNode.childNodes)
})
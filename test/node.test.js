import Node from "../lib/node"
import TextNode from "../lib/node/text"

test("node", () =>{
    let textNode = new TextNode("123");
    let node = new Node("span", {}, textNode);
    
    console.log(node.child)
    console.log(textNode.child)
})
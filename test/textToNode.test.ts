import {textToNode} from "../lib/editor/toNode"

test("textToNode", () =>{
    let text = '> 123\n  > 456';
    let vnodes = textToNode(text);
    
    console.log(text)
    for(let v of vnodes){
        console.log(v);
    }
})
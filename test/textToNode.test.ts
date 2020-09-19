import {textToNode} from "../lib/editor/toNode"

test("textToNode-blockquote", () =>{
    let text = '> 123\n  > 456';
    let vnodes = textToNode(text);
    
    console.log(text)
    for(let v of vnodes){
        console.log(v);
    }
})

test("textToNode-ol", () =>{
    let text = '1. 123\n2. 456\n   * 1234\n   * 5678';
    let vnodes = textToNode(text);
    console.log(text);
    console.log(vnodes.length == 1);
    let ol = vnodes[0];
    console.log(ol.nodeName == 'ol');
    console.log(ol.childNodes.length == 3);

})
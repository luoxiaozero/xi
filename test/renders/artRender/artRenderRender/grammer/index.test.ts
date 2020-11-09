/**
 * HelloWorld.test.ts
 */
import {mdToNode} from '../../../../../src/renders/artRender/artRenderRender/grammer';
import { VNode, VText } from '../../../../../src/renders/artRender/artRenderRender/vObject';

test("getMd", () =>{
    let text = '* 无序列表\n\
* 无序列表\n\
* * 给岁月以文明，而不是给文明以岁月。\n\
* * 无序列表\n\
* * * 无序列表\n\
* * * 无序列表\n';
    let vnodes = mdToNode(text);
    
    let v = new VNode('div', {}, vnodes);
    console.log(v.childNodes);
    console.log(v.getMd('read'));
})
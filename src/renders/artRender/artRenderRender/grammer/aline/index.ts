import { VNode, VText } from '../../vObject';
import inline from '../inline';

export default function aline(text: string): VNode[]{ 
    // str = str.replace(/\s/g, '&nbsp;'); 
    if(text === ""){
        return [new VNode("p", {}, new VNode("br"))]
    }
    for(let k = 0; k < alineRule.length; k++){
        if(text.match(alineRule[k]["re"])){
            return alineRule[k]["fun"](text);
        }   
    }
    return null;
}

const h1 = {"first": "#", "last" : "", "re": /^#\s/, "fun": h1Fun}
const h2 = {"first": "##", "last" : "", "re": /^##\s/, "fun": h2Fun}
const h3 = {"first": "###", "last" : "", "re": /^###\s/, "fun": h3Fun}
const h4 = {"first": "####", "last" : "", "re": /^####\s/, "fun": h4Fun}
const h5 = {"first": "#####", "last" : "", "re": /^#####\s/, "fun": h5Fun}
const h6 = {"first": "######", "last" : "", "re": /^######\s/, "fun": h6Fun}
// const hr = {"re": /^(\*{3,}$|^\-{3,}$|^\_{3,}$)/, "fun": hrFun}
export const alineRule = [h1, h2, h3, h4, h5, h6]

function h1Fun(text: string){
  let child = [new VNode("span", {"class": "art-hide"}, new VText("# ")), ...inline(text.substring(2))];
  let h1 = new VNode("h1", {}, child);
  let md = h1.getMd();
  md = md.replace(/\s/g, '-').replace(/\\|\/|#|\:/g, '');
  h1.childNodes.unshift(new VNode('a', {class: 'art-shield', name: md}, null));
  return [h1]
}
function h2Fun(text: string){
  let child = [new VNode("span", {"class": "art-hide"}, new VText("## ")), ...inline(text.substring(3))];
  let h2 = new VNode("h2", {}, child);
  let md = h2.getMd();
  md = md.replace(/\s/g, '-').replace(/\\|\/|#|\:/g, '');
  h2.childNodes.unshift(new VNode('a', {class: 'art-shield', name: md}, null));
  return [h2]
}
function h3Fun(text: string){
  let child = [new VNode("span", {"class": "art-hide"}, new VText("### ")), ...inline(text.substring(4))];
  let h3 = new VNode("h3", {}, child);
  let md = h3.getMd();
  md = md.replace(/\s/g, '-').replace(/\\|\/|#|\:/g, '');
  h3.childNodes.unshift(new VNode('a', {class: 'art-shield', name: md}, null));
  return [h3]
}
function h4Fun(text: string){
  let child = [new VNode("span", {"class": "art-hide"}, new VText("#### ")), ...inline(text.substring(5))];
  let h4 = new VNode("h4", {}, child);
  let md = h4.getMd();
  md = md.replace(/\s/g, '-').replace(/\\|\/|#|\:/g, '');
  h4.childNodes.unshift(new VNode('a', {class: 'art-shield', name: md}, null));
  return [h4]
}
function h5Fun(text: string){
  let child = [new VNode("span", {"class": "art-hide"}, new VText("##### ")), ...inline(text.substring(6))];
  let h5 = new VNode("h5", {}, child);
  let md = h5.getMd();
  md = md.replace(/\s/g, '-').replace(/\\|\/|#|\:/g, '');
  h5.childNodes.unshift(new VNode('a', {class: 'art-shield', name: md}, null));
  return [h5]
}
function h6Fun(text: string){
  let child = [new VNode("span", {"class": "art-hide"}, new VText("###### ")), ...inline(text.substring(7))];
  let h6 = new VNode("h6", {}, child);
  let md = h6.getMd();
  md = md.replace(/\s/g, '-').replace(/\\|\/|#|\:/g, '');
  h6.childNodes.unshift(new VNode('a', {class: 'art-shield', name: md}, null));
  return [h6]
}
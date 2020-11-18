import { aline, inline, mdToNode } from "../grammer";
import { VNode, VText } from "../vObject";

/**
 * 更新toc
 * @param vnode 
 */
export function updateToc(vnode: VNode) {
    let tocs = [];
    let directory = [];
    for (let v of vnode.childNodes) {
        if (/^h\d$/.test(v.nodeName)) {
            let md = v.getMd();
            md = md.replace(/\s/g, '-').replace(/\\|\/|#|\:/g, '');
            let a = new VNode('a', { href: '#' + md }, new VText(v.getText()))
            let d = new VNode('p', { class: 'art-toc-' + v.nodeName }, a)
            directory.push(d);
        } else if (v instanceof VNode && (<VNode>v).attr['class'] && /art-toc(\s|$)/.test((<VNode>v).attr['class'])) {
            tocs.push(v);
        }
    }
    for (let toc of tocs) {
        toc.childNodes = directory;
    }
}

/**
 * 更新Table
 * @param vnode 
 */
export function updateTable(vnode: VNode) {
    for (let i = 0; i < vnode.childNodes.length; i++) {
        // thead tbody
        for (let j = 0; j < (<VNode>vnode.childNodes[i]).childNodes.length; j++) {
            /**tr th */
            let t = (<VNode>vnode.childNodes[i]).childNodes[j] as VNode;
            for (let k = 0; k < t.childNodes.length; k++) {
                (<VNode>t.childNodes[k]).replaceAllChild(inline(t.childNodes[k].getMd()));
            }
        }
    }
}




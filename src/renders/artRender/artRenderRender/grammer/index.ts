import { VNode, VText } from '../vObject';
import aline from "./aline";
import inline, { inlineRules } from "./inline";
import moreline from "./moreline";

export { inline, aline, moreline }

/**
 * md文本转虚拟节点
 * @param text md文本
 */
export function mdToNode(text: string): VNode[] {
    let rows = text.split('\n');
    let vnodes: VNode[] = [];
    let child: VNode[];

    for (let i = 0, len = rows.length; i < len; i++) {
        let more = moreline(rows, i, len);
        if (more) {
            more[0].forEach(element => {
                vnodes.push(element);
            });
            i = more[1];
            if (i + 1 < len && /^\s*$/.test(rows[i + 1]))
                i++;
        } else if (child = aline(rows[i])) {
            child.forEach(element => {
                vnodes.push(element);
            })
            if (i + 1 < len && /^\s*$/.test(rows[i + 1]))
                i++;
        } else {
            vnodes.push(new VNode('p', {}, inline(rows[i])));
            if (i + 1 < len && /^\s*$/.test(rows[i + 1]))
                i++;
        }
    }
    return vnodes;
}

/**
 * dom转md文本
 * @param dom 节点
 */
export function domToMd(dom: HTMLElement) {
    let md = '';
    if (dom.nodeName == 'DIV' || dom.nodeName == 'P') {
        for (let i = 0; i < dom.childNodes.length; i++) {
            md += domToMd(dom.childNodes[i] as HTMLElement);
        }
        md += '\n';
    } else if (dom.nodeName == 'UL') {
        for (let i = 0; i < dom.childNodes.length; i++) {
            md += '* ' + domToMd(dom.childNodes[i] as HTMLElement) + '\n';
        }
    } else if (dom.nodeName == 'OL') {
        for (let i = 0; i < dom.childNodes.length; i++) {
            md += (i + 1).toString() + '. ' + domToMd(dom.childNodes[i] as HTMLElement) + '\n';
        }
    } else if (dom.nodeName == 'BLOCKQUOTE') {
        for (let i = 0; i < dom.childNodes.length; i++) {
            md += '> ' + domToMd(dom.childNodes[i] as HTMLElement) + '\n';
        }
    } else if (dom.nodeName == 'TABLE') {
        for (let i = 0; i < dom.childNodes.length; i++) {
            md += '> ' + domToMd(dom.childNodes[i] as HTMLElement) + '\n';
        }
    } else if (/^H\d$/.test(dom.nodeName)) {
        md += '#'.repeat(parseInt(dom.nodeName[1])) + ' ';
        for (let i = 0; i < dom.childNodes.length; i++) {
            md += domToMd(dom.childNodes[i] as HTMLElement);
        }
        md += '\n';
    } else if (dom.nodeName == 'A') {
        md += '[' + domToMd(dom.childNodes[0] as HTMLElement) + '](' + (dom as HTMLAnchorElement).href + ')';
    } else if (dom.nodeName == 'IMG') {
        md += '![' + (dom as HTMLImageElement).alt + '](' + (dom as HTMLImageElement).src + ')';
    } else if (dom.nodeName == '#text') {
        md += (dom as unknown as Text).data;
    } else {
        let _is = true;
        for (let i = 0; i < inlineRules.length; i++) {
            if (dom.nodeName.toLowerCase() == inlineRules[i].tag) {
                md += inlineRules[i].left;
                for (let i = 0; i < dom.childNodes.length; i++) {
                    md += domToMd(dom.childNodes[i] as HTMLElement);
                }
                md += inlineRules[i].right;
                _is = false;
                break;
            }
        }
        for (let i = 0; _is && i < dom.childNodes.length; i++) {
            md += domToMd(dom.childNodes[i] as HTMLElement);
        }
    }
    return md;
}

/**
 * dom转虚拟节点 
 * @param dom 节点
 */
export function domToNode(dom: HTMLElement): VText | VNode {
    if (dom.nodeName == '#text') {
        return new VText(dom.nodeValue);
    } else {
        let vnode = new VNode(dom.nodeName.toLowerCase(), {}, []);
        for (let i = 0; i < dom.attributes.length; i++) {
            let it = dom.attributes[i];
            vnode.attr[it.localName] = it.value;
        }
        if (dom.nodeName == 'INPUT') {
            if ((<HTMLInputElement>dom).checked) {
                vnode.attr['checked'] = 'checked';
            } else if (vnode.attr['checked']) {
                delete vnode.attr['checked'];
            }
        }
        for (let i = 0; i < dom.childNodes.length; i++) {
            vnode.appendChild(domToNode(<HTMLElement>dom.childNodes[i]));
        }
        return vnode;
    }
}
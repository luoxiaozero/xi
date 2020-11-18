import { inline } from "../..";
import { VNode, VText } from "../../../vObject";

/**ul和ol的处理 */
export function uoDispose(text: string, nodeName: string, match: string): VNode {
    if (text == '') {
        return new VNode('li', { __match__: match }, new VNode('p', {}, new VNode('br')));
    } else if (nodeName == 'ul' && /^\[x|X\]\s/.test(text)) {
        return new VNode('li', { __match__: match, style: 'list-style:none' },
            new VNode('p', {}, [new VNode('input', { type: 'checkbox', checked: 'checked' }), ...inline(text.substring(4))]));
    } else if (nodeName == 'ul' && /^\[\s\]\s/.test(text)) {
        return new VNode('li', { __match__: match, style: 'list-style:none' },
            new VNode('p', {}, [new VNode('input', { type: 'checkbox' }), ...inline(text.substring(4))]));
    } else if (/^\*\s/.test(text)) {
        return new VNode('li', { __match__: match }, new VNode('ul', {}, uoDispose(text.substring(2), 'ul', '*')));
    } else if (/^\s{2}\*\s/.test(text)) {
        return new VNode('li', { __match__: match }, new VNode('ul', {}, uoDispose(text.substring(2), 'ul', ' ')));
    } else if (/^\d\.\s/.test(text)) {
        return new VNode('li', { __match__: match }, new VNode('ol', {}, uoDispose(text.substring(3), 'ol', 'd.')));
    } else if (/^>\s/.test(text)) {
        return new VNode('li', { __match__: match }, new VNode('blockquote', {}, bDispose(text.substring(2))));
    } else {
        return new VNode('li', { __match__: match }, new VNode('p', {}, inline(text)));
    }
}

/**blockquote的处理 */
export function bDispose(text: string): VNode {
    // 处理
    if (text == '') {
        return new VNode('p', {}, new VNode('br'));
    } else if (/^>\s/.test(text)) {
        return new VNode('blockquote', {}, bDispose(text.substring(2)));
    } else if (/^\*\s/.test(text)) {
        return new VNode('ul', {}, uoDispose(text.substring(2), 'ul', '*'));
    } else if (/^\d\.\s/.test(text)) {
        return new VNode('ol', {}, uoDispose(text.substring(3), 'ol', 'd.'));
    } else {
        return new VNode('p', {}, inline(text));
    }
}

/**ul ol blockquote整合 */
export function buoMerge(node: VNode): VNode {

    let childs = node.childNodes as VNode[];
    let newChilds: VNode[] = [];
    newChilds.push(childs[0]);

    for (let i = 1; i < childs.length; i++) {
        if (childs[i] instanceof VText) {
            newChilds.push(childs[i]);
            continue;
        }
        let childNode0 = childs[i].childNodes[0];
        let newChildNodes_1 = newChilds[newChilds.length - 1].childNodes[0];
        if (childs[i].attr['__match__'] == ' ' && childNode0.nodeName == 'ul'
                && (newChildNodes_1.nodeName == 'p' || newChildNodes_1.nodeName == 'ul')) {
            newChilds[newChilds.length - 1].appendChild(childNode0);
        } else if (childs[i].nodeName == 'ul'  && newChilds[newChilds.length - 1].nodeName == 'ul') {
            newChilds[newChilds.length - 1].appendChild(childNode0);
        } else if (childs[i].attr['__match__'] == ' ' && childNode0.nodeName == 'ol'
                && (newChildNodes_1.nodeName == 'p' || newChildNodes_1.nodeName == 'ol')) {
            newChilds[newChilds.length - 1].appendChild(childNode0);
        } else if (childs[i].nodeName == 'ol'  && newChilds[newChilds.length - 1].nodeName == 'ol') {
            newChilds[newChilds.length - 1].appendChild(childNode0);
        } else if (childs[i].nodeName == 'blockquote'  && newChilds[newChilds.length - 1].nodeName == 'blockquote') {
                newChilds[newChilds.length - 1].appendChild(childNode0);
        } else {
            newChilds.push(childs[i]);
        }

        // 可优化
        if (newChilds[newChilds.length - 1].childNodes.length > 1) {
            newChilds[newChilds.length - 1] = buoMerge(newChilds[newChilds.length - 1]);
        }
    }

    node.replaceAllChild(newChilds);
    return node;
}
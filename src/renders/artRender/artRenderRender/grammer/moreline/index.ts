import { VNode, VText } from '../../vObject';
import inline from "../inline";
/**处理 */
function uoDispose(text: string, nodeName: string, match: string): VNode {
    let num = 2;
    if (nodeName == 'ol') {
        num = 3;
    }
    if (text.substring(num) == '') {
        return new VNode('li', { __match__: match }, new VNode('p', {}, new VNode('br')));
    } else if (nodeName == 'ul' && /^\[x|X\]\s/.test(text.substring(2))) {
        return new VNode('li', { __match__: match, style: 'list-style:none' }, [new VNode('input', { type: 'checkbox', checked: 'checked' }), new VNode('p', {}, inline(text.substring(6)))]);
    } else if (nodeName == 'ul' && /^\[\s\]\s/.test(text.substring(2))) {
        return new VNode('li', { __match__: match, style: 'list-style:none' }, [new VNode('input', { type: 'checkbox' }), new VNode('p', {}, inline(text.substring(6)))]);
    } else if (/^\*\s/.test(text.substring(num))) {
        return new VNode('li', { __match__: match }, new VNode('ul', {}, uoDispose(text.substring(num), 'ul', '*')));
    } else if (/^\s{2}\*\s/.test(text.substring(num))) {
        return new VNode('li', { __match__: match }, new VNode('ul', {}, uoDispose(text.substring(num), 'ul', ' ')));
    } else if (/^\d\.\s/.test(text.substring(num))) {
        return new VNode('li', { __match__: match }, new VNode('ol', {}, uoDispose(text.substring(num), 'ol', 'd.')));
    } else if (/^>\s/.test(text.substring(2))) {
        return new VNode('li', { __match__: match }, new VNode('blockquote', {}, bDispose(text.substring(2))));
    } else {
        return new VNode('li', { __match__: match }, new VNode('p', {}, inline(text.substring(num))));
    }
}

function bDispose(text) {
    // 处理
    if (text.substring(2) == "") {
        return new VNode("p", {}, new VNode("br"));
    } else if (/^>\s/.test(text.substring(2))) {
        return new VNode('blockquote', {}, bDispose(text.substring(2)));
    } else if (/^\*\s/.test(text.substring(2))) {
        return new VNode('ul', {}, uoDispose(text.substring(2), 'ul', '*'));
    } else if (/^\d\.\s/.test(text.substring(2))) {
        return new VNode('ol', {}, uoDispose(text.substring(2), 'ol', 'd.'));
    } else {
        return new VNode("p", {}, inline(text.substring(2)));
    }
}

/**整合 */
function buo(node: VNode): VNode {
    let child = node.childNodes as VNode[];
    let newChild: VNode[] = [];
    for (let i = 0; i < child.length; i++) {
        /**合并blockquote */
        if (child[i].nodeName == 'blockquote' && newChild.length > 0 && newChild[newChild.length - 1].nodeName == 'blockquote') {
            newChild[newChild.length - 1].childNodes.push(child[i].childNodes[0]);
            /**合并ul */
        } else if (child[i].nodeName == 'ul' && newChild.length > 0 && newChild[newChild.length - 1].nodeName == 'ul') {
            newChild[newChild.length - 1].childNodes.push(child[i].childNodes[0]);
            /**合并ol */
        } else if (child[i].nodeName == 'ol' && newChild.length > 0 && newChild[newChild.length - 1].nodeName == 'ol') {
            newChild[newChild.length - 1].childNodes.push(child[i].childNodes[0]);
        } else if (child[i].childNodes[0].nodeName == 'ul' && newChild.length > 0 && newChild[newChild.length - 1].childNodes[0].nodeName == 'ul') {
            (<VNode>newChild[newChild.length - 1].childNodes[0]).childNodes.push((<VNode>child[i].childNodes[0]).childNodes[0]);
        } else if (child[i].childNodes[0].nodeName == 'ol' && newChild.length > 0 && newChild[newChild.length - 1].childNodes[0].nodeName == 'ol') {
            (<VNode>newChild[newChild.length - 1].childNodes[0]).childNodes.push((<VNode>child[i].childNodes[0]).childNodes[0]);
        } else {
            if (newChild.length > 0) {
                if (newChild[newChild.length - 1].nodeName == 'blockquote') {
                    newChild[newChild.length - 1] = buo(newChild[newChild.length - 1]);
                } else if ('ul ol'.indexOf(newChild[newChild.length - 1].childNodes[0].nodeName) >= 0) {
                    newChild[newChild.length - 1].childNodes[0] = buo(newChild[newChild.length - 1].childNodes[0] as VNode);
                } else if ('ul ol'.indexOf(newChild[newChild.length - 1].nodeName) >= 0) {
                    newChild[newChild.length - 1] = buo(newChild[newChild.length - 1]);
                }
            }
            if (newChild.length > 0 && newChild[newChild.length - 1].nodeName == 'li' && child[i].nodeName == 'li' && child[i].attr['__match__'] == ' '
                && child[i].childNodes[0].nodeName == 'ul') {
                if (newChild[newChild.length - 1].childNodes.length > 1) {
                    (<VNode>newChild[newChild.length - 1].childNodes[newChild[newChild.length - 1].childNodes.length - 1])
                        .appendChild((<VNode>child[i].childNodes[0]).childNodes[0]);
                } else {
                    newChild[newChild.length - 1].appendChild(child[i].childNodes[0]);
                }

            } else {
                newChild.push(child[i]);
            }
        }
    }
    if (newChild.length > 0) {
        if (newChild[newChild.length - 1].nodeName == 'blockquote') {
            newChild[newChild.length - 1] = buo(newChild[newChild.length - 1]);
        } else if ('ul ol'.indexOf(newChild[newChild.length - 1].childNodes[0].nodeName) >= 0) {
            newChild[newChild.length - 1].childNodes[0] = buo(newChild[newChild.length - 1].childNodes[0] as VNode);
        } else if ('ul ol'.indexOf(newChild[newChild.length - 1].nodeName) >= 0) {
            newChild[newChild.length - 1] = buo(newChild[newChild.length - 1]);
        }
    }
    node.childNodes = newChild;
    return node;
}

/**
 * 多行匹配
 * @param rows 文本列表
 * @param i 匹配到第几行
 * @param len 文本列表长度
 */
export default function moreline(rows: string[], i: number, len: number): [VNode[], number] {
    for (let k = 0; k < morelineRule.length; k++) {
        if (rows[i].match(morelineRule[k].re)) {
            return morelineRule[k].fun(rows, i, len);
        }
    }
    return null;
}

const blockquote = { re: /^>\s/, fun: blockquoteFun };
const ul = { re: /^\*\s/, fun: ulFun };
const ol = { re: /^\d\.\s/, fun: olFun };
const pre = { re: /^```/, fun: preFun };
const table = { re: /^\|.*\|/, fun: tableFun };
const hr = { re: /^(\*{3,}$|^\-{3,}$|^\_{3,}$)/, fun: hrFun };
const toc = { re: /^\[(TOC)|(toc)\]$/, fun: tocFun };
export const morelineRule = [blockquote, ul, ol, pre, table, hr, toc];

function tocFun(rows: string[], i: number, len: number): [VNode[], number] {
    let vnodes: VNode[] = [];
    vnodes.push(new VNode('div', { class: 'art-shield art-tocTool', contenteditable: 'false', __dom__: 'tocTool' }));
    vnodes.push(new VNode('div', { class: 'art-shield art-toc', contenteditable: 'false', __dom__: 'toc' }));
    if (i + 1 < len && /^\s*$/.test(rows[i + 1]))
        i++;
    return [vnodes, i];
}

function hrFun(rows: string[], i: number, len: number): [VNode[], number] {
    let vnodes: VNode[] = [];
    vnodes.push(new VNode("hr"));
    if (i + 1 < len && /^\s*$/.test(rows[i + 1]))
        i++;
        return [vnodes, i];
}

function blockquoteFun(rows: string[], i: number, len: number): [VNode[], number] {
    let child: VNode[] = [];
    while (i < len && /^>\s/.test(rows[i])) {
        child.push(bDispose(rows[i]));
        i++;
    }
    if (!(i < len && /^\s*$/.test(rows[i + 1])))
        i--;
    return [[buo(new VNode('blockquote', {}, child))], i];
}

function ulFun(rows: string[], i: number, len: number): [VNode[], number] {
    let child: VNode[] = [];
    while (i < len) {
        if (/^\*\s/.test(rows[i])) {
            child.push(uoDispose(rows[i], 'ul', '*'));
            i++;
        } else if (/^\s{2,}\*\s/.test(rows[i])) {
            child.push(uoDispose(rows[i], 'ul', ' '));
            i++;
        } else {
            break;
        }
    }
    if (!(i < len && /^\s*$/.test(rows[i + 1])))
        i--;

    return [[buo(new VNode('ul', {}, child))], i];
}

function olFun(rows: string[], i: number, len: number): [VNode[], number] {
    let child: VNode[] = [];

    while (i < len) {
        if (/^\d\.\s/.test(rows[i])) {
            child.push(uoDispose(rows[i], 'ol', 'd.'));
            i++;
        } else if (/^\s{3,}\*\s/.test(rows[i])) {
            child.push(uoDispose(rows[i], 'ol', ' '));
            i++;
        } else {
            break;
        }
    }
    if (!(i < len && /^\s*$/.test(rows[i + 1])))
        i--;

    return [[buo(new VNode('ol', {}, child))], i];
}

function preFun(rows: string[], i: number, len: number): [VNode[], number] {
    let vnodes: VNode[] = []
    let lang = rows[i].match(/^```\s*([^\s]*?)\s*$/)[1];
    let j, _is = false, temp = '';
    for (j = i + 1; j < len; j++) {
        if (/^```$/.test(rows[j])) {
            _is = true;
            break;
        }
        temp += rows[j] + '\n';
    }
    if (_is) {
        i = j;
        let code;
        if (lang == undefined || lang == null) {
            lang = '';
        }
        vnodes.push(new VNode('div',
                { class: 'art-shield art-codeTool', contenteditable: 'false', __dom__: 'codeTool', __dict__: { codeLang: lang } }));
        if (lang != '') {
            code = new VNode("code", { "class": "lang-" + lang }, new VText(temp));
            vnodes.push(new VNode("pre", { class: 'art-pre-' + lang }, code));
            if (lang == 'flow') {
                vnodes.push(new VNode("div", { class: 'art-shield art-flowTool', 'contenteditable': 'false' }, []));
            }
        } else {
            code = new VNode("code", {}, new VText(temp));
            vnodes.push(new VNode("pre", {}, code));
        }
        if (i + 1 < len && /^\s*$/.test(rows[i + 1]))
            i++;
    } else {
        vnodes.push(new VNode("p", {}, new VText(rows[i])));
        if (i + 1 < len && rows[i + 1] == '')
            i++;
    }
    return [vnodes, i]
}

function tableFun(rows: string[], i: number, len: number): [VNode[], number] {
    let child: VNode[] = [], vnodes: VNode[] = [];
    if (i + 1 < len && /^\|(\s*:?-{3,}:?\s*\|)+/.test(rows[i + 1])) {
        let arry: string[], j: number, jlen: number, trChild: VNode[], tbodyChild: VNode[], align: string[], attr;

        arry = rows[i + 1].split('|');
        align = [];
        for (j = 1, jlen = arry.length - 1; j < jlen; j++) {
            let str: string = arry[j].replace(/(^\s*)|(\s*$)/g, '');
            if (str[0] == ':' && str[str.length - 1] == ':') {
                align.push('center');
            } else if (str[0] == ':') {
                align.push('left');
            } else if (str[str.length - 1] == ':') {
                align.push('right');
            } else {
                align.push('');
            }
        }

        child = []

        arry = rows[i].split('|');
        trChild = []
        for (j = 1, jlen = arry.length - 1; j < jlen; j++) {
            attr = {}
            if (align[j - 1]) {
                attr['style'] = 'text-align:' + align[j - 1];
            }
            trChild.push(new VNode("th", attr, inline(arry[j])));
        }
        child.push(new VNode('thead', {}, new VNode("tr", {}, trChild)));
        i += 2;

        tbodyChild = []
        while (i < len && /^\|.*\|/.test(rows[i])) {
            arry = rows[i].split('|');
            trChild = []
            for (j = 1, jlen = arry.length - 1; j < jlen; j++) {
                attr = {}
                if (align[j - 1]) {
                    attr['style'] = 'text-align:' + align[j - 1];
                }
                trChild.push(new VNode("td", attr, inline(arry[j])));
            }
            tbodyChild.push(new VNode("tr", {}, trChild));
            i++;
        }
        if (!(i < len && /^\s*$/.test(rows[i + 1])))
            i--;
        vnodes.push(new VNode('div',
            { class: 'art-shield art-tableTool', contenteditable: 'false', __dom__: 'tableTool' }));
        child.push(new VNode('tbody', {}, tbodyChild))
        vnodes.push(new VNode('table', { 'style': 'width:100%;' }, child));
    } else {
        vnodes.push(new VNode("p", {}, inline(rows[i])));
        if (i + 1 < len && /^\s*$/.test(rows[i + 1]))
            i++;
    }
    return [vnodes, i];
}
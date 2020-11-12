import { VNode, VText } from '../../vObject';
import inline from "../inline";
import { bDispose, buoMerge, uoDispose } from './buo';


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
        child.push(bDispose(rows[i].substring(2)));
        i++;
    }
    if (!(i < len && /^\s*$/.test(rows[i + 1])))
        i--;
    return [[buoMerge(new VNode('blockquote', {}, child))], i];
}

/**
 * ul匹配成功转虚拟节点
 * @param rows 
 * @param i 
 * @param len 
 */
function ulFun(rows: string[], i: number, len: number): [VNode[], number] {
    let child: VNode[] = [];
    while (i < len) {
        if (/^\*\s/.test(rows[i])) {
            child.push(uoDispose(rows[i].substring(2), 'ul', '*'));
            i++;
        } else if (/^\s{2,}\*\s/.test(rows[i])) {
            child.push(uoDispose(rows[i].substring(2), 'ul', ' '));
            i++;
        } else {
            break;
        }
    }
    if (!(i < len && /^\s*$/.test(rows[i + 1])))
        i--;


    let ul = buoMerge(new VNode('ul', {}, child));
    return [[ul], i];
}

function olFun(rows: string[], i: number, len: number): [VNode[], number] {
    let child: VNode[] = [];

    while (i < len) {
        if (/^\d\.\s/.test(rows[i])) {
            child.push(uoDispose(rows[i].substring(3), 'ol', 'd.'));
            i++;
        } else if (/^\s{3,}\d\.\s/.test(rows[i]) || /^\s{3,}\*\s/.test(rows[i])) {
            child.push(uoDispose(rows[i].substring(3), 'ol', ' '));
            i++;
        } else {
            break;
        }
    }
    if (!(i < len && /^\s*$/.test(rows[i + 1])))
        i--;

    let ol = buoMerge(new VNode('ol', {}, child));
    return [[ol], i];
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
import Tool from '@/tool';
import ArtRender from '..';
import Cursor from '../cursor';
import { initCodeTool, initTableTool, initTocTool } from '../tool';
import { enterRender, vnodeRender } from './eventRender';
import { aline, domToNode, inline, mdToNode} from './grammer';
import { VNode, VText } from './vObject';

/**
 * 渲染器的渲染类
 */
export default class ArtRenderRender {

    artRender: ArtRender;
    rootNode: VNode;
    constructor(artRender: ArtRender) {
        this.artRender = artRender;
        this.rootNode = new VNode('div', { __root__: true, class: 'art-render-art' }, new VNode('p', {}, new VNode('br')));
    }

    /**
     * 渲染
     * @param key 键值 
     * @param type 摁键行为
     */
    public render(key: string, type: string): boolean {
        this.artRender.cursor.getSelection();
        if (key == 'Backspace' && type == 'keydown') {
            return this.backRender();
        } else if (key == 'Enter' && type == 'keydown') {
            return enterRender(this);
        } else if (type == 'keyup') {
            return this.keyupRender();
        }
        return false;
    }

    /**
     * 退格渲染
     */
    public backRender(): boolean {
        let location = this.artRender.cursor.getSelection();
        if (location) {
            let dom = this.rootNode.dom.childNodes[location.anchorAlineOffset];
            if (dom.nodeName == 'PRE') {
                if (location.anchorNode.previousSibling == null && location.anchorInlineOffset == 0)
                    return false;
            } else {
                console.log("无执行", location)
            }
        }
        return true;
    }

    public updateToc() {
        let tocs = [];
        let directory = [];
        for (let vnode of this.rootNode.childNodes) {
            if (/^h\d$/.test(vnode.nodeName)) {
                let md = vnode.getMd();
                md = md.replace(/\s/g, '-').replace(/\\|\/|#|\:/g, '');
                let a = new VNode('a', { href: '#' + md }, new VText(vnode.getText()))
                let d = new VNode('p', { class: 'art-toc-' + vnode.nodeName }, a)
                directory.push(d);
            } else if (vnode instanceof VNode && (<VNode>vnode).attr['class'] && /art-toc(\s|$)/.test((<VNode>vnode).attr['class'])) {
                tocs.push(vnode);
            }
        }
        for (let toc of tocs) {
            toc.childNodes = directory;
        }
    }
    
    /**
     * 摁键抬起时渲染
     */
    public keyupRender(): boolean {
        this.rootNode.replaceAllChild((domToNode(this.rootNode.dom) as VNode).childNodes);

        this.dispose(this.rootNode);
        this.updateToc();

        vnodeRender(this.rootNode.dom, this.rootNode);

        this.artRender.cursor.setSelection();
        return false;
    }

    /**
     * 处理节点或处理文本到该节点上
     * @param vnode 节点
     * @param text 文本(可选)
     */
    public dispose(vnode: VNode, text: string = null): VNode[] {
        if (text != null) {
            vnode.replaceAllChild(mdToNode(text));
            return null;
        } else if (vnode.attr['__root__'] == true) {
            for (let i = vnode.childNodes.length - 1; i >= 0; i--) {
                let nodes = this.dispose(<VNode>vnode.childNodes[i]);
                if (nodes && nodes.length > 0) {
                    vnode.removeChild(vnode.childNodes[i]);
                    let refChild = vnode.childNodes[i];
                    for (let v of nodes) {
                        // 插入失败时，说明参考节点不存在，直接在后面添加
                        if (!vnode.insertBefore(v, refChild))
                            vnode.appendChild(v);
                    }
                }
            }
        } else if (vnode.attr['class'] && vnode.attr['class'].match(/art-shield/)) {
            return null;
        } else if (vnode.nodeName == 'blockquote') {
            for (let i = 0; i < vnode.childNodes.length; i++) {
                if (vnode.childNodes[i].nodeName == "blockquote" || vnode.childNodes[i].nodeName == "ul" || vnode.childNodes[i].nodeName == "ol") {
                    this.dispose(<VNode>vnode.childNodes[i]);
                } else if (/^>\s/.test(vnode.childNodes[i].getMd())) {
                    vnode.replaceChild(new VNode('blockquote', {}, new VNode('p', {}, new VNode('br'))), vnode.childNodes[i])
                } else if (/^\*\s/.test(vnode.childNodes[i].getMd())) {
                    vnode.replaceChild(new VNode('ul', {}, new VNode('li', {}, new VNode('br'))), vnode.childNodes[i])
                } else if (/^\d\.\s/.test(vnode.childNodes[i].getMd())) {
                    vnode.replaceChild(new VNode('ol', {}, new VNode('li', {}, new VNode('br'))), vnode.childNodes[i])
                } else {
                    (<VNode>vnode.childNodes[i]).replaceAllChild(inline(vnode.childNodes[i].getMd()));
                }
            }
        } else if (vnode.nodeName === "ul" || vnode.nodeName === "ol") {
            for (let i = 0; i < vnode.childNodes.length; i++) {
                if ((<VNode>vnode.childNodes[i]).childNodes[0].nodeName == "blockquote" || (<VNode>vnode.childNodes[i]).childNodes[0].nodeName == "ul" || (<VNode>vnode.childNodes[i]).childNodes[0].nodeName == "ol") {
                    for (let j = 0; j < (<VNode>vnode.childNodes[i]).childNodes.length; j++) {
                        if ((<VNode>vnode.childNodes[i]).childNodes[j].nodeName == "p") {
                            (<VNode>(<VNode>vnode.childNodes[i]).childNodes[j]).replaceAllChild(inline((<VNode>vnode.childNodes[i]).childNodes[j].getMd()));
                        } else {
                            this.dispose(<VNode>(<VNode>vnode.childNodes[i]).childNodes[j]);
                        }
                    }
                } else if (/^>\s/.test(vnode.childNodes[i].getMd())) {
                    (<VNode>vnode.childNodes[i]).replaceAllChild([new VNode("blockquote", {}, new VNode('p', {}, new VNode('br')))]);
                } else if (/^\*\s/.test(vnode.childNodes[i].getMd())) {
                    (<VNode>vnode.childNodes[i]).replaceAllChild([new VNode("ul", {}, new VNode("li", {}, new VNode('br')))]);
                } else if (/^\d\.\s/.test(vnode.childNodes[i].getMd())) {
                    (<VNode>vnode.childNodes[i]).replaceAllChild([new VNode("ol", {}, new VNode("li", {}, new VNode('br')))]);
                } else if ((<VNode>vnode.childNodes[i]).childNodes[0].nodeName == 'input') {
                    (<VNode>vnode.childNodes[i]).replaceAllChild([(<VNode>vnode.childNodes[i]).childNodes[0], ...inline(vnode.childNodes[i].getMd())]);
                } else if (/^\[x|X\]\s/.test(vnode.childNodes[i].getMd())) {
                    (<VNode>vnode.childNodes[i]).replaceAllChild([new VNode('input', { type: "checkbox", checked: "checked" }), ...inline(vnode.childNodes[i].getMd().substring(4))]);
                } else if (/^\[\s\]\s/.test(vnode.childNodes[i].getMd())) {
                    (<VNode>vnode.childNodes[i]).replaceAllChild([new VNode('input', { type: "checkbox" }), ...inline(vnode.childNodes[i].getMd().substring(4))]);
                } else {
                    (<VNode>vnode.childNodes[i]).replaceAllChild(inline((<VNode>vnode.childNodes[i]).childNodes[0].getMd()));
                }
            }
        } else if (vnode.nodeName == "table") {
            // table
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
        } else if (vnode.nodeName === "pre") {
            return null
        } else if (vnode.nodeName == "hr") {
            return null
        } else {
            let md = vnode.getMd();
            let vnodes = null;
            if (/^>\s/.test(md)) {
                (<VNode>vnode.parentNode).replaceChild(new VNode('blockquote', {}, new VNode('p', {}, inline(md.substring(2)))), vnode);
                this.artRender.cursor.location.focusInlineOffset -= 2;
                this.artRender.cursor.location.anchorInlineOffset -= 2;
            } else if (/^\*\s/.test(md)) {
                (<VNode>vnode.parentNode).replaceChild(new VNode('ul', {}, new VNode('li', {}, inline(md.substring(2)))), vnode);
                this.artRender.cursor.location.focusInlineOffset -= 2;
                this.artRender.cursor.location.anchorInlineOffset -= 2;
            } else if (/^\d\.\s/.test(md)) {
                (<VNode>vnode.parentNode).replaceChild(new VNode('ol', {}, new VNode('li', {}, inline(md.substring(3)))), vnode);
                this.artRender.cursor.location.focusInlineOffset -= 3;
                this.artRender.cursor.location.anchorInlineOffset -= 3;
            } else if (vnodes = aline(md)) {
                // let nodes = textToNode(this.getMd());
                return vnodes;
            } else {
                return [new VNode('p', {}, inline(md))];
            }
        }
        return null
    }

}
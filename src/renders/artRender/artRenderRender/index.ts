import ArtRender from '..';
import { backRender, enterRender, keyupRender } from './eventRender';
import { aline, inline, mdToNode } from './grammer';
import { updateTable, updateToc } from './vnodeDispose';
import { VNode } from './vObject';

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
            return backRender(this);
        } else if (key == 'Enter' && type == 'keydown') {
            return enterRender(this);
        } else if (type == 'keyup') {
            return keyupRender(this);
        }
        this.artRender.cursor.setSelection();
        return false;
    }

    /**
     * 更新Blockquote
     * @param vnode 
     */
    public updateBlockquote(vnode: VNode) {
        for (let i = 0; i < vnode.childNodes.length; i++) {
            if (vnode.childNodes[i].nodeName == "blockquote" || vnode.childNodes[i].nodeName == "ul" || vnode.childNodes[i].nodeName == "ol") {
                this.vnodeDispose(<VNode>vnode.childNodes[i]);
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
    }

    /**
     * 更新ul ol
     * @param vnode 
     */
    public updataULOL(vnode: VNode) {
        for (let li of vnode.childNodes) {
            li = li as VNode;
            if (li.childNodes.length > 1 || li.childNodes[0].nodeName != 'p') {
                for (let v of li.childNodes) {
                    if (v.nodeName == 'p') {
                        (<VNode>v).replaceAllChild(inline(v.getMd()));
                    } else {
                        this.vnodeDispose(v as VNode);
                    }
                }
            } else if (/^>\s/.test(li.getMd())) {
                li.replaceAllChild([new VNode('blockquote', {}, new VNode('p', {}, inline(li.getMd().substring(2))))]);
                this.artRender.cursor.location.focusInlineOffset -= 2;
                this.artRender.cursor.location.anchorInlineOffset -= 2;
            } else if (/^\*\s/.test(li.getMd())) {
                let p = new VNode('p', {}, inline(li.getMd().substring(2)));
                li.replaceAllChild([new VNode('ul', {}, new VNode('li', {}, p))]);
                this.artRender.cursor.location.focusInlineOffset -= 2;
                this.artRender.cursor.location.anchorInlineOffset -= 2;
            } else if (/^\d\.\s/.test(li.getMd())) {
                let p = new VNode('p', {}, inline(li.getMd().substring(2)));
                li.replaceAllChild([new VNode('ol', {}, new VNode('li', {}, p))]);
                this.artRender.cursor.location.focusInlineOffset -= 3;
                this.artRender.cursor.location.anchorInlineOffset -= 3;
            } else if (vnode.nodeName == 'ul' && /^\[x|X\]\s/.test(li.getMd())) {
                let p = new VNode('p', {}, [new VNode('input', { type: 'checkbox', checked: 'checked' }), ...inline(li.getMd().substring(4))]);
                li.replaceAllChild([p]);
            } else if (vnode.nodeName == 'ul' && /^\[\s\]\s/.test(li.getMd())) {
                let p = new VNode('p', {}, [new VNode('input', { type: 'checkbox' }), ...inline(li.getMd().substring(4))]);
                li.replaceAllChild([p]);
            } else if (li.childNodes[0].nodeName == 'p' && (<VNode>li.childNodes[0]).childNodes[0].nodeName == 'input') {
                (<VNode>li.childNodes[0]).replaceAllChild([(<VNode>li.childNodes[0]).childNodes[0], ...inline(li.childNodes[0].getMd())]);
            } else {
                li.replaceAllChild([new VNode('p', {}, inline(li.childNodes[0].getMd()))]);
            }
        }
    }

    public updateRoot(vnode: VNode) {
        for (let i = vnode.childNodes.length - 1; i >= 0; i--) {
            let nodes = this.vnodeDispose(<VNode>vnode.childNodes[i]);
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
        updateToc(vnode);
    }
    /**
     * 处理节点或处理文本到该节点上
     * @param vnode 节点
     * @param text 文本(可选)
     */
    public vnodeDispose(vnode: VNode, text: string = null): VNode[] {
        if (text != null) {
            vnode.replaceAllChild(mdToNode(text));
            updateToc(vnode);
            return null;
        } else if (vnode.attr['__root__'] == true) {
            this.updateRoot(vnode);
        } else if (vnode.attr['class'] && vnode.attr['class'].match(/art-shield/)) {
            return null;
        } else if (vnode.nodeName == 'blockquote') {
            this.updateBlockquote(vnode);
        } else if (vnode.nodeName == 'ul' || vnode.nodeName == 'ol') {
            this.updataULOL(vnode);
        } else if (vnode.nodeName == 'table') {
            updateTable(vnode);
        } else if (vnode.nodeName == 'pre' || vnode.nodeName == 'hr') {
            return null;
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
                return vnodes;
            } else {
                return [new VNode('p', {}, inline(md))];
            }
        }
        return null
    }
}
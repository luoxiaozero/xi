import initTableTool from '../tool/tableTool';
import VTextNode from "./vTextNode";
import VNodeObject from "./vNodeObject";
import Editor from 'lib/editor';
import imgTool from "lib/render/artRender/tool/imgTool";
import initCodeTool from "lib/render/artRender/tool/codeTool";
import initTocTool from "lib/render/artRender/tool/tocTool";

class VNode extends VNodeObject{
    attr: {};
    childNodes: (VNode | VTextNode)[];
    dom: HTMLElement;
    parentNode: VNode;

    constructor(nodeName: string, attr: {} = {}, childNodes: any[] | VTextNode | VNode = null) {
        super(nodeName);
        this.parentNode = null;

        this.attr = attr;
        if (childNodes instanceof Array) {
            this.childNodes = childNodes;
        } else if (childNodes == null) {
            this.childNodes = []
        } else {
            this.childNodes = [childNodes]
        }
        for(let node of this.childNodes){
            node.parentNode = this;
        }
    }

    /**新建dom */
    public newDom(): any {
        this.dom = document.createElement(this.nodeName);
        for (let key in this.attr) {
            if (key === "__dom__") {
                if (this.attr[key] === "tableTool") {
                    initTableTool(this.dom)
                } else if (this.attr[key] === "imgTool") {
                    this.dom.appendChild(imgTool())
                } else if (this.attr[key] === "codeTool") {
                    initCodeTool(this.dom, this.attr['__dict__']['codeLang']);
                } else if (this.attr[key] == 'tocTool') {
                    initTocTool(this.dom);
                }
            } else if (key == "art-math") {
                if(Editor.plugins.katex){
                    this.dom.innerHTML = Editor.plugins.katex.renderToString(this.attr["art-math"], { throwOnError: false });
                    this.dom.setAttribute(key, this.attr[key]);
                }else{
                    this.dom.setAttribute(key, '\n@math:katex未加载出@\n');
                }
            } else if (!(/^__[a-zA-Z\d]+__$/.test(key))) {
                this.dom.setAttribute(key, this.attr[key]);
            }
        }

        this.childNodes.forEach((element) => {
            this.dom.appendChild(element.newDom());
        })
        return this.dom;
    }

    /**添加孩子节点 */
    public appendChild(vnode: VNode | VTextNode): boolean{
        this.childNodes.push(vnode);
        vnode.parentNode = this;
        return true;
    }

    /**替换孩子节点 */ 
    public replaceChild(newNode: VNode | VTextNode, oldNode: VNode | VTextNode): boolean {
        let index = this.childNodes.indexOf(oldNode)
        if (index != -1) {
            newNode.parentNode = this;
            this.childNodes[index] = newNode;
            return true;
        }
        return false;
    }

    /**替换所有孩子节点 */
    public replaceAllChild(newNodes: (VNode | VTextNode)[]): boolean {
        if(newNodes){
            this.childNodes = [];
            for(let v of newNodes){
                this.appendChild(v);
            }
            return true;
        }
        return false;
    }

    /**插入参考孩子节点之前 */
    public insertBefore (newChild: VNode | VTextNode, refChild: VNode | VTextNode): boolean{
        let index = this.childNodes.indexOf(refChild);
        if (index != -1) {
            newChild.parentNode = this;
            this.childNodes.splice(index, 0, newChild);
            return true;
        }
        return false;
    }

    /**插入参考孩子节点之后 */
    public insertAfter (newChild: VNode | VTextNode, refChild: VNode | VTextNode): boolean {   
        let index = this.childNodes.indexOf(refChild);
        if (index != -1) { 
            newChild.parentNode = this;
            this.childNodes.splice(index + 1, 0, newChild);
            return true;
       }          
       return false;  
    }

    /**删除孩子节点 */
    public removeChild (oldChild: VTextNode | VNode): boolean{
        let index = this.childNodes.indexOf(oldChild);
        if (index != -1) { 
            this.childNodes.splice(index, 1);
            return true;
       }          
       return false;  
    }

    /**是否存在该类名 */
    public hasClass (cls: string): boolean {
        if(!this.attr['class']){
            return false;
        }
        return (' ' + this.attr['class'] + ' ').indexOf(' ' + cls + ' ') > -1;
    }

    public getMd(model: string='editor'): string{
        let md = '';
        if(/art-toc(\s|$)/.test(this.attr['class'])){
            return '[TOC]\n'
        }else if (this.nodeName == 'a' && this.childNodes.length > 0) {
            md += (<VTextNode>this.childNodes[0]).text;
        } else if (this.attr['class'] && /art-shield/.test(this.attr['class'])) {
            return '';
        } else if(model == 'read'){
            if (this.nodeName == 'hr') {
                md += '***\n';
            } else if (this.nodeName == 'input' && this.attr['type'] == 'checkbox') {
                if (this.attr['checked'] == 'checked') {
                    md += '[x] '
                } else {
                    md += '[ ] '
                }
            } else if (this.nodeName == 'blockquote') {
                for (let i = 0; i < this.childNodes.length; i++) {
                    let rows = this.childNodes[i].getMd(model).replace(/\s$/, '').split('\n');
                    for(let text of rows){
                        md += '> ' + text + '\n';
                    }
                }
            } else if (this.nodeName == 'ul') {
                for (let i = 0; i < this.childNodes.length; i++) {
                    let rows = this.childNodes[i].getMd(model).replace(/\s$/, '').split('\n');
                    for(let text of rows){
                        md += '* ' + text + '\n';
                    }
                }
            } else if (this.nodeName == 'ol') {
                for (let i = 0; i < this.childNodes.length; i++) {
                    let rows = this.childNodes[i].getMd(model).replace(/\s$/, '').split('\n');
                    for(let j = 0, len = rows.length; j < len; j++){
                        if(j == 0)
                            md += (i + 1).toString() + '. ' + rows[j] + '\n';
                        else
                            md +=  '   ' + rows[j] + '\n';
                    }
                }
            } else if(this.nodeName == 'li'){
                for (let i = 0; i < this.childNodes.length; i++) {
                    md += this.childNodes[i].getMd(model);
                }
            } else if (('h1 h2 h3 h4 h5 h6'.indexOf(this.nodeName) >= 0 || this.nodeName == 'p')) {
                for (let i = 0; i < this.childNodes.length; i++) {
                    md += this.childNodes[i].getMd(model)
                }
                md += '\n';
            } else if (this.nodeName == 'table') {
                for (let k = 0; k < this.childNodes.length; k++) {
                    for (let i = 0; i < (<VNode>this.childNodes[k]).childNodes.length; i++) {
                        let tr = (<VNode>this.childNodes[k]).childNodes[i] as VNode;

                        md += '|';
                        for (let j = 0; j < tr.childNodes.length; j++) {
                            md += tr.childNodes[j].getMd(model) + '|';
                        }
                        md += '\n';

                        if (k == 0) {
                            md += '|'
                            for (let j = 0; j < tr.childNodes.length; j++) {
                                let th = tr.childNodes[j] as VNode;
                                let mat;
                                if(th.attr['style'] && (mat = th.attr['style'].match(/text-align:\s*?(left|center|right)/))){
                                    switch(mat[1]){
                                        case 'center': md += ':---:|'; break;
                                        case 'left': md += ':---|'; break;
                                        case 'right': md += '---:|'; break;
                                        default: md += ':---:'; break;
                                    }
                                } else {
                                    md += '---|';
                                }
                                
                            }
                            md += '\n';
                        }
                    }
                }
            } else if (this.nodeName == 'pre') {
                md += '```'
    
                let className: string = (<VNode>this.childNodes[0]).attr['class'];
                if(className){
                    let lang = className.match(/lang-(.*?)(\s|$)/);
                    if(lang){
                        md += lang[1];
                    }
                }
                
                md += '\n';
                for (let i = 0; i < this.childNodes.length; i++) {
                    md += this.childNodes[i].getMd(model);
                }
                md += '```\n'
            }else{
                for (let i = 0; i < this.childNodes.length; i++) {
                    md += this.childNodes[i].getMd(model);
                }
            }
        } else {
            for (let i = 0; i < this.childNodes.length; i++) {
                md += this.childNodes[i].getMd(model);
            }
        }
        return md;
    }
    public getText(): string{
        let text = '';
        for(let vnode of this.childNodes){
            if(vnode.nodeName == '#text'){
                text += vnode.getText();
            }else if((<VNode>vnode).attr['class'] != undefined && !/(art\-shield)|(art\-hide)|(art\-show)/.test((<VNode>vnode).attr['class'])){
                text += vnode.getText();
            }
        }
        return text
    }
}
export default VNode
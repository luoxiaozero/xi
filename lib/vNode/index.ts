import tableTool from "../tool/tableTool"
import imgTool from "../tool/imgTool"
import codeTool from "../tool/codeTool"
import VTextNode from "./vTextNode";
import VNodeObject from "./vNodeObject";
import Editor from "../editor"

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
                    this.dom.appendChild(tableTool())
                } else if (this.attr[key] === "imgTool") {
                    this.dom.appendChild(imgTool())
                } else if (this.attr[key] === "codeTool") {
                    this.dom.appendChild(codeTool())
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

    public getMd(model: string='editor'): string{
        let md = '';
        if(/art-toc/.test(this.attr['class'])){
            return '[TOC]\n'
        }else if (this.nodeName == 'a' && this.childNodes.length > 0) {
            md += (<VTextNode>this.childNodes[0]).text;
        } else if (this.attr['class'] && this.attr['class'] == 'art-shield') {
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
                    md += (i + 1).toString() + '. ' + this.childNodes[i].getMd(model) + '\n';
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
                        md += '|';
                        let j;
                        for (j = 0; j < (<VNode>(<VNode>this.childNodes[k]).childNodes[i]).childNodes.length; j++) {
                            md += (<VNode>(<VNode>this.childNodes[k]).childNodes[i]).childNodes[j].getMd(model) + '|';
                        }
                        md += '\n';
                        if (k == 0) {
                            md += '|'
                            while (j--) {
                                md += '---|'
                            }
                            md += '\n';
                        }
                    }
                }
            } else if (this.nodeName == 'pre') {
                md += '```'
    
                let className = (<VNode>this.childNodes[0]).attr['class'];
                if (className) {
                    md += ' ' + className.substring(5).split(' ')[0];
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
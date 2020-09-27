import VNode from '..'
import VNodeObject from '../vNodeObject';

class VTextNode extends VNodeObject {
    nodeName: string;
    text: string;
    dom: Text;
    parentNode: VNode;

    constructor(text) {
        super('#text');
        this.text = text;
        this.parentNode = null;
        this.dom = null;
    }

    public newDom(): any {
        this.dom = document.createTextNode(this.text);
        return this.dom;
    }

    public getMd(): string {
        return this.text;
    }

    public getText(): string {
        return this.text;
    }
}
export default VTextNode;
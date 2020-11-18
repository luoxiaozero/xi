import {VObject, VNode} from '../';

export default class VText extends VObject {
    nodeName: string;
    text: string;
    dom: Text;
    parentNode: VNode;

    constructor(text: string) {
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
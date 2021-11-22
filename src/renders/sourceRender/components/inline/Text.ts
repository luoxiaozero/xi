import { InlineComponent } from "./Component";
import VNode from "../../../artRender/node";
import Component from "../Component";

export default class TextComponent extends InlineComponent {
    el: Text;
    text: string;
    constructor(node: VNode, parent: Component) {
        super(parent);
        this.text = node._literal;
    }
    mounted(el: HTMLElement) {
        this.el = new Text(this.text);
        el.appendChild(this.el);
    }
    toMd() {
        return this.text;
    }
}
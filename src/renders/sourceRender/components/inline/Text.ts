import { InlineComponent } from "./Component";
import VNode from "../../../artRender/node";

export default class TextComponent extends InlineComponent {
    el: Text;
    text: string;
    constructor(node: VNode) {
        super();
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
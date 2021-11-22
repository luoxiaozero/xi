import { InlineComponent } from "./Component";
import VNode from "../../../artRender/node";
import Component from "../Component";

export default class SoftBreakComponent extends InlineComponent {
    el: Text;
    constructor(node: VNode, parent: Component) {
        super(parent);
    }
    mounted(el: HTMLElement) {
        this.el = new Text("\n");
        el.appendChild(this.el);
    }
}
import { InlineComponent } from "./Component";
import VNode from "../../../artRender/node";

export default class SoftBreakComponent extends InlineComponent {
    el: Text;
    constructor(node: VNode) {
        super();
    }
    mounted(el: HTMLElement) {
        this.el = new Text("\n");
        el.appendChild(this.el);
    }
}
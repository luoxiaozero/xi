import { InlineComponent } from "../Component";

export default class SoftBreakComponent extends InlineComponent {
    el: Text;
    constructor() {
        super();
    }
    mounted(el: HTMLElement) {
        this.el = new Text("\n");
        el.appendChild(this.el);
    }
}
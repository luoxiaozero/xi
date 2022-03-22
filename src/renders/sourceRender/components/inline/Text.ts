import { InlineComponent } from "../Component";

export default class TextComponent extends InlineComponent {
    el: Text;
    constructor(public text: string) {
        super();
    }
    mounted(el: HTMLElement) {
        this.el = new Text(this.text);
        el.appendChild(this.el);
    }
    toMd() {
        return this.text;
    }
}
import { InlineContainerComponent } from "../Component";

export default class LinkComponent extends InlineContainerComponent {
    el: HTMLAnchorElement;
    href: string;
    constructor() {
        super();
    }
  
    beforeMount() {
        this.el = document.createElement("a");
        // if (this.children.length > 0)
        // this.children[0].text;
        this.el.innerHTML = "[" + "]";
        this.el.href = this.href;
    }
    mounted(el: HTMLElement) {
        el.appendChild(this.el);
    }
    toMd() {
        return this.el.innerText;
    }
}
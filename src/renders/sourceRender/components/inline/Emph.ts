import { InlineComponent } from "../Component";

export default class EmphComponent extends InlineComponent {
    el: HTMLSpanElement;
    containerEl: HTMLSpanElement;
    matchText: string;
    children: InlineComponent[];
    constructor() {
        super();
        // this.matchText = node.firstChild.type === 'strong' ? node.firstChild.attrs.get('art-marker') : node.attrs.get('art-marker');
    }
  
    beforeMount() {
        this.el = document.createElement("span");
        let beforeEl = document.createElement("span");
        beforeEl.innerText = this.matchText;
        let afterEl = document.createElement("span");
        afterEl.innerText = this.matchText;
        this.containerEl = document.createElement("span");
        this.el.appendChild(beforeEl);
        this.el.appendChild(this.containerEl);
        this.el.appendChild(afterEl);
    }
    mounted(el: HTMLElement) {
        el.appendChild(this.el);
    }
    toMd() {
        return this.el.innerText;
    }
}
import VNode from "../../../../artRender/node";
import { ContainerComponent, LeafComponent } from "../Component";

export default class CodeBlock extends LeafComponent {
  children: undefined;
  matchText: string;
  langText: string;
  codeText: string;
  constructor(node: VNode, parent: ContainerComponent) {
    super(parent);
    this.created(node);
  }

  created(node: VNode) {
    if (!node) return;
    this.codeText = node._literal;
    this.matchText = (node._fenceChar as string).repeat(node._fenceLength);
    this.langText = node._info;
  }

  beforeMount() {
    this.el = document.createElement("div");
    this.el.contentEditable = "true";
    let beforeEl = document.createElement("p");
    beforeEl.innerText = this.matchText + this.langText;
    let afterEl = document.createElement("p");
    afterEl.innerText = this.matchText;
    let containerEl = document.createElement("pre");
    let contentEl = document.createElement("code");
    contentEl.innerHTML = this.codeText;
    containerEl.appendChild(contentEl);
    this.el.appendChild(beforeEl);
    this.el.appendChild(containerEl);
    this.el.appendChild(afterEl);
  }
  
  mounted(el: HTMLElement) {
    el.appendChild(this.el);
  }  

  toMd(): string {
    let md = "";
    
    return md;
  }
}
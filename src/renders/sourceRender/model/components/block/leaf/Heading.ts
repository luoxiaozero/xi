import VNode from "../../../../../artRender/node";
import { ContainerComponent, LeafComponent } from "../Component";
import Paragraph from "./Paragraph";
const reATXHeadingMarker = /^#{1,6}/;
export default class Heading extends LeafComponent {
  el: HTMLHeadingElement;
  level: number;
  constructor(node: VNode, parent: ContainerComponent) {
    super(parent);
    this.level = node._level;
    let text = new VNode("text");
    text._literal = "#".repeat(node._level) + " ";
    node.prependChild(text);
    this.created(node);
  }
  mounted(el: HTMLElement) {
    this.el = document.createElement("h" + this.level) as HTMLHeadingElement;
    // this.el.contentEditable = "true";
    el.appendChild(this.el);
    super.mounted(this.el);
    this.el.addEventListener("keyup", (e) => {
      this.keyupEvent(e);
    })
  }
  keyupEvent(e: KeyboardEvent) {
    let match: RegExpMatchArray;
    let md = this.el.innerText;
    if ((match = md.match(reATXHeadingMarker)) && md.charCodeAt(match[0].length) == 32) {
      this.level = match[0].length;
    } else {
      this.parent.replaceChild(new Paragraph(this.children, this.parent), this);
    }
  }
  toMd(): string {
    let md = "";
    for (let c of this.children) {
        md += c.toMd();
    }
    md + "\n";
    return md;
  }
}

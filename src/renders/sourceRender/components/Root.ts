import VNode from "../../artRender/node";
import { Heading, Paragraph } from "./block";
import { ContainerComponent } from "./block/Component";
import CodeBlock from "./block/leaf/CodeBlock";
import Component from "./Component";

export default class Root extends ContainerComponent {
  el: HTMLElement;
  children: Component[];
  constructor(node: VNode, dom: HTMLElement) {
    super(null);
    this.el = dom;
    this.children = [];
    this.created(node);
    this.beforeMount();
    this.mounted();
  }
  created(node: VNode) {
    let child = node.firstChild;
    if (child === null) {
      child = new VNode("paragraph");
      child.appendChild(new VNode("linebreak"));
      node.appendChild(child);
    }
    while (child) {
      let c = this.nodeToComponent(child);
      c && this.children.push(c);
      child = child.next;
    }
  }
  nodeToComponent(node: VNode): Component | null {
    switch (node.type) {
      case "paragraph":
        return new Paragraph(node, this);
      case "heading":
        return new Heading(node, this);
      case "code_block":
        return new CodeBlock(node, this);
    }
    return null;
  }
  beforeMount() {
    for (let c of this.children) {
      c.beforeMount();
    }
  }
  mounted() {
    for (let c of this.children) {
      c.mounted(this.el);
    }
  }

  toMd(): string {
    let md = "";
    for (let c of this.children) {
        md += c.toMd() + '\n';
    }
    return md;
  }
}

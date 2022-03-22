import { Component, ContainerComponent } from "./Component";

export default class Root extends ContainerComponent {
  el: HTMLElement;
  children: Component[];
  constructor(dom: HTMLElement) {
    super();
    this.el = dom;
    this.children = [];
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

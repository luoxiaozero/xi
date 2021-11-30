import Component from "../Component";
import VNode from "../../../../artRender/node";
import { TextComponent } from "../inline";
import { InlineComponent } from "../inline/Component";

export class LeafComponent extends Component {
  el: HTMLElement;
  parent: ContainerComponent;
  children: Component[];
  constructor(parent: ContainerComponent) {
    super();
    this.parent = parent;
    this.children = [];
  }

  created(node: VNode | Component[]) {
    if (!node) return;
    if (node instanceof VNode) {
      let child = node.firstChild;
      while (child) {
        let c = this.nodeToComponent(child);
        c && this.children.push(c);
        child = child.next;
      }
    } else {
        this.children = node;
    }
    
  }

  nodeToComponent(node: VNode): InlineComponent {
    switch (node.type) {
      case "text":
        return new TextComponent(node, this);
    }
  }
  mounted(el: HTMLElement) {
    for (let c of this.children) {
      c.mounted(el);
    }
  }
}

export class ContainerComponent extends Component {
  el: HTMLElement;
  parent: ContainerComponent;
  children: Component[];
  constructor(parent: ContainerComponent) {
    super();
    this.parent = parent;
    this.children = [];
  }

  replaceChild(newChild: LeafComponent, oldChild: LeafComponent): boolean {
    let index = this.children.indexOf(oldChild);
    if (index !== -1) {
      this.children.splice(index, 1, newChild);
      return true;
    }
    return false;
  }
}

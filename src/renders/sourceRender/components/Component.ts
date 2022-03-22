
export class Component {
  parent: Component;
  constructor() {}
  beforeCreate() {

  }
  created() {

  }
  beforeMount() {

  }

  mounted(el: HTMLElement) {
  }

  beforeUpdate() {

  }
  updated() {}

  render() {}

  beforeUnmount(el: HTMLElement) {

  }
  unmounted() {

  }
  toMd(): string {
    return "";
  }
}

export class LeafComponent extends Component {
  el: HTMLElement;
  parent: ContainerComponent;
  children: Component[];
  constructor() {
    super();
    this.children = [];
  }
  beforeMount()  {
    for (let c of this.children) {
      c.beforeMount();
    }
  }
  
  mounted(el: HTMLElement) {
    for (let c of this.children) {
      c.mounted(el);
    }
  }

  appendChild(component: InlineComponent) {
    this.children.push(component);
    component.parent = this;
  }
}

export class ContainerComponent extends Component {
  el: HTMLElement;
  parent: ContainerComponent;
  children: Component[];
  constructor() {
    super();
    this.children = [];
  }

  appendChild(component: Component) {
    this.children.push(component);
    component.parent = this;
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

export class InlineComponent extends Component {
  parent: Component;
  constructor() {
    super();
  }
}

export class InlineContainerComponent extends InlineComponent {
  parent: Component;
  children: Component[] = [];
  constructor() {
    super();
  }
  appendChild(component: Component) {
    this.children.push(component);
    component.parent = this;
  }
}
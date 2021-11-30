import VNode from "../../../../artRender/node";
import Component from "../Component";
import EmphComponent from "./Emph";
import TextComponent from "./Text";

export class InlineComponent extends Component {
  parent: Component;
  constructor(parent: Component) {
    super();
    this.parent = parent;
  }

  // nodeToComponent(node: VNode): InlineComponent {
  //   let component: InlineComponent;
  //   switch (node.type) {
  //     case "emph":
  //       return new EmphComponent(node, this);
  //     case "text":
  //       return new TextComponent(node, this);
  //   }
  // }
}

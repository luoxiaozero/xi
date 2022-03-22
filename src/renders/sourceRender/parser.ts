import * as MarkdownIt from "markdown-it";
import Token from "markdown-it/lib/token";
import { Heading, Paragraph, CText, CLink } from "./components";
import {
  Component,
  ContainerComponent,
  LeafComponent,
  InlineContainerComponent,
} from "./components/Component";

const md = MarkdownIt();

export function mdToComponent(content: string): Component[] {
  const components: Component[] = [];
  const tokens = md.parse(content, {});
  let currentComponent:
    | ContainerComponent
    | LeafComponent
    | InlineContainerComponent = null;
  const enterComponents: Component[] = [];
  tokens.forEach((token) => {
    console.log(token);
    switch (token.type) {
      case "paragraph_open":
        currentComponent = new Paragraph();
        enterComponents.push(currentComponent);
        break;
      case "heading_open":
        const h = new Heading();
        h.level = token.markup.length;
        currentComponent = h;
        enterComponents.push(currentComponent);
        break;
      case "heading_close":
      case "paragraph_close":
        components.push(currentComponent);
        enterComponents.pop();
        currentComponent = null;
        break;
      case "inline":
        for (let child of token.children) {
          switch (child.type) {
            case "text":
              currentComponent?.appendChild(new CText(child.content));
              break;
            case "link_open":
              const link = new CLink();
              child.attrs?.forEach((attr) => {
                if (attr[0] == "href") {
                    link.href = attr[1];
                }
              });
              currentComponent = link;
              enterComponents.push(currentComponent);
              break;
            case "link_close":
              const linkClose = enterComponents.pop();
              currentComponent = enterComponents[enterComponents.length - 1] as
                | ContainerComponent
                | LeafComponent;
              currentComponent.appendChild(linkClose);
              break;
          }
        }
        break;
    }
  });
  return components;
}

function htmlToVNode() {}

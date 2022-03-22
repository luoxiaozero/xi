
import { LeafComponent } from "../../Component";
const reATXHeadingMarker = /^#{1,6}/;
export default class Heading extends LeafComponent {
  el: HTMLHeadingElement;
  level: number;
  constructor() {
    super();
  }
  beforeMount() {
    super.beforeMount();
  }
  mounted(el: HTMLElement) {
    this.el = document.createElement("h" + this.level) as HTMLHeadingElement;
    el.appendChild(this.el);
    this.el.appendChild(new Text("#".repeat(this.level) + " "));
    super.mounted(this.el);
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

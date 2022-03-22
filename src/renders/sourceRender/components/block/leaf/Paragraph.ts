import { LeafComponent } from "../../Component";

export default class Paragraph extends LeafComponent {
  constructor() {
    super();
  }
  beforeMount() {
    this.el = document.createElement("p");
    this.el.contentEditable = "true";
  }
  
  mounted(el: HTMLElement) {
    this.el = document.createElement("p");
    // this.el.contentEditable = "true";
    el.appendChild(this.el);
    super.mounted(this.el);
    this.el.addEventListener("keyup", () => {
      console.log(this.el);
    })
  }  
  keyupEvent() {
    
  }
  toMd(): string {
    let md = "";
    for (let c of this.children) {
        md += c.toMd() + '\n';
    }
    return md;
  }
}

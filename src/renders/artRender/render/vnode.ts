import { initCodeTool } from "../tool";
import VNode from "../../../node";

export default class VNodeRenderer {
    options: any;
    doc: HTMLElement;
    currentDom: HTMLElement;
    constructor(options) {
        this.options = options;
    }

    public render(ast: VNode, dom: HTMLElement) {
        let walker = ast.walker(),
            event: { entering: boolean; node: VNode; },
            type: string;

        this.doc = dom;
        this.currentDom = this.doc;

        let i = 0, childDom: HTMLElement;
        while ((event = walker.next())) {
            type = event.node.type;

            childDom = i++ < dom.childNodes.length ? <HTMLElement>dom.childNodes[i] : null;

            if (this[type]) {
                this[type](event.node, event.entering);
            }
        }
    }

    public text(node: VNode) {
        let dom = new Text(node._literal);
        this.currentDom.appendChild(dom);
    }

    public softbreak() {
        let dom = new Text("\n");
        this.currentDom.appendChild(dom);
    }

    public linebreak() {
        let dom = document.createElement("br");
        this.currentDom.appendChild(dom);
    }

    public link(node: VNode, entering: boolean) {
        if (entering) {
            let dom = document.createElement("a");
            this.attrs(node, dom);
            dom.href = node._destination

            if (node._title)
                dom.title = node._title;

            this.currentDom.appendChild(dom);
            this.currentDom = dom;
        } else {
            this.currentDom = this.currentDom.parentElement;
        }
    }

    public delete(node: VNode, entering: boolean) {
        if (entering) {
            let dom = document.createElement("del");
            this.attrs(node, dom);

            this.currentDom.appendChild(dom);
            this.currentDom = dom;
        } else {
            this.currentDom = this.currentDom.parentElement;
        }
    }

    public span(node: VNode, entering: boolean) {
        if (entering) {
            let dom = document.createElement("span");
            this.attrs(node, dom);

            this.currentDom.appendChild(dom);
            this.currentDom = dom;
        } else {
            this.currentDom = this.currentDom.parentElement;
        }
    }

    public image(node: VNode, entering) {
        if (entering) {
            let dom = document.createElement("img");
            this.attrs(node, dom);
            dom.src = node._destination;
            if (node._title)
                dom.title = dom.title;

            this.currentDom.appendChild(dom);
        } else {
            // this.currentDom = this.currentDom.parentElement;
        }
    }


    public emph(node: VNode, entering: boolean) {
        if (entering) {
            let dom = document.createElement("em");
            this.attrs(node, dom);

            this.currentDom.appendChild(dom);
            this.currentDom = dom;
        } else {
            this.currentDom = this.currentDom.parentElement;
        }
    }

    public strong(node, entering) {
        if (entering) {
            let dom = document.createElement("strong");
            this.attrs(node, dom);

            this.currentDom.appendChild(dom);
            this.currentDom = dom;
        } else {
            this.currentDom = this.currentDom.parentElement;
        }
    }

    public paragraph(node: VNode, entering: boolean) {
        if (entering) {
            let dom = document.createElement("p");
            this.attrs(node, dom);

            this.currentDom.appendChild(dom);
            this.currentDom = dom;
        } else {
            this.currentDom = this.currentDom.parentElement;
        }
    }

    public heading(node: VNode, entering: boolean) {
        if (entering) {
            let dom = document.createElement("h" + node._level);
            this.attrs(node, dom);

            this.currentDom.appendChild(dom);
            this.currentDom = dom;
        } else {
            this.currentDom = this.currentDom.parentElement;
        }
    }

    public code(node: VNode) {
        let dom = document.createElement("code");
        this.attrs(node, dom);

        dom.innerHTML = node._literal;
      
        this.currentDom.appendChild(dom);
    }

    public code_block(node: VNode) {
        var info_words = node._info ? node._info.split(/\s+/) : [];
            
    
        let tool = document.createElement("div");
        initCodeTool(tool);
        this.currentDom.appendChild(tool);

        let pre = document.createElement("pre");
        let code = document.createElement("code");

        if (info_words.length > 0 && info_words[0].length > 0) {
            code.setAttribute("class", "language-" + info_words[0]);
        }
        code.innerHTML = node._literal;

        pre.appendChild(code);
        this.currentDom.appendChild(pre);
    }

    public thematic_break(node: VNode): void {
        let dom = document.createElement("hr");
        this.attrs(node, dom);

        this.currentDom.appendChild(dom);
    }

    public block_quote(node: VNode, entering: boolean): void {
        if (entering) {
            let dom = document.createElement("blockquote");
            this.attrs(node, dom);

            this.currentDom.appendChild(dom);
            this.currentDom = dom;
        } else {
            this.currentDom = this.currentDom.parentElement;
        }
    }

    public list(node, entering) {
        if (entering) {
            let dom = document.createElement(node.listType === "bullet" ? "ul" : "ol");
            this.attrs(node, dom);

            this.currentDom.appendChild(dom);
            this.currentDom = dom;
        } else {
            this.currentDom = this.currentDom.parentElement;
        }
    }

    public item(node, entering) {
        if (entering) {
            let dom = document.createElement("li");
            this.attrs(node, dom);

            this.currentDom.appendChild(dom);
            this.currentDom = dom;
        } else {
            this.currentDom = this.currentDom.parentElement;
        }
    }

    private attrs(node: VNode, dom: HTMLElement): void {
        node.attrs.forEach( (value, key) => {
            dom.setAttribute(key, value);
        });
    }
}

import Parser from "../../../parser";
import VNode from "../../../node";

export default class InteractionParser {
    private parser: Parser;
    private doc: VNode;
    constructor(options) {
        this.parser = new Parser(options);
    }

    public heading(node: VNode, entering: boolean) {
        if (entering) {
            let span = new VNode("span");
            span.attrs.set("class", "art-meta art-hide");
            let text = new VNode("text");
            text._literal = "#".repeat(node._level) + " ";
            span.appendChild(text);
            node.firstChild.insertBefore(span);

            let md = node.getMd();
            md = md.replace(/\s/g, '-').replace(/\\|\/|#|\:/g, '');
            let a = new VNode('link');
            a.attrs.set('name', md);
            a.attrs.set('class', 'art-meta art-shield');
            node.firstChild.insertBefore(a);
        }
    }

    public link(node: VNode, entering: boolean) {
        if (entering) {
            let span = new VNode("span");
            span.attrs.set("class", "art-meta art-hide");
            let text = new VNode("text");
            text._literal = '[';
            span.appendChild(text);
            node.insertBefore(span);

            node.attrs.set("class", "art-text-double");

            span = new VNode("span");
            span.attrs.set("class", "art-meta art-hide");
            text = new VNode("text");
            text._literal = '](' + node._destination + ')';
            span.appendChild(text);
            node.insertAfter(span);
        }
    }

    public code(node: VNode, entering: boolean) {
        if (entering) {
            let span = new VNode("span");
            span.attrs.set("class", "art-meta art-hide");
            let text = new VNode("text");
            text._literal = '`';
            span.appendChild(text);
            node.insertBefore(span);

            node.attrs.set("class", "art-text-double");

            span = new VNode("span");
            span.attrs.set("class", "art-meta art-hide");
            text = new VNode("text");
            text._literal = '`';
            span.appendChild(text);
            node.insertAfter(span);
        }
    }

    public code_block(node: VNode, entering: boolean) {
        console.log("---------------------------")
        console.log(node, node._info)
        if (entering) {
            
        }
    }


    public emph(node: VNode, entering: boolean) {
        if (entering) {
            let art_mark = node.firstChild.type === 'strong' ? node.firstChild.attrs.get('art-marker') : node.attrs.get('art-marker');

            let span = new VNode("span");
            span.attrs.set("class", "art-meta art-hide");
            let text = new VNode("text");
            text._literal = art_mark;
            span.appendChild(text);
            node.insertBefore(span);

            node.attrs.set("class", "art-text-double");

            span = new VNode("span");
            span.attrs.set("class", "art-meta art-hide");
            text = new VNode("text");
            text._literal = art_mark;
            span.appendChild(text);
            node.insertAfter(span);
        }
    }

    public strong(node, entering) {
        if (entering) {
            let span = new VNode("span");
            span.attrs.set("class", "art-meta art-hide");
            let text = new VNode("text");
            text._literal = node.attrs.get('art-marker');
            span.appendChild(text);
            node.insertBefore(span);

            node.attrs.set("class", "art-text-double");

            span = new VNode("span");
            span.attrs.set("class", "art-meta art-hide");
            text = new VNode("text");
            text._literal = node.attrs.get('art-marker');
            span.appendChild(text);
            node.insertAfter(span);
        }
    }

    public delete(node, entering) {
        if (entering) {
            let span = new VNode("span");
            span.attrs.set("class", "art-meta art-hide");
            let text = new VNode("text");
            text._literal = node.attrs.get('art-marker');
            span.appendChild(text);
            node.insertBefore(span);

            node.attrs.set("class", "art-text-double");

            span = new VNode("span");
            span.attrs.set("class", "art-meta art-hide");
            text = new VNode("text");
            text._literal = node.attrs.get('art-marker');
            span.appendChild(text);
            node.insertAfter(span);
        }
    }

    private interactionParse() {
        let walker = this.doc.walker(),
            event: { entering: boolean; node: VNode; },
            type: string;

        let i = 0, childDom: HTMLElement;
        while ((event = walker.next())) {
            type = event.node.type;

            if (this[type]) {
                this[type](event.node, event.entering);
            }
        }
    }

    public parse(input: string): VNode {
        this.doc = this.parser.parse(input);
        this.interactionParse();

        return this.doc;
    }
}
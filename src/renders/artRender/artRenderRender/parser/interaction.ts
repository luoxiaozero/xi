import Parser from ".";
import VNode from "../node";

export default class InteractionParser {
    private parser: Parser;
    private doc: VNode;
    constructor(options) {
        this.parser = new Parser(options);
    }

    public heading(node: VNode, entering: boolean) {
        if (entering) {
            let span = new VNode("span");
            span.attrs.set("class", "art-hide");
            let text = new VNode("text");
            text.literal = "#".repeat(node.level) + " ";
            span.appendChild(text);
            node.firstChild.insertBefore(span);

            let md = node.getMd();
            md = md.replace(/\s/g, '-').replace(/\\|\/|#|\:/g, '');
            let a = new VNode('link');
            a.attrs.set('name', md);
            a.attrs.set('class', 'art-shield');
            node.firstChild.insertBefore(a);
        }
    }

    public link(node: VNode, entering: boolean) {
        if (entering) {
            let span = new VNode("span");
            span.attrs.set("class", "art-hide");
            let text = new VNode("text");
            text.literal = '[';
            span.appendChild(text);
            node.insertBefore(span);

            node.attrs.set("class", "art-text-double");

            span = new VNode("span");
            span.attrs.set("class", "art-hide");
            text = new VNode("text");
            text.literal = '](' + node.destination + ')';
            span.appendChild(text);
            node.insertAfter(span);
        }
    }

    public code(node: VNode, entering: boolean) {
        if (entering) {
            let span = new VNode("span");
            span.attrs.set("class", "art-hide");
            let text = new VNode("text");
            text.literal = '`';
            span.appendChild(text);
            node.insertBefore(span);

            node.attrs.set("class", "art-text-double");

            span = new VNode("span");
            span.attrs.set("class", "art-hide");
            text = new VNode("text");
            text.literal = '`';
            span.appendChild(text);
            node.insertAfter(span);
        }
    }

    public code_block(node: VNode, entering: boolean) {
        if (entering) {
            
        }
    }


    public emph(node: VNode, entering: boolean) {
        if (entering) {
            let art_mark = node.firstChild.type === 'strong' ? node.firstChild.attrs.get('art-mark') : node.attrs.get('art-mark');

            let span = new VNode("span");
            span.attrs.set("class", "art-hide");
            let text = new VNode("text");
            text.literal = art_mark;
            span.appendChild(text);
            node.insertBefore(span);

            node.attrs.set("class", "art-text-double");

            span = new VNode("span");
            span.attrs.set("class", "art-hide");
            text = new VNode("text");
            text.literal = art_mark;
            span.appendChild(text);
            node.insertAfter(span);
        }
    }

    public strong(node, entering) {
        if (entering) {
            let span = new VNode("span");
            span.attrs.set("class", "art-hide");
            let text = new VNode("text");
            text.literal = node.attrs.get('art-mark');
            span.appendChild(text);
            node.insertBefore(span);

            node.attrs.set("class", "art-text-double");

            span = new VNode("span");
            span.attrs.set("class", "art-hide");
            text = new VNode("text");
            text.literal = node.attrs.get('art-mark');
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
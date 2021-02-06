import Parser from "@/parser";
import VNode from "@/node";

export default class InteractionParser {
    public parser: Parser;
    constructor(options) {
        this.parser = new Parser(options);
    }

    public image(node: VNode, entering: boolean) {
        if (entering) {
            let span = new VNode("span");
            span.attrs.set("class", "art-meta art-hide");
            let text = new VNode("text");
            text._literal = "![" + node.firstChild._literal;
            text._literal += "](" + node._destination;
            if (node._title)
                text._literal += "\"" + node._title + "\"";

            text._literal += ")";
            span.appendChild(text);
            node.insertBefore(span);

            node.attrs.set("contenteditable", "false");
        }

    }

    public heading(node: VNode, entering: boolean) {
        if (entering) {
            let span = new VNode("span");
            span.attrs.set("class", "art-meta art-hide");
            let text = new VNode("text");
            text._literal = "#".repeat(node._level) + " ";
            span.appendChild(text);
            node.prependChild(span);

            let md = node.getMd();
            md = md.replace(/\s/g, '-').replace(/\\|\/|#|\:/g, '');
            let a = new VNode('link');
            a.attrs.set('name', md);
            a.attrs.set('class', 'art-meta art-shield');
            node.prependChild(a);
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
        if (entering) {
            let art_tool = new VNode("art_tool");
            art_tool.attrs.set("--tool", "code_block");
            node.insertBefore(art_tool);

            let info_words = node._info ? node._info.split(/\s+/) : [];
            if (info_words.length > 0 && info_words[0].length > 0) {
                switch (info_words[0]) {
                    case "flow":
                    case "mermaid":
                        let art_tool = new VNode("art_tool");
                        art_tool.attrs.set("--tool", "code_block_" + info_words[0]);
                        node.insertAfter(art_tool);
                        break;
                    default:
                        console.log("InteractionParser:" + info_words[0]);
                }

            }
        } else {

        }
    }


    public emph(node: VNode, entering: boolean) {
        if (entering) {
            if (node.firstChild.type === "strong")
                return;
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

    public strong(node: VNode, entering: boolean) {
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

    public delete(node: VNode, entering: boolean) {
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

    public interactionParse(ast: VNode) {
        let walker = ast.walker(),
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
        let doc = this.parser.parse(input);
        this.interactionParse(doc);

        return doc;
    }

    public inlineParse(input: string): VNode {
        let doc = new VNode("paragraph");
        doc._string_content = input;
        this.parser.inlineParser.parse(doc);
        this.interactionParse(doc);

        return doc;
    }
}

import { escapeXml } from "../parser/common";
import VNode  from "../node";
import Renderer from "./renderer";

var reUnsafeProtocol = /^javascript:|vbscript:|file:|data:/i;
var reSafeDataProtocol = /^data:image\/(?:png|gif|jpeg|webp)/i;

var potentiallyUnsafe = function (url) {
    return reUnsafeProtocol.test(url) && !reSafeDataProtocol.test(url);
};

export default class HtmlRenderer extends Renderer {
    disableTags: number;
    options: any;
    constructor(options) {
        super();
        options = options || {};
        // by default, soft breaks are rendered as newlines in HTML
        options.softbreak = options.softbreak || "\n";
        // set to "<br />" to make them hard breaks
        // set to " " if you want to ignore line wrapping in source

        this.disableTags = 0;
        this.lastOut = "\n";
        this.options = options;

    }
/* Node methods */
    public text(node: VNode) {
        this.out(node.literal);
    }

    public html_inline(node) {
        if (this.options.safe) {
            this.lit("<!-- raw HTML omitted -->");
        } else {
            this.lit(node.literal);
        }
    }

    public html_block(node) {
        this.cr();
        if (this.options.safe) {
            this.lit("<!-- raw HTML omitted -->");
        } else {
            this.lit(node.literal);
        }
        this.cr();
    }

    public softbreak() {
        this.lit(this.options.softbreak);
    }
   
    public linebreak() {
        this.tag("br", [], true);
        this.cr();
    }
    
    public link(node, entering) {
        var attrs = this.attrs(node);
        if (entering) {
            if (!(this.options.safe && potentiallyUnsafe(node.destination))) {
                attrs.push(["href", this.esc(node.destination)]);
            }
            if (node.title) {
                attrs.push(["title", this.esc(node.title)]);
            }
            this.tag("a", attrs);
        } else {
            this.tag("/a");
        }
    }

    public image(node, entering) {
        if (entering) {
            if (this.disableTags === 0) {
                if (this.options.safe && potentiallyUnsafe(node.destination)) {
                    this.lit('<img src="" alt="');
                } else {
                    this.lit('<img src="' + this.esc(node.destination) + '" alt="');
                }
            }
            this.disableTags += 1;
        } else {
            this.disableTags -= 1;
            if (this.disableTags === 0) {
                if (node.title) {
                    this.lit('" title="' + this.esc(node.title));
                }
                this.lit('" />');
            }
        }
    }


    public emph(node, entering) {
        this.tag(entering ? "em" : "/em");
    }
    
    public strong(node, entering) {
        this.tag(entering ? "strong" : "/strong");
    }
    
    public paragraph(node: VNode, entering) {
        var grandparent = node.parent.parent,
            attrs = this.attrs(node);
        if (grandparent !== null && grandparent.type === "list") {
            if (grandparent.listTight) {
                return;
            }
        }
        if (entering) {
            this.cr();
            this.tag("p", attrs);
        } else {
            this.tag("/p");
            this.cr();
        }
    }
    
    public heading(node, entering) {
        var tagname = "h" + node.level,
            attrs = this.attrs(node);
        if (entering) {
            this.cr();
            this.tag(tagname, attrs);
        } else {
            this.tag("/" + tagname);
            this.cr();
        }
    }
    
    public code(node) {
        this.tag("code");
        this.out(node.literal);
        this.tag("/code");
    }
    
    public code_block(node) {
        var info_words = node.info ? node.info.split(/\s+/) : [],
            attrs = this.attrs(node);
        if (info_words.length > 0 && info_words[0].length > 0) {
            attrs.push(["class", "language-" + this.esc(info_words[0])]);
        }
        this.cr();
        this.tag("pre");
        this.tag("code", attrs);
        this.out(node.literal);
        this.tag("/code");
        this.tag("/pre");
        this.cr();
    }
    
    public thematic_break(node) {
        var attrs = this.attrs(node);
        this.cr();
        this.tag("hr", attrs, true);
        this.cr();
    }
    
    public block_quote(node, entering) {
        var attrs = this.attrs(node);
        if (entering) {
            this.cr();
            this.tag("blockquote", attrs);
            this.cr();
        } else {
            this.cr();
            this.tag("/blockquote");
            this.cr();
        }
    }
    
    public list(node, entering) {
        var tagname = node.listType === "bullet" ? "ul" : "ol",
            attrs = this.attrs(node);
    
        if (entering) {
            var start = node.listStart;
            if (start !== null && start !== 1) {
                attrs.push(["start", start.toString()]);
            }
            this.cr();
            this.tag(tagname, attrs);
            this.cr();
        } else {
            this.cr();
            this.tag("/" + tagname);
            this.cr();
        }
    }
    
    public item(node, entering) {
        var attrs = this.attrs(node);
        if (entering) {
            this.tag("li", attrs);
        } else {
            this.tag("/li");
            this.cr();
        }
    }

    public custom_inline(node, entering) {
        if (entering && node.onEnter) {
            this.lit(node.onEnter);
        } else if (!entering && node.onExit) {
            this.lit(node.onExit);
        }
    }
    
    public custom_block(node, entering) {
        this.cr();
        if (entering && node.onEnter) {
            this.lit(node.onEnter);
        } else if (!entering && node.onExit) {
            this.lit(node.onExit);
        }
        this.cr();
    }

    public esc(s: string): string {
        return escapeXml(s);
    }

    /* Helper methods */
    public out(s) {
        this.lit(this.esc(s));
    }


    // Helper function to produce an HTML tag.
    public tag(name, attrs=null, selfclosing=null) {
        if (this.disableTags > 0) {
            return;
        }
        this.buffer += "<" + name;
        if (attrs && attrs.length > 0) {
            var i = 0;
            var attrib;
            while ((attrib = attrs[i]) !== undefined) {
                this.buffer += " " + attrib[0] + '="' + attrib[1] + '"';
                i++;
            }
        }
        if (selfclosing) {
            this.buffer += " /";
        }
        this.buffer += ">";
        this.lastOut = ">";
    }

    public attrs(node) {
        var att = [];
        if (this.options.sourcepos) {
            var pos = node.sourcepos;
            if (pos) {
                att.push([
                    "data-sourcepos",
                    String(pos[0][0]) +
                    ":" +
                    String(pos[0][1]) +
                    "-" +
                    String(pos[1][0]) +
                    ":" +
                    String(pos[1][1])
                ]);
            }
        }
        return att;
    }
}


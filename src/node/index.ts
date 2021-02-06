import ArtRender from "@/renders/artRender";
import Cursor from "@/renders/artRender/cursor";
import createCodeBlockTool from "@/renders/artRender/tool/codeBlockTool";

class NodeWalker {
    current: VNode;
    root: VNode;
    entering: boolean;
    selfFalg: boolean;
    constructor(root: VNode, selfFalg: boolean = false) {
        this.current = root;
        this.root = root;
        this.entering = true;
        this.selfFalg = selfFalg;
    }

    public next() {
        var cur = this.current;
        var entering = this.entering;

        if (cur === null) {
            return null;
        }

        var container = VNode.isContainer(cur);

        if (entering && container) {
            if (cur.firstChild) {
                this.current = cur.firstChild;
                this.entering = true;
            } else {
                // stay on node but exit
                this.entering = false;
            }
        } else if (cur === this.root) {
            this.current = null;
        } else if (cur.next === null) {
            this.current = cur.parent;
            this.entering = false;
        } else {
            this.current = cur.next;
            this.entering = true;
        }

        if (this.selfFalg && cur === this.root)
            return this.next();

        return { entering: entering, node: cur };
    }

    public resumeAt(node: VNode, entering: boolean) {
        this.current = node;
        this.entering = entering === true;
    };
}

export default class VNode {
    private _type: string;
    _parent: VNode;
    private _firstChild: VNode;
    private _lastChild: VNode;
    _prev: VNode;
    _next: VNode;
    public _lastLineChecked: boolean;
    private _sourcepos: any;
    public _lastLineBlank: boolean;
    public _open: boolean;
    public _string_content: string;
    public _literal: string;
    public _listData: { type: string, tight, start: number, delimiter, markerOffset, padding, bulletChar };
    public _info: any;
    public _destination: any;
    public _title: any;
    public _isFenced: boolean;
    public _fenceChar: any;
    public _fenceLength: number;
    public _fenceOffset: any;
    public _level: number;
    public _onEnter: any;
    public _onExit: any;
    _htmlBlockType: any;
    attrs: Map<string, string>;
    dom: HTMLElement | Text;
    constructor(nodeType: string, sourcepos = null) {
        this._type = nodeType;
        this._parent = null;
        this._firstChild = null;
        this._lastChild = null;
        this._prev = null;
        this._next = null;
        this._sourcepos = sourcepos;
        this._lastLineBlank = false;
        this._lastLineChecked = false;
        this._open = true;
        this._string_content = null;
        this._literal = null;
        this._listData = { type: '', tight: '', start: null, delimiter: '', markerOffset: '', padding: '', bulletChar: "" };
        this._info = null;
        this._destination = null;
        this._title = null;
        this._isFenced = false;
        this._fenceChar = null;
        this._fenceLength = 0;
        this._fenceOffset = null;
        this._level = null;
        this._onEnter = null;
        this._onExit = null;
        this.attrs = new Map();
        this.dom = null;
    }

    public get type() {
        return this._type;
    }

    public get firstChild() {
        return this._firstChild;
    }

    public get lastChild() {
        return this._lastChild;
    }

    public get next(): VNode {
        return this._next;
    }

    public get prev() {
        return this._prev;
    }

    public get parent() {
        return this._parent;
    }

    public get sourcepos() {
        return this._sourcepos;
    }

    public get listType() {
        return this._listData.type;
    }

    public set listType(t) {
        this._listData.type = t;
    }

    public get listTight() {
        return this._listData.tight;
    }

    public set listTight(t) {
        this._listData.tight = t;
    }

    public get listStart() {
        return this._listData.start;
    }

    public set listStart(n) {
        this._listData.start = n;
    }

    public get listDelimiter() {
        return this._listData.delimiter;
    }
    public set listDelimiter(delim) {
        this._listData.delimiter = delim;
    }

    updateDom() {
        if (!this.dom)
            this.newDom();

        let child = this.firstChild;
        while (child) {
            if (!child)
                child.newDom();

            child = child.next;
        }
    }

    newDom(): Function {
        let nodeName: string;
        switch (this._type) {
            case "text":
                if (this.parent._type === "link")
                    (<HTMLElement>this.parent.dom).setAttribute("alt", this._literal);

                this.dom = new Text(this._literal);
                return null;
            case "softbreak":
                this.dom = new Text("\n");
                return null;
            case "code":
                this.dom = document.createElement("code");
                this.setAttrs();
                this.dom.innerHTML = this._literal;
                return null;
            case "linebreak":
                this.dom = document.createElement("br");
                return null;
            case "thematic_break":
                this.dom = document.createElement("hr");
                return null;
            case "art_tool":
                this.dom = document.createElement("div");
                let tool = this.attrs.get('--tool');
                if (tool === "code_block") {
                    let info_words = this.next._info ? this.next._info.split(/\s+/) : [];
                    if (info_words.length > 0 && info_words[0].length > 0)
                        createCodeBlockTool(this.dom, info_words[0]);
                    else
                        createCodeBlockTool(this.dom);
                } //else if (tool == "math") {

                // } else if (tool == "toc") {

                // } else if (tool == "table") {

                // } 
                else if (tool == "code_block_flow") {
                    this.dom.setAttribute("class", "art-meta art-shield art-codeBlockBottomTool");
                    this.dom.setAttribute("contenteditable", "false");

                    if (ArtRender.plugins.flowchart) {
                        let dom = this.dom, mdText = this.prev._literal;
                        let fun = () => { console.log("flowchar 执行"); ArtRender.plugins.flowchart(dom, mdText); };
                        return fun;
                    }
                } else if (tool == "code_block_mermaid") {
                    this.dom.setAttribute("class", "art-meta art-shield art-codeBlockBottomTool");
                    this.dom.setAttribute("contenteditable", "false");

                    if (ArtRender.plugins.mermaid) {
                        let dom = this.dom, mdText = this.prev._literal;
                        let fun = () => { console.log("mermaid 执行"); ArtRender.plugins.mermaid(dom, mdText); };
                        return fun;
                    }
                }
                return null;
            case "link":
                this.dom = document.createElement("a");
                (<HTMLAnchorElement>this.dom).href = this._destination;
                if (this._title)
                    this.dom.title = this._title;
                break;
            case "image":
                this.dom = document.createElement("img");
                (<HTMLImageElement>this.dom).src = this._destination;
                if (this._title)
                    this.dom.title = this._title;
                break;
            case "code_block":
                this.dom = document.createElement("pre");
                let code = document.createElement("code");

                let lang, md = this._literal;
                let info_words = this._info ? this._info.split(/\s+/) : [];
                if (info_words.length > 0 && info_words[0].length > 0) {
                    code.setAttribute("class", "lang-" + info_words[0]);
                    lang = info_words[0].match(/lang-(.*?)(\s|$)/);
                }
                if (ArtRender.plugins.hljs) {
                    ArtRender.plugins.hljs(code, md, lang);
                } else {
                    code.innerHTML = md;
                }
                this.dom.appendChild(code);
                break;
            default:
                switch (this._type) {
                    case "heading":
                        nodeName = "h" + this._level;
                        break;
                    case "paragraph":
                        nodeName = "p";
                        break;
                    case "delete":
                        nodeName = "del";
                        break;
                    case "emph":
                        nodeName = "em";
                        break;
                    case "block_quote":
                        nodeName = "blockquote";
                        break;
                    case "list":
                        nodeName = this.listType === "bullet" ? "ul" : "ol";
                        break;
                    case "item":
                        nodeName = "li";
                        break;
                    default:
                        nodeName = this._type;
                }

                this.dom = document.createElement(nodeName);
        }

        if (VNode.isContainer(this)) {
            this.setAttrs();

            let child = this.firstChild, fun: Function;
            while (child) {
                fun = child.newDom();
                this.dom.appendChild(child.dom);
                if (fun)
                    fun();
                child = child.next;
            }
        }
        return null;
    }

    private setAttrs() {
        this.attrs.forEach((value, key) => {
            (<HTMLElement>this.dom).setAttribute(key, value);
        });
    }

    public static isBlock(node: VNode) {
        switch (node._type) {
            case "document":
            case "block_quote":
            case "list":
            case "paragraph":
            case "heading":
            case "custom_block":
                return true;
            default:
                return false;
        }
    }

    public static isContainer(node: VNode) {
        switch (node._type) {
            case "document":
            case "block_quote":
            case "list":
            case "item":
            case "paragraph":
            case "heading":
            case "emph":
            case "strong":
            case "link":
            case "image":
            case "span":
            case "delete":
            case "custom_inline":
            case "custom_block":
                return true;
            default:
                return false;
        }
    }

    /**向最后添加孩子节点 */
    public appendChild(child: VNode) {


        child.unlink();
        child._parent = this;
        if (this._lastChild) {
            this._lastChild._next = child;
            child._prev = this._lastChild;
            this._lastChild = child;
        } else {
            this._firstChild = child;
            this._lastChild = child;
        }
    }

    /**向最前添加孩子节点 */
    public prependChild(child: VNode) {
        child.unlink();
        child._parent = this;
        if (this._firstChild) {
            this._firstChild._prev = child;
            child._next = this._firstChild;
            this._firstChild = child;
        } else {
            this._firstChild = child;
            this._lastChild = child;
        }
    }

    /**拆开节点 */
    public unlink() {
        if (this._prev) {
            this._prev._next = this._next;
        } else if (this._parent) {
            this._parent._firstChild = this._next;
        }
        if (this._next) {
            this._next._prev = this._prev;
        } else if (this._parent) {
            this._parent._lastChild = this._prev;
        }
        this._parent = null;
        this._next = null;
        this._prev = null;
    }

    /**替换该节点 */
    public replace(sibling: VNode) {
        sibling.unlink();

        sibling._parent = this._parent;
        if (this._prev) {
            sibling._prev = this._prev;
            this._prev._next = sibling;
        } else
            sibling._parent._firstChild = sibling;

        if (this._next) {
            sibling._next = this._next;
            this._next._prev = sibling;
        } else
            sibling._parent._lastChild = sibling;

        this._parent = null;
        this._next = null;
        this._prev = null;
    }

    /**插入之后 */
    public insertAfter(sibling: VNode) {
        sibling.unlink();
        sibling._next = this._next;
        if (sibling._next) {
            sibling._next._prev = sibling;
        }
        sibling._prev = this;
        this._next = sibling;
        sibling._parent = this._parent;
        if (!sibling._next) {
            sibling._parent._lastChild = sibling;
        }
    }

    /**插入之前 */
    public insertBefore(sibling: VNode) {
        sibling.unlink();
        sibling._prev = this._prev;
        if (sibling._prev) {
            sibling._prev._next = sibling;
        }
        sibling._next = this;
        this._prev = sibling;
        sibling._parent = this._parent;
        if (!sibling._prev) {
            sibling._parent._firstChild = sibling;
        }
    }

    public walker(selfFalg?: boolean): NodeWalker {
        return new NodeWalker(this, selfFalg);
    }

    public getMd(layer: number = 0): string {
        layer += 1;
        let md = "", node = this._firstChild;
        switch (this._type) {
            case "text":
                return this._literal;
            case "softbreak":
                return "\n";
            case "thematic_break":
                return this.attrs.get("art-marker") + "\n";
            case "code":
                return this._literal;
            case "code_block":
                md += "```" + this._info + "\n";
                md += this._literal;
                md += "\n```\n"
                return md;
            case "item":
                if (this.parent.firstChild !== this) {
                    md += "  ".repeat(layer / 2 - 1);
                }

                if (this._listData.type === "ordered")
                    md += this._listData.start + ". " + node.getMd(layer);
                else
                    md += this._listData.bulletChar + " " + node.getMd(layer);
                return md;
            case "block_quote":
                while (node) {
                    md += "> " + node.getMd(layer);
                    node = node._next;
                }
                return md;
            default:
                if (VNode.isContainer(this)) {
                    while (node) {
                        md += node.getMd(layer);
                        node = node._next;
                    }
                }

                if (this.type === "list") {
                    if (this.parent.type === "document")
                        md += "\n";
                } else if (VNode.isBlock(this)) {
                    md += "\n";
                }

                return md;
        }
    }

    public getText(): string {
        if (this.attrs.has("class") && /art\-meta/.test(this.attrs.get("class")))
            return "";
        else if (this._type === "text")
            return this._literal;

        let md = "", node: VNode = this._firstChild;
        while (node) {
            md += node.getText();
            node = node._next;
        }
        return md;
    }
}

/* Example of use of walker:

 var walker = w.walker();
 var event;

 while (event = walker.next()) {
 console.log(event.entering, event.node.type);
 }

 */

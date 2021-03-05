import ArtRender from "@/renders/artRender";
import Cursor from "@/renders/artRender/cursor";
import createCodeBlockTool from "@/renders/artRender/tool/codeBlockTool";
import createMathBlockTool from "@/renders/artRender/tool/mathBlockTool";
import createTableTool from "@/renders/artRender/tool/tableTool";

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

    /**dom为空时, 新建 */
    setDom(): Function {
        if (this.dom == null)
            return this.newDom();

        return null;
    }

    /**新建dom值 */
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
                this.dom = document.createElement("div");
                this.dom.setAttribute("class", "art-md-hr");
                this.dom.appendChild(document.createElement("hr"));
                return null;
            case "art_tool":
                this.dom = document.createElement("div");
                let tool = this.attrs.get('--tool');

                //else if (tool == "math") {

                // } else if (tool == "toc") {

                if (tool === "math") {
                    this.dom = document.createElement("span");
                    this.dom.setAttribute("contenteditable", "false");
                    this.dom.setAttribute("class", "art-shield");
                    this.dom.style.position = "relative";
                    this.dom.onclick = function () {
                        Cursor.setCursor((this as HTMLSpanElement).nextSibling, 0);
                    }
                    if (ArtRender.plugins.katex) {
                        let dom = this.dom, mdText = this.attrs.get("--math");
                        let fun = () => ArtRender.plugins.katex(dom, mdText);
                        let cla = this._next.attrs.get("class");
                        cla += " art-hide";
                        this._next.attrs.set("class", cla);
                        return fun
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
                this.dom = document.createElement("div");
                this.dom.setAttribute("class", "art-md-CodeBlock");
                this.dom.setAttribute("contenteditable", "false");

                let info_words = this._info ? this._info.split(/\s+/) : [], lang = '', dom: HTMLElement, code = document.createElement("code");
                if (info_words.length > 0 && info_words[0].length > 0) {
                    code.setAttribute("class", "lang-" + info_words[0]);
                    lang = info_words[0];
                    // lang = info_words[0].match(/lang-(.*?)(\s|$)/);
                }

                dom = document.createElement("div");
                createCodeBlockTool(dom, lang);
                this.dom.appendChild(dom);

                dom = document.createElement("pre");
                dom.setAttribute("contenteditable", "true");
                dom.style.outline = "none";
                dom.appendChild(code);
                this.dom.appendChild(dom);
                let mdText = this._literal;
                if (ArtRender.plugins.hljs) {
                    ArtRender.plugins.hljs(code, mdText, lang);
                } else {
                    code.innerHTML = mdText;
                }

                switch (lang) {
                    case "flow":
                        dom = document.createElement("div");
                        dom.setAttribute("class", "art-meta art-shield art-codeBlockBottomTool");
                        this.dom.appendChild(dom);

                        if (ArtRender.plugins.flowchart) {
                            let fun = () => ArtRender.plugins.flowchart(dom, mdText);
                            return fun;
                        }
                        break;
                    case "mermaid":
                        dom = document.createElement("div");
                        dom.setAttribute("class", "art-meta art-shield art-codeBlockBottomTool");
                        this.dom.appendChild(dom);

                        if (ArtRender.plugins.mermaid) {
                            let fun = () => ArtRender.plugins.mermaid(dom, mdText);;
                            return fun;
                        }
                        break;
                    default:
                        console.log("InteractionParser:" + info_words[0]);
                }
                break;
            case "math":
                this.dom = document.createElement("span");
                break;
            case "math_block":
                this.dom = document.createElement("div");
                this.dom.setAttribute("contenteditable", "false");
                this.dom.setAttribute("class", "art-md-math-block");

                let main_div = document.createElement("div");
                main_div.setAttribute("class", "art-md-math-block-main")

                let math_tool = document.createElement("div");
                createMathBlockTool(math_tool, "start");
                main_div.appendChild(math_tool);

                let pre = document.createElement("pre");
                pre.setAttribute("contenteditable", "true");

                pre.style.outline = "none";
                pre.innerText = this._literal;

                pre.onblur = function () {
                    if (ArtRender.plugins.katex) {
                        let mdText = (this as HTMLSpanElement).innerText;
                        ArtRender.plugins.katex(((this as HTMLSpanElement).parentElement.nextElementSibling as HTMLDivElement), mdText);
                        (this as HTMLSpanElement).parentElement.style.display = "none";
                    }
                }
                main_div.appendChild(pre);
                math_tool = document.createElement("div");
                createMathBlockTool(math_tool, "end");
                main_div.appendChild(math_tool);
                this.dom.appendChild(main_div);

                let div = document.createElement("div");
                div.style.textAlign = "center";
                div.onclick = function () {
                    ((this as HTMLSpanElement).previousSibling as HTMLDivElement).style.display = "block";
                    Cursor.setCursor(((this as HTMLSpanElement).previousSibling as HTMLDivElement).childNodes[0], 0)
                }

                if (ArtRender.plugins.katex) {
                    main_div.style.display = "none";
                    let mdText = this._literal;
                    ArtRender.plugins.katex(div, mdText);
                } else {
                    main_div.style.display = "block";
                }


                this.dom.appendChild(div);
                break;
            case "item_checkbox":
                this.dom = document.createElement("input");
                this.setAttrs();
                break;
            case "html_inline":
                this.dom = document.createElement("span");
                this.setAttrs();
                this.dom.style.color = "#999";
                this.dom.innerText = this._literal;
                break;
            case "html_block":
                this.dom = document.createElement("div");
                this.dom.setAttribute("contenteditable", "false");

                div = document.createElement("div");
                div.setAttribute("class", "art-md-html-block-main")
                div.style.display = "none";
                pre = document.createElement("pre");
                pre.setAttribute("contenteditable", "true");
                pre.style.outline = "none";

                pre.innerText = this._literal;
                pre.onblur = function () {
                    (this as HTMLSpanElement).parentElement.style.display = "none";
                    ((this as HTMLSpanElement).parentElement.nextElementSibling as HTMLDivElement).style.display = "block";
                    ((this as HTMLSpanElement).parentElement.nextElementSibling as HTMLDivElement).innerHTML = (this as HTMLSpanElement).innerText;
                }
                div.appendChild(pre);
                this.dom.appendChild(div);

                div = document.createElement("div");
                div.onclick = function () {
                    (this as HTMLSpanElement).style.display = "none";
                    ((this as HTMLSpanElement).previousSibling as HTMLDivElement).style.display = "block";
                    Cursor.setCursor(((this as HTMLSpanElement).previousSibling as HTMLDivElement), 0)
                }
                div.innerHTML = this._literal;


                this.dom.appendChild(div);
                break;
            case "table":
                this.dom = document.createElement("div");
                this.dom.setAttribute("class", "art-md-Table");

                dom = document.createElement("div");
                this.dom.appendChild(dom);
                createTableTool(dom);

                dom = document.createElement("table");

                this.dom.appendChild(dom);
                this.attrs.forEach((value, key) => {
                    (<HTMLElement>dom).setAttribute(key, value);
                });

                let child = this.firstChild, fun: Function;
                while (child) {
                    fun = child.newDom();
                    dom.appendChild(child.dom);
                    if (fun)
                        fun();
                    child = child.next;
                }
                
                return null;
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
            case "table":
            case "thead":
            case "tbody":
            case "tr":
            case "th":
            case "td":
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
            case "math":
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

    public getMd(): string {
        let md = "", node = this._firstChild;
        switch (this._type) {
            case "html_inline":
            case "text":
                return this._literal;
            case "html_block":
                return this._literal + "\n";
            case "softbreak":
                return "\n";
            case "thematic_break":
                return this.attrs.get("art-marker") + "\n";
            case "code":
                return this._literal;
            case "code_block":
                md += "```" + this._info + "\n";
                md += this._literal;
                md += "```\n"
                return md;
            case "math_block":
                md += "$$\n";
                md += this._literal;
                md += "$$\n"
                return md;
            case "table":
                let child = this.firstChild.firstChild.firstChild, mat, tableStr = "", child_2: VNode;
                md += '|';
                tableStr += "|";
                while (child) {
                    md += child.getMd() + '|';
                    if (child.attrs.has("style") && (mat = child.attrs.get("style").match(/text-align:\s*?(left|center|right)/))) {
                        switch (mat[1]) {
                            case 'center': tableStr += ':---:|'; break;
                            case 'left': tableStr += ':---|'; break;
                            case 'right': tableStr += '---:|'; break;
                            default: tableStr += ':---:'; break;
                        }
                    } else {
                        tableStr += '---|';
                    }
                    child = child.next;
                }
                md += "\n" + tableStr + "\n";

                child = this.lastChild.firstChild, mat;
                while (child) {
                    child_2 = child.firstChild;
                    md += '|';
                    while (child_2) {
                        md += child_2.getMd() + '|';
                        child_2 = child_2.next;
                    }
                    md += "\n";
                    child = child.next;
                }
                return md;
            case "item":
                let str: string, spaceNumbar = "", flag = true;
                child = this.parent;
                while (child) {
                    if (child.type === "list") {
                        if (child._listData.type === "ordered") {
                            spaceNumbar += "   ";
                        } else {
                            spaceNumbar += "  ";
                        }
                    } else if (child.type !== "item") {
                        break;
                    }
                    child = child.parent;
                }

                if (this._listData.type === "ordered") {
                    md += this._listData.start + ". ";
                } else {
                    md += this._listData.bulletChar + " ";
                }

                while (node) {
                    switch (node.type) {
                        case "list":
                        case "block_quote":
                        case "paragraph":
                            str = node.getMd();
                            let strs = str.substring(0, str.length - 1).split("\n");
                            for (let i = 0; i < strs.length; i++) {
                                if (flag) {
                                    md += strs[i] + "\n";
                                    flag = false;
                                } else {
                                    md += spaceNumbar + strs[i] + "\n"
                                }
                            }
                            break;
                        default:
                            md += node.getMd();
                    }
                    node = node._next;
                }
                return md;
            case "item_checkbox":
                if (this.attrs.has("checked")) {
                    md += "[x] ";
                } else {
                    md += "[ ] ";
                }
                return md;
            case "block_quote":
                while (node) {
                    switch (node.type) {
                        case "list":
                        case "block_quote":
                        case "paragraph":
                            str = node.getMd();
                            let strs = str.substring(0, str.length - 1).split("\n");
                            strs.forEach(value => md += "> " + value + "\n");
                            break;
                        default:
                            md += "> " + node.getMd();
                    }
                    node = node._next;
                }
                return md;
            default:
                if (VNode.isContainer(this)) {
                    while (node) {
                        md += node.getMd();
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

    isEqual(node: VNode): boolean {
        if (node.type != this._type)
            return false;

        switch (this._type) {
            case "text":
                if (this._literal != node._literal)
                    return false;
                break;
        }
        return true;
    }
}

/* Example of use of walker:

 var walker = w.walker();
 var event;

 while (event = walker.next()) {
 console.log(event.entering, event.node.type);
 }

 */

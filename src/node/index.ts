class NodeWalker{
    current: VNode;
    root: any;
    entering: boolean;
    constructor(root) {
        this.current = root;
        this.root = root;
        this.entering = true;
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
    
        return { entering: entering, node: cur };
    }

    public resumeAt(node, entering) {
        this.current = node;
        this.entering = entering === true;
    };
}

export default class VNode{
    private _type: string;
    private _parent: VNode;
    private _firstChild: VNode;
    private _lastChild: VNode;
    private _prev: any;
    private _next: any;
    public _lastLineChecked: boolean;
    private _sourcepos: any;
    public _lastLineBlank: boolean;
    public _open: boolean;
    public _string_content: string;
    public _literal: any;
    public _listData: {type , tight, start, delimiter};
    public _info: any;
    public _destination: any;
    public _title: any;
    public _isFenced: boolean;
    public _fenceChar: any;
    public _fenceLength: number;
    public _fenceOffset: any;
    public _level: any;
    public _onEnter: any;
    public _onExit: any;
    _htmlBlockType: any;
    attrs: Map<string, string>;
    constructor(nodeType: string, sourcepos=null) {
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
        this._listData = {type: '', tight: '', start: '', delimiter: ''};
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

    public get next() {
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

    public insertAfter(sibling) {
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

    public insertBefore(sibling) {
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

    public walker(): NodeWalker {
        return new NodeWalker(this);
    }

    public getMd(): string {
        return '';
    }
}

/* Example of use of walker:

 var walker = w.walker();
 var event;

 while (event = walker.next()) {
 console.log(event.entering, event.node.type);
 }

 */

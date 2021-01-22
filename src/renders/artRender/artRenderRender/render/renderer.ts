import VNode from "../node";

export default class Renderer {
    buffer: any;
    lastOut: any;
    constructor() {
    }

    /**
     *  Walks the AST and calls member methods for each Node type.
     *  遍历AST并调用每个节点类型的成员方法。
     *  @param ast {Node} The root of the abstract syntax tree.
     */
    public render(ast: VNode) {
        let walker = ast.walker(),
            event: { entering: boolean; node: VNode; },
            type: string;
            
        this.buffer = "";
        this.lastOut = "\n";

        while ((event = walker.next())) {
            type = event.node.type;
            if (this[type]) {
                this[type](event.node, event.entering);
            }
        }
        return this.buffer;
    }

    /**
     *  Concatenate a literal string to the buffer.
     *
     *  @param str {String} The string to concatenate.
     */
    public lit(str: string) {
        this.buffer += str;
        this.lastOut = str;
    }

    /**
    *  Output a newline to the buffer.
     */
    public cr() {
        return;
        if (this.lastOut !== "\n") {
            this.lit("\n");
        }
    }

    /**
 *  Concatenate a string to the buffer possibly escaping the content.
 *
 *  Concrete renderer implementations should override this method.
 *
 *  @param str {String} The string to concatenate.
 */
    public out(str) {
        this.lit(str);
    }

    /**
 *  Escape a string for the target renderer.
 *
 *  Abstract function that should be implemented by concrete
 *  renderer implementations.
 *
 *  @param str {String} The string to escape.
 */
    public esc(str) {
        return str;
    }
}










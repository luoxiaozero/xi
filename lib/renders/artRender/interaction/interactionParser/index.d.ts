import Parser from "../../parser";
import VNode from "../../../../renders/artRender/node";
export default class InteractionParser {
    parser: Parser;
    private html_inlines;
    constructor(options: any);
    text(node: VNode, entering: boolean): void;
    image(node: VNode, entering: boolean): void;
    heading(node: VNode, entering: boolean): void;
    link(node: VNode, entering: boolean): void;
    code(node: VNode, entering: boolean): void;
    html_inline(node: VNode, entering: boolean): void;
    item(node: VNode, entering: boolean): void;
    math(node: VNode, entering: boolean): void;
    emph(node: VNode, entering: boolean): void;
    strong(node: VNode, entering: boolean): void;
    delete(node: VNode, entering: boolean): void;
    /**交互解释 */
    interactionParse(ast: VNode): void;
    /**行交互解释 */
    parse(input: string): VNode;
    /**行内交互解释 */
    inlineParse(input: string | VNode): VNode;
}

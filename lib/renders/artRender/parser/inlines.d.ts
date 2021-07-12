import VNode from "../node";
export declare function normalizeReference(string: string): string;
declare type Delimiters = {
    cc: number;
    numdelims: number;
    origdelims: number;
    node: VNode;
    previous: Delimiters;
    next: Delimiters;
    can_open: boolean;
    can_close: boolean;
};
export default class InlineParser {
    subject: string;
    delimiters: Delimiters;
    brackets: any;
    pos: number;
    refmap: Map<string, {
        destination: string;
        title: string;
    }>;
    options: {
        smart: any;
    };
    constructor(options?: {
        smart: string;
    });
    private match;
    peek(): number;
    spnl(): boolean;
    parseBackticks(block: VNode): boolean;
    parseBackslash(block: VNode): boolean;
    /**尝试解析autolink(尖括号中的URL或电子邮件)。 */
    parseAutolink(block: VNode): boolean;
    /**尝试解析一个原始的HTML标记。 */
    parseHtmlTag(block: VNode): boolean;
    scanDelims(cc: number): {
        numdelims: number;
        can_open: boolean;
        can_close: boolean;
    };
    handleDelim(cc: number, block: VNode): boolean;
    parseLinkTitle(): any;
    /**尝试解析链接目的地，返回字符串或如果没有匹配则为空 */
    parseLinkDestination(): any;
    /**尝试解析一个链接标签，返回解析的字符数。 */
    parseLinkLabel(): number;
    /**向分隔符堆栈添加左括号，并向块的子节点添加文本节点。 */
    parseOpenBracket(block: VNode): boolean;
    parseBang(block: VNode): boolean;
    /**
     * 尝试将右括号与分隔符中的开口相匹配堆栈。
     * 添加一个链接或图像，或一个普通字符，阻止儿童。
     * 如果有匹配的分隔符，从分隔符堆栈中删除它。
     * */
    parseCloseBracket(block: VNode): boolean;
    addBracket(node: any, index: any, image: any): void;
    removeBracket(): void;
    /**尝试解析一个实体。 */
    parseEntity(block: VNode): boolean;
    /**
     * 解析一系列普通字符，或单个字符markdown的特殊含义，
     * 作为普通字符串。
     * */
    parseString(block: VNode): boolean;
    parseNewline(block: VNode): boolean;
    parseReference(s: string, refmap: Map<string, {
        destination: string;
        title: string;
    }>): number;
    parseInline(block: VNode): boolean;
    processEmphasis(stack_bottom: Delimiters): void;
    removeDelimiter(delim: any): void;
    parseInlines(block: VNode): void;
    parse(block: VNode): void;
}
export {};

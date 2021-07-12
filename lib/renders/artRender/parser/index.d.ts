import VNode from "../node";
import InlineParser from "./inlines";
declare class Parser {
    doc: VNode;
    blocks: {
        document: {
            continue(): number;
            finalize(): void;
            canContain(t: string): boolean;
            acceptsLines: boolean;
        };
        list: {
            continue(): number;
            finalize(parser: Parser, block: VNode): void;
            canContain(t: string): boolean;
            acceptsLines: boolean;
        };
        block_quote: {
            continue(parser: Parser): 0 | 1;
            finalize(): void;
            canContain(t: string): boolean;
            acceptsLines: boolean;
        };
        item: {
            continue(parser: Parser, container: VNode): 0 | 1;
            finalize(): void;
            canContain(t: string): boolean;
            acceptsLines: boolean;
        };
        heading: {
            continue(): number;
            finalize(): void;
            canContain(): boolean;
            acceptsLines: boolean;
        };
        thematic_break: {
            continue(): number;
            finalize(): void;
            canContain(): boolean;
            acceptsLines: boolean;
        };
        code_block: {
            continue(parser: Parser, container: VNode): 0 | 1 | 2;
            finalize(parser: Parser, block: VNode): void;
            canContain(): boolean;
            acceptsLines: boolean;
        };
        math_block: {
            continue(parser: Parser, container: VNode): 0 | 1 | 2;
            finalize(parser: Parser, block: VNode): void;
            canContain(): boolean;
            acceptsLines: boolean;
        };
        html_block: {
            continue(parser: Parser, container: VNode): 0 | 1;
            finalize(parser: Parser, block: VNode): void;
            canContain(): boolean;
            acceptsLines: boolean;
        };
        table: {
            continue(parser: Parser, container: VNode): 1 | 2;
            finalize(parser: Parser, block: VNode): void;
            canContain(): boolean;
            acceptsLines: boolean;
        };
        def_link: {
            continue(parser: Parser, container: VNode): number;
        };
        paragraph: {
            continue(parser: Parser): 0 | 1;
            finalize(parser: Parser, block: VNode): void;
            canContain(): boolean;
            acceptsLines: boolean;
        };
    };
    blockStarts: (((parser: Parser, container: VNode) => 0 | 2) | ((parser: Parser, container: VNode) => 0 | 3) | ((parser: Parser, container: VNode) => 0 | 1))[];
    tip: VNode;
    oldtip: VNode;
    lines: string[];
    lineLength: number;
    currentLineNumbar: number;
    currentLine: string;
    lineNumber: number;
    offset: number;
    column: number;
    nextNonspace: number;
    nextNonspaceColumn: number;
    /**缩进 */
    indent: number;
    indented: boolean;
    blank: boolean;
    partiallyConsumedTab: boolean;
    allClosed: boolean;
    lastMatchedContainer: VNode;
    refmap: Map<string, {
        destination: string;
        title: string;
    }>;
    lastLineLength: number;
    inlineParser: InlineParser;
    options: any;
    constructor(options: any);
    /**查找下一个是非空格 */
    private findNextNonspace;
    advanceOffset(count: number, columns?: boolean): void;
    advanceNextNonspace(): void;
    addLine(): void;
    addChild(tag: string, offset: number): VNode;
    incorporateLine(ln: string): void;
    finalize(block: VNode, lineNumber: number): void;
    processInlines(block: VNode): void;
    closeUnmatchedBlocks(): void;
    parse(input: string): VNode;
}
export default Parser;

import ArtText from '../../artText';
import Render from '../';
import Cursor from './cursor';
import FloatAuxiliaryTool, { floatAuxiliaryToolExport } from "./tool/floatAuxiliaryTool";
import ArtRenderEvent from "./artRenderEvent";
import { TableMoreTool } from "./tool/tableTool/tableMoreTool";
import Tool from '../../tool';
import './index.css'
import Editor from '../../editor';
import { Art, Core } from '../../core';
import EventCenter from '../../eventCenter';
import InteractionParser from './interaction/interactionParser';
import VNode from '../../renders/artRender/node';
import Interaction from './interaction';
import Operation from '../../renders/artRender/node/operation';
import { flowchartExport } from './plugins/flowchart';
import { hljsExport } from './plugins/highlight';
import { mermaidExport } from './plugins/mermaid';
import { katexExport } from './plugins/katex';
import { TableTool } from './tool/tableTool';

export class RefMap {
    refmap: Map<string, { destination: string, title: string }>;
    constructor() {
        this.refmap = new Map();
    }

    setRefMap(refmap: Map<string, { destination: string, title: string }>) {
        this.refmap = refmap;
    }

    set(key: string, value: { destination: string, title: string }): Map<string, { destination: string, title: string }> {
        let all = document.querySelectorAll("*[art-data-ref=\"" + key + "\"]");
        all.forEach(dom => {
            if (dom.tagName === "IMG") {
                dom.previousElementSibling.setAttribute("class", "art-meta art-hide");
                dom.previousElementSibling.setAttribute("style", "");
                dom.setAttribute("src", value.destination);
            }
        })
        return this.refmap.set(key, value);
    }

    get(key: string): { destination: string, title: string } {
        return this.refmap.get(key);
    }

    has(key: string): boolean {
        return this.refmap.has(key);
    }

    delete(key: string): boolean {
        let all = document.querySelectorAll("*[art-data-ref=\"" + key + "\"]");
        all.forEach(dom => {
            if (dom.tagName === "IMG") {
                dom.previousElementSibling.setAttribute("class", "art-meta");
                dom.previousElementSibling.setAttribute("style", "color: #c7c7c7");
                dom.setAttribute("src", "");
            }
        })
        return this.refmap.delete(key);
    }
}

/**
 * 默认的渲染器
 */
export default class ArtRender implements Render {
    static plugins = { hljs: null, katex: null, flowchart: null, mermaid: null };
    private static artRenders: ArtRender[] = [];

    static setPlugin(key: string, value: any): void {
        ArtRender.plugins[key] = value;
        for (let artRender of ArtRender.artRenders) {
            artRender.interaction.render(null, 'keyup');
        }
    }


    abbrName: string;
    artText: ArtText;
    dom: HTMLDivElement;

    cursor: Cursor;
    tableMoreTool: TableMoreTool;
    renderEvent: ArtRenderEvent;

    doc: VNode;
    refmap: RefMap;
    interaction: Interaction;
    parser: InteractionParser;
    operation: Operation;
    constructor(artText: ArtText) {
        this.artText = artText;
        this.cursor = null;
        this.abbrName = ' MD ';

        this.dom = document.createElement("div");
        this.dom.setAttribute("class", "art-render-art markdown-body");
        let p = document.createElement("p");
        p.appendChild(document.createElement("br"));
        this.dom.appendChild(p);

        this.cursor = new Cursor(this.dom);

        this.tableMoreTool = new TableMoreTool();

        this.renderEvent = new ArtRenderEvent(this);

        this.operation = new Operation(this);
        this.parser = new InteractionParser({});
        this.interaction = new Interaction(this);

        this.refmap = new RefMap();
        this.doc = new VNode('document', [[1, 1], [0, 0]]);
        this.doc.dom = this.dom;
        ArtRender.artRenders.push(this);
    }

    public createDom(): HTMLDivElement {
        this.artText.get<Tool>('$tool').add({ dom: this.tableMoreTool.createDom() });

        return this.dom;
    }

    public open(): void {
        this.dom.style.display = 'block';
        this.renderEvent.attachAllEvent();
    }

    public close(): void {
        this.renderEvent.detachAllEvent();
        this.dom.style.display = 'none';
    }

    public getMd(): string {
        let md = "";
        let child = this.doc.firstChild;
        while (child) {
            let lineMd = child.getMd();
            if (lineMd)
                md += lineMd + '\n';
            child = child.next;
        }
        return md;
    }

    public setMd(md: string): void {
        this.doc = this.parser.parse(md);
        this.refmap.setRefMap(this.parser.parser.refmap);
        this.doc.dom = this.dom;
        this.doc.dom.innerHTML = "";

        let child = this.doc.firstChild, fun: Function;
        if (child === null) {
            child = new VNode("paragraph");
            child.appendChild(new VNode("linebreak"));
            this.doc.appendChild(child);
        }
        while (child) {
            fun = child.newDom();
            this.doc.dom.appendChild(child.dom);
            if (fun && fun !== null)
                fun();
            child = child.next;
        }

        console.log(this.doc);
        this.artText.get<EventCenter>('$eventCenter').emit('artRender-render');
    }

    public attachAllEvent(): void {
        this.renderEvent.attachAllEvent();
    }

    public detachAllEvent(): void {
        console.log('sdad', this)
        this.renderEvent.detachAllEvent();
    }

    /**删除选中的元素 */
    public deleteSelectNode(): boolean {
        this.cursor.getSelection()
        let pos = this.cursor.pos;
        if (pos.selection.isCollapsed)
            return false;

        let row_before = pos.rowAnchorOffset, row_after = pos.rowFocusOffset;
        let in_before = pos.inAnchorOffset, in_after = pos.inFocusOffset;
        if (row_before > row_after) {
            [row_before, row_after] = [row_after, row_before];
            [in_before, in_after] = [in_after, in_before];
        }

        let node = this.doc.firstChild;
        let i = 0, md = "";
        while (node) {
            if (i > row_after) {
                break;
            } else if (row_after === row_before) {
                md += node.getMd().substring(in_before, in_after);
                break;
            } else if (i == row_before) {
                md += node.getMd().substring(in_before) + "\n";
            } else if (i === row_after) {
                md += node.getMd().substring(0, in_after) + "\n";
            } else if (i > row_before) {
                md += node.getMd() + "\n";
            }
            i++;
            node = node.next;
        }

        return false;
        return true;
    }

    /**获取选中的元素的 markdown 文本 */
    public getSelectNodeMd(): string {
        this.cursor.getSelection()

        let pos = this.cursor.pos;
        let row_before = pos.rowAnchorOffset, row_after = pos.rowFocusOffset;
        let in_before = pos.inAnchorOffset, in_after = pos.inFocusOffset;
        if (row_before > row_after) {
            [row_before, row_after] = [row_after, row_before];
            [in_before, in_after] = [in_after, in_before];
        }

        let node = this.doc.firstChild;
        let i = 0, md = "";
        while (node) {
            if (i > row_after) {
                break;
            } else if (row_after === row_before) {
                md += node.getMd().substring(in_before, in_after);
                break;
            } else if (i == row_before) {
                md += node.getMd().substring(in_before) + "\n";
            } else if (i === row_after) {
                md += node.getMd().substring(0, in_after) + "\n";
            } else if (i > row_before) {
                md += node.getMd() + "\n";
            }
            i++;
            node = node.next;
        }

        return md;
    }
}

export let ArtRenderExport = {
    install: function (Art, options) {
        // Core.use(flowchartExport);
        // Core.use(hljsExport);
        // Core.use(mermaidExport);
        // Core.use(katexExport);
        options['container'].bind('$artRender', ArtRender, [{ 'get': 'art' }], true);
    },
    created: function (art: Art, options) {
        art.get<Editor>('$editor').addRender('artRender', art.get('$artRender'));
        art.get<Editor>('$editor').defaultRender = art.get('$artRender');
    }
}
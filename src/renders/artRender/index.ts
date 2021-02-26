import ArtText from '@/artText';
import Render from '../';
import Cursor from './cursor';
import FloatAuxiliaryTool from "./tool/floatAuxiliaryTool";
import ArtRenderEvent from "./artRenderEvent";
import { TableMoreTool } from "./tool/tableTool/tableMoreTool";
import Tool from '../../tool';
import './index.css'
import Editor from '@/editor';
import { Art, Core } from '@/core';
import EventCenter from '@/eventCenter';
import InteractionParser from './interaction/interactionParser';
import VNode from '@/node';
import Interaction from './interaction';
import Operation from '@/node/operation';
import { flowchartExport } from './plugins/flowchart';
import { hljsExport } from './plugins/highlight';
import { mermaidExport } from './plugins/mermaid';
import { katexExport } from './plugins/katex';


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
    floatAuxiliaryTool: FloatAuxiliaryTool;
    renderEvent: ArtRenderEvent;

    doc: VNode;
    interaction: Interaction;
    parser: InteractionParser;
    operation: Operation;
    constructor(artText: ArtText) {
        this.artText = artText;
        this.cursor = null;
        this.abbrName = ' MD ';

        this.dom = document.createElement("div");
        this.dom.setAttribute("class", "art-render-art");
        let p = document.createElement("p");
        p.appendChild(document.createElement("br"));
        this.dom.appendChild(p);

        this.cursor = new Cursor(this.dom);

        this.tableMoreTool = new TableMoreTool();
        this.floatAuxiliaryTool = new FloatAuxiliaryTool();

        this.renderEvent = new ArtRenderEvent(this);

        this.operation = new Operation(this);
        this.parser = new InteractionParser({});
        this.interaction = new Interaction(this);

        this.doc = new VNode('document', [[1, 1], [0, 0]]);
        this.doc.dom = this.dom;
        ArtRender.artRenders.push(this);
    }

    public createDom(): HTMLDivElement {
        this.artText.get<Tool>('$tool').add({ dom: this.tableMoreTool.createDom() });
        this.artText.get<Tool>('$tool').add({ dom: this.floatAuxiliaryTool.createDom() });


        return this.dom;
    }

    public open(): void {
        this.dom.style.display = 'inherit';
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
        this.doc.dom = this.dom;
        this.doc.dom.innerHTML = "";

        let child = this.doc.firstChild, fun: Function;
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
}

export let ArtRenderExport = {
    install: function (Art, options) {
        //Core.use(flowchartExport);
        //Core.use(hljsExport);
        //Core.use(mermaidExport);
        //Core.use(katexExport);
        options['container'].bind('$artRender', ArtRender, [{ 'get': 'art' }], true);
    },
    created: function (art: Art, options) {
        art.get<Editor>('$editor').addRender('artRender', art.get('$artRender'));
        art.get<Editor>('$editor').defaultRender = art.get('$artRender');
    }
}
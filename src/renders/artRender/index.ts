import ArtText from '@/artText';
import Render from '../';
import Cursor from './cursor';
import FloatAuxiliaryTool from "./tool/floatAuxiliaryTool";
import ArtRenderEvent from "./artRenderEvent";
import { TableMoreTool } from "./tool/tableTool/tableMoreTool";
import Tool from '../../tool';
import './index.css'
import ArtRenderRender from './artRenderRender';
import { keyupRender } from './artRenderRender/eventRender';
import vnodeRender from './artRenderRender/vnodeRender';
import Editor from '@/editor';
import { Art } from '@/core';
import EventCenter from '@/eventCenter';

const win = window;
/**
 * 默认的渲染器
 */
export default class ArtRender implements Render {
    static plugins = { hljs: null, katex: null, flowchart: null, Raphael: null };
    static Name: string = "ArtRender";

    static setPlugin(key: string, value: any, artRender: ArtRender = null): void {
        ArtRender.plugins[key] = value;

        if (artRender && artRender.renderRender.render != undefined)
            artRender.renderRender.render(null, 'keyup');
    }


    abbrName: string;
    artText: ArtText;
    dom: HTMLDivElement;

    cursor: Cursor;
    tableMoreTool: TableMoreTool;
    floatAuxiliaryTool: FloatAuxiliaryTool;
    renderEvent: ArtRenderEvent;
    renderRender: ArtRenderRender;
    constructor(artText: ArtText) {
        this.artText = artText;
        this.cursor = null;
        this.abbrName = ' MD ';

        this.tableMoreTool = new TableMoreTool();
        this.floatAuxiliaryTool = new FloatAuxiliaryTool();

        this.renderEvent = new ArtRenderEvent(this);
        this.renderRender = new ArtRenderRender(this);
        this.registerPlugin();
    }

    private registerPlugin(): void {
        if (this.artText.nameId != 'artText-0' && true)
            return null;

        if (this.artText.options.code.jsFun) {
            ArtRender.setPlugin('hljs', this.artText.options.code.jsFun);
        } else if (this.artText.options.code.js) {
            Tool.loadScript(this.artText.options.code.js, () => { ArtRender.setPlugin('hljs', win['hljs'], this) });
        }

        if (this.artText.options.math.jsFun != undefined) {
            ArtRender.setPlugin('katex', this.artText.options.math.jsFun);
        } else if (this.artText.options.math.js) {
            Tool.loadScript(this.artText.options.math.js, () => { ArtRender.setPlugin('katex', win['katex'], this) })
        }

        if (this.artText.options.math.css) {
            Tool.loadCss(this.artText.options.math.css)
        }

        if (this.artText.options.flowchart.jsFun) {
            ArtRender.setPlugin('flowchart', this.artText.options.flowchart.jsFun);
        } else if (this.artText.options.flowchart.js) {
            let fun = () => { Tool.loadScript(this.artText.options.flowchart.js[1], () => { ArtRender.setPlugin('flowchart', win['flowchart'], this) }) };
            Tool.loadScript(this.artText.options.flowchart.js[0], () => { ArtRender.setPlugin('Raphael', win['Raphael'], null); fun(); })
        }
    }

    public createDom(): HTMLDivElement {
        this.artText.get<Tool>('$tool').add({ dom: this.tableMoreTool.createDom() });
        this.artText.get<Tool>('$tool').add({ dom: this.floatAuxiliaryTool.createDom() });

        this.dom = this.renderRender.rootNode.newDom();
        this.cursor = new Cursor(this.renderRender.rootNode.dom);
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
        keyupRender(this.renderRender); // 更新
        let md = '';
        for (let i = 0; i < this.renderRender.rootNode.childNodes.length; i++) {
            let lineMd = this.renderRender.rootNode.childNodes[i].getMd('read');
            if (lineMd)
                md += lineMd + '\n';
        }
        return md;
    }

    public setMd(md: string): void {
        this.renderRender.vnodeDispose(this.renderRender.rootNode, md);
        vnodeRender(this.renderRender.rootNode.dom, this.renderRender.rootNode);
        this.artText.get<EventCenter>('$eventCenter').emit('artRender-render')
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
        options['container'].bind('$artRender', ArtRender, [{'get': 'art'}], true);
    },
    created: function (art: Art, options) {
        art.get<Editor>('$editor').addRender('artRender', art.get('$artRender'));
        art.get<Editor>('$editor').defaultRender = art.get('$artRender');
    }
}
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
import { Art, Core } from '@/core';
import EventCenter from '@/eventCenter';
import { loadPluginsExport } from './plugins/default';
import Parser from '../../parser';
import HtmlRenderer from './render/html';
import VNodeRenderer from './render/vnode';
import InteractionParser from './interaction/interactionParser';
import VNode from '@/node';


/**
 * 默认的渲染器
 */
export default class ArtRender implements Render {
    static plugins = { hljs: null, katex: null, flowchart: null, Raphael: null };
    private static artRenders: ArtRender[] = [];

    static setPlugin(key: string, value: any): void {
        ArtRender.plugins[key] = value;
        for (let artRender of ArtRender.artRenders) {
            artRender.renderRender.render(null, 'keyup');
        }
    }


    abbrName: string;
    artText: ArtText;
    dom: HTMLDivElement;

    cursor: Cursor;
    tableMoreTool: TableMoreTool;
    floatAuxiliaryTool: FloatAuxiliaryTool;
    renderEvent: ArtRenderEvent;
    renderRender: ArtRenderRender;

    doc: VNode;
    parser: InteractionParser;
    render: VNodeRenderer;
    constructor(artText: ArtText) {
        this.artText = artText;
        this.cursor = null;
        this.abbrName = ' MD ';

        this.tableMoreTool = new TableMoreTool();
        this.floatAuxiliaryTool = new FloatAuxiliaryTool();

        this.renderEvent = new ArtRenderEvent(this);
        this.renderRender = new ArtRenderRender(this);

        this.parser = new InteractionParser({});
        this.render = new VNodeRenderer({});
        this.doc = null;
        ArtRender.artRenders.push(this);
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
        this.doc = this.parser.parse(md);
        this.render.render(this.doc, this.dom);
        console.log(this.doc);
      
        this.artText.get<EventCenter>('$eventCenter').emit('artRender-render');
        return;
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
        //Core.use(loadPluginsExport);
        options['container'].bind('$artRender', ArtRender, [{'get': 'art'}], true);
    },
    created: function (art: Art, options) {
        art.get<Editor>('$editor').addRender('artRender', art.get('$artRender'));
        art.get<Editor>('$editor').defaultRender = art.get('$artRender');
    }
}
import { Art } from '../core';
import EventCenter from '../eventCenter';
import { SwitchRenderButton } from '../plugins/toolbar/default';
import Render from '../renders';
import ArtText from '../artText'
import './styles/index.css'

/**
 * 编辑器
 */
export default class Editor {

    artText: ArtText;
    dom: HTMLDivElement;
    fileInfo: {};
    defaultRender: any;
    runRender: Render;
    renders: {};
    constructor(artText: ArtText) {
        this.artText = artText;

        this.dom = document.createElement('div');
        this.dom.setAttribute('class', 'art-editor markdown-body');
        this.artText.domContent.appendChild(this.dom);

        this.fileInfo = {};
        this.renders = {};
        
    }

    public init(): void {
        if (this.defaultRender)
            this.runRender = this.defaultRender;

        this.runRender.open();
        this.runRender.setMd(this.artText.options.defaultMd);
    }

    /**
     * 添加渲染器
     */
    public addRender(name:string, render: Render) {
        this.renders[name] = render;
        const dom = render.createDom();
        dom.classList.add("art-render")
        this.dom.appendChild(dom);
        this.artText.get<EventCenter>('$eventCenter').waitOnceEmit('@switchRenderButton-addRender', this.renders[name].abbrName, name)
    }

    /**
     * 打开文件
     * @param md markdown文本
     * @param fileInfo 
     * @param renderName 
     */
    public openFile(fileInfo: {} = {}, renderName: string = null): void {
        this.fileInfo = Object.assign({ name: null, id: null, defaultMd: '' }, fileInfo);;
        this.switchRender(renderName);
    }

    /**
     * 获取文件
     * @param key 
     */
    public getFile(key: string = null): any {
        if (key == 'fileInfo')
            return this.fileInfo;
        else if (key == 'md')
            return this.runRender.getMd();
        else {
            this.fileInfo['markdown'] = this.runRender.getMd();
            return this.fileInfo;
        }
    }

    /**
     * 切换渲染器
     * @param renderName 渲染器的名字
     */
    public switchRender(renderName: string): void {
        let render: Render = null;
        let md: string;
        if (renderName == null) {
            render = this.defaultRender
            md = this.fileInfo['defaultMd'];
        } else if (this.runRender == this.renders[renderName])
            return null;
        else {
            render = this.renders[renderName];
            md = this.runRender.getMd()
        }

        this.runRender.close();
        render.open();
        render.setMd(md);

        this.runRender = render;
    }
}

export let EditorExport = {
    install: function (Art: any, options: any) {
        options['container'].bind('$editor', Editor, [{'get': 'art'}], true);
    },
    created: function (art: Art , options: any) {
        art.get('$editor');
    },
    mount: function(art: Art, options: any) {
        art.get<Editor>('$editor').init();
    }
}
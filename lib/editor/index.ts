import ArtText from "../../lib"
import Tool from "../tool"
import ArtRender from "lib/render/artRender"
import TextareaRender from "lib/render/textareaRender"

let win = window;

export class SwitchEditor {
    static codeDescribe = 'Toolbar.addTool';

    editor: Editor;
    spanElement: HTMLSpanElement;
    text: string;
    options: string[];
    keys: string[];
    constructor(editor: Editor) {
        this.editor = editor;
        this.text = '默认';
        this.spanElement = null;
        this.options = [];
        this.keys = [];
    }

    public click(): void {
        let index: number = this.options.indexOf(this.text);
        if (index > -1) {
            index++;
            if (index == this.options.length) {
                index = 0;
            }
            this.text = this.options[index];
            this.spanElement.innerHTML = this.options[index];
            this.editor.openEditor(this.keys[index]);
        }
    }
}

class Editor {
    static plugins = { hljs: null, katex: null, flowchart: null, Raphael: null };
    static setPlugin(key: string, value: any, editor: Editor = null): void {
        Editor.plugins[key] = value;
        if (editor == undefined && !editor)
            return null;
        if (editor.editorRender.render != undefined)
            editor.editorRender.render(null, 'keyup');
    }

    static RenderPlugins = { ArtRender, TextareaRender }
    static DEFAULT_CSS = '\n\
    .art-hide{display: inline-block;width: 0;height: 0;overflow: hidden;vertical-align: middle;}\n\
    .art-show{color: #ccc;}\n\
    .art-editor-html pre code{white-space: pre-wrap;}\n\
    .art-show-math{position: absolute;padding: 13px 25px;background: #fff;box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;}\n\
    .art-editor{box-shadow:0 2px 12px 0 rgba(0, 0, 0, 0.1);padding:30px 25px;border-radius:4px;background-color:${theme.backgroundColor};}'

    artText: ArtText;
    dom: HTMLDivElement;
    fileInfo: {};
    editorDefaultRender: any;
    editorRender: any;
    renders: {};
    switchEditor: SwitchEditor;

    constructor(artText: ArtText) {
        this.artText = artText;
        this.dom = document.createElement('div');
        this.dom.setAttribute('class', 'art-editor markdown-body');
        this.artText.rootDom.appendChild(this.dom);

        this.fileInfo = {};

        this.renders = {};
        this.registerPlugin();
        this.switchEditor = new SwitchEditor(this);

        // 
        for (let key in Editor.RenderPlugins) {
            this.renders[key] = new Editor.RenderPlugins[key](this.artText);
            this.switchEditor.options.push(this.renders[key].abbrName);
            this.switchEditor.keys.push(key);
        }

        this.editorDefaultRender = this.renders['ArtRender'];
        this.switchEditor.text = this.editorDefaultRender.abbrName;

        this.editorRender = this.editorDefaultRender;
    }

    public init(): void {
        for (let key in this.renders) {
            this.dom.appendChild(this.renders[key].createDom());
            this.renders[key].init();
        }
        let switchEditor = this.switchEditor;
        switchEditor.spanElement = this.artText.tool.toolbar.addTool(this.switchEditor.text, () => { switchEditor.click(); });

        this.editorRender.open();
    }

    private registerPlugin(): void {
        if (this.artText.id)
            return null;
        if (this.artText.options.code.jsFun) {
            Editor.setPlugin('hljs', this.artText.options.code.jsFun);
        } else if (this.artText.options.code.js) {
            Tool.loadScript(this.artText.options.code.js, () => { Editor.setPlugin('hljs', win['hljs'], this) });
        }

        if (this.artText.options.math.jsFun != undefined) {
            Editor.setPlugin('katex', this.artText.options.math.jsFun);
        } else if (this.artText.options.math.js) {
            Tool.loadScript(this.artText.options.math.js, () => { Editor.setPlugin('katex', win['katex'], this) })
        }

        if (this.artText.options.math.css) {
            Tool.loadCss(this.artText.options.math.css)
        }

        if (this.artText.options.flowchart.jsFun) {
            Editor.setPlugin('flowchart', this.artText.options.flowchart.jsFun);
        } else if (this.artText.options.flowchart.js) {
            let fun = () => { Tool.loadScript(this.artText.options.flowchart.js[1], () => { Editor.setPlugin('flowchart', win['flowchart'], this) }) };
            Tool.loadScript(this.artText.options.flowchart.js[0], () => { Editor.setPlugin('Raphael', win['Raphael'], undefined); fun(); })
        }
    }


    public openFile(md: string, fileInfo: {} = {}, renderName: string = null): void {
        this.fileInfo = Object.assign({ name: null, id: null, defaultMd: md }, fileInfo);;
        this.openEditor(renderName);
    }

    public getFile(key: string = null): any {
        if (key == 'fileInfo')
            return this.fileInfo;
        else if (key == 'md')
            return this.editorRender.getMd();
        else
            return [this.editorRender.getMd(), this.fileInfo];
    }

    public openEditor(renderName: string): void {
        let render = null;
        let md: string;
        if (renderName == null) {
            render = this.editorDefaultRender
            md = this.fileInfo['defaultMd'];
        } else if (this.editorRender == this.renders[renderName])
            return null;
        else {
            render = this.renders[renderName];
            md = this.editorRender.getMd()
        }

        this.editorRender.close();
        render.open();
        render.setMd(md);

        this.editorRender = render;
    }
}
export default Editor
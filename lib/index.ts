import Editor from './editor'
import { ART_DEFAULT_OPTIONS, ArtOptions, RunModel, ART_THEME, ART_DEFAULT_CSS } from './config'
import Tool from './tool'
import EventCenter from './eventCenter';
import { executeFutureEvent } from './eventCenter';
import PluginCenter from './PluginCenter';

let win: any = window;
class ArtText {
    static version: string = '0.0.0';

    static use: Function = PluginCenter.use;
    static theme = ART_THEME;
    static ID: number = 0;
    static DEFAULT_CSS = ART_DEFAULT_CSS;

    options: ArtOptions; // {}
    editor: Editor;
    eventCenter: EventCenter;
    tool: Tool;
    container: HTMLElement;
    rootDom: HTMLDivElement;
    pluginCenter: PluginCenter;
    id: number;

    constructor(container: HTMLElement, options = {}) {
        this.container = container;
        this.rootDom = document.createElement('div');
        this.rootDom.className = 'art-main';
        this.container.appendChild(this.rootDom);

        this.options = Object.assign({}, ART_DEFAULT_OPTIONS, options);
        this.editor = new Editor(this);
        this.tool = new Tool(this);
        this.eventCenter = new EventCenter(this);
        this.pluginCenter = new PluginCenter(this);
        this.id = ArtText.ID++;
        this.addDefaultCss();
    }

    private addDefaultCss() {
        if (this.id) {
            return null;
        }
        ArtText.DEFAULT_CSS += Editor.DEFAULT_CSS;
        ArtText.DEFAULT_CSS += Tool.DEFAULT_CSS;
        let css = ArtText.DEFAULT_CSS;
        css = css.replace('${theme.backgroundColor}', ArtText.theme.backgroundColor);
        css = css.replace('${theme.color}', ArtText.theme.color);
        Tool.addCss(css);
    }

    @executeFutureEvent()
    public init(): void {
        this.pluginCenter.register();
        this.editor.init();
        this.tool.init();
        this.eventCenter.init();
        if (this.options.runModel != RunModel.editor)
            this.changeRunModel(this.options.runModel);
        this.editor.openFile(this.options.markdown, { name: '演示版本' });
    }

    public changeRunModel(runModel: RunModel) {
        let oldRunModel = this.options.runModel;

        if (runModel == RunModel.read_noStyle) {
            this.rootDom.childNodes.forEach((node) => {
                (<HTMLElement>node).style.display = 'none';
            })
            this.editor.editorDom.style.display = 'inherit';
            this.editor.editorDom.setAttribute('class', 'art-editor-noStyle')
            this.editor.editorDom.childNodes.forEach((node) => {
                (<HTMLElement>node).style.display = 'none';
            })
            this.editor.htmlNode.dom.style.display = 'inherit';
            this.editor.htmlNode.dom.setAttribute('contenteditable', 'false');
            this.eventCenter.removeAllEventListener();
        } else if (oldRunModel != RunModel.editor) {
            this.rootDom.childNodes.forEach((node) => {
                (<HTMLElement>node).style.display = 'inherit';
            })
            this.editor.editorDom.setAttribute('class', 'art-editor')
            this.editor.editorDom.childNodes.forEach((node) => {
                (<HTMLElement>node).style.display = 'inherit';
            })
            this.editor.htmlNode.dom.setAttribute('contenteditable', 'true');
            this.eventCenter.init();
        }

        this.options.runModel = runModel;
    }
}
win.ArtText = ArtText;
export default ArtText
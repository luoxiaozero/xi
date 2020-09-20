import Editor from './editor'
import {ART_DEFAULT_OPTIONS} from './config'
import Tool from './tool'
import EventCenter from './eventCenter';
import {executeFutureEvent} from './eventCenter';
import {exportMdFileMap} from './defaultPlugin'

let win: any = window;
class ArtText {
    static version: string = '0.0.0';

    static Editor = Editor;

    static plugins: any[] = [exportMdFileMap];
    static use (plugin: any, options: {}): void{
        this.plugins.push({plugin, options});
    }

    static artTexts: ArtText[] = [];
    static artTextsRender(): void{
        for(let art of ArtText.artTexts){
            art.editor.render();
        }
    }

    options: any; // {}
    editor: Editor;
    eventCenter: EventCenter;
    tool: Tool;
    rootDom: HTMLElement

    constructor(dom: HTMLElement, options = {}) {
        this.rootDom = dom;
        this.options = Object.assign({}, ART_DEFAULT_OPTIONS, options);
        this.editor = new Editor(this);
        this.tool = new Tool(this);
        this.eventCenter = new EventCenter(this);
        ArtText.artTexts.push(this);
    } 

    @executeFutureEvent()
    public init(): void{
        this.registerPlugin();
        this.editor.init();
        this.tool.init();
        this.eventCenter.init();
        if(this.options.runModel != 'editor')
            this.changeRunModel(this.options.runModel);
        this.editor.openFile(this.options.markdown, {name: '演示版本'});
    }

    private registerPlugin(): void{
        for(let i = 0; i < ArtText.plugins.length; i++){
            if(ArtText.plugins[i].options.init != undefined && ArtText.plugins[i].options.init){
                ArtText.plugins[i].options.init(this);
            }
        }
    }
    public changeRunModel(runModel){
        let oldRunModel = this.options.runModel;

        if(runModel == 'read-noStyle'){
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
        }else if(oldRunModel != 'editor'){
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
import Editor from './editor'
import Config from './config'
import Tool from './tool'
import EventCenter from './eventCenter';
import {exportMdFileMap} from './defaultPlugin'

let win: any = window;
class ArtText {
    static Editor = Editor;
    static plugins: Map<any, any>[] = [exportMdFileMap];
    static use (plugin: any, options: Map<any, any>= new Map()) {
        let map: Map<any, any> = new Map();
        map.set('plugin', plugin);
        map.set('options', options);
        this.plugins.push(map);
    }
    container: HTMLHtmlElement;
    config: Config;
    editor: Editor;
    eventCenter: EventCenter;
    tool: Tool;

    constructor(container: HTMLHtmlElement, config: Map<any, any>= new Map()) {
        this.container = container;
        this.config = new Config(config);
        this.editor = new Editor(this, container);
        this.tool = new Tool(this, container);
        this.eventCenter = new EventCenter(this, this.editor.editorHtmlDom);
        
    } 
    init(): void{
        this.registerPlugin();
        this.editor.init();
        if(this.config.runModel != Config.RunModel.read){
            this.tool.init();
            this.eventCenter.init();
        }
        this.eventCenter.executeFutureEvent('init-end');
    }
    registerPlugin(): void{
        for(let i = 0; i < ArtText.plugins.length; i++){
            if(ArtText.plugins[i].get('plugin').name == 'uploadImg'){
                this.eventCenter.uploadImg = ArtText.plugins[i]['plugin'];
            } 
            if(ArtText.plugins[i].get('options').init){
                ArtText.plugins[i].get('options').init(this);
            }
        }
    }
}
win.ArtText = ArtText;
export default ArtText
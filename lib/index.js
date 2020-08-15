import Event from './event'
import Interpreter from './interpreter'
import Config from './config'
import HeadTool from './tool/headTool'

class ArtText {
    static plugins = [];
    static use (plugin, options = {}) {
        this.plugins.push({
          plugin,
          options
        })
    }

    constructor(container, config={}) {
        this.container = container;
        this.interpreter = new Interpreter(container, this);
        this.config = new Config(config);
        this.headTool = new HeadTool(container);
        this.event = new Event(container, this.interpreter.rootDom);
        window.artText = this;
    } 
    init(){
        this.registerPlugin();
        this.interpreter.init(this.config.model);
        if(this.config.model != 'read'){
            this.headTool.init();
            this.event.init();
        }
            
        
    }
    registerPlugin(){
        for(let i = 0; i < ArtText.plugins.length; i++){
            if(ArtText.plugins[i].plugin.name == 'uploadImg'){
                this.event.onUploadImg = ArtText.plugins[i].plugin;
            }
        }
    }
}
window.ArtText = ArtText;
export default ArtText
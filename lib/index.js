import Event from './event'
import Interpreter from './interpreter'
import Config from './config'
import Tool from './tool/Tool'

class ArtText {
    static plugins = [];
    static use (plugin, options = {}) {
        this.plugins.push({
          plugin,
          options
        })
    }

    constructor(container, config={}) {
        window.artText = this;
        this.container = container;
        this.config = new Config(config);
        this.interpreter = new Interpreter(container, this);
        this.tool = new Tool(container, this);
        this.event = new Event(container, this.interpreter.rootDom);
        
    } 
    init(){
        this.registerPlugin();
        this.interpreter.init(this.config.model);
        if(this.config.model != 'read'){
            this.tool.init();
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
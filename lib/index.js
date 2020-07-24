import Event from './event'
import Interpreter from './interpreter'
import Config from './config'


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
        this.event = new Event(container);
        this.interpreter = new Interpreter(container);
        this.config = new Config(config);
        window.artText = this;
    } 
    init(){
        this.container.setAttribute("contenteditable", "true");
        this.container.style.outline = "none";
        this.container.style.whiteSpace = "pre-wrap";
        this.container.style.wordBreak = "break-word";

        // 去掉空格后判断是否为空
        if(this.container.innerHTML.replace(/\s+/g,"") === ""){
            this.container.innerHTML =  "<p><br/></p>"
        }
        
        this.interpreter.init();
        this.event.init();
        console.log(this);
    }
}
export default ArtText
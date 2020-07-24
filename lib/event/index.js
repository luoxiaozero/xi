import katex from "../interpreter/js/katex.min.js"
import hljs from "../interpreter/js/highlight.min.js"
class Event{
    static isComposition = false;
    static cursorLocation = null;
    constructor(container) {
        this.container = container;
    } 
    init(){
        this.container.onkeydown = this.onkeydown         
        this.container.onkeyup = this.onkeyup
        this.container.addEventListener('compositionstart',function(e){
            Event.isComposition=true;
        },false);
        
        this.container.addEventListener('compositionend',function(e){
            Event.isComposition=false;
        },false);
        this.container.onclick = this.onclick;
    
    }
    onclick(e){
        let node = e.target;
        window.artText.interpreter.onclick();
        if(node && e.altKey && node.nodeName == "A"){
            //window.location.href=node.href;
            window.open(node.href)
        }
    }
    onkeydown(e){
    }
    
    onkeyup(e){
        let _this = window.artText.event;
        let keyCode = e.keyCode;
    
        if(keyCode === 8){
            if(_this.container.innerHTML === ""){
                _this.container.innerHTML =  "<p><br/></p>"
            }
        }
        if(!Event.isComposition){
            window.artText.interpreter.render();
        }
        


    }
}
export default Event
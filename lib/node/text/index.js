import Node from "../index"

class TextNode extends Node{
    constructor(text){
        super("#text", {}, text);
    }
    getText(){
        return this.childNodes;
    }

    getMd(){
        return this.childNodes;
    }
    getDom(){
        return  document.createTextNode(this.childNodes)
    }
}
export default TextNode;
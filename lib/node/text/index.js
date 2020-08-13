import Node from "../index"

class TextNode extends Node{
    constructor(text){
        super("#text", {}, text);
    }
    getText(){
        return this.child;
    }

    getMd(){
        return this.child;
    }
    getDom(){
        return  document.createTextNode(this.child)
    }
}
export default TextNode;
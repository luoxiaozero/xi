import VNode from "../index"

class VTextNode extends VNode{
    text: string;
    constructor(text){
        super("#text", {}, []);
        this.text = text;
    }
    
    getText(){
        return this.text;
    }

    getMd(){
        return this.text;
    }
    
    getDom(){
        return document.createTextNode(this.text)
    }
}
export default VTextNode;
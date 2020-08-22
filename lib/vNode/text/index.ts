class VTextNode{
    nodeName: string;
    text: string;
    constructor(text){
        this.nodeName = '#text';
        this.text = text;
    }
    
    newDom(){
        return document.createTextNode(this.text)
    }
    render(dom){
        if(dom.nodeName.toLowerCase() == "#text"){
            if(this.text == dom.nodeValue){
                return null;
            }else{
                dom.nodeValue = this.text;
                return false;
            }
        }else{
            dom.parentNode.replaceChild(this.newDom(), dom); 
        }
        return null;
    }

    getMd(): string{
        return this.text;
    }
}
export default VTextNode;
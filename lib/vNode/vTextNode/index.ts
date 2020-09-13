import VNode from '..'
class VTextNode{
    nodeName: string;
    text: string;
    dom: Text;
    parentNode: VNode;
    constructor(text){
        this.nodeName = '#text';
        this.text = text;
        this.parentNode = null;
        this.dom = null;
    }
    domToNode(): VTextNode{
        return new VTextNode(this.dom.nodeValue);
    }
    newDom(){
        this.dom = document.createTextNode(this.text);
        return this.dom;
    }
    /**@deprecated */
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

    getText(): string{
        return this.text;
    }
}
export default VTextNode;
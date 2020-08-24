import codeTool from "../../tool/codeTool"
import tableTool from "../../tool/tableTool"
import Tool from "../../tool";
class Location {
    anchorInlineOffset: number;
    focusInlineOffset: number;
    anchorAlineOffset: number;
    focusAlineOffset: number;
    anchorOffset: number;
    anchorNode: Node;
    focusNode: Node;
    focusOffset: number;
    constructor(
        anchorInlineOffset: number,
        focusInlineOffset: number,
        anchorAlineOffset: number,
        focusAlineOffset: number,
        anchorOffset: number,
        anchorNode: Node,
        focusOffset: number,
        focusNode: Node) {

        this.anchorInlineOffset = anchorInlineOffset;
        this.focusInlineOffset = focusInlineOffset;
        this.anchorAlineOffset = anchorAlineOffset;
        this.focusAlineOffset = focusAlineOffset;
        this.anchorOffset = anchorOffset;
        this.anchorNode = anchorNode;
        this.focusNode = focusNode;
        this.focusOffset = focusOffset;
    }
}
export default class Cursor {
    static sel: Selection = window.getSelection();

    editorHtmlDom: HTMLDivElement;
    location: Location;
    constructor(editorHtmlDom: HTMLDivElement) {
        this.editorHtmlDom = editorHtmlDom;
        this.location = null;
    }
    getSelection(): Location {
        let { anchorNode, anchorOffset, focusNode, focusOffset } = Cursor.sel;
        if (anchorNode && focusNode) {
            console.log(Cursor.sel)
            let node = anchorNode;
            let len = anchorOffset;
            if (node == this.editorHtmlDom){
                this.location = null;
                return this.location;
            }
                
            while (node.parentNode != this.editorHtmlDom) {
                while (node.previousSibling) {
                    node = node.previousSibling;
                    len += node.textContent.length;
                }
                node = node.parentNode;
            }

            let nodeF = focusNode;
            let lenF = focusOffset;

            while (nodeF.parentNode !== this.editorHtmlDom) {
                while (nodeF.previousSibling) {
                    nodeF = nodeF.previousSibling;
                    lenF += nodeF.textContent.length;
                }
                nodeF = nodeF.parentNode;
            }

            let rootNodeSub = -1;
            for (let i = 0; i < this.editorHtmlDom.childNodes.length; i++) {
                if (this.editorHtmlDom.childNodes[i] === node) {
                    rootNodeSub = i;
                    break;
                }
            }

            let rootNodeSubF = -1;
            for (let i = 0; i < this.editorHtmlDom.childNodes.length; i++) {
                if (this.editorHtmlDom.childNodes[i] === nodeF) {
                    rootNodeSubF = i;
                    break;
                }
            }
            let name = anchorNode.parentNode.nodeName;
            if (anchorOffset == 0 && anchorNode.previousSibling == null &&
                (name == 'LI' || name == 'P' || name == 'TH' || name == 'TD')) {
                anchorNode = anchorNode.parentNode;
            }
            this.location = new Location(len, lenF, rootNodeSub, rootNodeSubF, anchorOffset, anchorNode, focusOffset, focusNode);
        } else {
            this.location = null;
        }
        return this.location;
    }
    searchNode(node, len) {
        if (node.childNodes.length === 1 && node.childNodes[0].nodeName === "#text")
            if (len <= node.childNodes[0].textContent.length)
                return [node.childNodes[0], len]
            else
                return [node.childNodes[0], len - node.textContent.length]
        for (let i = 0; i < node.childNodes.length; i++) {
            if (node.childNodes[i].textContent.length < len) {
                len -= node.childNodes[i].textContent.length;
            } else if (node.childNodes[i].nodeName === "#text") {
                return [node.childNodes[i], len]
            } else {
                return this.searchNode(node.childNodes[i], len)
            }
        }
        return null
    }
    setTool(alineDom: HTMLElement): boolean {
        if(Tool.hasClass(alineDom, 'art-shield')){
            return false;
        }
        let pres = this.editorHtmlDom.getElementsByTagName('pre');
        for (let i = 0; i < pres.length; i++) {
            if (Tool.hasClass(pres[i].previousSibling as HTMLElement, "art-codeTool"))
                (<HTMLElement>pres[i].previousSibling).style.visibility = 'hidden';
        }

        let tables = this.editorHtmlDom.getElementsByTagName('table');

        for (let i = 0; i < tables.length; i++) {
            if (Tool.hasClass(tables[i].previousSibling as HTMLElement, "art-tableTool"))
                (<HTMLElement>tables[i].previousSibling).style.visibility = 'hidden';

        }

        if (alineDom.nodeName == "PRE") {
            if (Tool.hasClass(alineDom.previousSibling as HTMLElement, "art-codeTool")) {
                (<HTMLElement>alineDom.previousSibling).style.visibility = 'visible';
            } else {
                alineDom.parentNode.insertBefore(codeTool(), alineDom);
            }
            return true;
        }
        if (alineDom.nodeName == "TABLE") {
            if (Tool.hasClass(alineDom.previousSibling as HTMLElement, "art-tableTool")) {
                (<HTMLElement>alineDom.previousSibling).style.visibility = 'visible';
            } else {
                alineDom.parentNode.insertBefore(tableTool(), alineDom);
            }
            return true;
        }
        return false;
    }
    setSelection(location: Location=undefined){
        if (typeof location == undefined || !location) {
            location = this.location;
        }
        if(!location){
            return false;
        }

        // 隐藏所有的art-show Dom
        let showNodeList = this.editorHtmlDom.getElementsByClassName("art-show");
        for (let i = showNodeList.length - 1; i >= 0; i--) {
            let classVal = showNodeList[i].getAttribute("class");
            classVal = classVal.replace("art-show", "art-hide");
            showNodeList[i].setAttribute("class", classVal);
        }

        if (this.location && this.location.anchorInlineOffset == this.location.focusInlineOffset &&
            this.location.anchorAlineOffset == this.location.focusAlineOffset) {
            let info = null;
            var pNode = this.editorHtmlDom.childNodes[this.location.focusAlineOffset];
            var pLen = this.location.anchorInlineOffset;
            this.setTool(pNode as HTMLElement)
            if(pNode.nodeName == 'HR'){
                // 不可调优先度
                info = [pNode, 0];
            }else if (this.location.anchorNode.nodeName === "LI" || this.location.anchorNode.nodeName === "TH" ||
                this.location.focusNode.nodeName === "P" || this.location.anchorNode.nodeName === "TD" || this.location.anchorNode.nodeName === "DIV") {
                info = [this.location.anchorNode, 0]
            } else if (this.location.anchorOffset == 0 && ((this.location.anchorNode.parentNode.nodeName == 'CODE' && this.location.anchorNode.parentNode.parentNode.nodeName == 'PRE') || this.location.anchorNode.nodeName == 'CODE' && this.location.anchorNode.parentNode.nodeName == 'PRE')) {
                info = [this.location.anchorNode, 0] 
            } else {
                info = this.searchNode(pNode, pLen);
            }
            console.log(info);
            if (info === null)
                return null
            let showNodeList = this.editorHtmlDom.getElementsByClassName("art-show-math");
            for (let i = showNodeList.length - 1; i >= 0; i--) {
                let classVal = showNodeList[i].getAttribute("class");
                classVal = classVal.replace("art-show-math", "");
                showNodeList[i].setAttribute("class", classVal);
            }
            if (info[0].nodeName == '#text' && Tool.hasClass(info[0].parentNode, 'art-math')) {
                let classVal = (<HTMLSpanElement>info[0].parentNode.previousSibling.childNodes[0]).getAttribute("class");
                if (classVal.indexOf('art-show-math') < 0) {
                    classVal += ' art-show-math';
                    (<HTMLSpanElement>info[0].parentNode.previousSibling.childNodes[0]).setAttribute("class", classVal);
                }
            }
            Cursor.setCursor(info[0], info[1])

            let art_text_double = info[0].parentNode;
            if (art_text_double && Tool.hasClass(art_text_double, "art-hide")) {
                if (art_text_double.previousSibling && Tool.hasClass(art_text_double.previousSibling, "art-text-double")) {
                    art_text_double = art_text_double.previousSibling;
                } else if (art_text_double.nextSibling && Tool.hasClass(art_text_double.nextSibling, "art-text-double")) {
                    art_text_double = art_text_double.nextSibling;
                }
            }

            if (art_text_double && Tool.hasClass(art_text_double, "art-text-double")) {
                let classVal = art_text_double.nextSibling.getAttribute("class");
                classVal = classVal.replace("art-hide", "art-show");
                art_text_double.nextSibling.setAttribute("class", classVal);

                classVal = art_text_double.previousSibling.getAttribute("class");
                classVal = classVal.replace("art-hide", "art-show");
                art_text_double.previousSibling.setAttribute("class", classVal);
            }

            if (info[0].nodeName === "#text" && Tool.hasClass(info[0].parentNode, "art-hide")) {
                let classVal = info[0].parentNode.getAttribute("class");
                classVal = classVal.replace("art-hide", "art-show");
                info[0].parentNode.setAttribute("class", classVal);
            }
        }
    }
    static setCursor(node: Node, offset: number) {
        let range = Cursor.sel.getRangeAt(0).cloneRange();
        range.setStart(node, offset);
        range.collapse(true);
        Cursor.sel.removeAllRanges();
        Cursor.sel.addRange(range);
    }
}
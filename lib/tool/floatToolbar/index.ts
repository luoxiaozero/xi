import ArtText from "../..";

export default function floatToolbar(artText: ArtText): HTMLDivElement{
    //dom.getBoundingClientRect()

    let box = document.createElement('div');
    box.style.width = '180px'
    box.style.position = 'absolute';
    box.style.top = '10px';
    box.style.left =  '10px';
    box.style.fontWeight = '800';
    box.style.fontSize = '17px';
    box.style.padding = '3px 8px';
    box.style.boxShadow = '0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)';
    box.style.transition = 'all .15s cubic-bezier(0,0,.2,1)';
    box.style.border ='1px solid #e6e6e6';
    box.style.display = 'none';
    // box.style.display = 'none';

    function closure(fun: Function): Function{
        // 实现闭包
        function c(e){
            fun(e, box, artText);
        }
        return c;
    }
    function newChild(innerText: string, title: string, fun: Function){
        let span = document.createElement('span');
        span.setAttribute('class', 'art-floatToolbar-span')
        span.innerText = innerText;
        span.title = title;
        span.onmousedown = <any>closure(fun);
        box.appendChild(span); 
    }
    newChild('B', '粗体', blod);
    newChild('I', '斜体', italic);
    newChild('D', '删除线', del);
    newChild('S', '下划线', ins);
    newChild('u', '上标', sup);
    newChild('d', '下标', sub);

    return box;
}

function blod(e, box: HTMLDivElement, artText: ArtText) {
    e;
    model(box, artText, '**');
}

function italic(e, box: HTMLDivElement, artText: ArtText) {
    e;
    model(box, artText, '*');
}
function del(e, box: HTMLDivElement, artText: ArtText){
    e;
    model(box, artText, '~~');
}
function ins(e, box: HTMLDivElement, artText: ArtText){
    e;
    model(box, artText, '__');
} 
function sup(e, box: HTMLDivElement, artText: ArtText){
    e;
    model(box, artText, '^');
}
function sub(e, box: HTMLDivElement, artText: ArtText){
    e;
    model(box, artText, '~');
} 
function model(box: HTMLDivElement, artText: ArtText, str: string) {
    let location = artText.editor.cursor.getSelection();
    if(location.anchorNode.nodeName == '#text'){
        let nodeValue = location.anchorNode.nodeValue;
        nodeValue = nodeValue.substring(0, location.anchorOffset) + str + nodeValue.substring(location.anchorOffset)
        location.anchorNode.nodeValue = nodeValue;
    }
    if(location.focusNode.nodeName == '#text'){
        let nodeValue = location.focusNode.nodeValue;
        nodeValue = nodeValue.substring(0, location.focusOffset) + str + nodeValue.substring(location.focusOffset)
        location.focusNode.nodeValue = nodeValue;
    }
    artText.editor.render();
    box.style.display = 'none';
}
// 暂时弃用

/*import ArtText from "../..";
import { blod, italic, del, ins, sup, sub } from "../default";

export default class floatToolbar {
    constructor() {

    }
    //dom.getBoundingClientRect()
    public createDom() {
        let box = document.createElement('div');
        box.style.width = '180px'
        box.style.position = 'absolute';
        box.style.top = '10px';
        box.style.left = '10px';
        box.style.fontWeight = '800';
        box.style.fontSize = '17px';
        box.style.padding = '3px 8px';
        box.style.boxShadow = '0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)';
        box.style.transition = 'all .15s cubic-bezier(0,0,.2,1)';
        box.style.border = '1px solid #e6e6e6';
        box.style.display = 'none';
        // box.style.display = 'none';
        // Tool.DEFAULT_CSS += '.art-floatToolbar-span{padding: 8px 10px;cursor: pointer;}.art-floatToolbar-span:hover{color:' + ArtText.theme.color + '}';

        function closure(fun: Function): Function {
            // 实现闭包
            function c() {
                fun(artText);
                box.style.display = 'none';
            }
            return c;
        }
        function newChild(innerText: string, title: string, fun: Function) {
            let span = document.createElement('span');
            span.setAttribute('class', 'art-floatToolbar-span')
            span.innerText = innerText;
            span.title = title;
            span.onmousedown = <any>closure(fun);
            box.appendChild(span);
        }

        newChild('B', '粗体(ctrl+b)', blod);
        newChild('I', '斜体(crtl+i)', italic);
        newChild('D', '删除线(ctrl+shift+d)', del);
        newChild('S', '下划线(ctrl+u)', ins);
        newChild('u', '上标(ctrl+alt+s)', sup);
        newChild('d', '下标(ctrl+shift+s)', sub);

        return box;
    }
}*/
